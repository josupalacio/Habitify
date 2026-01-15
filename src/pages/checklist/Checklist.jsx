import React, { useRef, useState, useEffect } from "react";
import "./Checklist.css";
import { AiOutlineLeft, AiOutlineDelete } from "react-icons/ai";

/* ============================
   🔌 BASE DE DATOS (COMENTADO)
   ============================ */
// import { useTasks } from "../../hooks/useTasks.js";

const Checklist = () => {

    /* ============================
       🔌 BASE DE DATOS (COMENTADO)
       ============================ */
    // const { tasks, loading, error, addTask, toggleTask, deleteTask } = useTasks();

    /* ============================
       🧠 ESTADO LOCAL (FUNCIONAL)
       ============================ */
    const [tasks, setTasks] = useState([]);
    const [openCheckedList, setOpenCheckedList] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);

    // Enfocar input al renderizar
    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, [tasks.length]);

    /* ============================
       ➕ AGREGAR TAREA (LOCAL)
       ============================ */
    const handleInputKeyDown = (e) => {
        if (e.key === "Tab" || e.key === "Enter") {
            e.preventDefault();
            const value = inputValue.trim();

            if (!value) return;
            if (tasks.some(t => t.title === value)) return;

            setTasks([
                ...tasks,
                {
                    id: Date.now(),
                    title: value,
                    is_completed: false
                }
            ]);

            setInputValue("");
        }
    };

    /* ============================
       ✅ TOGGLE TAREA (LOCAL)
       ============================ */
    const handleToggleTask = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId
                ? { ...task, is_completed: !task.is_completed }
                : task
        ));
    };

    /* ============================
       🗑️ BORRAR TAREA (LOCAL)
       ============================ */
    const handleDeleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    return (
        <div className="checklist-container">

            <div style={{
                background: '#fbbf24',
                color: '#222',
                padding: '8px',
                fontWeight: 'bold',
                textAlign: 'center'
            }}>
                Checklist page is rendering!
            </div>

            <div className="checklist-header">
                <p className="title">Check-Lists</p>
            </div>

            <div className="card-body">
                <div className="card-header">
                    <p className="title">Add your tasks</p>
                </div>

                {/* ============================
                   📋 TAREAS NO COMPLETADAS
                   ============================ */}
                {tasks.filter(task => !task.is_completed).map(task => (
                    <div key={task.id} className="checkbox-container hoverable-task">
                        <input
                            type="checkbox"
                            checked={false}
                            onChange={() => handleToggleTask(task.id)}
                        />
                        <label>{task.title}</label>
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
                        {tasks.filter(task => task.is_completed).map(task => (
                            <div key={task.id} className="checkbox-container hoverable-task fade-in">
                                <input
                                    type="checkbox"
                                    checked
                                    onChange={() => handleToggleTask(task.id)}
                                />
                                <label className="completed">{task.title}</label>
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
