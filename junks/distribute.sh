#!/usr/bin/env bash
# Build the clean marketplace archive and the MainFiles bundle.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CONFIG_FILE="${DISTRIBUTE_CONF:-$SCRIPT_DIR/distribute.conf}"
DEPLOY=false
DRY_RUN=false
ASSUME_YES=false

usage() {
  cat <<'EOF'
Usage: ./junks/distribute.sh [options]

Options:
  -c, --config FILE  Use another distribution config
  -d, --deploy       Upload the generated archive
  -n, --dry-run      Show actions without changing files
  -y, --yes          Skip the upload confirmation
  -h, --help         Show this help
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    -c|--config) CONFIG_FILE="$2"; shift 2 ;;
    -d|--deploy) DEPLOY=true; shift ;;
    -n|--dry-run) DRY_RUN=true; shift ;;
    -y|--yes) ASSUME_YES=true; shift ;;
    -h|--help) usage; exit 0 ;;
    *) printf 'Unknown option: %s\n' "$1" >&2; usage >&2; exit 1 ;;
  esac
done

if [ -f "$CONFIG_FILE" ]; then
  # shellcheck source=/dev/null
  source "$CONFIG_FILE"
else
  printf 'Distribution config not found: %s\n' "$CONFIG_FILE" >&2
  exit 1
fi

APP_NAME="${APP_NAME:-ankabit-lms}"
SOURCE_DIR="${SOURCE_DIR:-$PROJECT_ROOT}"
MAIN_FILES_DIR="${MAIN_FILES_DIR:-$PROJECT_ROOT/MainFiles}"
MAIN_FILES_ARCHIVE="${MAIN_FILES_ARCHIVE:-$PROJECT_ROOT/MainFiles.zip}"
TMP_DIR="${TMP_DIR:-$PROJECT_ROOT/tmp}"
ARCHIVE_TOP_DIR="${ARCHIVE_TOP_DIR:-$APP_NAME}"
ZIP_NAME="${ZIP_NAME:-$APP_NAME.zip}"
STAGE_DIR="$TMP_DIR/$ARCHIVE_TOP_DIR"
ZIP_PATH="$TMP_DIR/$ZIP_NAME"

log() { printf '[distribute] %s\n' "$*"; }
run() {
  if $DRY_RUN; then printf '[dry-run]'; printf ' %q' "$@"; printf '\n'; else "$@"; fi
}
run_shell() {
  if $DRY_RUN; then printf '[dry-run] (cd %q && %s)\n' "$2" "$1"; else (cd "$2" && eval "$1"); fi
}

cleanup() {
  $DRY_RUN && return 0
  [ "${KEEP_TMP:-false}" = true ] || rm -rf "$STAGE_DIR" "$ZIP_PATH"
}
trap cleanup EXIT

if [ ! -d "$SOURCE_DIR" ]; then
  printf 'Source directory not found: %s\n' "$SOURCE_DIR" >&2
  exit 1
fi
if ! $DRY_RUN && ! command -v zip >/dev/null 2>&1; then
  printf "The 'zip' command is required.\n" >&2
  exit 1
fi

log "Project: $PROJECT_ROOT"
log "Staging: $SOURCE_DIR -> $STAGE_DIR"
run rm -rf "$STAGE_DIR" "$ZIP_PATH"
run mkdir -p "$STAGE_DIR" "$MAIN_FILES_DIR"

if command -v rsync >/dev/null 2>&1; then
  args=(-a --delete --include='.env.example' --include='.env.production.template')
  for pattern in "${EXCLUDES[@]}"; do args+=("--exclude=$pattern"); done
  run rsync "${args[@]}" "$SOURCE_DIR/" "$STAGE_DIR/"
else
  log 'rsync not found; using tar fallback'
  tar_args=(-C "$SOURCE_DIR")
  for pattern in "${EXCLUDES[@]}"; do tar_args+=("--exclude=$pattern"); done
  tar_args+=(--exclude='.env' --exclude='.env.local' --exclude='.env.*.local')
  if $DRY_RUN; then
    printf '[dry-run] tar ... | tar -C %q -xf -\n' "$STAGE_DIR"
  else
    tar "${tar_args[@]}" -cf - . | tar -C "$STAGE_DIR" -xf -
    [ -f "$SOURCE_DIR/.env.example" ] && cp "$SOURCE_DIR/.env.example" "$STAGE_DIR/.env.example"
    [ -f "$SOURCE_DIR/.env.production.template" ] && cp "$SOURCE_DIR/.env.production.template" "$STAGE_DIR/.env.production.template"
  fi
fi

if [ -n "${TRANSLATE_CMD:-}" ]; then run_shell "$TRANSLATE_CMD" "$PROJECT_ROOT"; fi
if [ -n "${DOCS_BUILD_CMD:-}" ]; then run_shell "$DOCS_BUILD_CMD" "$PROJECT_ROOT"; fi

log "Creating $MAIN_FILES_DIR/$ZIP_NAME"
if $DRY_RUN; then
  printf '[dry-run] (cd %q && zip -rq %q %q)\n' "$TMP_DIR" "$ZIP_PATH" "$ARCHIVE_TOP_DIR"
else
  (cd "$TMP_DIR" && zip -rq "$ZIP_PATH" "$ARCHIVE_TOP_DIR")
fi
run mv -f "$ZIP_PATH" "$MAIN_FILES_DIR/"
run rm -f "$MAIN_FILES_ARCHIVE"
if $DRY_RUN; then
  printf '[dry-run] (cd %q && zip -rq %q %s)\n' "$PROJECT_ROOT" "$MAIN_FILES_ARCHIVE" "$(basename "$MAIN_FILES_DIR")"
else
  (cd "$PROJECT_ROOT" && zip -rq "$MAIN_FILES_ARCHIVE" "$(basename "$MAIN_FILES_DIR")")
fi

if $DEPLOY; then
  : "${DEPLOY_HOST:?--deploy requires DEPLOY_HOST}"
  source_file="$MAIN_FILES_DIR/$ZIP_NAME"
  destination="${DEPLOY_USER:-root}@${DEPLOY_HOST}:${DEPLOY_PATH:-/var/www/}"
  if ! $ASSUME_YES; then
    printf 'Upload %s to %s? [y/N] ' "$source_file" "$destination"
    read -r answer
    case "$answer" in y|Y|yes|YES) ;; *) exit 1 ;; esac
  fi
  scp_args=(-P "${DEPLOY_PORT:-22}")
  [ -n "${DEPLOY_SSH_KEY:-}" ] && scp_args+=(-i "$DEPLOY_SSH_KEY")
  run scp "${scp_args[@]}" "$source_file" "$destination"
  [ -z "${DEPLOY_POST_CMD:-}" ] || run ssh -p "${DEPLOY_PORT:-22}" "$destination" "$DEPLOY_POST_CMD"
fi

log "Release bundle created: $MAIN_FILES_DIR/$ZIP_NAME"
log "Marketplace bundle created: $MAIN_FILES_ARCHIVE"
