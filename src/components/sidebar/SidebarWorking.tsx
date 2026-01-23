import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { PiBooksDuotone } from 'react-icons/pi';
import { GiWeightLiftingUp } from 'react-icons/gi';
import { LiaBookSolid } from 'react-icons/lia';
import { AiOutlineHome, AiOutlineComment } from 'react-icons/ai';
import { FaTasks } from 'react-icons/fa';
import { IoIosTimer } from 'react-icons/io';
import { IoCalendarNumberOutline } from 'react-icons/io5';
import { MdPushPin } from 'react-icons/md';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../context/AuthContext';
import { ManageAccount } from '../../config/firebaseConnect.js';
import CreateHabit from '../createHabit/CreateHabit';
import Swal from 'sweetalert2';
import logoWhite from '../../assets/icon-white-yia.png';
import './Sidebar.css';

interface Habit {
  id: string;
  name: string;
  color: string;
  iconKey: string;
}

// Icon mapping con React Icons
const reactIcons = {
  books: <PiBooksDuotone />,
  read: <LiaBookSolid />,
  study: <PiBooksDuotone />,
  gym: <GiWeightLiftingUp />,
  run: <FaTasks />,
  focus: <AiOutlineHome />,
  done: <FaTasks />,
  timer: <IoIosTimer />,
  calendar: <IoCalendarNumberOutline />,
  sleep: <IoIosTimer />,
  water: <IoIosTimer />,
  sun: <IoIosTimer />,
  default: <PiBooksDuotone />,
};

export const SidebarWorking: React.FC = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const navigate = useNavigate();
  const { isExpanded, setIsExpanded, isPinned, setIsPinned } = useSidebar();
  const { user } = useAuth();
  
  // Estado local para hábitos (vacío - solo fijos)
  const [localHabits, setLocalHabits] = useState<Habit[]>([]);

  // Logout
  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar Sesión?',
      text: 'Se cerrará tu sesión en Habitify',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const account = new ManageAccount();
      const logoutResult = await account.signOut();

      if (logoutResult.success) {
        Swal.fire({
          icon: 'success',
          title: 'Sesión Cerrada',
          text: 'Hasta luego!',
          timer: 1500
        }).then(() => navigate('/'));
      }
    }
  };

  // Función para crear hábito (temporal)
  const handleCreateHabit = async (habitData: any) => {
    try {
      // Simulación de creación
      const newHabit = {
        id: Date.now().toString(),
        name: habitData.name,
        color: habitData.color,
        iconKey: habitData.iconKey || 'books'
      };
      
      setLocalHabits(prev => [newHabit, ...prev]);
      setOpenCreateModal(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Hábito creado',
        text: 'El hábito ha sido creado correctamente',
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el hábito'
      });
    }
  };

  // Streak
  let Streak = 1;

  return (
    <>
      <aside
        className={isExpanded ? "sidebar expanded" : "sidebar collapsed"}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => !isPinned && setIsExpanded(false)}
      >
        <ul>
          <div className="brand-title">
            <img src={logoWhite} />
            <p className="title">GTD</p>
            <span className="pin-container">
              <button className="pin" onClick={() => { setIsPinned(!isPinned); if (!isPinned) setIsExpanded(true); }}>
                <MdPushPin />
              </button>
            </span>
          </div>

          <li className="streak-item">
            <span className="labels">Streak:</span>
            <span className="icons">
              {Streak} day <span className="icons-emoji">{'\u{1F525}'}</span>
            </span>
          </li>

          <button onClick={() => navigate('/dashboard')}>
            <li><span className="icons"><AiOutlineHome /></span><span className="labels">Dashboard</span></li>
          </button>

          <button onClick={() => navigate('/appointments')}>
            <li><span className="icons"><IoCalendarNumberOutline /></span><span className="labels">Appointments</span></li>
          </button>

          <button onClick={() => navigate('/pomodoro')}>
            <li><span className="icons"><IoIosTimer /></span><span className="labels">Pomodoro</span></li>
          </button>

          <button onClick={() => navigate('/checklist')}>
            <li><span className="icons"><FaTasks /></span><span className="labels">Check-Lists</span></li>
          </button>

          <button onClick={() => navigate('/chatbot')}>
            <li><span className="icons"><AiOutlineComment /></span><span className="labels">Chat-Bot</span></li>
          </button>

          {/* HÁBITOS FIJOS */}
          <button className="habits estudiar glossy-habit" onClick={() => navigate('/study-habit')}>
            <li><span className="icons"><PiBooksDuotone /></span><span className="labels">Estudiar</span></li>
          </button>
          <button className="habits gym glossy-habit" onClick={() => navigate('/gym-habit')}>
            <li><span className="icons"><GiWeightLiftingUp /></span><span className="labels">Ir al Gym</span></li>
          </button>
          <button className="habits leer glossy-habit" onClick={() => navigate('/read-habit')}>
            <li><span className="icons"><LiaBookSolid/></span><span className="labels">Leer</span></li>
          </button>

          {/* Render hábitos locales (vacío por ahora) */}
          {localHabits.length === 0 && null}
          {localHabits.map((habit) => (
            <button 
              key={habit.id}
              className="habits custom-habit glossy-habit"
              style={{ '--habit-color': habit.color } as React.CSSProperties}
              onClick={() => navigate('/habit-demo')}
            >
              <li>
                <span className="icons">
                  {reactIcons[habit.iconKey as keyof typeof reactIcons] || reactIcons.default}
                </span>
                <span className="labels">{habit.name}</span>
              </li>
            </button>
          ))}

          {/* Crear hábito */}
          <button onClick={() => setOpenCreateModal(true)}>
            <li><span className="icons"><IoMdAddCircleOutline /></span><span className="labels">Create habit</span></li>
          </button>
        </ul>

        <button className="logout" onClick={handleLogout} title="Cerrar Sesión">
          <li><span className="icons"><BiLogOut /></span><span className="labels">Logout</span></li>
        </button>
      </aside>

      <CreateHabit
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreateHabit={handleCreateHabit}
      />
    </>
  );
};
