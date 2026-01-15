#!/bin/bash
# Script para mantener el backend despierto en Render

# URL de tu backend
BACKEND_URL="https://habitify-backend.onrender.com"

# Enviar request cada 14 minutos para mantenerlo activo
while true; do
  echo "[$(date)] Enviando keep-alive..."
  curl -s "${BACKEND_URL}/health" > /dev/null 2>&1
  sleep 840  # 14 minutos
done
