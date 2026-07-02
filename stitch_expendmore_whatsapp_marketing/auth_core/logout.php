<?php
require_once __DIR__ . '/auth_helper.php';

secure_session_start();

// Log logout success
if (isset($_SESSION['email'])) {
    write_security_log('LOGOUT_SUCCESS', $_SESSION['email']);
}

// Clear remember me token and cookie
clear_remember_me_cookie();

// Unset all of the session variables
$_SESSION = [];

// If it's desired to kill the session, also delete the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finally, destroy the session
session_destroy();

// Detect theme from referer
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$isLight = (strpos($referer, '_light') !== false);
$loginRedirect = $isLight ? '../expendmore_login_light/code.php' : '../expendmore_login/code.php';

header("Location: $loginRedirect");
exit;
