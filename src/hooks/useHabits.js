import { useState, useEffect } from 'react';
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
          .eq('uid', user.uid)  // Corregido: user_id -> uid
          .eq('is_active', true)
          .order('sort_order', { ascending: false });  // Corregido: created_at -> sort_order

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
        if (payload.new?.uid === user.uid) {  // Corregido: user_id -> uid
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

  const addHabit = async (habitData) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('habits')
        .insert([{ 
          uid: user.uid,  // Corregido: user_id -> uid
          ...habitData,
          sort_order: Date.now(),  // Agregar sort_order para ordenamiento
          is_active: true
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error adding habit:', err);
      throw err;
    }
  };

  const updateHabit = async (habitId, updates) => {
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
  };

  const toggleHabitCompletion = async (habitId, date, completed = true) => {
    try {
      const { data, error } = await supabase
        .from('habit_records')
        .upsert({
          habit_id: habitId,
          uid: user.uid,  // Corregido: user_id -> uid
          record_date: date,
          completed,
          time_completed: completed ? new Date().toTimeString().slice(0, 5) : null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error toggling habit completion:', err);
      throw err;
    }
  };

  const getHabitRecords = async (habitId, startDate, endDate) => {
    try {
      const { data, error } = await supabase
        .from('habit_records')
        .select('*')
        .eq('habit_id', habitId)
        .gte('record_date', startDate)
        .lte('record_date', endDate)
        .order('record_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching habit records:', err);
      return [];
    }
  };

  const deleteHabit = async (habitId) => {
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
  };

  return { 
    habits, 
    loading, 
    error, 
    addHabit, 
    updateHabit, 
    toggleHabitCompletion,
    getHabitRecords,
    deleteHabit 
  };
};
