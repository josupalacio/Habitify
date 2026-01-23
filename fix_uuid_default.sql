-- ============================================
-- Script para agregar DEFAULT a campos UUID
-- ============================================
-- 
-- PROBLEMA: Los campos UUID no tienen valor por defecto
-- SOLUCIÓN: Agregar gen_random_uuid() como DEFAULT
-- ============================================

-- Habilitar la extensión para generar UUIDs (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Agregar DEFAULT a la columna id en appointments
ALTER TABLE appointments 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Agregar DEFAULT a la columna id en checklist
ALTER TABLE checklist 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Verificar que se aplicó correctamente
SELECT 
  table_name,
  column_name,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('appointments', 'checklist')
  AND column_name = 'id';
