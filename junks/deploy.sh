#!/usr/bin/env bash
# ==============================================================================
# Ankabit LMS: Enterprise Zero-Downtime VPS Deployment Script
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
APP_DIR="$PROJECT_ROOT/lms"

cd "$APP_DIR"
COMPOSE=(docker compose --env-file .env.production)

echo "=========================================================="
echo "🚀 Starting Ankabit LMS Production Deployment..."
echo "=========================================================="

# 1. Environment Verification
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found!"
    echo "💡 Please copy .env.production.template to .env.production and fill in your production credentials."
    exit 1
fi

# 2. Swap Space Check (Prevents build OOM on smaller VPS instances)
AVAILABLE_MEM=$(free -m | awk '/^Mem:/{print $2}')
SWAP_TOTAL=$(free -m | awk '/^Swap:/{print $2}')
if [ "$AVAILABLE_MEM" -lt 2000 ] && [ "$SWAP_TOTAL" -lt 1000 ]; then
    echo "⚠️ Warning: Low memory detected (${AVAILABLE_MEM}MB RAM, ${SWAP_TOTAL}MB swap)."
    echo "🔧 Creating 2GB swap file to prevent compilation out-of-memory..."
    if command -v fallocate &> /dev/null; then
        sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
        sudo swapon /swapfile
        echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab
        echo "✅ 2GB Swap file created successfully."
    fi
fi

# 3. Pull latest Git changes if in a repository
if [ -d "$PROJECT_ROOT/.git" ]; then
    echo "📥 Pulling latest git repository changes..."
    (cd "$PROJECT_ROOT" && git pull origin main) || (cd "$PROJECT_ROOT" && git pull origin master) || true
fi

# 4. Pull base images and build containers
echo "🔨 Building Docker images..."
"${COMPOSE[@]}" build --pull app

# 5. Start Database and Cache services first
echo "📦 Starting Database and Cache containers..."
"${COMPOSE[@]}" up -d mysql redis

# Wait for MySQL to report healthy
echo "⏳ Waiting for MySQL to become healthy..."
TIMEOUT=60
while [ $TIMEOUT -gt 0 ]; do
    if "${COMPOSE[@]}" ps mysql | grep -q "healthy"; then
        echo "✅ MySQL is ready and healthy."
        break
    fi
    sleep 3
    TIMEOUT=$((TIMEOUT - 3))
done

if [ $TIMEOUT -le 0 ]; then
    echo "❌ MySQL failed to become healthy within 60 seconds."
    "${COMPOSE[@]}" logs mysql
    exit 1
fi

# 6. Run Database Migrations
echo "🗄️ Running Prisma database migrations..."
if [ -d "prisma/migrations" ] && find prisma/migrations -type f -print -quit | grep -q .; then
    "${COMPOSE[@]}" run --rm app npx prisma migrate deploy
else
    if [ "${ALLOW_DB_PUSH:-false}" = "true" ]; then
        echo "No Prisma migrations found; applying schema with explicitly enabled db push."
        "${COMPOSE[@]}" run --rm app npx prisma db push
    else
        echo "❌ No Prisma migrations found. Refusing an uncontrolled production schema change."
        echo "Create and commit migrations, or explicitly set ALLOW_DB_PUSH=true for a controlled initial setup."
        exit 1
    fi
fi

# 7. Start App and Reverse Proxy
echo "🌐 Starting Application and its supporting services..."
"${COMPOSE[@]}" up -d --remove-orphans

# 8. Healthcheck verification
echo "🩺 Performing application health check..."
APP_HEALTH_TIMEOUT=45
HEALTHY=false
while [ $APP_HEALTH_TIMEOUT -gt 0 ]; do
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/ || true)
    if [ "$HTTP_STATUS" -eq 200 ] || [ "$HTTP_STATUS" -eq 307 ] || [ "$HTTP_STATUS" -eq 308 ]; then
        HEALTHY=true
        break
    fi
    sleep 3
    APP_HEALTH_TIMEOUT=$((APP_HEALTH_TIMEOUT - 3))
done

if [ "$HEALTHY" = true ]; then
    echo "=========================================================="
    echo "🎉 DEPLOYMENT SUCCESSFUL!"
    echo "=========================================================="
    echo "Platform is running. Configure your external reverse proxy and TLS separately."
    echo "Domain: https://${NEXT_PUBLIC_ROOT_DOMAIN:-ankabit.app}"
    echo "Wildcards: https://*.${NEXT_PUBLIC_ROOT_DOMAIN:-ankabit.app}"
else
    echo "⚠️ Warning: App container started, but local HTTP probe returned code: ${HTTP_STATUS}"
    echo "Check container logs with: docker compose logs -n 50 app"
fi

# 9. Clean up dangling images
echo "🧹 Pruning unused Docker build layers..."
docker image prune -f

echo "✅ All deployment operations completed."
