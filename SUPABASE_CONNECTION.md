# 🔌 Configuración de Conexión a Supabase

## 📋 Información de tu Proyecto

**Host de Base de Datos:** `db.ikvzdsbprwpholrmpylt.supabase.co`  
**URL del Proyecto:** `https://ikvzdsbprwpholrmpylt.supabase.co`

## 🔑 Obtener las Credenciales

Para conectar tu aplicación frontend a Supabase, necesitas:

1. **Ve a tu Dashboard de Supabase:**
   - https://app.supabase.com
   - Selecciona tu proyecto

2. **Obtén la URL del Proyecto y la Anon Key:**
   - Ve a **Settings** → **API**
   - Copia:
     - **Project URL** (ejemplo: `https://ikvzdsbprwpholrmpylt.supabase.co`)
     - **anon/public key** (la clave pública, no la service_role key)

## ⚙️ Configurar Variables de Entorno

Crea o actualiza el archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://ikvzdsbprwpholrmpylt.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

## 🧪 Probar la Conexión

Una vez configuradas las variables, puedes probar la conexión ejecutando:

```javascript
import { testConnection } from './config/supabaseClient.js';

// En tu componente o consola
testConnection().then(result => {
  if (result.success) {
    console.log('✅ Conexión exitosa!');
  } else {
    console.error('❌ Error:', result.error);
  }
});
```

## 📝 Nota Importante

- **NO uses la conexión directa de PostgreSQL** (`postgresql://...`) en el frontend
- **Usa el cliente JS de Supabase** que ya está configurado en `src/config/supabaseClient.js`
- La conexión directa de PostgreSQL es solo para:
  - Backends (Node.js, Python, etc.)
  - Herramientas de administración de DB
  - ORMs que requieren conexión directa

## 🔒 Seguridad

- ✅ La **anon key** es segura para usar en el frontend (tiene Row Level Security)
- ❌ **NUNCA** uses la **service_role key** en el frontend
- ✅ Las variables `.env.local` están en `.gitignore` y no se suben a GitHub

## 🚀 Estado Actual

El cliente de Supabase está configurado en:
- `src/config/supabaseClient.js`

Y se usa en:
- `src/hooks/useAppointments.js`
- `src/hooks/useChecklist.js`
- `src/context/AuthContext.jsx`
- `src/components/auth/ModalSignup.jsx`
