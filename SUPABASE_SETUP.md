# Configuración de Supabase - Sincronización de Datos

## Tablas Necesarias en Supabase

Ejecuta estas sentencias SQL en el SQL Editor de Supabase para crear las tablas necesarias:

### 1. Tabla de Tareas (Checklist)
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

### 2. Tabla de Citas (Appointments)
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'TODO' CHECK (status IN ('TODO', 'InProgress', 'Completed')),
  priority TEXT NOT NULL DEFAULT 'Normal' CHECK (priority IN ('High', 'Medium', 'Normal')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_date ON appointments(date);
```

### 3. Tabla de Hábitos (Habits)
```sql
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  frequency TEXT DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  streak_count INTEGER DEFAULT 0,
  last_completed_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_habits_user_id ON habits(user_id);
```

### 4. Tabla de Pomodoros (Pomodoro Sessions)
```sql
CREATE TABLE pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 25,
  completed_at TIMESTAMP,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pomodoro_sessions_user_id ON pomodoro_sessions(user_id);
```

## Configurar Row Level Security (RLS)

Para cada tabla, ejecuta:

```sql
-- Para tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

-- Para appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own appointments" ON appointments
  FOR ALL USING (auth.uid() = user_id);

-- Para habits
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own habits" ON habits
  FOR ALL USING (auth.uid() = user_id);

-- Para pomodoro_sessions
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own pomodoro sessions" ON pomodoro_sessions
  FOR ALL USING (auth.uid() = user_id);
```

## Próximos Pasos

1. Ve a tu dashboard de Supabase
2. Abre el SQL Editor
3. Copia y pega cada sentencia SQL anterior
4. Ejecuta cada una
5. Los hooks y componentes se actualizarán automáticamente
