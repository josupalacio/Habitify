import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase usando variables de entorno de Vite
// Obtén estas credenciales desde: https://app.supabase.com → Tu Proyecto → Settings → API
// Nota: La "Publishable key" es la equivalente a la antigua "anon key" y es segura para usar en el frontend
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ikvzdsbprwpholrmpylt.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Si no hay anon key, mostrar un error claro
if (!supabaseAnonKey && !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('⚠️ VITE_SUPABASE_ANON_KEY no está configurada. Por favor, agrega tu Publishable key en .env.local');
  console.error('📝 Obtén tu Publishable key desde: https://app.supabase.com → Tu Proyecto → Settings → API');
}

console.log('🔌 Supabase Config Debug:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyLength: supabaseAnonKey?.length || 0,
  keyPrefix: supabaseAnonKey?.substring(0, 10) + '...' || 'NO_KEY'
});

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Debug: Verificar configuración (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('🔌 Supabase Config:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    keyLength: supabaseAnonKey?.length || 0
  });
}

// Función para probar la conexión
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('❌ Error de conexión a Supabase:', error.message);
      console.error('💡 Verifica que:');
      console.error('   1. La Publishable key sea correcta');
      console.error('   2. Row Level Security (RLS) esté configurado correctamente');
      console.error('   3. Las tablas existan en Supabase');
      return { success: false, error: error.message };
    }
    console.log('✅ Conexión a Supabase exitosa');
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error de conexión:', err);
    return { success: false, error: err.message };
  }
};

export default supabase;
