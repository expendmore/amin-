<?php
require_once __DIR__ . '/auth_helper.php';
require_once __DIR__ . '/middleware.php';

// Enforce HTTPS
enforce_https();

secure_session_start();

$theme = $_SESSION['theme'] ?? 'dark';
$loginRedirect = ($theme === 'light') ? '../expendmore_login_light/code.php' : '../expendmore_login/code.php';
$dashboardRedirect = ($theme === 'light') ? '../expendmore_dashboard_light/code.php' : '../expendmore_dashboard/code.php';

$code = $_GET['code'] ?? '';
$state = $_GET['state'] ?? '';

// 1. Validate state parameter (CSRF protection)
if (empty($state) || empty($_SESSION['oauth_state']) || !hash_equals($_SESSION['oauth_state'], $state)) {
    write_security_log('OAUTH_CSRF_STATE_VALIDATION_FAILED', '', 'Received: ' . $state);
    header("Location: $loginRedirect?error=oauth_failed");
    exit;
}

// Clear state after single use
unset($_SESSION['oauth_state']);

if (empty($code)) {
    header("Location: $loginRedirect?error=oauth_failed");
    exit;
}

$clientId = getenv('GOOGLE_CLIENT_ID');
$clientSecret = getenv('GOOGLE_CLIENT_SECRET');
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http');
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$redirectUri = $protocol . '://' . $host . '/stitch_expendmore_whatsapp_marketing/auth_core/google_callback.php';

// 2. Exchange Authorization Code for Access & ID tokens
$tokenUrl = 'https://oauth2.googleapis.com/token';
$postData = [
    'code' => $code,
    'client_id' => $clientId,
    'client_secret' => $clientSecret,
    'redirect_uri' => $redirectUri,
    'grant_type' => 'authorization_code'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $tokenUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
// Suppress self-signed cert issues on localhost during development
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
$response = curl_exec($ch);

if (curl_errno($ch)) {
    $errorMsg = curl_error($ch);
    curl_close($ch);
    write_security_log('OAUTH_TOKEN_EXCHANGE_CURL_ERROR', '', $errorMsg);
    header("Location: $loginRedirect?error=oauth_failed");
    exit;
}

curl_close($ch);
$tokenData = json_decode($response, true);

if (!isset($tokenData['access_token'])) {
    write_security_log('OAUTH_TOKEN_EXCHANGE_FAILED_PAYLOAD', '', $response);
    header("Location: $loginRedirect?error=oauth_failed");
    exit;
}

$accessToken = $tokenData['access_token'];

// 3. Retrieve Google Userinfo Profile Payload
$userinfoUrl = 'https://www.googleapis.com/oauth2/v3/userinfo';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $userinfoUrl);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer $accessToken"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
$profileResponse = curl_exec($ch);

if (curl_errno($ch)) {
    $errorMsg = curl_error($ch);
    curl_close($ch);
    write_security_log('OAUTH_PROFILE_FETCH_CURL_ERROR', '', $errorMsg);
    header("Location: $loginRedirect?error=oauth_failed");
    exit;
}

curl_close($ch);
$profile = json_decode($profileResponse, true);

$googleSub = $profile['sub'] ?? '';
$email = $profile['email'] ?? '';
$fullName = $profile['name'] ?? 'Google User';

if (empty($googleSub) || empty($email)) {
    write_security_log('OAUTH_INVALID_PROFILE_DATA', '', $profileResponse);
    header("Location: $loginRedirect?error=oauth_failed");
    exit;
}

