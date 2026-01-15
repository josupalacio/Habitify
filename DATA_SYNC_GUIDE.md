# Guía de Sincronización de Datos con Supabase

## 🎯 Descripción General

Tu app Habitify ahora puede sincronizar todos los datos con Supabase. Cada usuario tiene sus propios datos separados y sincronizados en tiempo real entre dispositivos.

## 📋 Componentes Actualizados

### 1. **Checklist** - Gestión de Tareas
- ✅ Hook: `useTasks()`
- ✅ Operaciones: Crear, leer, actualizar, eliminar tareas
- ✅ Sincronización: En tiempo real
- ✅ Ubicación: `/src/pages/checklist/Checklist.jsx`

### 2. **Appointments** - Gestión de Citas
- ✅ Hook: `useAppointments()`
- ✅ Operaciones: CRUD de citas con drag-drop
- ✅ Sincronización: En tiempo real
- ✅ Ubicación: `/src/pages/appointments/Appointments.tsx`

### 3. **Habits** - Gestión de Hábitos
- ✅ Hook: `useHabits()`
- ✅ Operaciones: CRUD y tracking de racha (streak)
- ✅ Sincronización: En tiempo real
- ✅ Ubicación: `/src/pages/Habit.tsx`

### 4. **Pomodoro** - Sesiones de Trabajo
- ✅ Hook: `usePomodoroSessions()`
- ✅ Operaciones: Crear y completar sesiones
- ✅ Sincronización: En tiempo real
- ✅ Ubicación: `/src/pages/pomodoro/Pomodoro.jsx` (opcional)

## 🚀 Pasos para Activar

### Paso 1: Crear Tablas en Supabase

