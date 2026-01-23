#!/bin/bash
# Script para actualizar las variables de Supabase

echo "🔌 Actualizando configuración de Supabase..."
echo ""
echo "Por favor, ingresa la información de tu proyecto:"
echo ""

read -p "URL del Proyecto (ej: https://ikvzdsbprwpholrmpylt.supabase.co): " SUPABASE_URL
read -p "Anon Key (obtener desde Settings > API): " SUPABASE_KEY

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo "❌ Error: Debes proporcionar tanto la URL como la Anon Key"
    exit 1
fi

# Actualizar .env.local
if grep -q "VITE_SUPABASE_URL" .env.local 2>/dev/null; then
    sed -i "s|VITE_SUPABASE_URL=.*|VITE_SUPABASE_URL=$SUPABASE_URL|" .env.local
    sed -i "s|VITE_SUPABASE_ANON_KEY=.*|VITE_SUPABASE_ANON_KEY=$SUPABASE_KEY|" .env.local
else
    echo "" >> .env.local
    echo "# Supabase Configuration" >> .env.local
    echo "VITE_SUPABASE_URL=$SUPABASE_URL" >> .env.local
    echo "VITE_SUPABASE_ANON_KEY=$SUPABASE_KEY" >> .env.local
fi

echo ""
echo "✅ Configuración actualizada en .env.local"
echo ""
echo "📝 Para obtener tu Anon Key:"
echo "   1. Ve a https://app.supabase.com"
echo "   2. Selecciona tu proyecto"
echo "   3. Ve a Settings → API"
echo "   4. Copia la 'anon/public' key"
