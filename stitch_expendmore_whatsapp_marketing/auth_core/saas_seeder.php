<?php
require_once __DIR__ . '/db.php';

try {
    $db = Database::getInstance()->getConnection();
    echo "SaaS Seeder Started...\n";
    
    $db->beginTransaction();
    
    // 1. Seed Roles
    $roles = [
        'Super Admin' => 'Full administrative control over the entire platform.',
        'Owner'       => 'Owner of the organization account, with all rights.',
        'Admin'       => 'Administrator of the organization workspace.',
        'Manager'     => 'Manager with authority to oversee team activities.',
        'Marketing'   => 'Access to campaign execution and logs.',
        'Support'     => 'Access to templates and contact profiles.',
        'Finance'     => 'Access to billing dashboards.',
        'Viewer'      => 'Read-only access across the organization.'
    ];
    
    $roleIds = [];
    foreach ($roles as $name => $desc) {
        $stmt = $db->prepare("INSERT INTO roles (name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description = ?");
        $stmt->execute([$name, $desc, $desc]);
        
        $s = $db->prepare("SELECT id FROM roles WHERE name = ?");
        $s->execute([$name]);
        $roleIds[$name] = $s->fetchColumn();
    }
    echo "✔ Roles Seeded.\n";
    
    // 2. Seed Permissions
    $permissions = [
        'Manage Team'      => 'Invite, edit, suspend, and remove workspace members.',
        'Manage Campaigns' => 'Create, execute, and monitor message campaigns.',
        'Manage Contacts'  => 'Import, export, and manage contacts profiles.',
        'View Analytics'   => 'Access reporting logs, delivery counts, and metrics.',
        'Manage Billing'   => 'Manage payment invoices, plans, and coin buyings.',
        'Manage Templates' => 'Create and customize WhatsApp templates.',
        'Manage API Keys'  => 'Generate, rotate, and revoke system API credentials.',
        'Manage WhatsApp'  => 'Configure APIs endpoints and WhatsApp profiles.',
        'View Reports'     => 'Export activity and diagnostic reports.',
        'Manage Settings'  => 'Modify organizational details, timezones, and branding.'
    ];
    
    $permIds = [];
    foreach ($permissions as $name => $desc) {
        $stmt = $db->prepare("INSERT INTO permissions (name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description = ?");
        $stmt->execute([$name, $desc, $desc]);
        
        $s = $db->prepare("SELECT id FROM permissions WHERE name = ?");
        $s->execute([$name]);
        $permIds[$name] = $s->fetchColumn();
    }
    echo "✔ Permissions Seeded.\n";
    
    // 3. Map Permissions to Roles (Role-Permission relationships)
    // Clear existing mappings to prevent constraints issues
    $db->exec("DELETE FROM role_permissions");
    
    $rolePermMap = [
        'Super Admin' => array_keys($permissions),
        'Owner'       => array_keys($permissions),
        'Admin'       => ['Manage Team', 'Manage Campaigns', 'Manage Contacts', 'View Analytics', 'Manage Templates', 'Manage WhatsApp', 'View Reports', 'Manage Settings'],
        'Manager'     => ['Manage Campaigns', 'Manage Contacts', 'View Analytics', 'Manage Templates', 'View Reports'],
        'Marketing'   => ['Manage Campaigns', 'Manage Contacts', 'View Analytics', 'Manage Templates', 'View Reports'],
        'Support'     => ['Manage Contacts', 'Manage Templates', 'View Reports'],
        'Finance'     => ['Manage Billing', 'View Analytics', 'View Reports'],
        'Viewer'      => ['View Analytics', 'View Reports']
    ];
    
    foreach ($rolePermMap as $roleName => $perms) {
        $rId = $roleIds[$roleName];
        foreach ($perms as $pName) {
            $pId = $permIds[$pName];
            $stmt = $db->prepare("INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)");
            $stmt->execute([$rId, $pId]);
        }
    }
    echo "✔ Role-Permission matrix initialized.\n";
    
    // 4. Seed Plans
    $plans = [
        [
            'name' => 'Free',
            'code' => 'free',
            'max_users' => 1,
            'max_contacts' => 250,
            'max_campaigns' => 5,
            'max_messages' => 1000,
            'max_storage_mb' => 100,
            'max_api_calls' => 100,
            'price_monthly' => 0.00
        ],
        [
            'name' => 'Starter',
            'code' => 'starter',
            'max_users' => 3,
            'max_contacts' => 1000,
            'max_campaigns' => 20,
            'max_messages' => 10000,
            'max_storage_mb' => 1000,
            'max_api_calls' => 2000,
            'price_monthly' => 29.00
        ],
        [
            'name' => 'Growth',
            'code' => 'growth',
            'max_users' => 10,
            'max_contacts' => 10000,
            'max_campaigns' => 100,
            'max_messages' => 100000,
            'max_storage_mb' => 5000,
            'max_api_calls' => 25000,
            'price_monthly' => 79.00
        ],
        [
            'name' => 'Enterprise',
            'code' => 'enterprise',
            'max_users' => 9999,
            'max_contacts' => 999999,
            'max_campaigns' => 99999,
            'max_messages' => 9999999,
            'max_storage_mb' => 100000,
            'max_api_calls' => 9999999,
            'price_monthly' => 299.00
        ]
    ];
    
    $planIds = [];
    foreach ($plans as $p) {
        $stmt = $db->prepare("INSERT INTO plans (name, code, max_users, max_contacts, max_campaigns, max_messages, max_storage_mb, max_api_calls, price_monthly) 
                              VALUES (:name, :code, :max_users, :max_contacts, :max_campaigns, :max_messages, :max_storage_mb, :max_api_calls, :price_monthly)
                              ON DUPLICATE KEY UPDATE 
                              max_users = :max_users, max_contacts = :max_contacts, max_campaigns = :max_campaigns, max_messages = :max_messages, max_storage_mb = :max_storage_mb, max_api_calls = :max_api_calls, price_monthly = :price_monthly");
        $stmt->execute($p);
        
        $s = $db->prepare("SELECT id FROM plans WHERE code = ?");
        $s->execute([$p['code']]);
        $planIds[$p['code']] = $s->fetchColumn();
    }
    echo "✔ Subscription plans initialized.\n";
    
    // 5. Seed Feature Flags
    $featureFlags = [
        'whatsapp_api'    => 'Access to WhatsApp integration endpoints.',
        'campaigns'       => 'Trigger automated and batch campaigns.',
        'analytics'       => 'Access dashboard metrics and reporting tables.',
        'automation'      => 'Define customer triggers and automation sequences.',
        'billing'         => 'Modify organization subscriptions and view logs.',
        'team_management' => 'Invite, revoke, and manage team members.',
        'api_access'      => 'Generate and use rotation API keys.',
        'ai_agent'        => 'Integrate AI support agents.'
    ];
    
    $featureIds = [];
    foreach ($featureFlags as $name => $desc) {
        $stmt = $db->prepare("INSERT INTO feature_flags (name, description) VALUES (?, ?) ON DUPLICATE KEY UPDATE description = ?");
        $stmt->execute([$name, $desc, $desc]);
        
        $s = $db->prepare("SELECT id FROM feature_flags WHERE name = ?");
        $s->execute([$name]);
        $featureIds[$name] = $s->fetchColumn();
    }
    echo "✔ Feature flags seeded.\n";
    
    // 6. Map Features to Plans (Plan-Feature relationships)
    $db->exec("DELETE FROM plan_features");
    
    $planFeatureMap = [
        'free'       => ['campaigns', 'analytics'],
        'starter'    => ['whatsapp_api', 'campaigns', 'analytics', 'team_management'],
        'growth'     => ['whatsapp_api', 'campaigns', 'analytics', 'automation', 'billing', 'team_management', 'api_access'],
        'enterprise' => ['whatsapp_api', 'campaigns', 'analytics', 'automation', 'billing', 'team_management', 'api_access', 'ai_agent']
    ];
    
    foreach ($planFeatureMap as $planCode => $feats) {
        $pId = $planIds[$planCode];
        foreach ($feats as $fName) {
            $fId = $featureIds[$fName];
            $stmt = $db->prepare("INSERT INTO plan_features (plan_id, feature_flag_id) VALUES (?, ?)");
            $stmt->execute([$pId, $fId]);
        }
    }
    echo "✔ Plan-Feature metrics mapped.\n";
    
    $db->commit();
    echo "SaaS Seeding Completed Successfully! All tables ready.\n";
    
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    die("Database seeding failure: " . $e->getMessage() . "\n");
}
