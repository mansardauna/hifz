#!/usr/bin/env bash
# ==============================================================================
# Ankabit LMS: 1-Click Production Server Initialization Script (Ubuntu/Debian)
# Provisions Docker, Compose, Firewall (UFW), Fail2ban, and Security Hardening
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
APP_DIR="$PROJECT_ROOT/lms"

if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run this script as root (sudo ./junks/setup-production.sh)"
    exit 1
fi

echo "=========================================================="
echo "🛡️ Initializing Ankabit LMS Production Host Environment"
echo "=========================================================="

# 1. Update OS Packages
echo "🔄 Updating APT packages..."
apt-get update && apt-get upgrade -y
apt-get install -y curl wget git ufw fail2ban ca-certificates gnupg lsb-release htop

# 2. Install Official Docker Engine & Docker Compose Plugin
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker Engine..."
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker installed successfully."
else
    echo "✅ Docker is already installed."
fi

# 3. Configure Security Firewall (UFW)
echo "🔒 Configuring UFW Firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment "SSH Remote Management"
ufw allow 80/tcp comment "HTTP Auto-SSL ACME Challenge"
ufw allow 443/tcp comment "HTTPS Web Traffic"
ufw allow 443/udp comment "HTTP/3 QUIC Media Acceleration"
# Optional LiveKit media ports (uncomment if self-hosting SFU instead of LiveKit Cloud):
# ufw allow 7880/tcp comment "LiveKit SFU Signaling"
# ufw allow 7881/tcp comment "LiveKit SFU TCP"
# ufw allow 50000:50100/udp comment "LiveKit WebRTC Media UDP"

ufw --force enable
echo "✅ UFW Firewall enabled with essential ports opened."

# 4. Configure Fail2ban for SSH Protection
echo "🛡️ Enabling Fail2ban service..."
systemctl enable fail2ban
systemctl restart fail2ban

# 5. Create Daily Database Backup Cron Job
echo "⏰ Setting up daily cron job for database backups..."
CRON_JOB="0 3 * * * cd $APP_DIR && $SCRIPT_DIR/backup-db.sh >> /var/log/ankabit-backup.log 2>&1"
(crontab -l 2>/dev/null | grep -Fv "backup-db.sh" ; echo "$CRON_JOB") | crontab -

echo "=========================================================="
echo "🎉 Server initialization complete!"
echo "Next steps:"
echo " 1. Configure .env.production (cp lms/.env.production.template lms/.env.production)"
echo " 2. Run ./junks/deploy.sh"
echo "=========================================================="
