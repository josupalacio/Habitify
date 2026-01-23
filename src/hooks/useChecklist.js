import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import supabase from '../config/supabaseClient.js';

export const useChecklist = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar tareas
  const fetchTasks = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('checklist')
        .select('*')
        .eq('uid', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
      setError(null);
      console.log('✅ Tareas cargadas:', data?.length || 0);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching checklist tasks:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Cargar tareas al iniciar
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchTasks();

    // Suscribirse a cambios en tiempo real usando la nueva API de Supabase
    const channel = supabase
      .channel(`checklist:${user.uid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'checklist',
          filter: `uid=eq.${user.uid}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setTasks(current => {
              const exists = current.find(t => t.id === payload.new.id);
              if (exists) return current;
              return [payload.new, ...current];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setTasks(current =>
              current.map(t => t.id === payload.new.id ? payload.new : t)
            );
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setTasks(current => current.filter(t => t.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchTasks]);

  const addTask = useCallback(async (taskName) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    try {
      // Generar UUID en el cliente como respaldo si la DB no lo genera automáticamente
      const { data, error } = await supabase
        .from('checklist')
        .insert([{ 
          id: crypto.randomUUID(), // Generar UUID en el cliente
          uid: user.uid,
          task_name: taskName,
          completed: false
        }])
        .select();

      if (error) throw error;
      
      // Actualizar el estado inmediatamente
      if (data && data[0]) {
        setTasks(current => {
          const exists = current.find(t => t.id === data[0].id);
          if (exists) return current;
          return [data[0], ...current];
        });
      }
      
      // Recargar para asegurarse de tener los datos más recientes
      setTimeout(() => fetchTasks(), 500);
      
      console.log('✅ Tarea agregada:', data[0]);
      return data[0];
    } catch (err) {
      console.error('❌ Error adding task:', err);
      throw err;
    }
  }, [user, fetchTasks]);

  const toggleTask = useCallback(async (taskId) => {
    try {
      // Obtener el estado actual de la tarea desde el estado local primero (más rápido)
      const currentTask = tasks.find(t => t.id === taskId);
      const newCompleted = currentTask ? !currentTask.completed : true;

      // Actualizar optimísticamente el estado local primero
      setTasks(current =>
        current.map(t => t.id === taskId ? { ...t, completed: newCompleted } : t)
      );

      // Luego actualizar en la base de datos
      const { data, error } = await supabase
        .from('checklist')
        .update({ completed: newCompleted })
        .eq('id', taskId)
        .select();

      if (error) {
        // Si hay error, revertir el cambio optimista
        setTasks(current =>
          current.map(t => t.id === taskId ? { ...t, completed: !newCompleted } : t)
        );
        throw error;
      }

      // Actualizar con los datos de la base de datos (por si hay otros cambios)
      if (data && data[0]) {
        setTasks(current =>
          current.map(t => t.id === taskId ? data[0] : t)
        );
      }

      console.log('✅ Tarea actualizada:', { taskId, completed: newCompleted });
      return data[0];
    } catch (err) {
      console.error('❌ Error toggling task:', err);
      throw err;
    }
  }, [tasks]);

  const deleteTask = useCallback(async (taskId) => {
    try {
      // Actualizar optimísticamente el estado local primero
      setTasks(current => current.filter(t => t.id !== taskId));

      // Luego eliminar de la base de datos
      const { error } = await supabase
        .from('checklist')
        .delete()
        .eq('id', taskId);

      if (error) {
        // Si hay error, recargar las tareas para revertir
        fetchTasks();
        throw error;
      }

      console.log('✅ Tarea eliminada:', taskId);
    } catch (err) {
      console.error('❌ Error deleting task:', err);
      throw err;
    }
  }, [fetchTasks]);

  return { 
    tasks, 
    loading, 
    error, 
    addTask, 
    toggleTask, 
    deleteTask 
  };
};
