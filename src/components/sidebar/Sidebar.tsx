import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import logoWhite from "../../assets/icon-white-yia.png";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
  AiOutlineLeft,
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineComment,
} from "react-icons/ai";
import {
  FaTasks,
  FaRegUserCircle
} from "react-icons/fa";
import {
  PiUsersFour,
} from "react-icons/pi";
import {
  IoIosTimer, // icono del timer
} from "react-icons/io";
import {
  TiMessages,
} from "react-icons/ti"
import { MdPushPin } from "react-icons/md";
import { IoHomeOutline, IoCalendarNumberOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { useSidebar } from "../../contexts/SidebarContext";
import { useAuth } from "../../context/AuthContext";
import { ManageAccount } from "../../config/firebaseConnect.js";
import Swal from 'sweetalert2';

// Types
type SidebarItem = {
  label: string;
  icon: React.ReactElement;
  path?: string;
};

// Components
import CreateHabit from "../createHabit/CreateHabit";

export const SideBar: React.FC = () => {
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const navigate = useNavigate();
  const { isExpanded, setIsExpanded, isPinned, setIsPinned } = useSidebar();
  const { user, userData } = useAuth();

  // Store habits
  const [sidebarItems, setSidebarItems] = useState<
    Record<string, SidebarItem>
  >({});

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
        }).then(() => {
          navigate('/');
        });
      }
    }
  };

  // Function to add a new habit to sidebar
  const addHabitToSidebar = (name: string) => {
    const id = crypto.randomUUID();

    setSidebarItems((prev) => ({
      ...prev,
      [id]: {
        label: name,
        icon: <IoMdAddCircleOutline />,
        path: "",
      },
    }));
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
            <p className="title">Habitify</p>
            
            <span className="pin-container">
              <button 
                className="pin"
                onClick={() => {
                  setIsPinned(!isPinned);
                  if (!isPinned) setIsExpanded(true);
                }}
              >
                <MdPushPin/>
              </button>
            </span>
          </div>


          <li className="streak-item">
            <span className="labels">Streak:</span>
            <span className="icons">
              {Streak} day{' '}
              <span className="icons-emoji">{'\u{1F525}'}</span>
            </span>
          </li>

          <button onClick={() => navigate('/dashboard')}>
            <li>
              <span className="icons"><AiOutlineHome /></span>
              <span className="labels">Dashboard</span>
            </li>
          </button>

          <button onClick={() => navigate('/appointments')}>
            <li>
              <span className="icons"><IoCalendarNumberOutline /></span>
              <span className="labels">Appointments</span>
            </li>
          </button>

          <button onClick={() => navigate('/pomodoro')}>
            <li>
              <span className="icons"><IoIosTimer /></span>
              <span className="labels">Pomodoro</span>
            </li>
          </button>

          <button onClick={() => navigate('/checklist')}>
            <li>
              <span className="icons"><FaTasks /></span>
              <span className="labels">Check-Lists</span>
            </li>
          </button>
          <button onClick={() => navigate('/chatbot')}>
            <li>
              <span className="icons"><AiOutlineComment /></span>
              <span className="labels">Chat-Bot</span>
            </li>
          </button>

          {/* Create habit button */}
          <button onClick={() => setOpenCreateModal(true)}>
            <li>
              <span className="icons"><IoMdAddCircleOutline /></span>
              <span className="labels">Create habit</span>
            </li>
          </button>


          {/* Render created habits with navigation if path is set */}
          {Object.entries(sidebarItems).map(([key, item]) => (
            <button
              key={key}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                } else {
                  // Puedes mostrar un modal, toast, o simplemente no hacer nada
                }
              }}
            >
              <li>
                <span className="icons">{item.icon}</span>
                <span className="labels">{item.label}</span>
              </li>
            </button>
          ))}
        </ul>
        <button onClick={handleLogout} title="Cerrar Sesión">
          <li>
            <span className="icons"><BiLogOut /></span>
            <span className="labels">Logout</span>
          </li>
        </button>
        <br />
      </aside>

      <CreateHabit
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onCreateHabit={addHabitToSidebar}
      />
    </>
  );
};

export default SideBar;
