#!/bin/sh
HOST=${1:-"http://localhost:3000"}
echo "[HealthCheck] Verifying target endpoint $HOST/api/v1/health..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$HOST/api/v1/health")
if [ "$STATUS" -eq 200 ]; then
  echo "[HealthCheck] Service is healthy (HTTP 200)."
  exit 0
else
  echo "[HealthCheck] Health check failed with HTTP status $STATUS!"
  exit 1
fi
