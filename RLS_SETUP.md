# 🔒 Configuración de Row Level Security (RLS) en Supabase

## ⚠️ IMPORTANTE: El error 401 se debe a que RLS no está configurado

El error `401 Unauthorized` que estás viendo significa que Row Level Security está bloqueando las consultas. Necesitas configurar las políticas de RLS en Supabase.

## 📋 Pasos para Configurar RLS

### 1. Ve al SQL Editor en Supabase

1. Abre https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a **SQL Editor** en el menú lateral

### 2. Habilita RLS en todas las tablas

Ejecuta estos comandos SQL:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist ENABLE ROW LEVEL SECURITY;
```

### 3. Crear Políticas para la tabla `users`

```sql
-- Los usuarios pueden ver su propio registro
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid()::text = uid);

-- Los usuarios pueden insertar su propio registro
CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = uid);

-- Los usuarios pueden actualizar su propio registro
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid()::text = uid)
  WITH CHECK (auth.uid()::text = uid);
```

### 4. Crear Políticas para la tabla `appointments`

```sql
-- Los usuarios pueden ver sus propias citas
CREATE POLICY "Users can view own appointments"
  ON appointments FOR SELECT
  USING (auth.uid()::text = uid);

-- Los usuarios pueden insertar sus propias citas
CREATE POLICY "Users can insert own appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid()::text = uid);

-- Los usuarios pueden actualizar sus propias citas
CREATE POLICY "Users can update own appointments"
  ON appointments FOR UPDATE
  USING (auth.uid()::text = uid)
  WITH CHECK (auth.uid()::text = uid);

-- Los usuarios pueden eliminar sus propias citas
CREATE POLICY "Users can delete own appointments"
  ON appointments FOR DELETE
  USING (auth.uid()::text = uid);
```

### 5. Crear Políticas para la tabla `checklist`

```sql
-- Los usuarios pueden ver sus propias tareas
CREATE POLICY "Users can view own checklist"
  ON checklist FOR SELECT
  USING (auth.uid()::text = uid);

-- Los usuarios pueden insertar sus propias tareas
CREATE POLICY "Users can insert own checklist"
  ON checklist FOR INSERT
  WITH CHECK (auth.uid()::text = uid);

-- Los usuarios pueden actualizar sus propias tareas
CREATE POLICY "Users can update own checklist"
  ON checklist FOR UPDATE
  USING (auth.uid()::text = uid)
  WITH CHECK (auth.uid()::text = uid);

-- Los usuarios pueden eliminar sus propias tareas
CREATE POLICY "Users can delete own checklist"
  ON checklist FOR DELETE
  USING (auth.uid()::text = uid);
```

## ⚠️ PROBLEMA: Firebase Auth vs Supabase Auth

**El problema es que estás usando Firebase Auth pero Supabase RLS espera Supabase Auth.**

Como estás usando Firebase UID (no Supabase Auth), necesitas una solución alternativa:

### Opción 1: Deshabilitar RLS temporalmente (Solo para desarrollo)

```sql
-- ⚠️ SOLO PARA DESARROLLO - NO USAR EN PRODUCCIÓN
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklist DISABLE ROW LEVEL SECURITY;
```

### Opción 2: Usar Service Role Key (NO recomendado para frontend)

No uses esto en el frontend. Solo para backends.

### Opción 3: Crear una función que valide el UID de Firebase (Recomendado)

Necesitas crear una función en Supabase que valide el UID de Firebase. Esto requiere configuración adicional.

### Opción 4: Usar Supabase Auth en lugar de Firebase Auth

Migrar completamente a Supabase Auth.

## 🚀 Solución Rápida (Para probar ahora)

Ejecuta esto en el SQL Editor para deshabilitar RLS temporalmente y poder probar:

```sql
-- Deshabilitar RLS temporalmente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklist DISABLE ROW LEVEL SECURITY;
```

**⚠️ IMPORTANTE:** Esto permite acceso sin autenticación. Solo úsalo para desarrollo y pruebas.

## 🔐 Solución Segura (Para producción)

Necesitas implementar una de estas opciones:

1. **Crear un backend que valide Firebase tokens y use Service Role Key**
2. **Migrar a Supabase Auth completamente**
3. **Crear funciones de PostgreSQL que validen Firebase UIDs**

¿Quieres que implemente alguna de estas soluciones?
