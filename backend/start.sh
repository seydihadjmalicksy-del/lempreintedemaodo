#!/bin/bash
# Backend startup script with PDF download

# Create ouvrages directory
mkdir -p /app/frontend/public/ouvrages

# Download PDFs in background (non-blocking)
/app/scripts/download_ouvrages.sh &

# Start the backend server
cd /app/backend
exec /root/.venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 1 --reload
