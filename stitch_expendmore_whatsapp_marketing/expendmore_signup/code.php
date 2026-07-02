<?php
require_once __DIR__ . '/../auth_core/auth_helper.php';
require_once __DIR__ . '/../auth_core/middleware.php';

// Guest check: if already verified and logged in, redirect to dashboard
checkGuest();

$errorMessage = '';
$successMessage = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';
    
    if (!verify_csrf_token($csrfToken)) {
        write_security_log('CSRF_FAILURE', $_POST['email'] ?? 'unknown');
        $errorMessage = 'Session Expired';
    } else {
        $fullName = trim($_POST['full_name'] ?? '');
        $companyName = trim($_POST['company_name'] ?? '');
        $emailInput = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';
        $phoneNumber = trim($_POST['phone_number'] ?? '');
        $country = trim($_POST['country'] ?? '');
        $terms = isset($_POST['terms']);
        $newsletter = isset($_POST['newsletter']);

        // Check rate limiting / registration spam protection
        // For simulation, we limit requests by matching attempts
        if (check_login_lockout($emailInput)) {
            $errorMessage = 'Too Many Attempts';
        } elseif (empty($fullName) || empty($companyName) || empty($emailInput) || empty($password) || empty($confirmPassword) || empty($phoneNumber) || empty($country)) {
            $errorMessage = 'All fields are required';
        } elseif (!$terms) {
            $errorMessage = 'You must accept the terms';
        } elseif (strlen($emailInput) > 255 || !filter_var($emailInput, FILTER_VALIDATE_EMAIL)) {
            $errorMessage = 'Wrong Email';
        } elseif ($password !== $confirmPassword) {
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
                try {
                    $db = Database::getInstance()->getConnection();
                    
                    // Verify email is not duplicated
                    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
                    $stmt->execute([$emailInput]);
                    if ($stmt->fetch()) {
                        write_security_log('REGISTRATION_DUPLICATE_EMAIL', $emailInput);
                        $errorMessage = 'Wrong Email'; // Generic response to prevent email harvesting
                    } else {
                        // Atomically create user, organization, member and profile
                        $db->beginTransaction();

                        // 1. Insert User
                        $stmt = $db->prepare("INSERT INTO users (email, password_hash, status, is_verified) VALUES (?, ?, 'active', 0)");
                        $stmt->execute([$emailInput, password_hash($password, PASSWORD_BCRYPT)]);
                        $userId = $db->lastInsertId();

                        // 2. Insert Organization
                        $stmt = $db->prepare("INSERT INTO organizations (name) VALUES (?)");
                        $stmt->execute([$companyName]);
                        $orgId = $db->lastInsertId();

                        // 3. Add Member mapping as Owner role
                        $stmt = $db->prepare("INSERT INTO organization_members (organization_id, user_id, role) VALUES (?, ?, 'owner')");
                        $stmt->execute([$orgId, $userId]);

                        // 4. Create User Profile details
                        $stmt = $db->prepare("INSERT INTO user_profiles (user_id, full_name, phone_number, country, newsletter_subscribed) VALUES (?, ?, ?, ?, ?)");
                        $stmt->execute([$userId, $fullName, $phoneNumber, $country, $newsletter ? 1 : 0]);

                        // 5. Generate Verification Token (expires in 24 hours)
                        $token = bin2hex(random_bytes(32));
                        $tokenHash = hash('sha256', $token);
                        $expiry = date('Y-m-d H:i:s', time() + 86400);

                        $stmt = $db->prepare("INSERT INTO email_verifications (user_id, token_hash, expires_at) VALUES (?, ?, ?)");
                        $stmt->execute([$userId, $tokenHash, $expiry]);

                        $db->commit();

                        // Log actions & print simulation parameters
                        write_security_log('REGISTRATION_SUCCESS', $emailInput, "Org ID: $orgId");

                        // Trigger Email Deliveries using Mailer
                        require_once __DIR__ . '/../auth_core/mailer.php';
                        Mailer::getInstance()->sendVerification($emailInput, $fullName, $token, false);
                        Mailer::getInstance()->sendWelcome($emailInput, $fullName, $companyName);

                        // Auto-start unverified session
                        session_regenerate_id(true);
                        $_SESSION['user_id'] = $userId;
                        $_SESSION['email'] = $emailInput;
                        $_SESSION['status'] = 'active';
                        $_SESSION['created_at'] = time();
                        $_SESSION['last_activity'] = time();

                        header('Location: verify_pending.php');
                        exit;
                    }
                } catch (Exception $e) {
                    if (isset($db) && $db->inTransaction()) {
                        $db->rollBack();
                    }
                    write_security_log('REGISTRATION_TRANSACTION_FAILED', $emailInput, $e->getMessage());
                    $errorMessage = 'Registration failure. Please try again later.';
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>ExpendMore - Create Account</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@600;700;800&amp;family=Inter:wght@400;500&amp;family=Geist:wght@500;600&amp;display=swap" rel="stylesheet">
    <!-- Material Symbols -->
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
        .glass-card:hover {
            border-color: #3de273;
            box-shadow: 0 0 20px rgba(61, 226, 115, 0.05);
        }
        .hero-gradient {
            background: radial-gradient(circle at 50% 50%, rgba(37, 211, 102, 0.1) 0%, transparent 70%);
        }
        .btn-primary {
            background: linear-gradient(90deg, #25D366 0%, #00e3fd 100%);
            transition: transform 0.2s, opacity 0.2s, filter 0.2s;
        }
        .btn-primary:active {
            transform: scale(0.98);
        }
        .btn-primary:hover {
            filter: brightness(1.05);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        input:focus, select:focus {
            border-color: #00e3fd !important;
            box-shadow: 0 0 0 2px rgba(0, 227, 253, 0.2) !important;
        }
    </style>
</head>
<body class="overflow-x-hidden min-h-screen flex flex-col justify-between hero-gradient">

    <!-- Header / Navbar -->
    <nav class="flex justify-between items-center w-full px-margin-desktop h-16 bg-background/80 backdrop-blur-xl border-b border-outline-variant">
        <div class="flex items-center gap-base">
            <a href="../expendmore_landing_page/code.html" class="flex items-center gap-base">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXX1DCQG8F09cfFGj6cNc74SiIzvhKlPuZ4DutMnLAZ1WwEr1_36Bq5V3rqx-3uLHDVeTemvJMZVol4mcWWp2v9MTj2o8OnNdTGqwOEVI8pCfuxe9XMoDgQ_YSPrAF3jNJO6rk9bNvj6cHhjY6shaIm4G9qa3qUoqIySXRR8FYo8XnQfSzk4gbBSsa3rHo5v0Ko2cs1RUpUyg2Ctx7ZQZsJmgvipi1TaV_MHArxTcgDRiBt27-TGkLEQudUI6bWo6T" alt="ExpendMore Logo" class="h-8 w-auto">
            </a>
        </div>
        <div class="flex items-center gap-md">
            <a href="../expendmore_signup_light/code.php" class="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-xs text-label-sm font-label-sm">
                <span class="material-symbols-outlined">light_mode</span>
                <span>Light Mode</span>
            </a>
        </div>
    </nav>

    <!-- Main Container -->
    <main class="flex-grow flex items-center justify-center px-margin-mobile py-xl">
        <div class="w-full max-w-lg glass-card rounded-2xl p-lg relative overflow-hidden my-4">
            <div class="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]"></div>
            <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary-container/10 rounded-full blur-[80px]"></div>
            
            <div class="relative z-10 space-y-md">
                <div class="text-center space-y-xs">
                    <h2 class="text-headline-lg font-display text-on-surface">Get Started Today</h2>
                    <p class="text-body-md font-body-md text-on-surface-variant">Create your free workspace and start marketing</p>
                </div>

                <?php if (!empty($errorMessage)): ?>
                <div class="bg-error/15 border border-error/30 rounded-lg p-3 text-error text-sm flex items-center gap-2 mb-4">
                    <span class="material-symbols-outlined text-sm">error</span>
                    <span><?php echo htmlspecialchars($errorMessage); ?></span>
                </div>
                <?php endif; ?>

                <form action="code.php" method="POST" class="space-y-md">
                    <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars(get_csrf_token()); ?>">
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                        <div class="space-y-xs">
                            <label for="full_name" class="text-label-sm font-label-sm text-on-surface-variant block">Full Name</label>
                            <input type="text" id="full_name" name="full_name" required placeholder="John Doe" class="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-on-surface focus:outline-none transition-all" value="<?php echo isset($_POST['full_name']) ? htmlspecialchars($_POST['full_name']) : ''; ?>">
                        </div>
                        <div class="space-y-xs">
                            <label for="company_name" class="text-label-sm font-label-sm text-on-surface-variant block">Company Name</label>
                            <input type="text" id="company_name" name="company_name" required placeholder="Acme Inc." class="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-on-surface focus:outline-none transition-all" value="<?php echo isset($_POST['company_name']) ? htmlspecialchars($_POST['company_name']) : ''; ?>">
                        </div>
                    </div>

                    <div class="space-y-xs">
                        <label for="email" class="text-label-sm font-label-sm text-on-surface-variant block">Business Email</label>
                        <input type="email" id="email" name="email" required placeholder="name@company.com" class="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-on-surface focus:outline-none transition-all" value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                        <div class="space-y-xs">
                            <label for="password" class="text-label-sm font-label-sm text-on-surface-variant block">Password</label>
                            <input type="password" id="password" name="password" required placeholder="••••••••" class="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-on-surface focus:outline-none transition-all">
                        </div>
                        <div class="space-y-xs">
                            <label for="confirm_password" class="text-label-sm font-label-sm text-on-surface-variant block">Confirm Password</label>
                            <input type="password" id="confirm_password" name="confirm_password" required placeholder="••••••••" class="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-on-surface focus:outline-none transition-all">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-md">
                        <div class="space-y-xs">
                            <label for="phone_number" class="text-label-sm font-label-sm text-on-surface-variant block">Phone Number</label>
                            <input type="tel" id="phone_number" name="phone_number" required placeholder="+1 (555) 000-0000" class="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-on-surface focus:outline-none transition-all" value="<?php echo isset($_POST['phone_number']) ? htmlspecialchars($_POST['phone_number']) : ''; ?>">
                        </div>
                        <div class="space-y-xs">
                            <label for="country" class="text-label-sm font-label-sm text-on-surface-variant block">Country</label>
                            <select id="country" name="country" required class="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-3 px-4 text-on-surface focus:outline-none transition-all">
                                <option value="">Select country</option>
                                <option value="United States" <?php echo (isset($_POST['country']) && $_POST['country'] === 'United States') ? 'selected' : ''; ?>>United States</option>
                                <option value="United Kingdom" <?php echo (isset($_POST['country']) && $_POST['country'] === 'United Kingdom') ? 'selected' : ''; ?>>United Kingdom</option>
                                <option value="Canada" <?php echo (isset($_POST['country']) && $_POST['country'] === 'Canada') ? 'selected' : ''; ?>>Canada</option>
                                <option value="India" <?php echo (isset($_POST['country']) && $_POST['country'] === 'India') ? 'selected' : ''; ?>>India</option>
                                <option value="Pakistan" <?php echo (isset($_POST['country']) && $_POST['country'] === 'Pakistan') ? 'selected' : ''; ?>>Pakistan</option>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-xs">
                        <div class="flex items-start gap-xs">
                            <input type="checkbox" id="terms" name="terms" required class="mt-1 w-4 h-4 rounded bg-[#1A1A1A] border-[#2A2A2A] text-primary focus:ring-0 focus:ring-offset-0">
                            <label for="terms" class="text-label-xs font-label-xs text-on-surface-variant cursor-pointer">I agree to the <a href="#" class="text-primary hover:underline font-semibold">Terms of Service</a> and <a href="#" class="text-primary hover:underline font-semibold">Privacy Policy</a></label>
                        </div>
                        <div class="flex items-start gap-xs mt-2">
                            <input type="checkbox" id="newsletter" name="newsletter" class="mt-1 w-4 h-4 rounded bg-[#1A1A1A] border-[#2A2A2A] text-primary focus:ring-0 focus:ring-offset-0" <?php echo isset($_POST['newsletter']) ? 'checked' : ''; ?>>
                            <label for="newsletter" class="text-label-xs font-label-xs text-on-surface-variant cursor-pointer">I want to receive marketing communications and product updates</label>
                        </div>
                    </div>

                    <button type="submit" class="btn-primary w-full py-3 rounded-lg text-on-primary font-bold text-body-md flex items-center justify-center gap-xs shadow-lg shadow-primary-container/20">
                        <span>Sign Up</span>
                        <span class="material-symbols-outlined">person_add</span>
                    </button>
                </form>

                <div class="relative flex py-2 items-center">
                    <div class="flex-grow border-t border-[#2A2A2A]"></div>
                    <span class="flex-shrink mx-4 text-label-xs font-label-xs text-on-surface-variant/40">or continue with</span>
                    <div class="flex-grow border-t border-[#2A2A2A]"></div>
                </div>

                <a href="../auth_core/google_oauth.php" class="w-full py-3 px-4 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] hover:bg-[#222222] transition-colors flex items-center justify-center gap-xs text-body-md font-bold text-on-surface">
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
                        Already have an account? 
                        <a href="../expendmore_login/code.php" class="text-primary font-bold hover:underline">Log in</a>
                    </p>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-md w-full bg-surface-container-lowest border-t border-outline-variant">
        <div class="flex flex-col gap-xs mb-md md:mb-0">
            <p class="text-label-xs font-label-xs text-on-surface-variant opacity-80">© 2024 ExpendMore. All rights reserved.</p>
        </div>
        <div class="flex gap-lg">
            <a class="text-label-xs font-label-xs text-on-surface-variant hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">Terms</a>
            <a class="text-label-xs font-label-xs text-on-surface-variant hover:text-secondary-fixed transition-colors opacity-80 hover:opacity-100" href="#">Privacy</a>
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
