import React, { useState, useRef } from "react";
import "./Checklist.css";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineDelete } from "react-icons/ai";

const Checklist = () => {
    const [tasks, setTasks] = useState([]);
    const [checkedList, setCheckedList] = useState([]);
    const [openCheckedList, setOpenCheckedList] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef(null);

    // Cuando el componente se monta, enfoca el input
    React.useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, [tasks.length]);

    const handleInputKeyDown = (e) => {
        if (e.key === "Tab" || e.key === "Enter") {
            e.preventDefault();
            const value = inputValue.trim();
            if (value && !tasks.includes(value)) {
                setTasks([...tasks, value]);
                setInputValue("");
            }
        }
    };

    const handleSelect = (event) => {
        const value = event.target.value;
        const isChecked = event.target.checked;
        if (isChecked) {
            setCheckedList([...checkedList, value]);
        } else {
            setCheckedList(checkedList.filter(item => item !== value));
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
                    {/* Lista de tareas no seleccionadas, la más nueva arriba */}
                    {tasks.filter(task => !checkedList.includes(task)).map((task, idx) => {
                        return (
                            <div key={idx} className="checkbox-container hoverable-task">
                                <input
                                    type="checkbox"
                                    value={task}
                                    checked={false}
                                    onChange={handleSelect}
                                />
                                <label>{task}</label>
                                <button
                                    className="delete-button"
                                    onClick={() => setTasks(tasks.filter(t => t !== task))}>
                                    <AiOutlineDelete />
                                </button>
                            </div>
                        );
                    })}
                    {/* Input para nueva tarea, siempre al final */}
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
                        {checkedList.map((task, idx) => {
                            return (
                                <div className="checkbox-container hoverable-task fade-in" key={idx}>
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        value={task}
                                        onChange={handleSelect}
                                    />
                                    <label className="completed">{task}</label>
                                    <button
                                        className="delete-button"
                                        onClick={() => {
                                            setCheckedList(checkedList.filter(t => t !== task));
                                            setTasks(tasks.filter(t => t !== task));
                                        }}>
                                        <AiOutlineDelete />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Checklist;