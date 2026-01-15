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
        // Hook sin conexión a base de datos, solo datos mockeados
        const [tasks, setTasks] = useState([
          { id: '1', title: 'Tarea de ejemplo', is_completed: false },
          { id: '2', title: 'Otra tarea', is_completed: true },
        ]);
        const [loading] = useState(false);
        const [error] = useState(null);
      return data[0];
    } catch (err) {
          setTasks(current => [
            { id: (Math.random()*100000).toFixed(0), title, is_completed: false },
            ...current
          ]);
      if (error) throw error;
    } catch (err) {
      console.error('Error toggling task:', err);
          setTasks(current =>
            current.map(task =>
              task.id === taskId ? { ...task, is_completed: !isCompleted } : task
            )
          );
  }, []);

  return { tasks, loading, error, addTask, toggleTask, deleteTask };
          setTasks(current => current.filter(task => task.id !== taskId));
      throw err;
