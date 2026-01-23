# Configuración del Servidor Habitify

## 1. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y también a `backend/.env`:

```bash
cp .env.example .env
cp .env.example backend/.env
```

Edita ambos archivos `.env` y añade tus configuraciones:

```env
# Backend Configuration
GEMINI_API_KEY=tu_gemini_api_key_aqui
DB_USER=postgres
DB_HOST=localhost
DB_NAME=habitify
DB_PASSWORD=tu_password_aqui
DB_PORT=5432
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## 2. Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea una nueva API key
3. Copia la key y pégala en ambos archivos `.env`

## 3. Configurar Base de Datos PostgreSQL

Opción A: Usar PostgreSQL local
```bash
# Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Crear base de datos
sudo -u postgres createdb habitify

# Crear usuario (opcional)
sudo -u postgres psql
CREATE USER habitify_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE habitify TO habitify_user;
```

Opción B: Usar Supabase
1. Crea cuenta en [Supabase](https://supabase.com)
2. Crea nuevo proyecto
3. Copia la URL y la API key al `.env`

## 4. Ejecutar Script de Base de Datos

```bash
cd backend
psql -h localhost -U postgres -d habitify -f database.sql
```

## 5. Iniciar Servidor

**Opción A: Desde la raíz (recomendado)**
```bash
npm start
```

**Opción B: Desde el backend**
```bash
cd backend
node server.js
```

El servidor debería iniciar en http://localhost:5000

## 6. Verificar Funcionamiento

Health check: http://localhost:5000/health

## Problemas Comunes

### "GEMINI_API_KEY environment variable is not set"
- Asegúrate de tener ambos archivos `.env` configurados
- Verifica que la API key esté correcta en ambos archivos
- El servidor busca `backend/.env`

### Error de conexión a base de datos
- Verifica que PostgreSQL esté corriendo
- Confirma que las credenciales en `.env` sean correctas
- Asegúrate de haber creado la base de datos `habitify`

### Puerto en uso
- Cambia el PORT en `.env` o detén el proceso que usa el puerto 5000

### "Cannot find module server.js"
- Ejecuta `npm start` desde la raíz del proyecto
- O ve al directorio `backend` y ejecuta `node server.js`
