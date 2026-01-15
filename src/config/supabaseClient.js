import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase usando variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cmqbsahfwxmelqolujym.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWJzYWhmd3htZWxxb2x1anltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMzIyOTMsImV4cCI6MjA2NDcwODI5M30.DnXolViLq95ODPUdoiIkdJQnVfrOei8x9pPYnwhyTPA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
