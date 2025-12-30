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

  // Sidebar elements


  // Store habits
  const [sidebarItems, setSidebarItems] = useState<
    Record<string, SidebarItem>
  >({});

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
      <aside>
        <ul>
          <div className="brand-title">
            <img src={logoWhite} />
            <p className="title">Habitify</p>
          </div>


          <li className="streak-item">
            <span className="labels">Streak:</span>
            <span className="icons">
              {Streak} day{' '}
              <span className="icons-emoji">{'\u{1F525}'}</span>
            </span>
          </li>


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


          {/* Render created habits */}
          {Object.entries(sidebarItems).map(([key, item]) => (
            <button key={key}>
              <li>
                <span className="icons">{item.icon}</span>
                <span className="labels">{item.label}</span>
              </li>
            </button>
          ))}
        </ul>
        <hr />
        <button>
          <li>
            <span className="icons"><FaRegUserCircle /></span>
            <span className="labels">username</span>
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
