import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import supabase from '../config/supabaseClient.js';

export const useHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar hábitos al iniciar
  useEffect(() => {
    if (!user) return;

    const fetchHabits = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.uid)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHabits(data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching habits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .from('habits')
      .on('*', payload => {
        if (payload.new?.user_id === user.uid) {
          setHabits(current => {
            const updated = current.filter(h => h.id !== payload.new.id);
            if (payload.new.is_active) {
              return [payload.new, ...updated];
            }
            return updated;
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [user]);

  const addHabit = useCallback(async (habit) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{ 
          user_id: user.uid, 
          ...habit,
          is_active: true
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error adding habit:', err);
      throw err;
    }
  }, [user]);

  const updateHabit = useCallback(async (habitId, updates) => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .update(updates)
        .eq('id', habitId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error updating habit:', err);
      throw err;
    }
  }, []);

  const completeHabit = useCallback(async (habitId) => {
    try {
      // Get current streak count
      const { data: currentData } = await supabase
        .from('habits')
        .select('streak_count')
        .eq('id', habitId)
        .single();

      const newStreakCount = (currentData?.streak_count || 0) + 1;

      const { data, error } = await supabase
        .from('habits')
        .update({ 
          last_completed_at: new Date().toISOString(),
          streak_count: newStreakCount
        })
        .eq('id', habitId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error completing habit:', err);
      throw err;
    }
  }, []);

  const deleteHabit = useCallback(async (habitId) => {
    try {
      const { error } = await supabase
        .from('habits')
        .update({ is_active: false })
        .eq('id', habitId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting habit:', err);
      throw err;
    }
  }, []);

  return { 
    habits, 
    loading, 
    error, 
    addHabit, 
    updateHabit, 
    completeHabit, 
    deleteHabit 
  };
};
