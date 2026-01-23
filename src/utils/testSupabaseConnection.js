/**
 * Utilidad para probar la conexión a Supabase
 * Usa esto en la consola del navegador o en un componente para verificar la conexión
 */

import supabase from '../config/supabaseClient.js';

export const testSupabaseConnection = async () => {
  console.log('🔌 Probando conexión a Supabase...');
  console.log('URL:', import.meta.env.VITE_SUPABASE_URL || 'No configurada');
  console.log('Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ No configurada');

  try {
    // Probar conexión básica
    const { data: healthCheck, error: healthError } = await supabase
      .from('users')
      .select('count')
      .limit(0);

    if (healthError) {
      // Si la tabla no existe, probar con otra tabla
      const { error: appointmentsError } = await supabase
        .from('appointments')
        .select('count')
        .limit(0);

      if (appointmentsError) {
        const { error: checklistError } = await supabase
          .from('checklist')
          .select('count')
          .limit(0);

        if (checklistError) {
          console.error('❌ Error de conexión:', checklistError.message);
          console.error('💡 Asegúrate de que:');
          console.error('   1. Las tablas estén creadas en Supabase');
          console.error('   2. Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén configuradas');
          console.error('   3. La anon key sea correcta');
          return { success: false, error: checklistError.message };
        }
      }
    }

    // Probar una consulta real
    const { data, error } = await supabase
      .from('users')
      .select('uid, email')
      .limit(1);

    if (error) {
      console.error('❌ Error al consultar datos:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✅ Conexión a Supabase exitosa!');
    console.log('📊 Datos de prueba:', data);
    return { success: true, data };
  } catch (err) {
    console.error('❌ Error inesperado:', err);
    return { success: false, error: err.message };
  }
};

// Función para verificar que las tablas existan
export const verifyTables = async () => {
  const tables = ['users', 'appointments', 'checklist'];
  const results = {};

  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('*')
        .limit(0);

      if (error) {
        results[table] = { exists: false, error: error.message };
      } else {
        results[table] = { exists: true };
      }
    } catch (err) {
      results[table] = { exists: false, error: err.message };
    }
  }

  console.log('📋 Estado de las tablas:', results);
  return results;
};

// Exportar para uso en consola del navegador
if (typeof window !== 'undefined') {
  window.testSupabaseConnection = testSupabaseConnection;
  window.verifyTables = verifyTables;
}
