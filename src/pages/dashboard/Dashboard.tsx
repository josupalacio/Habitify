import { useNavigate } from 'react-router-dom';
import { IoIosTimer } from 'react-icons/io';
import { FaTasks, FaFire, FaCheckCircle } from 'react-icons/fa';
import { AiOutlineComment, AiOutlineCalendar } from 'react-icons/ai';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  // Mock data - in a real app, this would come from state management or API
  const stats = {
    streak: 7,
    tasksCompleted: 12,
    habitsToday: 3,
    upcomingAppointments: 2
  };

  const quickActions = [
    { icon: <IoIosTimer />, label: 'Pomodoro', path: '/pomodoro' },
    { icon: <FaTasks />, label: 'Check-Lists', path: '/checklist' },
    { icon: <AiOutlineComment />, label: 'Chat-Bot', path: '/chatbot' },
    { icon: <AiOutlineCalendar />, label: 'Appointments', path: '/appointments' }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">¡Bienvenido de vuelta!</h1>
        <p className="dashboard-subtitle">¿Qué vamos a lograr hoy?</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.streak}</div>
          <p className="stat-label">Días de racha <FaFire style={{color: '#ff6b35'}} /></p>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.tasksCompleted}</div>
          <p className="stat-label">Tareas completadas <FaCheckCircle style={{color: '#4aec8c'}} /></p>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.habitsToday}</div>
          <p className="stat-label">Hábitos para hoy</p>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.upcomingAppointments}</div>
          <p className="stat-label">Citas próximas</p>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="dashboard-grid">
        {/* Pomodoro Status */}
        <div className="dashboard-card">
          <div className="card-header">
            <span className="card-icon"><IoIosTimer /></span>
            <h3 className="card-title">Sesión Pomodoro</h3>
          </div>
          <div className="card-content">
            <p>Estado: Listo para comenzar</p>
            <p>Próxima sesión: 25 minutos de trabajo</p>
          </div>
          <button className="card-action" onClick={() => navigate('/pomodoro')}>
            Iniciar Sesión
          </button>
        </div>

        {/* Tasks Overview */}
        <div className="dashboard-card">
          <div className="card-header">
            <span className="card-icon"><FaTasks /></span>
            <h3 className="card-title">Tareas Pendientes</h3>
          </div>
          <div className="card-content">
            <p>Tienes 5 tareas pendientes para hoy</p>
            <p>3 completadas esta semana</p>
          </div>
          <button className="card-action" onClick={() => navigate('/checklist')}>
            Ver Lista
          </button>
        </div>

        {/* AI Assistant */}
        <div className="dashboard-card">
          <div className="card-header">
            <span className="card-icon"><AiOutlineComment /></span>
            <h3 className="card-title">Asistente IA</h3>
          </div>
          <div className="card-content">
            <p>¿Necesitas ayuda con tus hábitos?</p>
            <p>Tu asistente está listo para ayudarte</p>
          </div>
          <button className="card-action" onClick={() => navigate('/chatbot')}>
            Chatear Ahora
          </button>
        </div>

        {/* Appointments */}
        <div className="dashboard-card">
          <div className="card-header">
            <span className="card-icon"><AiOutlineCalendar /></span>
            <h3 className="card-title">Próximas Citas</h3>
          </div>
          <div className="card-content">
            <p>Reunión de equipo - Mañana 10:00 AM</p>
            <p>Doctor - Viernes 2:00 PM</p>
          </div>
          <button className="card-action" onClick={() => navigate('/appointments')}>
            Ver Calendario
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3 className="quick-actions-title">Acceso Rápido</h3>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="action-button"
              onClick={() => navigate(action.path)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-label">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;