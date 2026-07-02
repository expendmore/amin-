<?php
require_once __DIR__ . '/db.php';

try {
    $db = Database::getInstance()->getConnection();
    
    // Clear existing test users if any
    $db->exec("DELETE FROM users WHERE email IN ('test@expendmore.com', 'disabled@expendmore.com', 'inactive@expendmore.com')");
    
    $users = [
        [
            'email' => 'test@expendmore.com',
            'password' => 'password123',
            'status' => 'active'
        ],
        [
            'email' => 'disabled@expendmore.com',
            'password' => 'password123',
            'status' => 'disabled'
        ],
        [
            'email' => 'inactive@expendmore.com',
            'password' => 'password123',
            'status' => 'inactive'
        ]
    ];
    
    $stmt = $db->prepare("INSERT INTO users (email, password_hash, status) VALUES (?, ?, ?)");
    
    foreach ($users as $u) {
        $hash = password_hash($u['password'], PASSWORD_BCRYPT);
        $stmt->execute([$u['email'], $hash, $u['status']]);
        echo "Created User: {$u['email']} (Status: {$u['status']})\n";
    }
    
    echo "\nDatabase seeding completed successfully!\n";
} catch (Exception $e) {
    echo "Seeding failed: " . $e->getMessage() . "\n";
}
