<?php
require_once __DIR__ . '/auth_helper.php';

function checkAuth() {
    // 1. Enforce HTTPS and emit security headers
    enforce_https();
    send_security_headers();

    secure_session_start();
    
    // Attempt automatic login via remember_me cookie if session is missing
    if (!isset($_SESSION['user_id'])) {
        check_remember_me_login();
    }
    
    // Detect light theme path
    $currentUri = $_SERVER['REQUEST_URI'] ?? '';
    $isLight = (strpos($currentUri, '_light') !== false);
    $loginRedirect = $isLight ? '../expendmore_login_light/code.php' : '../expendmore_login/code.php';
    
    if (!isset($_SESSION['user_id'])) {
        header("Location: $loginRedirect");
        exit;
    }

    // 2. Enforce session idle timeout (15 minutes = 900 seconds)
    if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > 900)) {
        write_security_log('SESSION_TIMEOUT', $_SESSION['email'] ?? 'unknown');
        
        clear_remember_me_cookie();
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        
        header("Location: $loginRedirect?error=session_expired");
        exit;
    }
    $_SESSION['last_activity'] = time();
    
    // Double check status of active user in Database
    try {
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("SELECT status, is_verified FROM users WHERE id = ?");
        $stmt->execute([$_SESSION['user_id']]);
        $user = $stmt->fetch();
        
        if (!$user || $user['status'] !== 'active') {
            write_security_log('USER_BLOCKED_MID_SESSION', $_SESSION['email'] ?? 'unknown', 'Status changed: ' . ($user['status'] ?? 'deleted'));
            
            // Destroy session and log out
            clear_remember_me_cookie();
            $_SESSION = [];
            if (ini_get("session.use_cookies")) {
                $params = session_get_cookie_params();
                setcookie(session_name(), '', time() - 42000,
                    $params["path"], $params["domain"],
                    $params["secure"], $params["httponly"]
                );
            }
            session_destroy();
            
            $errType = ($user && $user['status'] === 'disabled') ? 'disabled' : 'inactive';
            header("Location: $loginRedirect?error=$errType");
            exit;
        }

        // 3. Enforce email verification check
        if ($user['is_verified'] == 0) {
            // Verify if user is not already on the verify_pending page
            if (strpos($currentUri, 'verify_pending.php') === false) {
                $verifyRedirect = $isLight ? '../expendmore_signup_light/verify_pending.php' : '../expendmore_signup/verify_pending.php';
                header("Location: $verifyRedirect");
                exit;
            }
        } else {
            // If they are verified but trying to access verify_pending, redirect them to dashboard
            if (strpos($currentUri, 'verify_pending.php') !== false) {
                $dashboardRedirect = $isLight ? '../expendmore_dashboard_light/code.php' : '../expendmore_dashboard/code.php';
                header("Location: $dashboardRedirect");
                exit;
            }
        }

        // 4. Enforce Workspace Isolation
        if (isset($_SESSION['workspace_id'])) {
            $wsId = (int)$_SESSION['workspace_id'];
            $stmt = $db->prepare("
                SELECT 1 FROM workspaces w 
                JOIN organization_members m ON w.organization_id = m.organization_id 
                WHERE w.id = ? AND m.user_id = ? AND w.deleted_at IS NULL
            ");
            $stmt->execute([$wsId, $_SESSION['user_id']]);
            if (!$stmt->fetchColumn()) {
                unset($_SESSION['workspace_id']);
                unset($_SESSION['organization_id']);
                write_security_log('CROSS_WORKSPACE_ACCESS_PREVENTED', $_SESSION['email'] ?? 'unknown', "Workspace: $wsId");
            }
        }
    } catch (Exception $e) {
        error_log("Middleware database check error: " . $e->getMessage());
    }
}

function checkGuest() {
    // Enforce HTTPS and emit security headers
    enforce_https();
    send_security_headers();

    secure_session_start();
    
    if (!isset($_SESSION['user_id'])) {
        check_remember_me_login();
    }
    
    if (isset($_SESSION['user_id'])) {
        $currentUri = $_SERVER['REQUEST_URI'] ?? '';
        $isLight = (strpos($currentUri, '_light') !== false);
        $dashboardRedirect = $isLight ? '../expendmore_dashboard_light/code.php' : '../expendmore_dashboard/code.php';
        header("Location: $dashboardRedirect");
        exit;
    }
}
