<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth_helper.php';
require_once __DIR__ . '/saas_helper.php';
require_once __DIR__ . '/middleware.php';

enforce_https();
send_security_headers();

secure_session_start();

if (!isset($_SESSION['user_id'])) {
    header('Location: ../expendmore_login/code.php');
    exit;
}

$workspaceId = isset($_GET['workspace_id']) ? (int)$_GET['workspace_id'] : 0;

if ($workspaceId <= 0) {
    header('Location: ../expendmore_dashboard/code.php?error=invalid_workspace');
    exit;
}

try {
    $db = Database::getInstance()->getConnection();
    $userId = (int)$_SESSION['user_id'];
    
    // Validate that the user belongs to the organization owning the workspace
    $stmt = $db->prepare("
        SELECT w.organization_id 
        FROM workspaces w 
        JOIN organization_members m ON w.organization_id = m.organization_id 
        WHERE w.id = ? AND m.user_id = ? AND w.deleted_at IS NULL
    ");
    $stmt->execute([$workspaceId, $userId]);
    $orgId = $stmt->fetchColumn();
    
    if (!$orgId) {
        write_security_log('UNAUTHORIZED_WORKSPACE_SWITCH_ATTEMPT', $_SESSION['email'] ?? 'unknown', "Workspace: $workspaceId");
        header('Location: ../expendmore_dashboard/code.php?error=unauthorized_workspace');
        exit;
    }
    
    // Update active workspace in session
    $_SESSION['workspace_id'] = $workspaceId;
    $_SESSION['organization_id'] = (int)$orgId;
    
    SaaS::writeAudit('WORKSPACE_SWITCH', "User switched to workspace ID: $workspaceId");
    
    header('Location: ../expendmore_dashboard/code.php?status=workspace_switched');
    exit;
    
} catch (Exception $e) {
    error_log("Workspace switch failure: " . $e->getMessage());
    header('Location: ../expendmore_dashboard/code.php?error=system_error');
    exit;
}
