<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

class SaaS {
    private static $db = null;

    private static function getDb() {
        if (self::$db === null) {
            self::$db = Database::getInstance()->getConnection();
        }
        return self::$db;
    }

    /**
     * Get active Workspace ID from session or failover
     */
    public static function getWorkspaceId() {
        secure_session_start();
        if (isset($_SESSION['workspace_id'])) {
            return (int)$_SESSION['workspace_id'];
        }
        
        // Fallback: check database for user's default workspace
        if (isset($_SESSION['user_id'])) {
            $db = self::getDb();
            // Look up organization user belongs to
            $stmt = $db->prepare("SELECT organization_id FROM organization_members WHERE user_id = ? LIMIT 1");
            $stmt->execute([$_SESSION['user_id']]);
            $orgId = $stmt->fetchColumn();
            
            if ($orgId) {
                $stmt = $db->prepare("SELECT id FROM workspaces WHERE organization_id = ? AND is_default = 1 LIMIT 1");
                $stmt->execute([$orgId]);
                $wsId = $stmt->fetchColumn();
                
                if ($wsId) {
                    $_SESSION['workspace_id'] = $wsId;
                    $_SESSION['organization_id'] = $orgId;
                    return (int)$wsId;
                }
            }
        }
        return 0;
    }

    /**
     * Get active Organization ID
     */
    public static function getOrganizationId() {
        secure_session_start();
        if (isset($_SESSION['organization_id'])) {
            return (int)$_SESSION['organization_id'];
        }
        
        $wsId = self::getWorkspaceId();
        if ($wsId) {
            $db = self::getDb();
            $stmt = $db->prepare("SELECT organization_id FROM workspaces WHERE id = ?");
            $stmt->execute([$wsId]);
            $orgId = $stmt->fetchColumn();
            if ($orgId) {
                $_SESSION['organization_id'] = (int)$orgId;
                return (int)$orgId;
            }
        }
        return 0;
    }

