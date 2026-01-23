-- Tabla de hábitos
CREATE TABLE IF NOT EXISTS habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#fbbf24',
    is_glossy BOOLEAN DEFAULT false,
    description TEXT,
    frequency VARCHAR(50) DEFAULT 'Daily',
    time_preference VARCHAR(50) DEFAULT 'All day',
    icon_key VARCHAR(50) DEFAULT 'add',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_created_at ON habits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_habits_sort_order ON habits(sort_order DESC);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_habits_updated_at 
    BEFORE UPDATE ON habits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
