import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import supabase from '../config/supabaseClient.js';

export const useAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar citas al iniciar
  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('appointments')
          .select('*')
          .eq('user_id', user.uid)
          .order('date', { ascending: true });

        if (error) throw error;
        setAppointments(data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching appointments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Suscribirse a cambios en tiempo real
    const subscription = supabase
      .from('appointments')
      .on('*', payload => {
        if (payload.new?.user_id === user.uid) {
          setAppointments(current => {
            const updated = current.filter(a => a.id !== payload.new.id);
            return [payload.new, ...updated].sort((a, b) => 
              new Date(a.date) - new Date(b.date)
            );
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [user]);

  const addAppointment = useCallback(async (appointment) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{ 
          user_id: user.uid, 
          ...appointment
        }])
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error adding appointment:', err);
      throw err;
    }
  }, [user]);

  const updateAppointment = useCallback(async (appointmentId, updates) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', appointmentId)
        .select();

      if (error) throw error;
      return data[0];
    } catch (err) {
      console.error('Error updating appointment:', err);
      throw err;
    }
  }, []);

  const deleteAppointment = useCallback(async (appointmentId) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;
    } catch (err) {
      console.error('Error deleting appointment:', err);
      throw err;
    }
  }, []);

  return { 
    appointments, 
    loading, 
    error, 
    addAppointment, 
    updateAppointment, 
    deleteAppointment 
  };
};
