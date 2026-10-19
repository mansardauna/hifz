#!/usr/bin/env bash
# ==============================================================================
# Ankabit LMS: Automated Production Database Backup Script
# Creates compressed, timestamped UTF8mb4 MySQL dumps with retention policy
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
APP_DIR="$PROJECT_ROOT/lms"
cd "$APP_DIR"

BACKUP_DIR="${BACKUP_DIR:-/var/backups/ankabit}"
RETENTION_DAYS=14
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="ankabit_db_${TIMESTAMP}.sql.gz"

# Create backup directory if it does not exist
mkdir -p "$BACKUP_DIR"

echo "💾 Starting Ankabit database backup at $(date)..."

# Export dump directly from running MySQL container
docker compose exec -T mysql mysqldump \
    --user=root \
    --password="${DB_ROOT_PASSWORD:-root_secure_password_2026}" \
    --default-character-set=utf8mb4 \
    --single-transaction \
    --quick \
    --routines \
    --triggers \
    "${DB_NAME:-ankabit_lms}" | gzip -9 > "${BACKUP_DIR}/${FILENAME}"

# Verify backup file size
FILESIZE=$(stat -c%s "${BACKUP_DIR}/${FILENAME}" 2>/dev/null || stat -f%z "${BACKUP_DIR}/${FILENAME}" 2>/dev/null || wc -c < "${BACKUP_DIR}/${FILENAME}")

if [ "$FILESIZE" -lt 1000 ]; then
    echo "❌ Error: Backup file size is suspiciously small (${FILESIZE} bytes). Please check database status."
    exit 1
fi

echo "✅ Backup successfully created: ${BACKUP_DIR}/${FILENAME} (${FILESIZE} bytes)"

# Delete backups older than RETENTION_DAYS
echo "🧹 Pruning backups older than ${RETENTION_DAYS} days..."
find "$BACKUP_DIR" -name "ankabit_db_*.sql.gz" -type f -mtime +"$RETENTION_DAYS" -delete

echo "✅ Backup cycle complete."
