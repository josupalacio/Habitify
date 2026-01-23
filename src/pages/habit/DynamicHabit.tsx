import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFire, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaTrophy, FaChartLine, FaBrain, FaRunning, FaDumbbell, FaBed, FaCalendarCheck } from 'react-icons/fa';
import { PiBooksDuotone, PiNotebookDuotone } from 'react-icons/pi';
import { LiaBookSolid } from 'react-icons/lia';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { TbStretching, TbTargetArrow } from 'react-icons/tb';
import { FaGlassWater } from 'react-icons/fa6';
import { MdOutlineWbSunny, MdOutlineSchool, MdOutlineTimer } from 'react-icons/md';
import { IoMdAddCircleOutline } from 'react-icons/io';
import './DynamicHabit.css';

interface HabitRecord {
  date: Date;
  completed: boolean;
  notes?: string;
}

// Icon mapping dinámico - EXACTAMENTE IGUAL que CreateHabit
const getIconForHabit = (iconKey: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    books: <PiBooksDuotone key="books" />, 
    read: <LiaBookSolid key="read" />, 
    study: <MdOutlineSchool key="study" />, 
    notebook: <PiNotebookDuotone key="notebook" />,
    gym: <GiWeightLiftingUp key="gym" />, 
    run: <FaRunning key="run" />, 
    stretch: <TbStretching key="stretch" />,
    focus: <FaBrain key="focus" />, 
    goal: <TbTargetArrow key="goal" />, 
    done: <FaCheckCircle key="done" />,
    timer: <MdOutlineTimer key="timer" />, 
    calendar: <FaCalendarCheck key="calendar" />,
    sleep: <FaBed key="sleep" />, 
    water: <FaGlassWater key="water" />, 
    sun: <MdOutlineWbSunny key="sun" />,
    add: <IoMdAddCircleOutline key="add" />,
    default: <PiBooksDuotone key="default" />
  };
  return icons[iconKey] || icons.default;
};

// Color mapping dinámico
const getColorForHabit = (color: string) => {
  return color || '#4ecdc4';
};

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

export const DynamicHabit: React.FC = () => {
  const { habitName } = useParams<{ habitName: string }>();
  const navigate = useNavigate();
  
  // Debug para ver qué llega
  console.log('DynamicHabit - habitName desde URL:', habitName);
  
  // Obtener datos del hábito desde localStorage
  const [habitData, setHabitData] = useState<any>(() => {
    // Decodificar el nombre del hábito desde la URL
    const decodedHabitName = habitName ? decodeURIComponent(habitName) : 'Hábito';
    console.log('DynamicHabit - decodedHabitName:', decodedHabitName);
    
    const stored = localStorage.getItem(`habit_${decodedHabitName}`);
    console.log('DynamicHabit - stored data:', stored);
    
    return stored ? JSON.parse(stored) : {
      name: decodedHabitName,
      color: '#4ecdc4',
      iconKey: 'books',
      description: `🎯 Practico ${decodedHabitName} todos los días para mejorar. Cada día que lo practico me acerca a mis objetivos.`
    };
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [records, setRecords] = useState<HabitRecord[]>([]);
  const [showStats, setShowStats] = useState(false);

  // Guardar datos del hábito cuando cambien
  React.useEffect(() => {
    if (habitName) {
      const decodedHabitName = decodeURIComponent(habitName);
      localStorage.setItem(`habit_${decodedHabitName}`, JSON.stringify(habitData));
    }
  }, [habitData, habitName]);

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
  const habitColor = getColorForHabit(habitData.color);
  const habitIcon = getIconForHabit(habitData.iconKey);

  // Mensajes motivacionales dinámicos
  const getMotivationalMessage = (streak: number) => {
    const habitNameLower = (habitData.name || '').toLowerCase();
    
    if (streak >= 7) {
      return {
        icon: <FaFire className="motivation-icon fire" />,
        title: `🔥 ¡Racha de ${habitData.name} Impresionante!`,
        text: `Llevas ${streak} días seguidos practicando ${habitData.name}. Tu dedicación está dando resultados increíbles.`
      };
    } else if (streak >= 3) {
      return {
        icon: habitIcon,
        title: `💪 ¡Vas Bien con ${habitData.name}!`,
        text: `Llevas ${streak} días seguidos. Sigue así, cada día de ${habitData.name} cuenta.`
      };
    } else {
      return {
        icon: <FaChartLine className="motivation-icon" />,
        title: `🎯 ¡Comienza Hoy con ${habitData.name}!`,
        text: `El primer paso es el más importante. ¡Practica ${habitData.name} hoy y empieza tu racha!`
      };
    }
  };

  const motivationalMessage = getMotivationalMessage(stats.currentStreak);

  return (
    <div className="dynamic-habit-container" style={{ '--habit-color': habitColor } as React.CSSProperties}>
      {/* Header */}
      <div className="habit-header">
        <div className="habit-title">
          <div className="habit-icon-wrapper" style={{ color: habitColor }}>
            {habitIcon}
          </div>
          <h1>{habitData.name || 'Hábito'}</h1>
        </div>
        <p className="habit-description">
          {habitData.description}
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
          {getDayStatus(today) === 'completed' ? `¡Hoy ya ${habitData.name.toLowerCase()}!` : `${habitData.name} hoy`}
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

      {/* Motivational Message */}
      <div className="motivation-section">
        <div className="motivation-card">
          {motivationalMessage.icon}
          <h3>{motivationalMessage.title}</h3>
          <p>{motivationalMessage.text}</p>
        </div>
      </div>
    </div>
  );
};
