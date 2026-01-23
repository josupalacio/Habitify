import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import supabase from '../config/supabaseClient.js';

export const useAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar appointments
  const fetchAppointments = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('uid', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
      setError(null);
      console.log('✅ Appointments cargados:', data?.length || 0);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Cargar appointments al iniciar
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchAppointments();

    // Suscribirse a cambios en tiempo real usando la nueva API de Supabase
    const channel = supabase
      .channel(`appointments:${user.uid}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `uid=eq.${user.uid}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setAppointments(current => {
              const exists = current.find(a => a.id === payload.new.id);
              if (exists) return current;
              return [payload.new, ...current];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setAppointments(current =>
              current.map(a => a.id === payload.new.id ? payload.new : a)
            );
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setAppointments(current => current.filter(a => a.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchAppointments]);

  const addAppointment = useCallback(async (appointment) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    try {
      // Generar UUID en el cliente como respaldo si la DB no lo genera automáticamente
      const { data, error } = await supabase
        .from('appointments')
        .insert([{ 
          id: crypto.randomUUID(), // Generar UUID en el cliente
          uid: user.uid,
          description: appointment.description,
          status: appointment.status,
          priority: appointment.priority,
          date: appointment.date,
          time: appointment.time
        }])
        .select();

      if (error) throw error;
      
      // Actualizar el estado inmediatamente
      if (data && data[0]) {
        setAppointments(current => {
          const exists = current.find(a => a.id === data[0].id);
          if (exists) return current;
          return [data[0], ...current];
        });
      }
      
      // Recargar para asegurarse de tener los datos más recientes
      setTimeout(() => fetchAppointments(), 500);
      
      console.log('✅ Appointment agregado:', data[0]);
      return data[0];
    } catch (err) {
      console.error('❌ Error adding appointment:', err);
      throw err;
    }
  }, [user, fetchAppointments]);

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
    deleteAppointment,
  };
};
