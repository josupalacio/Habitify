import React, { useState, useRef, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './ContextMenu.css';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  habitName: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ 
  x, y, onClose, onEdit, onDelete, habitName 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Ajustar posición si el menú sale de la pantalla
  const adjustedX = x + 200 > window.innerWidth ? window.innerWidth - 210 : x;
  const adjustedY = y + 120 > window.innerHeight ? window.innerHeight - 130 : y;

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{ left: adjustedX, top: adjustedY }}
    >
      <div className="context-menu-header">
        <span className="habit-name">{habitName}</span>
      </div>
      <div className="context-menu-item" onClick={onEdit}>
        <FaEdit className="menu-icon" />
        <span>Editar hábito</span>
      </div>
      <div className="context-menu-item danger" onClick={onDelete}>
        <FaTrash className="menu-icon" />
        <span>Eliminar hábito</span>
      </div>
    </div>
  );
};
