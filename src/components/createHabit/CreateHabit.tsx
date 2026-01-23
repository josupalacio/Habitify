import React, { useEffect, useRef, useState } from "react";
import "./CreateHabit.css";

// Phosphor Icons
import { PiBooksDuotone, PiNotebookDuotone } from "react-icons/pi";

// Line Awesome
import { LiaBookSolid } from "react-icons/lia";

// Material Design Icons
import { MdOutlineSchool, MdOutlineTimer, MdOutlineWbSunny } from "react-icons/md";

// Game Icons
import { GiWeightLiftingUp } from "react-icons/gi";

// Font Awesome 6 (Versión moderna - donde vive FaGlassWater)
import { 
  FaBrain, 
  FaBed, 
  FaGlassWater 
} from "react-icons/fa6";

// Font Awesome (Versión estándar)
import { 
  FaCalendarCheck,
  FaRunning,
  FaCheckCircle
} from "react-icons/fa";

// Tabler Icons
import { TbStretching, TbTargetArrow } from "react-icons/tb";

// Ionicons
import { IoMdAddCircleOutline } from "react-icons/io";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreateHabit: (habitData: {
    name: string;
    color: string;
    isGlossy: boolean;
    description: string;
    frequency: string;
    time: string;
    iconKey: string;
  }) => void;
};

const CreateHabit: React.FC<Props> = ({ isOpen, onClose, onCreateHabit }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#fbbf24");
  const [isGlossy, setIsGlossy] = useState(false);
  const [frequency, setFrequency] = useState("Daily");
  const [time, setTime] = useState("All day");
  const [showIconList, setShowIconList] = useState(false);
  const [selectedIconKey, setSelectedIconKey] = useState("books");

  // Icon mapping SIN keys para evitar conflictos de React
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
    add: <IoMdAddCircleOutline />,
  };

  const suggestedColors = [
    { name: "Estudiar", hex: "#8B5CF6" },
    { name: "Leer", hex: "#38BDF8" },
    { name: "Gym", hex: "#22C55E" },
    { name: "Productividad", hex: "#FACC15" },
    { name: "Mindfulness", hex: "#FB7185" },
    { name: "Trabajo", hex: "#64748B" },
    { name: "Salud", hex: "#10B981" },
    { name: "Estudio Pro", hex: "#6366F1" },
    { name: "Rutina", hex: "#F97316" },
    { name: "Violeta Soft", hex: "#A78BFA" },
    { name: "Cyan Soft", hex: "#67E8F9" },
    { name: "Lime Soft", hex: "#A3E635" },
    { name: "Rose Soft", hex: "#FDA4AF" },
    { name: "Ocean", hex: "#0EA5E9" },
    { name: "Lavender", hex: "#C4B5FD" },
    { name: "Coral", hex: "#FB923C" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    console.log('Creando hábito con iconKey:', selectedIconKey); // Debug
    console.log('Icono final:', reactIcons[selectedIconKey]); // Debug del icono real
    onCreateHabit({ 
      name, 
      color, 
      isGlossy, 
      description, 
      frequency, 
      time, 
      iconKey: selectedIconKey 
    });
    setName(""); setDescription(""); setSelectedIconKey("books"); setShowIconList(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) setShowIconList(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" ref={modalRef} onClick={e => e.stopPropagation()}>
        <h2>Create new habit</h2>
        <button className="btn-close" onClick={onClose}>X</button>
        <form onSubmit={handleSubmit}>
          <div className="style-box">
            <input type="text" placeholder="Habit name" value={name} onChange={e => setName(e.target.value)} />
            <p>icon</p>
            <div className="icon-selector-container">
              <button type="button" className="icon-picker" onClick={() => setShowIconList(!showIconList)}>
                {reactIcons[selectedIconKey]}
              </button>
              {showIconList && (
                <div className="icon-dropdown">
                  {Object.entries(reactIcons).map(([key, icon]) => (
                    <div 
                      key={key} // Key simple sin forceUpdate
                      className={`icon-option ${selectedIconKey === key ? 'active' : ''}`} 
                      onClick={() => { 
                        console.log('Icono seleccionado:', key); // Debug simple
                        setSelectedIconKey(key); 
                        setShowIconList(false); 
                      }}
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="style-box">
            <div className="suggested-palette">
              {suggestedColors.map(c => (
                <div key={c.hex} className={`color-circle ${color === c.hex ? "active" : ""}`} style={{ backgroundColor: c.hex }} onClick={() => setColor(c.hex)} />
              ))}
            </div>
          </div>

          <div className="style-box">
            <p>Glossy effect</p>
            <input type="checkbox" checked={isGlossy} onChange={e => setIsGlossy(e.target.checked)} />
          </div>

          <textarea placeholder="Description" rows={3} value={description} onChange={e => setDescription(e.target.value)}></textarea>

          <select value={frequency} onChange={e => setFrequency(e.target.value)}>
            <option>Daily</option><option>Weekly</option><option>Monthly</option>
          </select>

          <select value={time} onChange={e => setTime(e.target.value)}>
            <option>All day</option><option>In the morning</option><option>In the evening</option>
          </select>

          <button type="submit" className="btn-create">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateHabit;
