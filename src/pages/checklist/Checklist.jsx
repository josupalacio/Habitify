import React, { useRef } from "react";
import "./Checklist.css";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";
import { useTasks } from "../../hooks/useTasks.js";

const Checklist = () => {
    const { tasks, loading, error, addTask, toggleTask, deleteTask } = useTasks();
    const [openCheckedList, setOpenCheckedList] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = useRef(null);

    // Cuando el componente se monta, enfoca el input
    React.useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, [tasks.length]);

    const handleInputKeyDown = async (e) => {
        if (e.key === "Tab" || e.key === "Enter") {
            e.preventDefault();
            const value = inputValue.trim();
            if (value && !tasks.some(t => t.title === value)) {
                try {
                    await addTask(value);
                    setInputValue("");
                } catch (err) {
                    console.error('Error adding task:', err);
                }
            }
        }
    };

    const handleToggleTask = async (taskId, isCompleted) => {
        try {
            await toggleTask(taskId, isCompleted);
        } catch (err) {
            console.error('Error toggling task:', err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteTask(taskId);
        } catch (err) {
            console.error('Error deleting task:', err);
        }
    };

    return (
        <div className="checklist-container">
            <div className="checklist-header">
                <p className="title">Check-Lists</p>
            </div>
            <div className="card-body">
                <div className="card-header">
                    <p className="title">Add your tasks</p>
                </div>
                {loading ? (
                    <div style={{ padding: '1rem', color: '#9ca3af' }}>Cargando tareas...</div>
                ) : error ? (
                    <div style={{ padding: '1rem', color: '#ef4444' }}>Error: {error}</div>
                ) : (
                    <>
                        {/* Lista de tareas no completadas */}
                        {tasks.filter(task => !task.is_completed).map((task) => {
                            return (
                                <div key={task.id} className="checkbox-container hoverable-task">
                                    <input
                                        type="checkbox"
                                        value={task.id}
                                        checked={false}
                                        onChange={() => handleToggleTask(task.id, task.is_completed)}
                                    />
                                    <label>{task.title}</label>
                                    <button
                                        className="delete-button"
                                        onClick={() => handleDeleteTask(task.id)}>
                                        <AiOutlineDelete />
                                    </button>
                                </div>
                            );
                        })}
                        {/* Input para nueva tarea */}
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                disabled
                                style={{
                                    accentColor: "#ccc",
                                    cursor: "not-allowed"
                                }}
                            />
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                placeholder="Write a task here"
                                style={{
                                    fontStyle: "normal",
                                    color: inputValue ? "#343434" : "#ccc",
                                    fontSize: "0.8rem",
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    marginLeft: "0.5rem",
                                    width: "100%"
                                }}
                            />
                        </div>
                        <div className="list-container">
                            <div className="action-tab">
                                <label>Tasks done</label>
                                <div className="card" style={{ position: "relative" }}></div>
                                <button
                                    className={`Sidebarbutton${openCheckedList ? " open" : ""}`}
                                    onClick={() => setOpenCheckedList(!openCheckedList)}
                                >
                                    <AiOutlineLeft />
                                </button>
                            </div>
                            <div
                                className={`checked-list-wrapper ${openCheckedList ? "open" : ""}`}
                            >
                                {tasks.filter(task => task.is_completed).map((task) => {
                                    return (
                                        <div className="checkbox-container hoverable-task fade-in" key={task.id}>
                                            <input
                                                type="checkbox"
                                                checked={true}
                                                value={task.id}
                                                onChange={() => handleToggleTask(task.id, task.is_completed)}
                                            />
                                            <label className="completed">{task.title}</label>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDeleteTask(task.id)}>
                                                <AiOutlineDelete />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

};

export default Checklist;