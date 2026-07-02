#!/bin/bash
# ==========================================
# Local Health Check Script - ExpendMore
# ==========================================

TARGET_URL="http://localhost:8080/expendmore_login/code.php"
HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" "$TARGET_URL")

echo "🔍 Fetching status of login page at $TARGET_URL..."

if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 302 ]; then
    echo "✔ Success: Server responded with HTTP Status $HTTP_STATUS"
    exit 0
else
    echo "❌ Error: Host is unreachable or responded with status $HTTP_STATUS"
    exit 1
fi
