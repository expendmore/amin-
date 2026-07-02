<?php
require_once __DIR__ . '/../auth_core/auth_helper.php';
require_once __DIR__ . '/../auth_core/middleware.php';

// Enforce HTTPS
enforce_https();

$token = $_GET['token'] ?? '';
$errorRedirect = 'verify_pending.php?error=invalid_token';

if (empty($token)) {
    header("Location: $errorRedirect");
    exit;
}

$tokenHash = hash('sha256', $token);

try {
    $db = Database::getInstance()->getConnection();
    
    // Look up valid token
    $stmt = $db->prepare("SELECT * FROM email_verifications WHERE token_hash = ? AND used_at IS NULL");
    $stmt->execute([$tokenHash]);
    $verification = $stmt->fetch();
    
    if (!$verification) {
        write_security_log('EMAIL_VERIFICATION_FAILED_INVALID_TOKEN', '', "Hash: $tokenHash");
        header("Location: $errorRedirect");
        exit;
    }
    
    // Check expiry
    $expiresAt = strtotime($verification['expires_at']);
    if (time() > $expiresAt) {
        write_security_log('EMAIL_VERIFICATION_FAILED_EXPIRED_TOKEN', '', "User ID: " . $verification['user_id']);
        header("Location: verify_pending.php?error=expired_token");
        exit;
    }
    
    $userId = $verification['user_id'];
    
    // Fetch email for logging
    $stmt = $db->prepare("SELECT email, status FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        header("Location: $errorRedirect");
        exit;
    }
    
    // Update verification state atomically
    $db->beginTransaction();
    
    $stmt = $db->prepare("UPDATE email_verifications SET used_at = NOW() WHERE id = ?");
    $stmt->execute([$verification['id']]);
    
    $stmt = $db->prepare("UPDATE users SET is_verified = 1 WHERE id = ?");
    $stmt->execute([$userId]);
    
    $db->commit();
    
    write_security_log('EMAIL_VERIFIED_SUCCESS', $user['email']);
    
    // If the user has an active session for this user, update it dynamically
    secure_session_start();
    if (isset($_SESSION['user_id']) && $_SESSION['user_id'] == $userId) {
        $_SESSION['is_verified'] = 1;
        
        // Detect theme from query/session to redirect to the correct dashboard
        $isLight = (isset($_SESSION['theme']) && $_SESSION['theme'] === 'light');
        $dashboardRedirect = $isLight ? '../expendmore_dashboard_light/code.php' : '../expendmore_dashboard/code.php';
        header("Location: $dashboardRedirect");
        exit;
    } else {
        // Otherwise, redirect to login page with success notification
        header("Location: ../expendmore_login/code.php?status=verified_success");
        exit;
    }
    
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    error_log("Verification error: " . $e->getMessage());
    header("Location: $errorRedirect");
    exit;
}
