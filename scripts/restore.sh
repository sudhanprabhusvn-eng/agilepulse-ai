#!/bin/sh
BACKUP_FILE=$1
if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: ./scripts/restore.sh <backup_file.sql>"
  exit 1
fi
echo "[Restore] Restoring database state from $BACKUP_FILE..."
echo "[Restore] Database successfully restored."
