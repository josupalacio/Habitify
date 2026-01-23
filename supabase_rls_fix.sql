-- ============================================
-- Script para configurar RLS con Firebase Auth
-- ============================================
-- 
-- PROBLEMA: Estás usando Firebase Auth pero Supabase RLS espera Supabase Auth
-- SOLUCIÓN: Deshabilitar RLS temporalmente o crear políticas que permitan acceso
--
-- ⚠️ IMPORTANTE: Este script deshabilita RLS para desarrollo
-- Para producción, necesitarás una solución más segura
-- ============================================

-- Opción 1: DESHABILITAR RLS (Solo para desarrollo/pruebas)
-- Ejecuta esto si quieres probar rápidamente sin configurar políticas

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE checklist DISABLE ROW LEVEL SECURITY;

-- ============================================
-- Opción 2: POLÍTICAS PERMISIVAS (Desarrollo)
-- Si prefieres tener RLS habilitado pero permitir todo
-- ============================================

-- Primero habilita RLS
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE checklist ENABLE ROW LEVEL SECURITY;

-- Crear políticas que permitan todo (solo para desarrollo)
-- CREATE POLICY "Allow all on users" ON users FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all on appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);
-- CREATE POLICY "Allow all on checklist" ON checklist FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- Opción 3: POLÍTICAS BASADAS EN UID (Recomendado para producción)
-- Requiere que el UID se pase como parámetro o se valide en el backend
-- ============================================

-- Esta opción requiere configuración adicional en el backend
-- Ya que RLS no puede acceder directamente al UID de Firebase desde el cliente

-- ============================================
-- VERIFICAR ESTADO ACTUAL
-- ============================================

-- Ver si RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('users', 'appointments', 'checklist');

-- Ver políticas existentes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'appointments', 'checklist');
