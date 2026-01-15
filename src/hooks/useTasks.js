import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import supabase from '../config/supabaseClient.js';

export const useTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar tareas al iniciar
  useEffect(() => {
    if (!user) return;

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTasks(data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .from('tasks')
      .on('*', payload => {
        if (payload.new?.user_id === user.uid) {
          setTasks(current => {
            const updated = current.filter(t => t.id !== payload.new.id);
            return [payload.new, ...updated];
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [user]);

  const addTask = useCallback(async (title) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ 
          user_id: user.uid, 
          title,
          is_completed: false 
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  }, [user]);

  const toggleTask = useCallback(async (taskId, isCompleted) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_completed: !isCompleted })
        .eq('id', taskId);

      if (error) throw error;
    } catch (err) {
      console.error('Error toggling task:', err);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  }, []);

  return { tasks, loading, error, addTask, toggleTask, deleteTask };
};
