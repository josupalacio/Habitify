import { useState } from 'react';

// Hook sin conexión a base de datos, solo datos mockeados
export const useAppointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      date: '2026-01-15',
      time: '10:00',
      description: 'Cita de ejemplo',
      status: 'TODO',
      priority: 'Normal',
    },
    {
      id: '2',
      date: '2026-01-16',
      time: '15:00',
      description: 'Otra cita',
      status: 'InProgress',
      priority: 'High',
    },
  ]);
  const [loading] = useState(false);
  const [error] = useState(null);

  const addAppointment = async (appointment) => {
    setAppointments(current => [
      { ...appointment, id: (Math.random()*100000).toFixed(0) },
      ...current
    ]);
  };

  const updateAppointment = async (appointmentId, updates) => {
    setAppointments(current =>
      current.map(app =>
        app.id === appointmentId ? { ...app, ...updates } : app
      )
    );
  };

  const deleteAppointment = async (appointmentId) => {
    setAppointments(current => current.filter(app => app.id !== appointmentId));
  };

  return {
    appointments,
    loading,
    error,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  };
};
