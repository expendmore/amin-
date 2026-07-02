<?php
require_once __DIR__ . '/../auth_core/auth_helper.php';
require_once __DIR__ . '/../auth_core/middleware.php';

// Enforce HTTPS
enforce_https();

secure_session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: ../expendmore_login/code.php');
    exit;
}

$email = $_SESSION['email'] ?? '';
$errorMessage = '';
$successMessage = '';

if (isset($_GET['error'])) {
    if ($_GET['error'] === 'invalid_token') {
        $errorMessage = 'The verification link is invalid or has already been used.';
    } elseif ($_GET['error'] === 'expired_token') {
        $errorMessage = 'The verification link has expired. Please request a new one.';
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['resend'])) {
    $csrfToken = $_POST['csrf_token'] ?? '';
    
    if (!verify_csrf_token($csrfToken)) {
        $errorMessage = 'Session Expired';
    } else {
        try {
            $db = Database::getInstance()->getConnection();
            
            $token = bin2hex(random_bytes(32));
            $tokenHash = hash('sha256', $token);
            $expiry = date('Y-m-d H:i:s', time() + 86400);

            $db->beginTransaction();
            
            $stmt = $db->prepare("UPDATE email_verifications SET expires_at = NOW() WHERE user_id = ? AND used_at IS NULL");
            $stmt->execute([$_SESSION['user_id']]);

            $stmt = $db->prepare("INSERT INTO email_verifications (user_id, token_hash, expires_at) VALUES (?, ?, ?)");
            $stmt->execute([$_SESSION['user_id'], $tokenHash, $expiry]);

            $db->commit();

            write_security_log('EMAIL_VERIFICATION_RESENT_SIMULATION', $email, "Token: $token");
            $successMessage = "A new verification link has been simulated! Token: $token";

        } catch (Exception $e) {
            if (isset($db) && $db->inTransaction()) {
                $db->rollBack();
            }
            $errorMessage = 'Failed to generate a new verification link.';
        }
    }
}
?>
<!DOCTYPE html>
<html class="dark" lang="en">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>ExpendMore - Verify Email</title>
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
    </style>
</head>
<body class="overflow-x-hidden min-h-screen flex flex-col justify-between hero-gradient">

    <nav class="flex justify-between items-center w-full px-margin-desktop h-16 bg-background/80 backdrop-blur-xl border-b border-outline-variant">
        <div class="flex items-center gap-base">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXX1DCQG8F09cfFGj6cNc74SiIzvhKlPuZ4DutMnLAZ1WwEr1_36Bq5V3rqx-3uLHDVeTemvJMZVol4mcWWp2v9MTj2o8OnNdTGqwOEVI8pCfuxe9XMoDgQ_YSPrAF3jNJO6rk9bNvj6cHhjY6shaIm4G9qa3qUoqIySXRR8FYo8XnQfSzk4gbBSsa3rHo5v0Ko2cs1RUpUyg2Ctx7ZQZsJmgvipi1TaV_MHArxTcgDRiBt27-TGkLEQudUI6bWo6T" alt="ExpendMore Logo" class="h-8 w-auto">
        </div>
        <div class="flex items-center gap-md">
            <a href="../auth_core/logout.php" class="text-on-surface-variant hover:text-error transition-colors flex items-center gap-xs text-label-sm font-label-sm">
                <span class="material-symbols-outlined">logout</span>
                <span>Log Out</span>
            </a>
        </div>
    </nav>

    <main class="flex-grow flex items-center justify-center px-margin-mobile py-xl">
        <div class="w-full max-w-md glass-card rounded-2xl p-lg relative overflow-hidden text-center space-y-md">
            <div class="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px]"></div>
            
            <div class="w-16 h-16 bg-primary/15 rounded-full flex items-center justify-center mx-auto text-primary">
                <span class="material-symbols-outlined text-[32px]">mark_email_unread</span>
            </div>

            <div class="space-y-xs">
                <h2 class="text-headline-lg font-display text-on-surface">Verify your Email</h2>
                <p class="text-body-md text-on-surface-variant">We've sent a verification link to <strong class="text-on-surface"><?php echo htmlspecialchars($email); ?></strong></p>
                <p class="text-label-sm text-on-surface-variant pt-2">Please click the link to activate your workspace and access the dashboard.</p>
            </div>

            <?php if (!empty($errorMessage)): ?>
            <div class="bg-error/15 border border-error/30 rounded-lg p-3 text-error text-sm flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-sm">error</span>
                <span><?php echo htmlspecialchars($errorMessage); ?></span>
            </div>
            <?php endif; ?>

            <?php if (!empty($successMessage)): ?>
            <div class="bg-primary/15 border border-primary/30 rounded-lg p-3 text-primary text-sm flex flex-col items-center gap-1">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm">check_circle</span>
                    <span class="font-bold">Resent Successfully!</span>
                </div>
                <div class="text-xs text-on-surface-variant text-center mt-1">
                    Copy the validation link below (simulated):<br>
                    <a href="verify.php?token=<?php echo htmlspecialchars($token); ?>" class="text-primary hover:underline font-semibold block mt-1 break-all">verify.php?token=<?php echo htmlspecialchars($token); ?></a>
                </div>
            </div>
            <?php endif; ?>

            <form action="verify_pending.php" method="POST" class="pt-base">
                <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars(get_csrf_token()); ?>">
                <button type="submit" name="resend" class="btn-primary w-full py-3 rounded-lg text-on-primary font-bold text-body-md flex items-center justify-center gap-xs shadow-lg">
                    <span>Resend Link</span>
                    <span class="material-symbols-outlined">send</span>
                </button>
            </form>
        </div>
    </main>

    <footer class="flex flex-col md:flex-row justify-between items-center px-margin-desktop py-md w-full bg-surface-container-lowest border-t border-outline-variant">
        <p class="text-label-xs text-on-surface-variant opacity-80">© 2024 ExpendMore. All rights reserved.</p>
    </footer>

</body>
</html>
