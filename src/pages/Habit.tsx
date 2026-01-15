import './Habit.css';
import { useHabits } from '../hooks/useHabits.js';
import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

const Habit = () => {
    const { habits, loading, error, addHabit, completeHabit, deleteHabit } = useHabits();
    const [inputValue, setInputValue] = useState("");
    const [showForm, setShowForm] = useState(false);

    const handleAddHabit = async () => {
        if (inputValue.trim()) {
            try {
                await addHabit({
                    title: inputValue,
                    description: '',
                    frequency: 'daily'
                });
                setInputValue("");
                setShowForm(false);
            } catch (err) {
                console.error('Error adding habit:', err);
            }
        }
    };

    const handleCompleteHabit = async (habitId: string) => {
        try {
            await completeHabit(habitId);
        } catch (err) {
            console.error('Error completing habit:', err);
        }
    };

    const handleDeleteHabit = async (habitId: string) => {
        try {
            await deleteHabit(habitId);
        } catch (err) {
            console.error('Error deleting habit:', err);
        }
    };

    return (
        <div className="habit-container">
            <div className="habit-header">
                <h1 className="habit-title">Habits</h1>
            </div>
            <div className="habit-body">
                {loading ? (
                    <p className="habit-content">Cargando hábitos...</p>
                ) : error ? (
                    <p className="habit-content">Error: {error}</p>
                ) : (
                    <>
                        <button 
                            onClick={() => setShowForm(!showForm)}
                            style={{
                                marginBottom: '1.5rem',
                                padding: '0.75rem 1.5rem',
                                backgroundColor: '#374151',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                cursor: 'pointer'
                            }}
                        >
                            {showForm ? 'Cancel' : '+ Add Habit'}
                        </button>

                        {showForm && (
                            <div style={{
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                backgroundColor: '#374151',
                                borderRadius: '0.5rem'
                            }}>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Enter habit name..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddHabit();
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: '0.5rem',
                                        border: 'none',
                                        marginBottom: '0.75rem'
                                    }}
                                />
                                <button
                                    onClick={handleAddHabit}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Save Habit
                                </button>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            {habits.map(habit => (
                                <div 
                                    key={habit.id}
                                    style={{
                                        padding: '1.5rem',
                                        backgroundColor: '#374151',
                                        borderRadius: '0.75rem',
                                        border: '1px solid #4b5563'
                                    }}
                                >
                                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{habit.title}</h3>
                                    <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                                        Streak: {habit.streak_count}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleCompleteHabit(habit.id)}
                                            style={{
                                                flex: 1,
                                                padding: '0.5rem',
                                                backgroundColor: '#10b981',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            ✓ Done
                                        </button>
                                        <button
                                            onClick={() => handleDeleteHabit(habit.id)}
                                            style={{
                                                padding: '0.5rem 0.75rem',
                                                backgroundColor: '#ef4444',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '0.5rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <AiOutlineDelete />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {habits.length === 0 && !showForm && (
                            <p className="habit-content">Welcome to your habits page. Here you can manage your daily habits.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Habit;