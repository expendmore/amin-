<?php
require_once __DIR__ . '/../auth_core/auth_helper.php';
require_once __DIR__ . '/../auth_core/middleware.php';

// Enforce HTTPS and send security headers
enforce_https();
send_security_headers();

secure_session_start();

$token = $_GET['token'] ?? $_POST['token'] ?? '';
$errorMessage = '';
$successMessage = '';

if (empty($token)) {
    header('Location: forgot_password.php');
    exit;
}

$tokenHash = hash('sha256', $token);

try {
    $db = Database::getInstance()->getConnection();
    
    // Validate token
    $stmt = $db->prepare("SELECT * FROM password_reset_tokens WHERE token_hash = ?");
    $stmt->execute([$tokenHash]);
    $resetRecord = $stmt->fetch();
    
    if (!$resetRecord) {
        header('Location: forgot_password.php?error=invalid_token');
        exit;
    }
    
    // Check expiry
    $expiresAt = strtotime($resetRecord['expires_at']);
    if (time() > $expiresAt) {
        // Delete expired token
        $stmt = $db->prepare("DELETE FROM password_reset_tokens WHERE id = ?");
        $stmt->execute([$resetRecord['id']]);
        header('Location: forgot_password.php?error=expired_token');
        exit;
    }
    
    $userId = $resetRecord['user_id'];
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $csrfToken = $_POST['csrf_token'] ?? '';
        
        if (!verify_csrf_token($csrfToken)) {
            $errorMessage = 'Session Expired';
        } else {
            $password = $_POST['password'] ?? '';
            $confirmPassword = $_POST['confirm_password'] ?? '';
            
            if ($password !== $confirmPassword) {
                $errorMessage = 'Passwords do not match';
            } elseif (strlen($password) < 8 || strlen($password) > 72) {
                $errorMessage = 'Wrong Password';
            } elseif (!preg_match('/[A-Z]/', $password) || !preg_match('/[a-z]/', $password) || !preg_match('/[0-9]/', $password) || !preg_match('/[^A-Za-z0-9]/', $password)) {
                $errorMessage = 'Password must contain uppercase, lowercase, numbers, and special characters';
            } else {
                $commonPasswords = ['password123', '12345678', 'admin1234', 'expendmore123', 'password', 'welcome123', 'admin123'];
                if (in_array(strtolower($password), $commonPasswords)) {
                    $errorMessage = 'Password is too common';
                } else {
                    // Update user password and clear token in a transaction
                    $db->beginTransaction();
                    
                    $stmt = $db->prepare("UPDATE users SET password_hash = ? WHERE id = ?");
                    $stmt->execute([password_hash($password, PASSWORD_BCRYPT), $userId]);
                    
                    $stmt = $db->prepare("DELETE FROM password_reset_tokens WHERE id = ?");
                    $stmt->execute([$resetRecord['id']]);
                    
                    $db->commit();
                    
                    // Fetch user info for security notification
                    $stmt = $db->prepare("SELECT email, u.status, p.full_name FROM users u LEFT JOIN user_profiles p ON u.id = p.user_id WHERE u.id = ?");
                    $stmt->execute([$userId]);
                    $user = $stmt->fetch();
                    
                    if ($user) {
                        require_once __DIR__ . '/../auth_core/mailer.php';
                        Mailer::getInstance()->sendSecurityAlert($user['email'], $user['full_name'] ?: 'User', 'your password was recently reset successfully');
                        write_security_log('PASSWORD_RESET_SUCCESS', $user['email']);
                    }
                    
                    header('Location: code.php?status=password_reset_success');
                    exit;
                }
            }
        }
    }
    
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    error_log("Password reset transaction failure: " . $e->getMessage());
    $errorMessage = 'Failed to update password. Please try again.';
}
?>
<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>ExpendMore - Reset Password</title>
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700;800&amp;family=Inter:wght@400;500&amp;family=Geist:wght@500;600&amp;display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "primary-fixed-dim": "#3de273",
                        "tertiary-container": "#bcebe2",
                        "secondary-fixed": "#c0e8f0",
                        "on-error": "#ffffff",
                        "surface-container-lowest": "#ffffff",
                        "on-primary-fixed": "#002109",
                        "tertiary": "#006a5e",
                        "error": "#ba1a1a",
                        "secondary-fixed-dim": "#a4d0d8",
                        "on-tertiary-container": "#00201c",
                        "surface-bright": "#f9f9f9",
                        "primary": "#006d2f",
                        "surface-variant": "#e1e4dc",
                        "tertiary-fixed": "#9ff2e2",
                        "surface-container-high": "#e6e8e0",
                        "on-secondary-container": "#001f24",
                        "primary-container": "#bdf6c7",
                        "on-secondary-fixed": "#001f24",
                        "on-surface-variant": "#434943",
                        "inverse-primary": "#3de273",
                        "secondary-container": "#cde7ec",
                        "surface-container": "#eeeff1",
                        "on-secondary-fixed-variant": "#1f4d54",
                        "surface-container-low": "#f3f5f3",
                        "error-container": "#ffdad6",
                        "inverse-surface": "#2f312e",
                        "on-tertiary-fixed-variant": "#005047",
                        "on-primary": "#ffffff",
                        "tertiary-fixed-dim": "#83d5c6",
                        "on-surface": "#1a1c19",
                        "on-secondary": "#ffffff",
                        "on-primary-container": "#002109",
                        "background": "#fcfdf6",
                        "on-background": "#1a1c19",
                        "on-tertiary-fixed": "#00201c",
                        "outline-variant": "#c1c9be",
                        "secondary": "#4a6267",
                        "inverse-on-surface": "#f0f1eb",
                        "on-error-container": "#410002",
                        "on-primary-fixed-variant": "#005322",
                        "surface-tint": "#006d2f",
                        "surface-container-highest": "#e1e3db",
                        "primary-fixed": "#bdf6c7",
                        "outline": "#727970",
                        "surface": "#fcfdf6",
                        "on-tertiary": "#ffffff",
                        "surface-dim": "#dadcd5"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "margin-desktop": "40px",
                        "lg": "48px",
                        "xs": "4px",
                        "margin-mobile": "16px",
                        "gutter": "24px",
                        "base": "8px",
                        "md": "24px",
                        "xl": "80px",
                        "sm": "12px"
                    },
                    "fontFamily": {
                        "headline-lg-mobile": ["Hanken Grotesk"],
                        "label-xs": ["Geist"],
                        "label-sm": ["Geist"],
                        "body-lg": ["Inter"],
                        "headline-md": ["Hanken Grotesk"],
                        "display": ["Hanken Grotesk"],
                        "headline-lg": ["Hanken Grotesk"],
                        "body-md": ["Inter"]
                    },
                    "fontSize": {
                        "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "700"}],
                        "label-xs": ["10px", {"lineHeight": "14px", "letterSpacing": "0.1em", "fontWeight": "600"}],
                        "label-sm": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500"}],
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "display": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}]
                    }
                },
            },
        }
    </script>
    <style>
        body {
            background-color: #fcfdf6;
            color: #1a1c19;
            font-family: 'Inter', sans-serif;
        }
        .glass-card {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #e1e3db;
            transition: all 0.3s ease;
        }
        .hero-gradient {
            background: radial-gradient(circle at 50% 50%, rgba(0, 109, 47, 0.05) 0%, transparent 70%);
        }
        .btn-primary {
            background: linear-gradient(90deg, #006d2f 0%, #4a6267 100%);
        }
        input:focus {
            border-color: #006d2f !important;
            box-shadow: 0 0 0 2px rgba(0, 109, 47, 0.2) !important;
        }
    </style>
</head>
<body class="overflow-x-hidden min-h-screen flex flex-col justify-between hero-gradient">

    <nav class="flex justify-between items-center w-full px-margin-desktop h-16 bg-[#ffffff]/80 backdrop-blur-xl border-b border-outline-variant">
        <div class="flex items-center gap-base">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXX1DCQG8F09cfFGj6cNc74SiIzvhKlPuZ4DutMnLAZ1WwEr1_36Bq5V3rqx-3uLHDVeTemvJMZVol4mcWWp2v9MTj2o8OnNdTGqwOEVI8pCfuxe9XMoDgQ_YSPrAF3jNJO6rk9bNvj6cHhjY6shaIm4G9qa3qUoqIySXRR8FYo8XnQfSzk4gbBSsa3rHo5v0Ko2cs1RUpUyg2Ctx7ZQZsJmgvipi1TaV_MHArxTcgDRiBt27-TGkLEQudUI6bWo6T" alt="ExpendMore Logo" class="h-8 w-auto">
        </div>
    </nav>

    <main class="flex-grow flex items-center justify-center px-margin-mobile py-xl">
        <div class="w-full max-w-md glass-card rounded-2xl p-lg relative overflow-hidden">
            
            <div class="relative z-10 space-y-md">
                <div class="text-center space-y-xs">
                    <h2 class="text-headline-lg font-display text-on-surface">Reset Password</h2>
                    <p class="text-body-md text-on-surface-variant">Please choose a secure new password for your account.</p>
                </div>

                <?php if (!empty($errorMessage)): ?>
                <div class="bg-error/15 border border-error/30 rounded-lg p-3 text-error text-sm flex items-center gap-2 mb-4">
                    <span class="material-symbols-outlined text-sm">error</span>
                    <span><?php echo htmlspecialchars($errorMessage); ?></span>
                </div>
                <?php endif; ?>

                <form action="reset_password.php" method="POST" class="space-y-md">
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars(get_csrf_token()); ?>">
                    <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
                    
                    <div class="space-y-xs">
                        <label for="password" class="text-label-sm font-label-sm text-on-surface-variant block">New Password</label>
                        <div class="relative">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">lock</span>
                            <input type="password" id="password" name="password" required placeholder="••••••••" class="w-full bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none transition-all">
                        </div>
                    </div>

                    <div class="space-y-xs">
                        <label for="confirm_password" class="text-label-sm font-label-sm text-on-surface-variant block">Confirm Password</label>
                        <div class="relative">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">lock</span>
                            <input type="password" id="confirm_password" name="confirm_password" required placeholder="••••••••" class="w-full bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none transition-all">
                        </div>
                    </div>

                    <button type="submit" class="btn-primary w-full py-3 rounded-lg text-white font-bold text-body-md flex items-center justify-center gap-xs shadow-md">
                        <span>Save New Password</span>
                        <span class="material-symbols-outlined">save</span>
                    </button>
                </form>
            </div>
        </div>
    </main>

    <footer class="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-md w-full bg-white border-t border-surface-container-high">
        <p class="text-label-xs text-on-surface-variant">© 2024 ExpendMore. All rights reserved.</p>
    </footer>

</body>
</html>
