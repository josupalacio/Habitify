import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaCheck, FaTimes, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { useHabits } from '../../hooks/useHabits';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import './HabitDetail.css';

interface HabitRecord {
  id: string;
  record_date: string;
  completed: boolean;
  time_completed: string | null;
  notes: string | null;
}

interface WeeklyConfig {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

interface MonthlyConfig {
  week_number?: number;
  day_of_week?: number;
  specific_day?: number;
}

export const HabitDetail: React.FC = () => {
  const { habitId } = useParams<{ habitId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    habits, 
    updateHabit, 
    deleteHabit, 
    toggleHabitCompletion, 
    getHabitRecords
  } = useHabits();

  const [habit, setHabit] = useState<any>(null);
  const [records, setRecords] = useState<HabitRecord[]>([]);
  const [weeklyConfig, setWeeklyConfig] = useState<WeeklyConfig | null>(null);
  const [monthlyConfig, setMonthlyConfig] = useState<MonthlyConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    color: '',
    is_glossy: false,
    frequency: 'Daily',
    time_preference: 'All day',
    icon_key: 'books'
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (habitId && habits.length > 0) {
      const foundHabit = habits.find(h => h.id === habitId);
      if (foundHabit) {
        setHabit(foundHabit);
        setEditForm({
          name: foundHabit.name,
          description: foundHabit.description || '',
          color: foundHabit.color,
          is_glossy: foundHabit.is_glossy,
          frequency: foundHabit.frequency,
          time_preference: foundHabit.time_preference || 'All day',
          icon_key: foundHabit.icon_key || 'books'
        });
        loadHabitData(foundHabit);
      }
    }
  }, [habitId, habits]);

  const loadHabitData = async (habitData: any) => {
    try {
      setLoading(true);
      
      // Cargar registros del mes actual
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const recordsData = await getHabitRecords(
        habitData.id,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setRecords(recordsData);

      // Cargar configuraciones específicas
      if (habitData.frequency === 'Weekly') {
        const weekly = await getWeeklyConfig(habitData.id);
        setWeeklyConfig(weekly);
      } else if (habitData.frequency === 'Monthly') {
        const monthly = await getMonthlyConfig(habitData.id);
        setMonthlyConfig(monthly);
      }
    } catch (error) {
      console.error('Error loading habit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateHabit(habitId!, editForm);
      setIsEditing(false);
      
      // Actualizar el hábito local
      setHabit(prev => ({ ...prev!, ...editForm }));
      
      Swal.fire({
        icon: 'success',
        title: 'Hábito actualizado',
        text: 'Los cambios han sido guardados',
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el hábito'
      });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Eliminar hábito?',
      text: `¿Seguro que quieres eliminar "${habit?.name}"? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteHabit(habitId!);
        navigate('/dashboard');
        Swal.fire({
          icon: 'success',
          title: 'Hábito eliminado',
          timer: 1500
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el hábito'
        });
      }
    }
  };

  const toggleDayCompletion = async (date: string) => {
    try {
      const record = records.find(r => r.record_date === date);
      const completed = record ? !record.completed : true;
      
      await toggleHabitCompletion(habitId!, date, completed);
      
      // Recargar registros
      await loadHabitData(habit);
      
      Swal.fire({
        icon: completed ? 'success' : 'info',
        title: completed ? '¡Buen trabajo!' : 'Registro eliminado',
        text: completed ? 'Hábito completado' : 'Se ha eliminado el registro',
        timer: 1000,
        showConfirmButton: false
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el registro'
      });
    }
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getRecordForDate = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return records.find(r => r.record_date === dateStr);
  };

  const changeMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  if (loading || !habit) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="habit-detail-container">
      <div className="habit-header">
        <div className="habit-info">
          <div className="habit-title-section">
            <h1 style={{ color: habit.color }}>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="edit-input"
                />
              ) : (
                habit.name
              )}
            </h1>
            <div className="habit-actions">
              {isEditing ? (
                <>
                  <button onClick={handleSaveEdit} className="btn-save">
                    <FaCheck /> Guardar
                  </button>
                  <button onClick={() => setIsEditing(false)} className="btn-cancel">
                    <FaTimes /> Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsEditing(true)} className="btn-edit">
                    <FaEdit /> Editar
                  </button>
                  <button onClick={handleDelete} className="btn-delete">
                    <FaTrash /> Eliminar
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="habit-details">
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Descripción:</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Color:</label>
                    <input
                      type="color"
                      value={editForm.color}
                      onChange={(e) => setEditForm({ ...editForm, color: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Frecuencia:</label>
                    <select
                      value={editForm.frequency}
                      onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                    >
                      <option value="Daily">Diario</option>
                      <option value="Weekly">Semanal</option>
                      <option value="Monthly">Mensual</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Preferencia de tiempo:</label>
                  <select
                    value={editForm.time_preference}
                    onChange={(e) => setEditForm({ ...editForm, time_preference: e.target.value })}
                  >
                    <option value="All day">Todo el día</option>
                    <option value="In the morning">Por la mañana</option>
                    <option value="In the evening">Por la tarde</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                <p className="habit-description">{habit.description || 'Sin descripción'}</p>
                <div className="habit-meta">
                  <span className="frequency-badge">{habit.frequency}</span>
                  <span className="time-badge">{habit.time_preference || 'Todo el día'}</span>
                  {habit.is_glossy && <span className="glossy-badge">Efecto Glossy</span>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="habit-calendar">
        <div className="calendar-header">
          <button onClick={() => changeMonth(-1)} className="nav-btn">
            ‹
          </button>
          <h2>
            {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => changeMonth(1)} className="nav-btn">
            ›
          </button>
        </div>

        <div className="calendar-grid">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="calendar-day-header">{day}</div>
          ))}
          
          {getDaysInMonth().map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="calendar-empty"></div>;
            }

            const record = getRecordForDate(day);
            const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
            
            return (
              <div
                key={day}
                className={`calendar-day ${record?.completed ? 'completed' : ''} ${isToday ? 'today' : ''}`}
                onClick={() => toggleDayCompletion(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
              >
                <span className="day-number">{day}</span>
                {record?.completed && <FaCheck className="check-icon" />}
                {record?.time_completed && (
                  <span className="time-completed">
                    <FaClock /> {record.time_completed}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-day completed"></div>
            <span>Completado</span>
          </div>
          <div className="legend-item">
            <div className="legend-day today"></div>
            <span>Hoy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
