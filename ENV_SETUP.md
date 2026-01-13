# 🔐 Setup Inicial - Variables de Entorno

## ⚠️ IMPORTANTE: No commits de archivos .env

Los archivos `.env` contienen API keys y información sensible. **NUNCA** deben ser committeados a GitHub.

## 📋 Configuración Local

### Frontend (.env.local)

```bash
# En la raíz del proyecto
VITE_BACKEND_URL=http://localhost:5000
```

### Backend (backend/.env)

```bash
# En la carpeta /backend
GEMINI_API_KEY=tu_api_key_aqui
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 🚀 Setup en Producción (Render.com)

### Para el Backend en Render:

1. Conecta tu repositorio a [render.com](https://render.com)
2. Crea un "Web Service"
3. Agrega estas variables de entorno en Render:

```
GEMINI_API_KEY=tu_api_key_aqui
ALLOWED_ORIGINS=https://josupalacio.github.io
PORT=5000
```

### Para el Frontend:

1. Actualiza `.env.production`:
```
VITE_BACKEND_URL=https://habitify-backend.onrender.com
```

2. Deploy a GitHub Pages normalmente

## 🔑 Cómo obtener GEMINI_API_KEY

1. Ve a [Google AI Studio](https://aistudio.google.com/apikey)
2. Crea una API Key
3. Guárdala en tu archivo `.env` local
4. **NUNCA** la subas a GitHub

## ✅ Verificar que todo esté oculto

```bash
# Verificar archivos ocultos en git
git status

# Verificar si hay archivos .env en el repositorio
git ls-files | grep ".env"

# Si encuentras alguno, removerlo:
git rm --cached .env
git commit -m "Remove .env from git tracking"
```

## 📦 Archivos ignorados por .gitignore

- `.env` - Variables de entorno
- `backend/.env` - Variables del backend
- `node_modules/` - Dependencias
- `.vscode/` - Configuración del editor
- `dist/` - Build de producción
- `*.log` - Archivos de log
- `.DS_Store` - Archivos del sistema
