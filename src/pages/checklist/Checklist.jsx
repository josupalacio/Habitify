import React, { useRef, useState, useEffect } from "react";
import "./Checklist.css";
import { AiOutlineLeft, AiOutlineDelete } from "react-icons/ai";
import { useChecklist } from "../../hooks/useChecklist.js";

const Checklist = () => {
    const { tasks, loading, error, addTask, toggleTask, deleteTask } = useChecklist();
    const [openCheckedList, setOpenCheckedList] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);

    // Debug: Mostrar información en consola
    useEffect(() => {
        console.log('📋 Checklist State:', { 
            tasksCount: tasks.length, 
            loading, 
            error,
            tasks: tasks 
        });
    }, [tasks, loading, error]);

    // Enfocar input al renderizar
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, [tasks.length]);

    /* ============================
       ➕ AGREGAR TAREA
       ============================ */
    const handleInputKeyDown = async (e) => {
        if (e.key === "Tab" || e.key === "Enter") {
            e.preventDefault();
            const value = inputValue.trim();

            if (!value) return;
            if (tasks.some(t => t.task_name === value)) return;

            try {
                await addTask(value);
                setInputValue("");
            } catch (err) {
                console.error('Error adding task:', err);
            }
        }
    };

    /* ============================
       ✅ TOGGLE TAREA
       ============================ */
    const handleToggleTask = async (taskId) => {
        try {
            await toggleTask(taskId);
        } catch (err) {
            console.error('Error toggling task:', err);
        }
    };

    /* ============================
       🗑️ BORRAR TAREA
       ============================ */
    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    if (loading) {
        return (
            <div className="checklist-container">
                <div style={{ textAlign: 'center', padding: '2rem', color: '#e5e7eb' }}>
                    Loading...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="checklist-container">
                <div className="checklist-header">
                    <p className="title">Check-Lists</p>
                </div>
                <div style={{ textAlign: 'center', padding: '2rem', color: '#ef4444' }}>
                    Error: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="checklist-container">
            <div className="checklist-header">
                <p className="title">Check-Lists</p>
            </div>

            <div className="card-body">
                <div className="card-header">
                    <p className="title">Add your tasks</p>
                </div>

                {/* Debug info - remover en producción */}
                {import.meta.env.DEV && (
                    <div style={{ 
                        padding: '0.5rem', 
                        margin: '0.5rem 0', 
                        background: '#1f2937', 
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        color: '#9ca3af'
                    }}>
                        {tasks.length} tareas totales | {tasks.filter(t => !t.completed).length} pendientes | {tasks.filter(t => t.completed).length} completadas
                    </div>
                )}

                {/* ============================
                   📋 TAREAS NO COMPLETADAS
                   ============================ */}
                {tasks.length === 0 && !loading && (
                    <div style={{ 
                        padding: '1rem', 
                        textAlign: 'center', 
                        color: '#9ca3af',
                        fontSize: '0.875rem'
                    }}>
                        No hay tareas. Agrega una escribiendo y presionando Enter.
                    </div>
                )}
                {tasks.filter(task => !task.completed).map(task => (
                    <div key={task.id} className="checkbox-container hoverable-task">
                        <input
                            type="checkbox"
                            checked={task.completed || false}
                            onChange={() => handleToggleTask(task.id)}
                        />
                        <label>{task.task_name}</label>
                        <button
                            className="delete-button"
                            onClick={() => handleDeleteTask(task.id)}
                        >
                            <AiOutlineDelete />
                        </button>
                    </div>
                ))}

                {/* ============================
                   ✍️ INPUT NUEVA TAREA
                   ============================ */}
                <div className="checkbox-container">
                    <input type="checkbox" disabled />
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Write a task here"
                        style={{
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            marginLeft: "0.5rem",
                            width: "100%",
                            color: inputValue ? "#343434" : "#ccc",
                            fontSize: "0.8rem"
                        }}
                    />
                </div>

                {/* ============================
                   📦 TAREAS COMPLETADAS
                   ============================ */}
                <div className="list-container">
                    <div className="action-tab">
                        <label>Tasks done</label>
                        <button
                            className={`Sidebarbutton${openCheckedList ? " open" : ""}`}
                            onClick={() => setOpenCheckedList(!openCheckedList)}
                        >
                            <AiOutlineLeft />
                        </button>
                    </div>

                    <div className={`checked-list-wrapper ${openCheckedList ? "open" : ""}`}>
                        {tasks.filter(task => task.completed).map(task => (
                            <div key={task.id} className="checkbox-container hoverable-task fade-in">
                                <input
                                    type="checkbox"
                                    checked={task.completed || true}
                                    onChange={() => handleToggleTask(task.id)}
                                />
                                <label className="completed">{task.task_name}</label>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDeleteTask(task.id)}
                                >
                                    <AiOutlineDelete />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checklist;
