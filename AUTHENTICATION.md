# 🔐 Sistema de Autenticación - Habitify

Integración completa de Firebase Auth y Supabase para autenticación segura en Habitify.

## 📋 Características

✅ **Registro de Usuarios**
- Validación de email
- Validaciones de contraseña (mín 6 caracteres)
- Validación de nickname único
- Almacenamiento en Firebase Firestore

✅ **Login/Logout**
- Autenticación con email y contraseña
- Opción "Recordarme" para sesiones persistentes
- Logout seguro con confirmación

✅ **Recuperación de Contraseña**
- Envío de email para resetear contraseña
- Validaciones de seguridad

✅ **Protección de Rutas**
- Las rutas requieren autenticación
- Redirección automática a login si no autenticado
- Loading state mientras se verifica autenticación

## 🔧 Configuración

### Variables de Entorno (.env.local)

```env
# Frontend
VITE_BACKEND_URL=http://localhost:5000

# Firebase
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Supabase (opcional)
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
```

### Obtener Credenciales Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un proyecto o selecciona uno existente
3. Ve a Project Settings → Your apps
4. Copia los valores de la configuración

## 📁 Estructura de Archivos

```
src/
├── config/
│   ├── firebaseConfig.js       # Inicialización de Firebase
│   ├── firebaseConnect.js      # Clase ManageAccount para auth
│   └── supabaseClient.js       # Cliente de Supabase
├── context/
│   └── AuthContext.jsx         # Context para estado de auth global
├── pages/
│   └── auth/
│       ├── Login.jsx           # Página de login
│       └── Auth.css            # Estilos
└── components/
    └── auth/
        ├── ModalSignup.jsx     # Modal de registro
        └── ForgotPassword.jsx  # Modal recuperar contraseña
```

## 🎯 Flujo de Autenticación

### 1. Login
```javascript
import { ManageAccount } from "../config/firebaseConnect";

const account = new ManageAccount();
const result = await account.authenticate(email, password);

if (result.success) {
  // Usuario autenticado - redirigir a dashboard
}
```

### 2. Registro
```javascript
const result = await account.register(email, password, nickname);

if (result.success) {
  // Usuario registrado - datos guardados en Firestore
}
```

### 3. Acceso a Datos de Usuario
```javascript
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, userData, isAuthenticated } = useAuth();
  
  // user: Firebase user object
  // userData: Datos adicionales de Firestore
  // isAuthenticated: boolean
}
```

### 4. Logout
```javascript
const result = await account.signOut();

if (result.success) {
  // Sesión cerrada - redirigir a login
}
```

## 🗄️ Estructura de Datos en Firestore

### Colección: users

```javascript
{
  uid: "firebase_uid",
  email: "user@example.com",
  nickname: "user_nickname",
  name: "Full Name",
  avatar: "url_to_avatar",
  bio: "User biography",
  status: "User status",
  createdAt: "2024-01-15T10:30:00Z"
}
```

## 🔒 Seguridad

✅ **API Keys en Variables de Entorno**
- Nunca committear credenciales en código
- Usar .env.local para desarrollo local

✅ **Validación Cliente**
- Email, nickname, password validados antes de enviar
- Mensajes de error personalizados

✅ **Validación Servidor**
- Firebase maneja validaciones de seguridad
- Hashing de contraseñas automático

✅ **CORS Protegido**
- Backend solo permite requests de origen autorizado

## 🐛 Troubleshooting

### "Error: GEMINI_API_KEY not set"
- Asegúrate que las variables de entorno estén en backend/.env
- Restart backend después de cambiar .env

### "Auth/user-not-found"
- El usuario no existe en Firebase
- Verificar que el email es correcto

### "Auth/weak-password"
- La contraseña debe tener al menos 6 caracteres
- Usar contraseñas más fuertes

### "Firebase not initialized"
- Verificar que firebaseConfig.js está correctamente importado
- Revisar que REACT_APP_FIREBASE_* están en .env.local

## 📚 Recursos

- [Firebase Docs](https://firebase.google.com/docs/auth)
- [Supabase Docs](https://supabase.com/docs)
- [Firestore Rules](https://firebase.google.com/docs/firestore/security/rules-structure)

## 🚀 Próximos Pasos

- [ ] Integrar perfil de usuario editable
- [ ] Subir avatar a Cloud Storage
- [ ] Autenticación social (Google, GitHub)
- [ ] Two-factor authentication
- [ ] Roles y permisos de usuario
