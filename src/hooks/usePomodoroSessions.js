import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import supabase from '../config/supabaseClient.js';

export const usePomodoroSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar sesiones de pomodoro al iniciar
  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pomodoro_sessions')
          .select('*')
          .eq('user_id', user.uid)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSessions(data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching pomodoro sessions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .from('pomodoro_sessions')
      .on('*', payload => {
        if (payload.new?.user_id === user.uid) {
          setSessions(current => {
            const updated = current.filter(s => s.id !== payload.new.id);
            return [payload.new, ...updated];
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [user]);

  const addSession = useCallback(async (task, durationMinutes = 25) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .insert([{ 
          user_id: user.uid, 
          task,
          duration_minutes: durationMinutes,
          is_completed: false
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error adding pomodoro session:', err);
      throw err;
    }
  }, [user]);

  const completeSession = useCallback(async (sessionId) => {
    try {
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .update({ 
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error completing pomodoro session:', err);
      throw err;
    }
  }, []);

  const deleteSession = useCallback(async (sessionId) => {
    try {
      const { error } = await supabase
        .from('pomodoro_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting pomodoro session:', err);
      throw err;
    }
  }, []);

  return { 
    sessions, 
    loading, 
    error, 
    addSession, 
    completeSession, 
    deleteSession 
  };
};
