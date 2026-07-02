<?php
require_once __DIR__ . '/auth_helper.php';

// Enforce HTTPS
enforce_https();

secure_session_start();

$clientId = getenv('GOOGLE_CLIENT_ID') ?: '';
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http');
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';
$redirectUri = $protocol . '://' . $host . '/stitch_expendmore_whatsapp_marketing/auth_core/google_callback.php';

// Generate secure random state token to protect against CSRF and replay attacks
$state = bin2hex(random_bytes(16));
$_SESSION['oauth_state'] = $state;

// Store theme configuration in session for post-oauth callback UI redirection
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$_SESSION['theme'] = (strpos($referer, '_light') !== false) ? 'light' : 'dark';

$params = [
    'client_id' => $clientId,
    'redirect_uri' => $redirectUri,
    'response_type' => 'code',
    'scope' => 'openid email profile',
    'state' => $state,
    'prompt' => 'select_account'
];

$authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);

header('Location: ' . $authUrl);
exit;
