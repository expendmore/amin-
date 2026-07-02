<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';

class Mailer {
    private static $instance = null;
    private $host;
    private $port;
    private $user;
    private $pass;
    private $secure;
    private $fromEmail;
    private $fromName;

    private function __construct() {
        // Read configuration settings from env variables
        $this->host = getenv('SMTP_HOST') ?: 'smtp.mailtrap.io';
        $this->port = (int)(getenv('SMTP_PORT') ?: 2525);
        $this->user = getenv('SMTP_USER') ?: '';
        $this->pass = getenv('SMTP_PASS') ?: '';
        $this->secure = strtolower(getenv('SMTP_SECURE') ?: 'tls');
        $this->fromEmail = getenv('SMTP_FROM_EMAIL') ?: 'no-reply@expendmore.com';
        $this->fromName = getenv('SMTP_FROM_NAME') ?: 'ExpendMore';
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function send($to, $subject, $htmlContent, $plainContent) {
        $maxRetries = 3;
        $attempt = 0;
        
        while ($attempt < $maxRetries) {
            $attempt++;
            try {
                $this->executeSmtpSend($to, $subject, $htmlContent, $plainContent);
                $this->logMail($to, $subject, 'SUCCESS');
                return true;
            } catch (Exception $e) {
                error_log("SMTP attempt $attempt failed: " . $e->getMessage());
                if ($attempt >= $maxRetries) {
                    $this->logMail($to, $subject, 'FAILED', $e->getMessage());
                    return false;
                }
                usleep(500000); // 500ms delay between retries
            }
        }
        return false;
    }

    private function executeSmtpSend($to, $subject, $htmlContent, $plainContent) {
        $connectionPrefix = ($this->secure === 'ssl') ? 'ssl://' : '';
        $socket = @fsockopen($connectionPrefix . $this->host, $this->port, $errno, $errstr, 10);
        
        if (!$socket) {
            throw new Exception("Could not connect to SMTP server {$this->host}:{$this->port} ($errstr)");
        }
        
        $this->readResponse($socket, '220');
        $this->writeCmd($socket, "EHLO " . ($this->host ?: "localhost"), '250');
        
        if ($this->secure === 'tls') {
            $this->writeCmd($socket, "STARTTLS", '220');
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_ANY_CLIENT)) {
                throw new Exception("STARTTLS negotiation failed");
            }
            $this->writeCmd($socket, "EHLO " . ($this->host ?: "localhost"), '250');
        }
        
        if (!empty($this->user)) {
            $this->writeCmd($socket, "AUTH LOGIN", '334');
            $this->writeCmd($socket, base64_encode($this->user), '334');
            $this->writeCmd($socket, base64_encode($this->pass), '235');
        }
        
        $this->writeCmd($socket, "MAIL FROM:<{$this->fromEmail}>", '250');
        $this->writeCmd($socket, "RCPT TO:<{$to}>", '250');
        
        $this->writeCmd($socket, "DATA", '354');
        
        $boundary = "----=" . md5(uniqid(rand(), true));
        $headers = [
            "MIME-Version: 1.0",
            "From: =?UTF-8?B?" . base64_encode($this->fromName) . "?= <{$this->fromEmail}>",
            "To: <{$to}>",
            "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=",
            "Date: " . date('r'),
            "Content-Type: multipart/alternative; boundary=\"{$boundary}\"",
            "Message-ID: <" . md5(uniqid(rand(), true)) . "@" . ($this->host ?: "localhost") . ">",
            "X-Mailer: PHP-SMTP-Mailer-ExpendMore"
        ];
        
