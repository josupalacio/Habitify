import React, { useState } from 'react';
import { FaFire, FaCheckCircle, FaTimesCircle, FaBookOpen, FaCalendarAlt, FaTrophy, FaChartLine } from 'react-icons/fa';
import './read.css';

interface ReadRecord {
  date: Date;
  completed: boolean;
  notes?: string;
}

// Funciones de fecha simplificadas sin date-fns
const getMonthName = (date: Date) => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return months[date.getMonth()];
};

const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const isSameDay = (date1: Date, date2: Date) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const subDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

const formatDate = (date: Date, format: string) => {
  if (format === "d 'de' MMMM") {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${date.getDate()} de ${months[date.getMonth()]}`;
  }
  return date.toLocaleDateString();
};

export const ReadHabit: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [records, setRecords] = useState<ReadRecord[]>([]);
  const [showStats, setShowStats] = useState(false);

  // Calcular estadísticas
  const calculateStats = () => {
    const totalDays = getDaysInMonth(currentMonth);
    const completedDays = records.filter(r => r.completed).length;
    const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
    
    // Calcular racha actual
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(today, i);
      const record = records.find(r => isSameDay(r.date, checkDate));
      if (record?.completed) {
        currentStreak++;
      } else if (i < 7) {
        break;
      }
    }
    
    return {
      completedDays,
      totalDays,
      completionRate,
      currentStreak,
      bestStreak: Math.max(...records.reduce((acc, r) => {
        if (r.completed) {
          acc[acc.length - 1] = (acc[acc.length - 1] || 0) + 1;
        } else {
          acc.push(0);
        }
        return acc;
      }, [0]))
    };
  };

  const stats = calculateStats();

  // Generar días del mes
  const getMonthDays = () => {
    const days = [];
    const totalDays = getDaysInMonth(currentMonth);
    const startDay = getFirstDayOfMonth(currentMonth);
    
    // Agregar días vacíos al inicio
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Agregar días del mes
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }
    
    return days;
  };

  // Toggle completado para un día
  const toggleDayCompletion = (date: Date) => {
    setRecords(prev => {
      const existingIndex = prev.findIndex(r => isSameDay(r.date, date));
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          completed: !updated[existingIndex].completed
        };
        return updated;
      } else {
        return [...prev, { date, completed: true }];
      }
    });
  };

  // Navegar meses
  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  // Obtener estado para un día específico
  const getDayStatus = (date: Date) => {
    if (!date) return null;
    const record = records.find(r => isSameDay(r.date, date));
    return record?.completed ? 'completed' : record ? 'missed' : 'pending';
  };

  const today = new Date();

  return (
    <div className="read-habit-container">
      {/* Header */}
      <div className="read-header">
        <div className="read-title">
          <FaBookOpen className="read-icon" />
          <h1>Leer</h1>
        </div>
        <p className="read-description">
          📖 Leo todos los días para expandir mi conocimiento. Cada página me abre nuevos mundos y posibilidades.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card streak-card">
          <div className="stat-icon">
            <FaFire className="fire-icon" />
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.currentStreak}</div>
            <div className="stat-label">Días seguidos</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaCheckCircle className="check-icon" />
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.completedDays}</div>
            <div className="stat-label">Días este mes</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaChartLine className="chart-icon" />
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.completionRate.toFixed(0)}%</div>
            <div className="stat-label">Tasa de éxito</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <FaTrophy className="trophy-icon" />
          </div>
          <div className="stat-info">
            <div className="stat-number">{stats.bestStreak}</div>
            <div className="stat-label">Mejor racha</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="quick-action-btn today-btn"
          onClick={() => toggleDayCompletion(today)}
        >
          <FaCheckCircle />
          {getDayStatus(today) === 'completed' ? '¡Hoy ya leí!' : 'Leí hoy'}
        </button>

        <button 
          className="quick-action-btn stats-btn"
          onClick={() => setShowStats(!showStats)}
        >
          <FaChartLine />
          {showStats ? 'Ocultar estadísticas' : 'Ver estadísticas'}
        </button>
      </div>

      {/* Calendar */}
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={() => navigateMonth(-1)} className="nav-btn">
            ‹
          </button>
          <h2>
            {getMonthName(currentMonth)} {currentMonth.getFullYear()}
          </h2>
          <button onClick={() => navigateMonth(1)} className="nav-btn">
            ›
          </button>
        </div>

        <div className="calendar-grid">
          {/* Days of week */}
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}

          {/* Calendar days */}
          {getMonthDays().map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="calendar-day empty"></div>;
            }

            const status = getDayStatus(date);
            const isToday = isSameDay(date, today);
            
            return (
              <button
                key={date.toISOString()}
                className={`calendar-day ${status} ${isToday ? 'today' : ''}`}
                onClick={() => toggleDayCompletion(date)}
              >
                <span className="day-number">{date.getDate()}</span>
                {status === 'completed' && <FaCheckCircle className="day-icon completed" />}
                {status === 'missed' && <FaTimesCircle className="day-icon missed" />}
                {isToday && <div className="today-indicator">HOY</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Extended Stats */}
      {showStats && (
        <div className="extended-stats">
          <h3><FaChartLine /> Estadísticas Detalladas</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Progreso mensual</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>
              <span className="stat-value">{stats.completionRate.toFixed(1)}%</span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Días restantes este mes</span>
              <span className="stat-value">
                {stats.totalDays - stats.completedDays} días
              </span>
            </div>
            
            <div className="stat-item">
              <span className="stat-label">Consistencia semanal</span>
              <span className="stat-value">
                {stats.currentStreak >= 7 ? '🔥 ¡Excelente!' : 
                 stats.currentStreak >= 3 ? '📖 ¡Bien!' : '🎯 Sigue adelante'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Message */}
      <div className="motivation-section">
        <div className="motivation-card">
          {stats.currentStreak >= 7 ? (
            <>
              <FaFire className="motivation-icon fire" />
              <h3>🔥 ¡Racha de Lectura Impresionante!</h3>
              <p>Llevas {stats.currentStreak} días seguidos leyendo. Tu dedicación está expandiendo tu conocimiento.</p>
            </>
          ) : stats.currentStreak >= 3 ? (
            <>
              <FaBookOpen className="motivation-icon" />
              <h3>📖 ¡Vas Bien!</h3>
              <p>Llevas {stats.currentStreak} días seguidos. Sigue así, cada página te acerca a nuevas aventuras.</p>
            </>
          ) : (
            <>
              <FaChartLine className="motivation-icon" />
              <h3>🎯 ¡Comienza Hoy!</h3>
              <p>El primer paso es el más importante. ¡Lee hoy y empieza tu racha de conocimiento!</p>
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3><FaCalendarAlt /> Actividad Reciente</h3>
        <div className="activity-list">
          {records
            .filter(r => r.completed)
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 5)
            .map((record, index) => (
              <div key={index} className="activity-item">
                <FaCheckCircle className="activity-icon" />
                <span className="activity-text">
                  Leíste el {formatDate(record.date, "d 'de' MMMM")}
                </span>
              </div>
            ))}
          {records.filter(r => r.completed).length === 0 && (
            <p className="no-activity">Aún no hay sesiones de lectura registradas. ¡Comienza hoy!</p>
          )}
        </div>
      </div>
    </div>
  );
};