try {
    $db = Database::getInstance()->getConnection();
    
    // 4. Verify if this provider ID is already linked
    $stmt = $db->prepare("SELECT * FROM oauth_accounts WHERE provider = 'google' AND provider_user_id = ?");
    $stmt->execute([$googleSub]);
    $oauthLink = $stmt->fetch();
    
    if ($oauthLink) {
        // Link exists! Log user in
        $userId = $oauthLink['user_id'];
        
        $stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        
        if (!$user || $user['status'] !== 'active') {
            header("Location: $loginRedirect?error=" . (($user && $user['status'] === 'disabled') ? 'disabled' : 'inactive'));
            exit;
        }
        
        // Setup authenticated session
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['status'] = $user['status'];
        $_SESSION['is_verified'] = $user['is_verified'];
        $_SESSION['created_at'] = time();
        $_SESSION['last_activity'] = time();
        
        write_security_log('OAUTH_LOGIN_SUCCESS', $user['email'], "Google Link Found");
        header("Location: $dashboardRedirect");
        exit;
    }
    
    // 5. Account Linking / Registration Handling
    $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $existingUser = $stmt->fetch();
    
    if ($existingUser) {
        // Existing user email is present in database. Link Google account to it dynamically
        $db->beginTransaction();
        
        $stmt = $db->prepare("INSERT INTO oauth_accounts (user_id, provider, provider_user_id) VALUES (?, 'google', ?)");
        $stmt->execute([$existingUser['id'], $googleSub]);
        
        // Auto-verify if they weren't verified
        if ($existingUser['is_verified'] == 0) {
            $stmt = $db->prepare("UPDATE users SET is_verified = 1 WHERE id = ?");
            $stmt->execute([$existingUser['id']]);
        }
        
        $db->commit();
        
        session_regenerate_id(true);
        $_SESSION['user_id'] = $existingUser['id'];
        $_SESSION['email'] = $existingUser['email'];
        $_SESSION['status'] = $existingUser['status'];
        $_SESSION['is_verified'] = 1;
        $_SESSION['created_at'] = time();
        $_SESSION['last_activity'] = time();
        
        write_security_log('OAUTH_ACCOUNT_LINK_SUCCESS', $email, "Linked to existing email");
        header("Location: $dashboardRedirect");
        exit;
    } else {
        // Entirely new user signing up via Google. Perform full transactional signup
        $db->beginTransaction();
        
        // Create user (no password for pure OAuth)
        $stmt = $db->prepare("INSERT INTO users (email, password_hash, status, is_verified) VALUES (?, NULL, 'active', 1)");
        $stmt->execute([$email]);
        $newUserId = $db->lastInsertId();
        
        // Create organization workspace
        $companyName = $fullName . "'s Workspace";
        $stmt = $db->prepare("INSERT INTO organizations (name) VALUES (?)");
        $stmt->execute([$companyName]);
        $newOrgId = $db->lastInsertId();
        
        // Add member mapping
        $stmt = $db->prepare("INSERT INTO organization_members (organization_id, user_id, role) VALUES (?, ?, 'owner')");
        $stmt->execute([$newOrgId, $newUserId]);
        
        // Create user profile
        $stmt = $db->prepare("INSERT INTO user_profiles (user_id, full_name, phone_number, country, newsletter_subscribed) VALUES (?, ?, NULL, NULL, 0)");
        $stmt->execute([$newUserId, $fullName]);
        
        // Link OAuth account
        $stmt = $db->prepare("INSERT INTO oauth_accounts (user_id, provider, provider_user_id) VALUES (?, 'google', ?)");
        $stmt->execute([$newUserId, $googleSub]);
        
        $db->commit();
        
        session_regenerate_id(true);
        $_SESSION['user_id'] = $newUserId;
        $_SESSION['email'] = $email;
        $_SESSION['status'] = 'active';
        $_SESSION['is_verified'] = 1;
        $_SESSION['created_at'] = time();
        $_SESSION['last_activity'] = time();
        
        write_security_log('OAUTH_SIGNUP_SUCCESS', $email, "Signed up via Google. Org ID: $newOrgId");
        
        // Dispatch Welcome Email
        require_once __DIR__ . '/mailer.php';
        Mailer::getInstance()->sendWelcome($email, $fullName, $companyName);
        
        header("Location: $dashboardRedirect");
        exit;
    }
    
} catch (Exception $e) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    write_security_log('OAUTH_DATABASE_TRANSACTION_FAILED', $email, $e->getMessage());
    header("Location: $loginRedirect?error=oauth_failed");
    exit;
}