        $body = "";
        foreach ($headers as $header) {
            $body .= $header . "\r\n";
        }
        $body .= "\r\n";
        
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($plainContent)) . "\r\n";
        
        $body .= "--{$boundary}\r\n";
        $body .= "Content-Type: text/html; charset=UTF-8\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= chunk_split(base64_encode($htmlContent)) . "\r\n";
        $body .= "--{$boundary}--\r\n";
        
        $body .= "\r\n.\r\n";
        
        fwrite($socket, $body);
        $this->readResponse($socket, '250');
        
        $this->writeCmd($socket, "QUIT", '221');
        fclose($socket);
    }

    private function writeCmd($socket, $cmd, $expectedResponse) {
        fwrite($socket, $cmd . "\r\n");
        $this->readResponse($socket, $expectedResponse);
    }

    private function readResponse($socket, $expectedResponse) {
        $response = "";
        while ($line = fgets($socket, 512)) {
            $response .= $line;
            if (substr($line, 3, 1) === ' ') {
                break;
            }
        }
        if (strpos($response, $expectedResponse) !== 0) {
            throw new Exception("Unexpected SMTP response: " . trim($response) . " (Expected: $expectedResponse)");
        }
    }

    private function logMail($to, $subject, $status, $error = '') {
        $logFile = __DIR__ . '/mail.log';
        $timestamp = date('Y-m-d H:i:s');
        $errorStr = $error ? " - Error: " . htmlspecialchars($error) : "";
        $logLine = "[$timestamp] [To: $to] [Subject: $subject] [Status: $status]$errorStr" . PHP_EOL;
        file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
    }

    private function getHtmlTemplate($title, $content) {
        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>' . htmlspecialchars($title) . '</title>
            <style>
                body { font-family: "Inter", sans-serif; background-color: #0A0A0A; color: #e5e2e1; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 40px auto; background-color: #131313; border: 1px solid #2a2a2a; border-radius: 12px; overflow: hidden; }
                .header { background: linear-gradient(90deg, #25D366 0%, #00e3fd 100%); padding: 30px; text-align: center; }
                .header h1 { margin: 0; color: #000; font-size: 28px; font-weight: 800; letter-spacing: -1px; }
                .body { padding: 40px 30px; line-height: 1.6; font-size: 16px; color: #bbcbb9; }
                .body h2 { color: #e5e2e1; font-size: 20px; font-weight: 700; margin-top: 0; }
                .btn { display: inline-block; background: linear-gradient(90deg, #25D366 0%, #00e3fd 100%); color: #000 !important; text-decoration: none; padding: 14px 28px; font-weight: bold; border-radius: 8px; margin: 20px 0; text-align: center; }
                .footer { padding: 20px 30px; background-color: #0e0e0e; border-top: 1px solid #2a2a2a; text-align: center; font-size: 12px; color: #869584; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>ExpendMore</h1>
                </div>
                <div class="body">
                    ' . $content . '
                </div>
                <div class="footer">
                    <p>© 2024 ExpendMore. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ';
    }

    // Dynamic verification email sender
    public function sendVerification($to, $name, $token, $isLight = false) {
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . ($_SERVER['HTTP_HOST'] ?? 'localhost');
        $verifyFolder = $isLight ? '/expendmore_signup/verify.php' : '/expendmore_signup/verify.php';
        $link = $baseUrl . '/stitch_expendmore_whatsapp_marketing' . $verifyFolder . '?token=' . $token;

        $html = $this->getHtmlTemplate('Verify Email', '
            <h2>Activate Your Workspace</h2>
            <p>Hi ' . htmlspecialchars($name) . ',</p>
            <p>Thank you for creating an account with ExpendMore. Click the button below to verify your email and activate your workspace:</p>
            <div style="text-align: center;">
                <a href="' . $link . '" class="btn">Verify Email Address</a>
            </div>
            <p>If the button doesn\'t work, copy and paste this link in your browser:</p>
            <p style="word-break: break-all;"><a href="' . $link . '" style="color: #3de273;">' . $link . '</a></p>
        ');

        $plain = "Verify Your Email\r\n\r\nHi {$name},\r\n\r\nPlease verify your email by loading the link below:\r\n{$link}";

        return $this->send($to, 'Verify Email Address - ExpendMore', $html, $plain);
    }

    // Welcome email sender
    public function sendWelcome($to, $name, $company) {
        $html = $this->getHtmlTemplate('Welcome to ExpendMore', '
            <h2>Welcome to the Board!</h2>
            <p>Hi ' . htmlspecialchars($name) . ',</p>
            <p>Thank you for registering ' . htmlspecialchars($company) . ' with ExpendMore. We are excited to support your high-performance WhatsApp campaign automations.</p>
            <p>You can now manage contacts, build campaign broadcast queues, and monitor performance analytics.</p>
        ');

        $plain = "Welcome to ExpendMore!\r\n\r\nHi {$name},\r\n\r\nThank you for registering {$company} with ExpendMore.";

        return $this->send($to, 'Welcome to ExpendMore', $html, $plain);
    }

    // Password reset email sender
    public function sendPasswordReset($to, $name, $token, $isLight = false) {
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . ($_SERVER['HTTP_HOST'] ?? 'localhost');
        $resetFolder = $isLight ? '/expendmore_login_light/reset_password.php' : '/expendmore_login/reset_password.php';
        $link = $baseUrl . '/stitch_expendmore_whatsapp_marketing' . $resetFolder . '?token=' . $token;

        $html = $this->getHtmlTemplate('Reset Password', '
            <h2>Reset Your Password</h2>
            <p>Hi ' . htmlspecialchars($name) . ',</p>
            <p>We received a request to change the password for your account. Click the button below to set a new password:</p>
            <div style="text-align: center;">
                <a href="' . $link . '" class="btn">Reset Password</a>
            </div>
            <p>This password reset request will expire in 1 hour. If you did not initiate this request, you can safely ignore this email.</p>
        ');

        $plain = "Reset Your Password\r\n\r\nHi {$name},\r\n\r\nReset your password using the link below:\r\n{$link}";

        return $this->send($to, 'Reset Your Password - ExpendMore', $html, $plain);
    }

    // Security alert email sender
    public function sendSecurityAlert($to, $name, $message) {
        $html = $this->getHtmlTemplate('Security Alert', '
            <h2>Security Notice</h2>
            <p>Hi ' . htmlspecialchars($name) . ',</p>
            <p>This is a notice that ' . htmlspecialchars($message) . ' on your ExpendMore account.</p>
            <p>If you did not initiate this request, please contact our support team immediately.</p>
        ');

        $plain = "Security Alert!\r\n\r\nHi {$name},\r\n\r\nThis is a security alert: {$message}.";

        return $this->send($to, 'Security Alert - ExpendMore', $html, $plain);
    }
}
