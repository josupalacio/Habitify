import React, { useEffect, useRef, useState } from "react";
import "./CreateHabit.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreateHabit: (name: string) => void;
};

const CreateHabit: React.FC<Props> = ({ isOpen, onClose, onCreateHabit }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);

    firstElement.focus();

    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateHabit(name);
    setName("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <h2>Create new habit</h2>
        <button className="btn-close" onClick={onClose}>X</button>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Habit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea placeholder="Description" rows={3}></textarea>

          <select>
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>

          <button type="submit" className="btn-create">Create</button>
        </form>
      </div>
    </div>
  );
};

export default CreateHabit;
