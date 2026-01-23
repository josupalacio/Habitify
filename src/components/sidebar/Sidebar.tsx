import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import logoWhite from "../../assets/icon-white-yia.png";
import { IoMdAddCircleOutline } from "react-icons/io";
import { AiOutlineHome, AiOutlineComment } from "react-icons/ai";
import { FaTasks } from "react-icons/fa";
import { PiBooksDuotone, PiNotebookDuotone } from "react-icons/pi";
import { GiWeightLiftingUp } from "react-icons/gi";
import { LiaBookSolid } from "react-icons/lia";
import { IoIosTimer } from "react-icons/io";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { MdPushPin, MdOutlineSchool, MdOutlineTimer, MdOutlineWbSunny } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { FaBrain, FaBed, FaGlassWater, FaCalendarCheck } from "react-icons/fa6";
import { FaRunning, FaCheckCircle, FaTrash } from "react-icons/fa";
import { TbStretching, TbTargetArrow } from "react-icons/tb";
import Swal from 'sweetalert2';

import { useSidebar } from "../../contexts/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import { ManageAccount } from "../../config/firebaseConnect.js";

// Components
import CreateHabit from "../createHabit/CreateHabit";

// Icon mapping para hábitos dinámicos
const reactIcons: Record<string, React.ReactNode> = {
  books: <PiBooksDuotone />,
  read: <LiaBookSolid />,
  study: <MdOutlineSchool />,
  notebook: <PiNotebookDuotone />,
  gym: <GiWeightLiftingUp />,
  run: <FaRunning />,
  stretch: <TbStretching />,
  focus: <FaBrain />,
  goal: <TbTargetArrow />,
  done: <FaCheckCircle />,
  timer: <MdOutlineTimer />,
  calendar: <FaCalendarCheck />,
  sleep: <FaBed />,
  water: <FaGlassWater />,
  sun: <MdOutlineWbSunny />,
};

type SidebarItem = {
  label: string;
  icon: React.ReactNode;
  color?: string;
  description?: string;
  frequency?: string;
  time?: string;
  path?: string;
  isGlossy?: boolean;
  sort_order?: number;
};

export const Sidebar: React.FC = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const navigate = useNavigate();
  const { isExpanded, setIsExpanded, isPinned, setIsPinned } = useSidebar();
  const { user, userData } = useAuth();

  const [sidebarItems, setSidebarItems] = useState<Record<string, SidebarItem>>({});

  // Ordenar hábitos: el más nuevo primero (como platos apilados)
  const sortedHabits = Object.entries(sidebarItems).sort(([keyA, itemA], [keyB, itemB]) => {
    // Si tienen sort_order, usar ese criterio
    if (itemA.sort_order !== undefined && itemB.sort_order !== undefined) {
      return itemB.sort_order - itemA.sort_order;
    }
    // Si no, por timestamp (key es UUID, mayor = más nuevo)
    return keyB.localeCompare(keyA);
  });

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

  // Función para agregar hábito
  const addHabitToSidebar = (
    name: string,
    color: string,
    isGlossy: boolean,
    description: string,
    frequency: string,
    time: string,
    iconKey: string
  ) => {
    const id = crypto.randomUUID();
    const timestamp = Date.now();
    setSidebarItems(prev => {
      const newItems = {
        ...prev,
        [id]: {
          label: name,
          icon: reactIcons[iconKey],
          color,
          description,
          frequency,
          time,
          isGlossy,
          sort_order: timestamp
        },
      };
      return newItems;
    });
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
          <button className="habits estudiar glossy-habit">
            <li><span className="icons"><PiBooksDuotone /></span><span className="labels">Estudiar</span></li>
          </button>
          <button className="habits gym glossy-habit">
            <li><span className="icons"><GiWeightLiftingUp /></span><span className="labels">Ir al Gym</span></li>
          </button>
          <button className="habits leer glossy-habit">
            <li><span className="icons"><LiaBookSolid/></span><span className="labels">Leer</span></li>
          </button>

          {/* Render hábitos creados - VAN ANTES DEL BOTÓN CREATE HABIT */}
          {sortedHabits.map(([key, item]) => (
            <button 
              key={key} 
              className={`habits custom-habit ${item.isGlossy ? 'glossy-habit' : ''}`}
              style={{ '--habit-color': item.color } as React.CSSProperties}
            >
              <li>
                <span className="icons">{item.icon}</span>
                <span className="labels">{item.label}</span>
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
        onCreateHabit={addHabitToSidebar}
      />
    </>
  );
};

export default Sidebar;
