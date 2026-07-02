<?php
// Production error control settings
ini_set('display_errors', '0');
error_reporting(E_ALL);

require_once __DIR__ . '/db.php';

function send_security_headers() {
    if (headers_sent()) {
        return;
    }
    // CSP: restrict resources while permitting google fonts, tailwind scripts, and profiles
    header("Content-Security-Policy: default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; img-src 'self' data: https://lh3.googleusercontent.com; frame-src 'none'; object-src 'none';");
    header("X-Frame-Options: DENY");
    header("X-Content-Type-Options: nosniff");
    header("Referrer-Policy: strict-origin-when-cross-origin");
    header("Permissions-Policy: geolocation=(), camera=(), microphone=()");
    header("Strict-Transport-Security: max-age=63072000; includeSubDomains; preload");
}

function enforce_https() {
    $isHttps = (isset($_SERVER['HTTPS']) && ($_SERVER['HTTPS'] === 'on' || $_SERVER['HTTPS'] === 1))
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https');
    
    if (!$isHttps) {
        // Only redirect if host header is clean
        $host = filter_input(INPUT_SERVER, 'HTTP_HOST', FILTER_SANITIZE_SPECIAL_CHARS) ?: 'localhost';
        $uri = filter_input(INPUT_SERVER, 'REQUEST_URI', FILTER_SANITIZE_SPECIAL_CHARS) ?: '';
        header("Location: https://" . $host . $uri);
        exit;
    }
}

function write_security_log($event, $email = '', $details = '') {
    $logFile = __DIR__ . '/security.log';
    $timestamp = date('Y-m-d H:i:s');
    $ip = get_ip_address();
    $emailStr = $email ? " [Email: " . filter_var($email, FILTER_SANITIZE_EMAIL) . "]" : "";
    $detailsStr = $details ? " - " . htmlspecialchars($details) : "";
    $logLine = "[$timestamp] [IP: $ip] [Event: $event]$emailStr$detailsStr" . PHP_EOL;
    file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
}

function secure_session_start() {
    if (session_status() === PHP_SESSION_NONE) {
        $cookieParams = session_get_cookie_params();
        session_set_cookie_params([
            'lifetime' => 0, // Session cookie (until browser closes)
            'path' => '/',
            'domain' => '',
            'secure' => isset($_SERVER['HTTPS']) || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https'),
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
        session_start();
    }

    // Session fixation protection: regenerate ID every 30 minutes
    if (!isset($_SESSION['created_at'])) {
        $_SESSION['created_at'] = time();
    } elseif (time() - $_SESSION['created_at'] > 1800) {
        session_regenerate_id(true);
        $_SESSION['created_at'] = time();
    }

    // Generate CSRF token if not present
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
}

function get_csrf_token() {
    secure_session_start();
    return $_SESSION['csrf_token'] ?? '';
}

function verify_csrf_token($token) {
    secure_session_start();
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

function get_ip_address() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    }
    return $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
}

function check_login_lockout($email) {
    try {
        $db = Database::getInstance()->getConnection();
        $ip = get_ip_address();
        
        // Lockout if more than 5 attempts within last 15 minutes
        $stmt = $db->prepare("
            SELECT COUNT(*) FROM login_attempts 
            WHERE (email = ? OR ip_address = ?) 
            AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
        ");
        $stmt->execute([$email, $ip]);
        return $stmt->fetchColumn() >= 5;
    } catch (Exception $e) {
        error_log("Lockout check failure: " . $e->getMessage());
        return false;
    }
}

function register_failed_attempt($email) {
    try {
        $db = Database::getInstance()->getConnection();
        $ip = get_ip_address();
        $stmt = $db->prepare("INSERT INTO login_attempts (email, ip_address) VALUES (?, ?)");
        $stmt->execute([$email, $ip]);
    } catch (Exception $e) {
        error_log("Failed attempt registration error: " . $e->getMessage());
    }
}

function clear_failed_attempts($email) {
    try {
        $db = Database::getInstance()->getConnection();
        $ip = get_ip_address();
        $stmt = $db->prepare("DELETE FROM login_attempts WHERE email = ? OR ip_address = ?");
        $stmt->execute([$email, $ip]);
    } catch (Exception $e) {
        error_log("Attempts clear error: " . $e->getMessage());
    }
}

function set_remember_me_cookie($userId) {
    try {
        $db = Database::getInstance()->getConnection();
        $token = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $token);
        
        // Expiry in 30 days
        $expiry = date('Y-m-d H:i:s', time() + (86400 * 30));
        
        // Save to DB
        $stmt = $db->prepare("INSERT INTO remember_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $tokenHash, $expiry]);
        
        // Set secure cookie
        $cookieValue = base64_encode($userId) . ':' . $token;
        setcookie('remember_me', $cookieValue, [
            'expires' => time() + (86400 * 30),
            'path' => '/',
            'domain' => '',
            'secure' => isset($_SERVER['HTTPS']) || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https'),
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
    } catch (Exception $e) {
        error_log("Remember me setting failure: " . $e->getMessage());
    }
}

function clear_remember_me_cookie() {
    if (isset($_COOKIE['remember_me'])) {
        try {
            $parts = explode(':', $_COOKIE['remember_me'], 2);
            if (count($parts) === 2) {
                $userId = base64_decode($parts[0]);
                $token = $parts[1];
                $tokenHash = hash('sha256', $token);
                
                $db = Database::getInstance()->getConnection();
                $stmt = $db->prepare("DELETE FROM remember_tokens WHERE user_id = ? AND token_hash = ?");
                $stmt->execute([$userId, $tokenHash]);
            }
        } catch (Exception $e) {
            error_log("Remember me deletion error: " . $e->getMessage());
        }
        
        // Remove cookie from browser
        setcookie('remember_me', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'domain' => '',
            'secure' => isset($_SERVER['HTTPS']) || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https'),
            'httponly' => true,
            'samesite' => 'Strict'
        ]);
    }
}

function check_remember_me_login() {
    if (isset($_SESSION['user_id'])) {
        return true;
    }
    
    if (empty($_COOKIE['remember_me'])) {
        return false;
    }
    
    try {
        $parts = explode(':', $_COOKIE['remember_me'], 2);
        if (count($parts) !== 2) {
            return false;
        }
        
        $userId = base64_decode($parts[0]);
        $token = $parts[1];
        $tokenHash = hash('sha256', $token);
        
        $db = Database::getInstance()->getConnection();
        $stmt = $db->prepare("
            SELECT t.user_id, u.email, u.status 
            FROM remember_tokens t
            JOIN users u ON t.user_id = u.id
            WHERE t.user_id = ? AND t.token_hash = ? AND t.expires_at > NOW()
        ");
        $stmt->execute([$userId, $tokenHash]);
        $user = $stmt->fetch();
        
        if ($user && $user['status'] === 'active') {
            // Establish session
            session_regenerate_id(true);
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['status'] = $user['status'];
            $_SESSION['created_at'] = time();
            return true;
        } else {
            // Invalid or expired token
            clear_remember_me_cookie();
        }
    } catch (Exception $e) {
        error_log("Remember me login check exception: " . $e->getMessage());
    }
    
    return false;
}
