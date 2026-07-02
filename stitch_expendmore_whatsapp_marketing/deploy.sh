#!/bin/bash
# ==========================================
# Automated Deployment Script - ExpendMore
# ==========================================

echo "🚀 Starting ExpendMore Deploy Process..."

# 1. Pull latest code changes
echo "📥 Pulling latest codebase additions..."
git pull origin main

# 2. Check for .env.local file
if [ ! -f .env.local ]; then
    echo "⚠️ Warning: .env.local configuration file missing! Copying from template..."
    cp .env.example .env.local
    echo "❗ Please fill connection credentials inside .env.local before running."
    exit 1
fi

# 3. Verify Docker orchestration state
if [ -x "$(command -v docker-compose)" ]; then
    echo "🐳 docker-compose detected. Rebuilding Docker volumes..."
    docker-compose down
    docker-compose up -d --build
else
    echo "⚙️ System: Standard PHP installation. Setting files permissions..."
    chown -R www-data:www-data /var/www/html
    chmod -R 755 /var/www/html
fi

# 4. Verify Local Health checks
echo "🔍 Checking local instance stability status..."
bash healthcheck.sh

echo "✔ Deployment completed successfully!"
exit 0
