import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './EditHabit.css';

interface EditHabitProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateHabit: (habitData: any) => void;
  habit: any;
}

const reactIcons = {
  books: '📚',
  read: '📖',
  study: '🎓',
  gym: '💪',
  run: '🏃',
  focus: '🧠',
  done: '✅',
  timer: '⏰',
  calendar: '📅',
  sleep: '😴',
  water: '💧',
  sun: '☀️',
};

const suggestedColors = [
  { hex: '#FF6B6B', name: 'Rojo coral' },
  { hex: '#4ECDC4', name: 'Turquesa' },
  { hex: '#45B7D1', name: 'Azul cielo' },
  { hex: '#96CEB4', name: 'Verde menta' },
  { hex: '#FFEAA7', name: 'Amarillo pastel' },
  { hex: '#DDA0DD', name: 'Lavanda' },
  { hex: '#98D8C8', name: 'Menta' },
  { hex: '#F7DC6F', name: 'Dorado' },
  { hex: '#BB8FCE', name: 'Orquídea' },
  { hex: '#85C1E2', name: 'Azul claro' },
];

export const EditHabit: React.FC<EditHabitProps> = ({ isOpen, onClose, onUpdateHabit, habit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#000000');
  const [isGlossy, setIsGlossy] = useState(false);
  const [frequency, setFrequency] = useState('Daily');
  const [time, setTime] = useState('All day');
  const [iconKey, setIconKey] = useState('books');

  useEffect(() => {
    if (habit) {
      setName(habit.name || '');
      setDescription(habit.description || '');
      setColor(habit.color || '#000000');
      setIsGlossy(habit.is_glossy || false);
      setFrequency(habit.frequency || 'Daily');
      setTime(habit.time_preference || 'All day');
      setIconKey(habit.icon_key || 'books');
    }
  }, [habit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo requerido',
        text: 'El nombre del hábito es obligatorio'
      });
      return;
    }

    const habitData = {
      name,
      description,
      color,
      isGlossy,
      frequency,
      time,
      iconKey
    };

    onUpdateHabit(habitData);
  };

  if (!isOpen) return null;

  return (
    <div className="edit-habit-overlay">
      <div className="edit-habit-modal">
        <div className="edit-habit-header">
          <h2>Editar Hábito</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="edit-habit-form">
          <div className="form-group">
            <label>Nombre del hábito:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Leer 30 minutos"
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe tu hábito..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Icono:</label>
            <div className="icon-selector">
              {Object.entries(reactIcons).map(([key, emoji]) => (
                <button
                  key={key}
                  type="button"
                  className={`icon-option ${iconKey === key ? 'selected' : ''}`}
                  onClick={() => setIconKey(key)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Color:</label>
            <div className="color-selector">
              <div className="suggested-palette">
                {suggestedColors.map(c => (
                  <div 
                    key={c.hex} 
                    className={`color-circle ${color === c.hex ? "active" : ""}`} 
                    style={{ backgroundColor: c.hex }} 
                    onClick={() => setColor(c.hex)}
                    title={c.name}
                  />
                ))}
              </div>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="color-picker"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Frecuencia:</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
              <option value="Daily">Diario</option>
              <option value="Weekly">Semanal</option>
              <option value="Monthly">Mensual</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preferencia de tiempo:</label>
            <select value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="All day">Todo el día</option>
              <option value="In the morning">Por la mañana</option>
              <option value="In the evening">Por la tarde</option>
            </select>
          </div>

          <div className="form-group">
            <label>Efecto Glossy:</label>
            <div className="checkbox-wrapper">
              <input 
                type="checkbox" 
                checked={isGlossy} 
                onChange={(e) => setIsGlossy(e.target.checked)} 
              />
              <span className="checkbox-label">Aplicar efecto brillante</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-update">
              Actualizar Hábito
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
