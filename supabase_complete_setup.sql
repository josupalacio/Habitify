-- =================================================================
-- SCRIPT COMPLETO PARA CONFIGURACIÓN DE HÁBITOS EN SUPABASE
-- =================================================================
-- Ejecutar este script completo en el SQL Editor de Supabase
-- =================================================================

-- 1. LIMPIAR ESTRUCTURAS EXISTENTES (si existen)
-- =================================================================

-- Eliminar políticas primero (si existen)
DROP POLICY IF EXISTS "Users can view own habits" ON habits;
DROP POLICY IF EXISTS "Users can insert own habits" ON habits;
DROP POLICY IF EXISTS "Users can update own habits" ON habits;
DROP POLICY IF EXISTS "Users can delete own habits" ON habits;

DROP POLICY IF EXISTS "Users can view own habit records" ON habit_records;
DROP POLICY IF EXISTS "Users can insert own habit records" ON habit_records;
DROP POLICY IF EXISTS "Users can update own habit records" ON habit_records;
DROP POLICY IF EXISTS "Users can delete own habit records" ON habit_records;

DROP POLICY IF EXISTS "Users can manage own weekly config" ON habit_weekly_config;
DROP POLICY IF EXISTS "Users can manage own monthly config" ON habit_monthly_config;

-- Eliminar triggers (si existen)
DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;
DROP TRIGGER IF EXISTS update_habit_records_updated_at ON habit_records;

-- Eliminar tablas en orden correcto (dependencias primero)
DROP TABLE IF EXISTS habit_monthly_config;
DROP TABLE IF EXISTS habit_weekly_config;
DROP TABLE IF EXISTS habit_records;
DROP TABLE IF EXISTS habits;

-- Eliminar función (si existe)
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 2. CREAR TABLAS PRINCIPALES
-- =================================================================

-- Tabla principal de hábitos
CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uid VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) NOT NULL DEFAULT '#fbbf24',
    is_glossy BOOLEAN DEFAULT false,
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('Daily', 'Weekly', 'Monthly')),
    time_preference VARCHAR(50) DEFAULT 'All day',
    icon_key VARCHAR(50) DEFAULT 'books',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

-- Tabla para registros diarios de hábitos
CREATE TABLE habit_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL,
    uid VARCHAR(255) NOT NULL,
    record_date DATE NOT NULL,
    completed BOOLEAN DEFAULT false,
    time_completed TIME,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    UNIQUE(habit_id, record_date) -- Solo un registro por hábito por día
);

-- Tabla para configuración de hábitos semanales
CREATE TABLE habit_weekly_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL,
    monday BOOLEAN DEFAULT false,
    tuesday BOOLEAN DEFAULT false,
    wednesday BOOLEAN DEFAULT false,
    thursday BOOLEAN DEFAULT false,
    friday BOOLEAN DEFAULT false,
    saturday BOOLEAN DEFAULT false,
    sunday BOOLEAN DEFAULT false,
    
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

-- Tabla para configuración de hábitos mensuales
CREATE TABLE habit_monthly_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID NOT NULL,
    week_number INTEGER CHECK (week_number BETWEEN 1 AND 5), -- 1-4 para semanas específicas, 5 para última semana
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo, 6=Sábado
    specific_day INTEGER CHECK (specific_day BETWEEN 1 AND 31), -- Día específico del mes
    
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
);

-- 3. CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- =================================================================

CREATE INDEX idx_habits_uid ON habits(uid);
CREATE INDEX idx_habits_active ON habits(is_active);
CREATE INDEX idx_habits_sort_order ON habits(sort_order DESC);
CREATE INDEX idx_habits_created_at ON habits(created_at DESC);

CREATE INDEX idx_habit_records_habit_id ON habit_records(habit_id);
CREATE INDEX idx_habit_records_uid ON habit_records(uid);
CREATE INDEX idx_habit_records_date ON habit_records(record_date);
CREATE INDEX idx_habit_records_completed ON habit_records(completed);

CREATE INDEX idx_habit_weekly_config_habit_id ON habit_weekly_config(habit_id);
CREATE INDEX idx_habit_monthly_config_habit_id ON habit_monthly_config(habit_id);

-- 4. CREAR TRIGGERS PARA TIMESTAMP AUTOMÁTICO
-- =================================================================

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para tabla habits
CREATE TRIGGER update_habits_updated_at 
    BEFORE UPDATE ON habits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 5. CONFIGURAR SEGURIDAD (ROW LEVEL SECURITY)
-- =================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_weekly_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_monthly_config ENABLE ROW LEVEL SECURITY;

-- 6. CREAR POLÍTICAS DE SEGURIDAD
-- =================================================================

-- Políticas para tabla habits
CREATE POLICY "Users can view own habits" ON habits
    FOR SELECT USING (auth.uid()::text = uid);

CREATE POLICY "Users can insert own habits" ON habits
    FOR INSERT WITH CHECK (auth.uid()::text = uid);

CREATE POLICY "Users can update own habits" ON habits
    FOR UPDATE USING (auth.uid()::text = uid);

CREATE POLICY "Users can delete own habits" ON habits
    FOR DELETE USING (auth.uid()::text = uid);

-- Políticas para tabla habit_records
CREATE POLICY "Users can view own habit records" ON habit_records
    FOR SELECT USING (auth.uid()::text = uid);

CREATE POLICY "Users can insert own habit records" ON habit_records
    FOR INSERT WITH CHECK (auth.uid()::text = uid);

CREATE POLICY "Users can update own habit records" ON habit_records
    FOR UPDATE USING (auth.uid()::text = uid);

CREATE POLICY "Users can delete own habit records" ON habit_records
    FOR DELETE USING (auth.uid()::text = uid);

-- Políticas para configuraciones (acceso indirecto a través de habits)
CREATE POLICY "Users can manage own weekly config" ON habit_weekly_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM habits 
            WHERE habits.id = habit_weekly_config.habit_id 
            AND habits.uid = auth.uid()::text
        )
    );

CREATE POLICY "Users can manage own monthly config" ON habit_monthly_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM habits 
            WHERE habits.id = habit_monthly_config.habit_id 
            AND habits.uid = auth.uid()::text
        )
    );

-- 7. VERIFICACIÓN FINAL
-- =================================================================

-- Mostrar tablas creadas
SELECT 
    table_name,
    table_type,
    is_insertable_into
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('habits', 'habit_records', 'habit_weekly_config', 'habit_monthly_config')
ORDER BY table_name;

-- Mostrar políticas creadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('habits', 'habit_records', 'habit_weekly_config', 'habit_monthly_config')
ORDER BY tablename, policyname;

-- =================================================================
-- ¡CONFIGURACIÓN COMPLETA REALIZADA CON ÉXITO!
-- =================================================================
-- Ahora puedes usar las siguientes operaciones:
-- 
-- 1. Crear hábitos: INSERT INTO habits (uid, name, color, ...) VALUES (...)
-- 2. Registrar progreso: INSERT INTO habit_records (habit_id, uid, record_date, completed) VALUES (...)
-- 3. Configurar frecuencia semanal: INSERT INTO habit_weekly_config (habit_id, monday, tuesday, ...) VALUES (...)
-- 4. Configurar frecuencia mensual: INSERT INTO habit_monthly_config (habit_id, week_number, day_of_week) VALUES (...)
-- =================================================================
