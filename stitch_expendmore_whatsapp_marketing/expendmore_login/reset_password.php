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
<html class="dark" lang="en">
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
                        "tertiary-container": "#63c9b9",
                        "secondary-fixed": "#9cf0ff",
                        "on-error": "#690005",
                        "surface-container-lowest": "#0e0e0e",
                        "on-primary-fixed": "#002109",
                        "tertiary": "#80e5d5",
                        "error": "#ffb4ab",
                        "secondary-fixed-dim": "#00daf3",
                        "on-tertiary-container": "#005249",
                        "surface-bright": "#3a3939",
                        "primary": "#4ff07f",
                        "surface-variant": "#353534",
                        "tertiary-fixed": "#8ff4e3",
                        "surface-container-high": "#2a2a2a",
                        "on-secondary-container": "#00616d",
                        "primary-container": "#25d366",
                        "on-secondary-fixed": "#001f24",
                        "on-surface-variant": "#bbcbb9",
                        "inverse-primary": "#006d2f",
                        "secondary-container": "#00e3fd",
                        "surface-container": "#201f1f",
                        "on-secondary-fixed-variant": "#004f58",
                        "surface-container-low": "#1c1b1b",
                        "error-container": "#93000a",
                        "inverse-surface": "#e5e2e1",
                        "on-tertiary-fixed-variant": "#005047",
                        "on-primary": "#003915",
                        "tertiary-fixed-dim": "#72d8c8",
                        "on-surface": "#e5e2e1",
                        "on-secondary": "#00363d",
                        "on-primary-container": "#005523",
                        "background": "#0A0A0A",
                        "on-background": "#e5e2e1",
                        "on-tertiary-fixed": "#00201c",
                        "outline-variant": "#3c4a3d",
                        "secondary": "#bdf4ff",
                        "inverse-on-surface": "#313030",
                        "on-error-container": "#ffdad6",
                        "on-primary-fixed-variant": "#005322",
                        "surface-tint": "#3de273",
                        "surface-container-highest": "#353534",
                        "primary-fixed": "#66ff8e",
                        "outline": "#869584",
                        "surface": "#131313",
                        "on-tertiary": "#003731",
                        "surface-dim": "#131313"
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
            background-color: #0A0A0A;
            color: #e5e2e1;
            font-family: 'Inter', sans-serif;
        }
        .glass-card {
            background: rgba(22, 22, 22, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid #2A2A2A;
            transition: all 0.3s ease;
        }
        .hero-gradient {
            background: radial-gradient(circle at 50% 50%, rgba(37, 211, 102, 0.1) 0%, transparent 70%);
        }
        .btn-primary {
            background: linear-gradient(90deg, #25D366 0%, #00e3fd 100%);
        }
        input:focus {
            border-color: #00e3fd !important;
            box-shadow: 0 0 0 2px rgba(0, 227, 253, 0.2) !important;
        }
    </style>
</head>
<body class="overflow-x-hidden min-h-screen flex flex-col justify-between hero-gradient">

    <nav class="flex justify-between items-center w-full px-margin-desktop h-16 bg-background/80 backdrop-blur-xl border-b border-outline-variant">
        <div class="flex items-center gap-base">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXX1DCQG8F09cfFGj6cNc74SiIzvhKlPuZ4DutMnLAZ1WwEr1_36Bq5V3rqx-3uLHDVeTemvJMZVol4mcWWp2v9MTj2o8OnNdTGqwOEVI8pCfuxe9XMoDgQ_YSPrAF3jNJO6rk9bNvj6cHhjY6shaIm4G9qa3qUoqIySXRR8FYo8XnQfSzk4gbBSsa3rHo5v0Ko2cs1RUpUyg2Ctx7ZQZsJmgvipi1TaV_MHArxTcgDRiBt27-TGkLEQudUI6bWo6T" alt="ExpendMore Logo" class="h-8 w-auto">
        </div>
    </nav>

    <main class="flex-grow flex items-center justify-center px-margin-mobile py-xl">
        <div class="w-full max-w-md glass-card rounded-2xl p-lg relative overflow-hidden">
            <div class="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]"></div>
            
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
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50">lock</span>
                            <input type="password" id="password" name="password" required placeholder="••••••••" class="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none transition-all">
                        </div>
                    </div>

                    <div class="space-y-xs">
                        <label for="confirm_password" class="text-label-sm font-label-sm text-on-surface-variant block">Confirm Password</label>
                        <div class="relative">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50">lock</span>
                            <input type="password" id="confirm_password" name="confirm_password" required placeholder="••••••••" class="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none transition-all">
                        </div>
                    </div>

                    <button type="submit" class="btn-primary w-full py-3 rounded-lg text-on-primary font-bold text-body-md flex items-center justify-center gap-xs shadow-lg">
                        <span>Save New Password</span>
                        <span class="material-symbols-outlined">save</span>
                    </button>
                </form>
            </div>
        </div>
    </main>

    <footer class="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-md w-full bg-surface-container-lowest border-t border-outline-variant">
        <p class="text-label-xs text-on-surface-variant opacity-80">© 2024 ExpendMore. All rights reserved.</p>
    </footer>

</body>
</html>
