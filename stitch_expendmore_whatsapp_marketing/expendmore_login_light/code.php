<?php
require_once __DIR__ . '/../auth_core/auth_helper.php';
require_once __DIR__ . '/../auth_core/middleware.php';

// If already logged in, redirect to dashboard
checkGuest();

$errorMessage = '';

// Check GET errors
if (isset($_GET['error'])) {
    if ($_GET['error'] === 'disabled') {
        $errorMessage = 'Disabled Account';
    } elseif ($_GET['error'] === 'inactive') {
        $errorMessage = 'Inactive Account';
    } elseif ($_GET['error'] === 'session_expired') {
        $errorMessage = 'Session Expired';
    } elseif ($_GET['error'] === 'oauth_failed') {
        $errorMessage = 'Google authentication failed';
    }
}

$statusMessage = '';
if (isset($_GET['status'])) {
    if ($_GET['status'] === 'verified_success') {
        $statusMessage = 'Email verified successfully! You can now log in.';
    } elseif ($_GET['status'] === 'password_reset_success') {
        $statusMessage = 'Password updated successfully! Please log in.';
    }
}

// Handle Form POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';
    
    if (!verify_csrf_token($csrfToken)) {
        write_security_log('CSRF_FAILURE', $_POST['email'] ?? 'unknown');
        $errorMessage = 'Session Expired';
    } else {
        $emailInput = trim($_POST['email'] ?? '');
        $passwordInput = $_POST['password'] ?? '';
        $rememberInput = isset($_POST['remember']);
        
        if (strlen($emailInput) > 255) {
            write_security_log('EMAIL_LENGTH_EXCEEDED', $emailInput);
            $errorMessage = 'Wrong Email';
        } elseif (strlen($passwordInput) < 8 || strlen($passwordInput) > 72) {
            write_security_log('PASSWORD_LENGTH_INVALID', $emailInput);
            $errorMessage = 'Wrong Password';
        } else {
            $email = filter_var($emailInput, FILTER_VALIDATE_EMAIL);
            
            if (!$email) {
                write_security_log('INVALID_EMAIL_FORMAT', $emailInput);
                $errorMessage = 'Wrong Email';
            } else {
                // Check rate limiting / brute-force lockout
                if (check_login_lockout($email)) {
                    write_security_log('LOGIN_LOCKOUT', $email);
                    $errorMessage = 'Too Many Attempts';
                } else {
                    try {
                        $db = Database::getInstance()->getConnection();
                        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
                        $stmt->execute([$email]);
                        $user = $stmt->fetch();
                        
                        if (!$user) {
                            register_failed_attempt($email);
                            write_security_log('USER_NOT_FOUND', $email);
                            $errorMessage = 'Wrong Email';
                        } else {
                            if (!password_verify($passwordInput, $user['password_hash'])) {
                                register_failed_attempt($email);
                                write_security_log('WRONG_PASSWORD', $email);
                                $errorMessage = 'Wrong Password';
                            } else {
                                // Check account status
                                if ($user['status'] === 'disabled') {
                                    write_security_log('LOGIN_ATTEMPT_DISABLED_ACCOUNT', $email);
                                    $errorMessage = 'Disabled Account';
                                } elseif ($user['status'] === 'inactive') {
                                    write_security_log('LOGIN_ATTEMPT_INACTIVE_ACCOUNT', $email);
                                    $errorMessage = 'Inactive Account';
                                } elseif ($user['status'] === 'active') {
                                    // Success! Clear attempts, create session
                                    clear_failed_attempts($email);
                                    
                                    session_regenerate_id(true);
                                    $_SESSION['user_id'] = $user['id'];
                                    $_SESSION['email'] = $user['email'];
                                    $_SESSION['status'] = $user['status'];
                                    $_SESSION['created_at'] = time();
                                    $_SESSION['last_activity'] = time();
                                    
                                    // Set remember me cookie if checked
                                    if ($rememberInput) {
                                        set_remember_me_cookie($user['id']);
                                    }
                                    
                                    write_security_log('LOGIN_SUCCESS', $email);
                                    
                                    header('Location: ../expendmore_dashboard_light/code.php');
                                    exit;
                                }
                            }
                        }
                    } catch (Exception $e) {
                        error_log("Login error: " . $e->getMessage());
                        $errorMessage = 'Database connection error';
                    }
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html class="light" lang="en">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>ExpendMore - Log In</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&amp;family=Inter:wght@400;500&amp;display=swap" rel="stylesheet"/>
    <!-- Material Symbols -->
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "on-primary-fixed-variant": "#005322",
                        "surface-container-low": "#f6f3f2",
                        "surface-container-lowest": "#ffffff",
                        "on-error-container": "#93000a",
                        "surface-container-high": "#ebe7e7",
                        "on-tertiary-fixed-variant": "#004c69",
                        "on-primary": "#ffffff",
                        "on-secondary-fixed": "#00201c",
                        "tertiary-fixed-dim": "#7cd0ff",
                        "tertiary-container": "#48c4ff",
                        "inverse-surface": "#313030",
                        "on-surface-variant": "#3c4a3d",
                        "background": "#ffffff",
                        "on-tertiary": "#ffffff",
                        "secondary-fixed-dim": "#72d8c8",
                        "primary-fixed-dim": "#3de273",
                        "primary-fixed": "#66ff8e",
                        "secondary-fixed": "#8ff4e3",
                        "error-container": "#ffdad6",
                        "secondary": "#006b5f",
                        "surface": "#fcf9f8",
                        "on-primary-container": "#005523",
                        "error": "#ba1a1a",
                        "surface-dim": "#dcd9d9",
                        "surface-tint": "#006d2f",
                        "inverse-primary": "#3de273",
                        "outline-variant": "#bbcbb9",
                        "surface-container-highest": "#e5e2e1",
                        "tertiary-fixed": "#c4e7ff",
                        "on-secondary": "#ffffff",
                        "on-secondary-container": "#006f64",
                        "surface-container": "#f0edec",
                        "primary": "#006d2f",
                        "tertiary": "#00668a",
                        "primary-container": "#25d366",
                        "on-error": "#ffffff",
                        "on-primary-fixed": "#002109",
                        "on-tertiary-fixed": "#001e2c",
                        "on-secondary-fixed-variant": "#005047",
                        "inverse-on-surface": "#f3f0ef",
                        "on-tertiary-container": "#004f6c",
                        "secondary-container": "#8cf1e1",
                        "outline": "#6c7b6b",
                        "on-surface": "#1c1b1b",
                        "surface-bright": "#fcf9f8",
                        "surface-variant": "#e5e2e1",
                        "on-background": "#1c1b1b"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "xl": "64px",
                        "sm": "12px",
                        "md": "24px",
                        "xs": "4px",
                        "gutter": "24px",
                        "margin-mobile": "16px",
                        "lg": "40px",
                        "margin-desktop": "48px",
                        "base": "8px"
                    },
                    "fontFamily": {
                        "display": ["Hanken Grotesk"],
                        "label-md": ["Hanken Grotesk"],
                        "headline-lg-mobile": ["Hanken Grotesk"],
                        "body-lg": ["Hanken Grotesk"],
                        "headline-lg": ["Hanken Grotesk"],
                        "body-md": ["Hanken Grotesk"],
                        "label-sm": ["Hanken Grotesk"],
                        "headline-md": ["Hanken Grotesk"]
                    },
                    "fontSize": {
                        "display": ["48px", {"lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
                        "label-md": ["14px", {"lineHeight": "20px", "letterSpacing": "0.01em", "fontWeight": "500"}],
                        "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
                        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
                        "body-md": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "label-sm": ["12px", {"lineHeight": "16px", "fontWeight": "600"}],
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}]
                    }
                },
            },
        }
    </script>
    <style>
        body {
            background-color: #FFFFFF;
            color: #1c1b1b;
            font-family: 'Hanken Grotesk', sans-serif;
        }
        .login-card {
            background: #FFFFFF;
            border: 1px solid #E9ECEF;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
            transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .login-card:hover {
            border-color: #25d366;
            box-shadow: 0 4px 24px rgba(37, 211, 102, 0.08);
        }
        .btn-primary {
            background-color: #25d366;
            color: #ffffff;
            transition: background-color 0.2s, transform 0.2s;
        }
        .btn-primary:hover {
            background-color: #20b859;
        }
        .btn-primary:active {
            transform: scale(0.98);
        }
        input:focus {
            border-color: #25d366 !important;
            box-shadow: 0 0 0 2px rgba(37, 211, 102, 0.2) !important;
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="overflow-x-hidden min-h-screen flex flex-col justify-between bg-surface-container-low">

    <!-- Header / Navbar -->
    <nav class="flex justify-between items-center w-full px-margin-desktop h-16 bg-white border-b border-surface-container-high">
        <div class="flex items-center gap-base">
            <a href="../expendmore_landing_page_light/code.html" class="flex items-center gap-base">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXX1DCQG8F09cfFGj6cNc74SiIzvhKlPuZ4DutMnLAZ1WwEr1_36Bq5V3rqx-3uLHDVeTemvJMZVol4mcWWp2v9MTj2o8OnNdTGqwOEVI8pCfuxe9XMoDgQ_YSPrAF3jNJO6rk9bNvj6cHhjY6shaIm4G9qa3qUoqIySXRR8FYo8XnQfSzk4gbBSsa3rHo5v0Ko2cs1RUpUyg2Ctx7ZQZsJmgvipi1TaV_MHArxTcgDRiBt27-TGkLEQudUI6bWo6T" alt="ExpendMore Logo" class="h-8 w-auto">
            </a>
        </div>
        <div class="flex items-center gap-md">
            <a href="../expendmore_login/code.php" class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs text-label-sm font-label-sm">
                <span class="material-symbols-outlined">dark_mode</span>
                <span>Dark Mode</span>
            </a>
        </div>
    </nav>

    <!-- Main Container -->
    <main class="flex-grow flex items-center justify-center px-margin-mobile py-xl">
        <div class="w-full max-w-md login-card rounded-2xl p-lg relative overflow-hidden bg-white">
            <div class="space-y-md">
                <div class="text-center space-y-xs">
                    <div class="flex justify-center mb-xs">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdSL_VzsGDUpkRQS2gLpPz4l2EV5vt6iuK9fB2fgNOwaBhfJGnq0SavbWj0w667UTg862DoNlUxGOsDgZQWiU8iEpyUtoTpkho0NBV9CPDrGTx5UcSTqSvxm1afL_Ut-m6lZUKRB7MuGDlmVnB1XHziJi8ToXkoBILoShLFmOTsoMMspb7E9Xc9IFhDo0Ttu7qp_NusCSxSLGXd_UIBsWJyy08k9tF52gj8-ieDOvRQlHxiQxUKQw" alt="ExpendMore" class="h-16 w-auto">
                    </div>
                    <h2 class="text-headline-lg font-display text-on-surface">Welcome Back</h2>
                    <p class="text-body-md font-body-md text-on-surface-variant">Log in to your WhatsApp marketing dashboard</p>
                </div>

                <?php if (!empty($errorMessage)): ?>
                <div class="bg-error/15 border border-error/30 rounded-lg p-3 text-error text-sm flex items-center gap-2 mb-4">
                    <span class="material-symbols-outlined text-sm">error</span>
                    <span><?php echo htmlspecialchars($errorMessage); ?></span>
                </div>
                <?php endif; ?>

                <?php if (!empty($statusMessage)): ?>
                <div class="bg-primary/15 border border-primary/30 rounded-lg p-3 text-primary text-sm flex items-center gap-2 mb-4">
                    <span class="material-symbols-outlined text-sm">check_circle</span>
                    <span><?php echo htmlspecialchars($statusMessage); ?></span>
                </div>
                <?php endif; ?>

                <form action="code.php" method="POST" class="space-y-md">
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars(get_csrf_token()); ?>">
                    
                    <div class="space-y-xs">
                        <label for="email" class="text-label-sm font-label-sm text-on-surface-variant block">Email Address</label>
                        <div class="relative">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">mail</span>
                            <input type="email" id="email" name="email" required placeholder="name@company.com" class="w-full bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none transition-all" value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                        </div>
                    </div>

                    <div class="space-y-xs">
                        <div class="flex justify-between items-center">
                            <label for="password" class="text-label-sm font-label-sm text-on-surface-variant block">Password</label>
                            <a href="forgot_password.php" class="text-label-xs font-label-xs text-primary hover:underline font-medium">Forgot password?</a>
                        </div>
                        <div class="relative">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">lock</span>
                            <input type="password" id="password" name="password" required placeholder="••••••••" class="w-full bg-[#F8F9FA] border border-[#E9ECEF] rounded-lg py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none transition-all">
                        </div>
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-xs">
                            <input type="checkbox" id="remember" name="remember" class="w-4 h-4 rounded bg-[#F8F9FA] border-[#E9ECEF] text-primary focus:ring-0 focus:ring-offset-0" <?php echo isset($_POST['remember']) ? 'checked' : ''; ?>>
                            <label for="remember" class="text-label-xs font-label-xs text-on-surface-variant cursor-pointer">Remember for 30 days</label>
                        </div>
                    </div>

                    <button type="submit" class="btn-primary w-full py-3 rounded-lg text-white font-bold text-body-md flex items-center justify-center gap-xs shadow-md shadow-primary-container/10">
                        <span>Sign In</span>
                        <span class="material-symbols-outlined">login</span>
                    </button>
                </form>

                <div class="relative flex py-2 items-center">
                    <div class="flex-grow border-t border-[#E9ECEF]"></div>
                    <span class="flex-shrink mx-4 text-label-xs font-label-xs text-on-surface-variant/40">or continue with</span>
                    <div class="flex-grow border-t border-[#E9ECEF]"></div>
                </div>

                <a href="../auth_core/google_oauth.php" class="w-full py-3 px-4 rounded-lg bg-[#F8F9FA] border border-[#E9ECEF] hover:bg-[#F1F3F5] transition-colors flex items-center justify-center gap-xs text-body-md font-bold text-on-surface">
                    <svg class="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.9 3.02C6.21 7.74 8.87 5.04 12 5.04z"/>
                        <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"/>
                        <path fill="#FBBC05" d="M5.29 14.54c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.39 6.92C.5 8.7 0 10.7 0 12.8s.5 4.1 1.39 5.88l3.9-3.14z"/>
                        <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.89c-1.04.7-2.37 1.11-4.23 1.11-3.13 0-5.79-2.7-6.71-5.54l-3.9 3.02C3.37 20.33 7.35 23 12 23z"/>
                    </svg>
                    <span class="pl-2">Google</span>
                </a>

                <div class="text-center pt-xs">
                    <p class="text-label-xs font-label-xs text-on-surface-variant">
                        Don\'t have an account? 
                        <a href="../expendmore_signup_light/code.php" class="text-primary font-bold hover:underline">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-md w-full bg-white border-t border-surface-container-high">
        <div class="flex flex-col gap-xs mb-md md:mb-0">
            <p class="text-label-xs font-label-xs text-on-surface-variant">© 2024 ExpendMore. All rights reserved.</p>
        </div>
        <div class="flex gap-lg">
            <a class="text-label-xs font-label-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Terms</a>
            <a class="text-label-xs font-label-xs text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy</a>
        </div>
    </footer>

    <script>
        // Micro-interaction for primary button hover
        const btn = document.querySelector('.btn-primary');
        if (btn) {
            btn.addEventListener('mouseover', () => {
                btn.classList.add('scale-[1.01]');
            });
            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('scale-[1.01]');
            });
        }
    </script>
</body>
</html>
