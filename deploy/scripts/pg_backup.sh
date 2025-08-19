#!/usr/bin/env bash
set -e
BACKUP_DIR=/var/backups/realtyflow
mkdir -p "${BACKUP_DIR}"
TIMESTAMP=$(date +"%F_%H-%M")
PG_CONTAINER=$(docker ps --filter "ancestor=postgres:15" --format "{{.ID}}" | head -n1)

if [ -z "$PG_CONTAINER" ]; then
  pg_dump -U ${POSTGRES_USER:-crm_user} -h ${PG_HOST:-localhost} ${POSTGRES_DB:-crm_db} > ${BACKUP_DIR}/${POSTGRES_DB}_${TIMESTAMP}.sql
else
  docker exec -i $PG_CONTAINER pg_dump -U ${POSTGRES_USER:-crm_user} ${POSTGRES_DB:-crm_db} > ${BACKUP_DIR}/${POSTGRES_DB}_${TIMESTAMP}.sql
fi

# rotate - keep 7 days
find "${BACKUP_DIR}" -type f -mtime +7 -delete