1. Ve a [https://app.supabase.com](https://app.supabase.com)
2. Selecciona tu proyecto
3. Haz clic en **SQL Editor** en la barra lateral
4. Abre el archivo `SUPABASE_SETUP.md` en tu proyecto
5. Copia y pega TODOS los comandos SQL (empezando por CREATE TABLE)
6. Ejecuta cada comando

### Paso 2: Verificar Row Level Security

Asegúrate de que ejecutaste también los comandos `ALTER TABLE ENABLE ROW LEVEL SECURITY` para cada tabla. Esto protege los datos del usuario.

### Paso 3: Verificar Variables de Entorno

Comprueba que `.env.local` tiene estas variables (deben estar correctas):

```env
VITE_FIREBASE_API_KEY=AIzaSyCpohdwjXlOeamp8WNJq-MtaDWpt86p5z0
VITE_FIREBASE_AUTH_DOMAIN=getting-things-done-6eea2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=getting-things-done-6eea2
VITE_FIREBASE_STORAGE_BUCKET=getting-things-done-6eea2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=205723042166
VITE_FIREBASE_APP_ID=1:205723042166:web:1394ecf62f094062d0fa57
VITE_FIREBASE_MEASUREMENT_ID=G-M31E7LKYY7
VITE_SUPABASE_URL=https://cmqbsahfwxmelqolujym.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWJzYWhmd3htZWxxb2x1anltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMzIyOTMsImV4cCI6MjA2NDcwODI5M30.DnXolViLq95ODPUdoiIkdJQnVfrOei8x9pPYnwhyTPA
```

### Paso 4: Reiniciar Servidor

```bash
npm run dev
```

## 💻 Cómo Usar los Hooks

### Agregar una Tarea

```jsx
import { useTasks } from "../../hooks/useTasks.js";

function MiComponente() {
  const { tasks, addTask } = useTasks();

  const handleAddTask = async () => {
    try {
      await addTask("Mi nueva tarea");
      // ✅ Se guarda en Supabase automáticamente
    } catch (err) {
      console.error(err);
    }
  };

  return <button onClick={handleAddTask}>Agregar Tarea</button>;
}
```

### Actualizar una Tarea

```jsx
const { tasks, toggleTask } = useTasks();

const handleToggle = async (taskId, isCompleted) => {
  try {
    await toggleTask(taskId, isCompleted);
    // ✅ Se actualiza en Supabase automáticamente
  } catch (err) {
    console.error(err);
  }
};
```

### Eliminar una Tarea

```jsx
const { deleteTask } = useTasks();

const handleDelete = async (taskId) => {
  try {
    await deleteTask(taskId);
    // ✅ Se elimina de Supabase automáticamente
  } catch (err) {
    console.error(err);
  }
};
```

## 🔄 Cómo Funciona la Sincronización

1. **Usuario agrega dato** → Hook envía a Supabase
2. **Supabase guarda** → Asocia al `user_id` del usuario
3. **Actualización en tiempo real** → Todos los clientes se actualizan
4. **Persistencia** → Datos permanecen en Supabase

### Diagrama de Flujo

```
┌─────────────────────┐
│  React Component    │
│  (useTasks hook)    │
└──────────┬──────────┘
           │
           │ await addTask("Nueva tarea")
           │
           ▼
┌─────────────────────┐
│  Supabase Client    │
│  (Realtime Update)  │
└──────────┬──────────┘
           │
           │ INSERT/UPDATE/DELETE
           │
           ▼
┌─────────────────────┐
│  Supabase Database  │
│  (user_id = auth)   │
└─────────────────────┘
```

## 📊 Estructura de Datos

### Tasks
```javascript
{
  id: "uuid",
  user_id: "user-uuid",
  title: "Mi tarea",
  is_completed: false,
  created_at: "2026-01-15T12:00:00",
  updated_at: "2026-01-15T12:00:00"
}
```

### Appointments
```javascript
{
  id: "uuid",
  user_id: "user-uuid",
  date: "2026-01-20",
  time: "14:30",
  description: "Mi cita",
  status: "TODO",
  priority: "High",
  created_at: "2026-01-15T12:00:00",
  updated_at: "2026-01-15T12:00:00"
}
```

### Habits
```javascript
{
  id: "uuid",
  user_id: "user-uuid",
  title: "Leer 30 minutos",
  description: "",
  frequency: "daily",
  streak_count: 5,
  last_completed_at: "2026-01-15T12:00:00",
  is_active: true,
  created_at: "2026-01-15T12:00:00",
  updated_at: "2026-01-15T12:00:00"
}
```

## 🐛 Solucionar Problemas

### ❌ "No puedo agregar tareas"
- Verifica que estés logueado en Firebase
- Revisa la consola (F12) para ver errores
- Asegúrate de que las tablas existen en Supabase

### ❌ "No veo mis datos"
- Verifica que `user_id` coincida con el usuario logueado
- Revisa la consola del navegador para errores
- Comprueba que RLS esté habilitado

### ❌ "Los datos no se sincronizan entre dispositivos"
- Recarga la página
- Verifica que ambos dispositivos estén logueados con la misma cuenta
- Comprueba que ambos tengan conexión a internet

### ❌ "Error: 'process is not defined'"
- Ya está arreglado en `firebaseConfig.js`
- Estamos usando `import.meta.env` en lugar de `process.env`
- Reinicia el servidor con `npm run dev`

## ✅ Checklist de Validación

- [ ] Tablas creadas en Supabase
- [ ] RLS habilitado en todas las tablas
- [ ] Variables de entorno correctas en `.env.local`
- [ ] Servidor reiniciado (`npm run dev`)
- [ ] Usuario logueado en la app
- [ ] Agregar una tarea (checklist)
- [ ] Verificar que aparece en Supabase
- [ ] Agregar una cita (appointments)
- [ ] Agregar un hábito (habits)
- [ ] Recargar la página y verificar que los datos persisten
- [ ] Modificar datos y verificar que se actualizan en Supabase

## 📱 Usar desde Múltiples Dispositivos

1. Accede desde dispositivo A con tu cuenta
2. Agrega una tarea
3. Accede desde dispositivo B con la misma cuenta
4. **¡Verás la tarea que agregaste en A!**
5. Cualquier cambio en B se refleja en A en tiempo real

## 🔐 Seguridad

- Cada usuario solo ve sus propios datos gracias a RLS
- Los datos se encriptan en tránsito (HTTPS)
- Las credenciales de Supabase están protegidas en `.env.local`

## 📞 Próximos Pasos

1. Probar la sincronización desde varios dispositivos
2. Crear reportes de hábitos completados
3. Agregar notificaciones de recordatorios
4. Sincronizar con Google Calendar (opcional)
