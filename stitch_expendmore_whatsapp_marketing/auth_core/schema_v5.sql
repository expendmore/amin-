-- Database Schema Updates v5: SaaS Core Foundation

-- 1. Alter organizations table to include profile and branding details
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255) NULL AFTER name;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS email VARCHAR(255) NULL AFTER logo_url;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS phone VARCHAR(50) NULL AFTER email;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS website VARCHAR(255) NULL AFTER phone;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS gst_number VARCHAR(50) NULL AFTER website;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS address TEXT NULL AFTER gst_number;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS country VARCHAR(100) NULL AFTER address;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS state VARCHAR(100) NULL AFTER country;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS city VARCHAR(100) NULL AFTER state;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS pin_code VARCHAR(20) NULL AFTER city;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS status ENUM('active', 'suspended', 'cancelled') DEFAULT 'active' AFTER pin_code;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS branding_primary_color VARCHAR(7) DEFAULT '#25D366' AFTER status;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS branding_secondary_color VARCHAR(7) DEFAULT '#00e3fd' AFTER branding_primary_color;
ALTER TABLE organizations ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL AFTER updated_at;

-- 2. Workspaces Table
CREATE TABLE IF NOT EXISTS workspaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    is_default TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Role Permissions mapping Table
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. User Roles context mapping Table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    organization_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id, organization_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Member Invitations Table
CREATE TABLE IF NOT EXISTS member_invitations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Subscription Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    max_users INT NOT NULL,
    max_contacts INT NOT NULL,
    max_campaigns INT NOT NULL,
    max_messages INT NOT NULL,
    max_storage_mb INT NOT NULL,
    max_api_calls INT NOT NULL,
    price_monthly DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Active Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL UNIQUE,
    plan_id INT NOT NULL,
    status ENUM('active', 'trial', 'past_due', 'cancelled', 'expired') DEFAULT 'active',
    starts_at DATETIME NOT NULL,
    ends_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Subscription Change History Log Table
CREATE TABLE IF NOT EXISTS subscription_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    plan_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    details TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Resource Usages Tracking Table
CREATE TABLE IF NOT EXISTS organization_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL UNIQUE,
    messages_sent_today INT DEFAULT 0,
    messages_sent_month INT DEFAULT 0,
    campaigns_count INT DEFAULT 0,
    contacts_count INT DEFAULT 0,
    storage_used_bytes BIGINT DEFAULT 0,
    api_calls_today INT DEFAULT 0,
    media_uploads_today INT DEFAULT 0,
    last_reset_date DATE NOT NULL,
    last_reset_month DATE NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Feature Flags Table
CREATE TABLE IF NOT EXISTS feature_flags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Plan Feature mapping Table
CREATE TABLE IF NOT EXISTS plan_features (
    plan_id INT NOT NULL,
    feature_flag_id INT NOT NULL,
    PRIMARY KEY (plan_id, feature_flag_id),
    FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
    FOREIGN KEY (feature_flag_id) REFERENCES feature_flags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. SaaS Audit Logs Table
CREATE TABLE IF NOT EXISTS saas_audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    details TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. API Keys Table
CREATE TABLE IF NOT EXISTS api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    key_hash VARCHAR(64) NOT NULL UNIQUE,
    scopes TEXT NULL,
    expires_at DATETIME NULL,
    last_used_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at DATETIME NULL,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