    /**
     * RBAC Permissions Check
     */
    public static function hasPermission($permissionName) {
        secure_session_start();
        if (!isset($_SESSION['user_id'])) {
            return false;
        }

        $userId = (int)$_SESSION['user_id'];
        $orgId = self::getOrganizationId();
        
        if (!$orgId) {
            return false;
        }

        $db = self::getDb();

        // 1. Look up role assigned to this user in this organization
        $stmt = $db->prepare("SELECT role_id FROM user_roles WHERE user_id = ? AND organization_id = ?");
        $stmt->execute([$userId, $orgId]);
        $roleId = $stmt->fetchColumn();

        if (!$roleId) {
            // Fallback: check organization_members table role context
            $stmt = $db->prepare("SELECT role FROM organization_members WHERE user_id = ? AND organization_id = ?");
            $stmt->execute([$userId, $orgId]);
            $legacyRole = $stmt->fetchColumn();

            if ($legacyRole) {
                // Map legacy role name to Roles ID
                $stmt = $db->prepare("SELECT id FROM roles WHERE name = ?");
                $stmt->execute([$legacyRole]);
                $roleId = $stmt->fetchColumn();
                
                if ($roleId) {
                    // Sync user_roles
                    $stmt = $db->prepare("INSERT IGNORE INTO user_roles (user_id, role_id, organization_id) VALUES (?, ?, ?)");
                    $stmt->execute([$userId, $roleId, $orgId]);
                }
            }
        }

        if (!$roleId) {
            return false;
        }

        // 2. Look up if permission exists and is mapped to this role
        $stmt = $db->prepare("
            SELECT 1 FROM role_permissions rp
            JOIN permissions p ON rp.permission_id = p.id
            WHERE rp.role_id = ? AND p.name = ?
        ");
        $stmt->execute([$roleId, $permissionName]);
        return (bool)$stmt->fetchColumn();
    }

    /**
     * Feature Flags Toggle
     */
    public static function featureEnabled($featureName) {
        $orgId = self::getOrganizationId();
        if (!$orgId) {
            return false;
        }

        $db = self::getDb();

        // Get active subscription plan ID
        $stmt = $db->prepare("
            SELECT plan_id FROM subscriptions 
            WHERE organization_id = ? AND status IN ('active', 'trial') 
            LIMIT 1
        ");
        $stmt->execute([$orgId]);
        $planId = $stmt->fetchColumn();

        if (!$planId) {
            // Fallback: get Free plan ID
            $stmt = $db->prepare("SELECT id FROM plans WHERE code = 'free' LIMIT 1");
            $stmt->execute();
            $planId = $stmt->fetchColumn();
        }

        if (!$planId) {
            return false;
        }

        // Check if plan maps to feature
        $stmt = $db->prepare("
            SELECT 1 FROM plan_features pf
            JOIN feature_flags ff ON pf.feature_flag_id = ff.id
            WHERE pf.plan_id = ? AND ff.name = ?
        ");
        $stmt->execute([$planId, $featureName]);
        return (bool)$stmt->fetchColumn();
    }

    /**
     * Check if Organization is within its usage limits
     */
    public static function checkLimit($metric) {
        $orgId = self::getOrganizationId();
        if (!$orgId) {
            return false;
        }

        $db = self::getDb();
        self::ensureUsageRow($orgId);

        // Fetch subscription limits
        $stmt = $db->prepare("
            SELECT p.* FROM subscriptions s
            JOIN plans p ON s.plan_id = p.id
            WHERE s.organization_id = ? AND s.status IN ('active', 'trial')
        ");
        $stmt->execute([$orgId]);
        $limits = $stmt->fetch();

        if (!$limits) {
            // Fallback to Free plan
            $stmt = $db->prepare("SELECT * FROM plans WHERE code = 'free' LIMIT 1");
            $stmt->execute();
            $limits = $stmt->fetch();
        }

        // Fetch current usages
        $stmt = $db->prepare("SELECT * FROM organization_usage WHERE organization_id = ?");
        $stmt->execute([$orgId]);
        $usage = $stmt->fetch();

        if (!$limits || !$usage) {
            return false;
        }

        switch ($metric) {
            case 'users':
                $stmt = $db->prepare("SELECT COUNT(*) FROM organization_members WHERE organization_id = ?");
                $stmt->execute([$orgId]);
                return $stmt->fetchColumn() < $limits['max_users'];
            
            case 'contacts':
                return $usage['contacts_count'] < $limits['max_contacts'];
            
            case 'campaigns':
                return $usage['campaigns_count'] < $limits['max_campaigns'];
            
            case 'daily_messages':
                return $usage['messages_sent_today'] < ($limits['max_messages'] / 30); // Simple daily allocation
            
            case 'monthly_messages':
                return $usage['messages_sent_month'] < $limits['max_messages'];
            
            case 'storage':
                $usedMb = $usage['storage_used_bytes'] / (1024 * 1024);
                return $usedMb < $limits['max_storage_mb'];
            
            case 'api_calls':
                return $usage['api_calls_today'] < $limits['max_api_calls'];
        }

        return false;
    }

    /**
     * Track usage increment
     */
    public static function trackUsage($metric, $amount = 1) {
        $orgId = self::getOrganizationId();
        if (!$orgId) {
            return false;
        }

        $db = self::getDb();
        self::ensureUsageRow($orgId);

        $column = '';
        switch ($metric) {
            case 'messages':
                $stmt = $db->prepare("UPDATE organization_usage SET messages_sent_today = messages_sent_today + ?, messages_sent_month = messages_sent_month + ? WHERE organization_id = ?");
                return $stmt->execute([$amount, $amount, $orgId]);
            case 'campaigns':
                $column = 'campaigns_count';
                break;
            case 'contacts':
                $column = 'contacts_count';
                break;
            case 'storage':
                $column = 'storage_used_bytes';
                break;
            case 'api_calls':
                $column = 'api_calls_today';
                break;
            case 'media_uploads':
                $column = 'media_uploads_today';
                break;
        }

        if ($column) {
            $stmt = $db->prepare("UPDATE organization_usage SET {$column} = {$column} + ? WHERE organization_id = ?");
            return $stmt->execute([$amount, $orgId]);
        }
        return false;
    }

    /**
     * Insert and sync usage tracks
     */
    private static function ensureUsageRow($orgId) {
        $db = self::getDb();
        $stmt = $db->prepare("SELECT id, last_reset_date, last_reset_month FROM organization_usage WHERE organization_id = ?");
        $stmt->execute([$orgId]);
        $row = $stmt->fetch();

        $today = date('Y-m-d');
        $thisMonth = date('Y-m-01');

        if (!$row) {
            $stmt = $db->prepare("INSERT INTO organization_usage (organization_id, last_reset_date, last_reset_month) VALUES (?, ?, ?)");
            $stmt->execute([$orgId, $today, $thisMonth]);
        } else {
            // Check daily reset
            if ($row['last_reset_date'] !== $today) {
                $stmt = $db->prepare("UPDATE organization_usage SET messages_sent_today = 0, api_calls_today = 0, media_uploads_today = 0, last_reset_date = ? WHERE organization_id = ?");
                $stmt->execute([$today, $orgId]);
            }
            // Check monthly reset
            if ($row['last_reset_month'] !== $thisMonth) {
                $stmt = $db->prepare("UPDATE organization_usage SET messages_sent_month = 0, campaigns_count = 0, last_reset_month = ? WHERE organization_id = ?");
                $stmt->execute([$thisMonth, $orgId]);
            }
        }
    }

    /**
     * SaaS Audit Logs writer
     */
    public static function writeAudit($action, $details = '') {
        $orgId = self::getOrganizationId();
        if (!$orgId) {
            return false;
        }

        secure_session_start();
        $userId = isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';

        $db = self::getDb();
        $stmt = $db->prepare("INSERT INTO saas_audit_logs (organization_id, user_id, action, ip_address, details) VALUES (?, ?, ?, ?, ?)");
        return $stmt->execute([$orgId, $userId, $action, $ip, $details]);
    }

    /**
     * Validate Header API Tokens
     */
    public static function validateApiKey($key) {
        if (empty($key)) {
            return false;
        }

        $keyHash = hash('sha256', $key);
        $db = self::getDb();

        $stmt = $db->prepare("
            SELECT * FROM api_keys 
            WHERE key_hash = ? AND revoked_at IS NULL AND (expires_at IS NULL OR expires_at > NOW())
            LIMIT 1
        ");
        $stmt->execute([$keyHash]);
        $record = $stmt->fetch();

        if ($record) {
            // Update last used timestamp
            $stmt = $db->prepare("UPDATE api_keys SET last_used_at = NOW() WHERE id = ?");
            $stmt->execute([$record['id']]);

            // Track usage count
            $_SESSION['organization_id'] = $record['organization_id'];
            self::trackUsage('api_calls', 1);

            return $record;
        }
        return false;
    }
}
