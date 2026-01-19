import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./Appointments.css"
import { useAppointments } from '../../hooks/useAppointments.js';

interface Appointment {
  id: string;
  date: string;
  time: string;
  description: string;
  status: 'TODO' | 'InProgress' | 'Completed';
  priority: 'High' | 'Medium' | 'Normal';
}

const Appointments: React.FC = () => {
  const { appointments, loading, error, addAppointment, updateAppointment, deleteAppointment } = useAppointments();

  // Type assertion to fix 'never' errors from useAppointments hook
  const typedAppointments = appointments as Appointment[];

  const [showForm, setShowForm] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [newAppointment, setNewAppointment] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    description: '',
    status: 'TODO' as const,
    priority: 'Normal' as const,
  });

  const handleAddAppointment = async () => {
  if (newAppointment.date && newAppointment.time && newAppointment.description) {
    try {
      await addAppointment({
        id: crypto.randomUUID(),
        ...newAppointment,
      });
      setNewAppointment({
        date: new Date().toISOString().split('T')[0],
        time: '',
        description: '',
        status: 'TODO',
        priority: 'Normal',
      });
      setShowForm(false);
    } catch (err) {
      console.error('Error adding appointment:', err);
    }
  }
};


  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id);
    } catch (err) {
      console.error('Error deleting appointment:', err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'TODO' | 'InProgress' | 'Completed') => {
    try {
      await updateAppointment(id, { status: newStatus });
    } catch (err) {
      console.error('Error updating appointment:', err);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItem(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: 'TODO' | 'InProgress' | 'Completed') => {
    e.preventDefault();
    if (draggedItem) {
      handleStatusChange(draggedItem, status);
      setDraggedItem(null);
    }
  };

  const countByStatus = (status: string) => typedAppointments.filter(app => app.status === status).length;

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Normal': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getTodoAppointments = () => typedAppointments.filter(app => app.status === 'TODO');
  const getInProgressAppointments = () => typedAppointments.filter(app => app.status === 'InProgress');
  const getCompletedAppointments = () => typedAppointments.filter(app => app.status === 'Completed');

  const getNextStatus = (currentStatus: string): 'TODO' | 'InProgress' | 'Completed' | null => {
    switch(currentStatus) {
      case 'TODO': return 'InProgress';
      case 'InProgress': return 'Completed';
      default: return null;
    }
  };

  const getPreviousStatus = (currentStatus: string): 'TODO' | 'InProgress' | 'Completed' | null => {
    switch(currentStatus) {
      case 'Completed': return 'InProgress';
      case 'InProgress': return 'TODO';
      default: return null;
    }
  };

  return (
    <div className="container">
      {/*<div style={{background:'#fbbf24',color:'#222',padding:'8px',fontWeight:'bold',textAlign:'center'}}>Appointments page is rendering!</div>*/}
      <div className='title-box'>
        <h1 className='title'>My Events</h1>
      </div>
      <hr style={{ borderColor: '#4b5563', marginBottom: '1.5rem' }} />
      
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          backgroundColor: '#374151',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontSize: '1rem',
        }}
      >
        {showForm ? 'Cancel' : '+ Add Appointment'}
      </button>

      {showForm && (
        <div style={{ backgroundColor: '#374151', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Date</label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Time</label>
              <input
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Priority</label>
              <select
                value={newAppointment.priority}
                onChange={(e) => setNewAppointment({ ...newAppointment, priority: e.target.value as any })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none' }}
              >
                <option value="Normal">Normal</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
            <input
              type="text"
              placeholder="Descripción de la actividad"
              value={newAppointment.description}
              onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleAddAppointment} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
              Add
            </button>
            <button onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className='appointments'>
        {/* TODO Section */}
        <div 
          className='appointment-section'
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'TODO')}
        >
          <div className='section-header'>
            <h2>TODO <span className='count-badge'>{countByStatus('TODO')}</span></h2>
          </div>
          <br />
          <div className='appointments-list'>
            {getTodoAppointments().map(app => (
              <div 
                key={app.id} 
                className='appointment-chip'
                draggable
                onDragStart={(e) => handleDragStart(e, app.id)}
                style={{ cursor: 'grab', opacity: draggedItem === app.id ? 0.5 : 1 }}
              >
                <div className='chip-content'>
                  <p className='chip-title'>{app.description}</p>
                  <p className='chip-date'>{app.date} • {app.time}</p>
                </div>
                <div className='chip-actions'>
                  <span className='priority-badge' style={{ backgroundColor: getPriorityColor(app.priority) }}>
                    {app.priority}
                  </span>
                  {getNextStatus(app.status) && (
                    <button 
                      onClick={() => handleStatusChange(app.id, getNextStatus(app.status)!)} 
                      className='btn-action btn-down'
                      title="Move down"
                    >
                      ↓
                    </button>
                  )}
                  <button onClick={() => handleDelete(app.id)} className='btn-delete'>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IN PROGRESS Section */}
        <div 
          className='appointment-section'
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'InProgress')}
        >
          <div className='section-header'>
            <h2>IN PROGRESS <span className='count-badge'>{countByStatus('InProgress')}</span></h2>
            <br />
          </div>
          <div className='appointments-list'>
            {getInProgressAppointments().map(app => (
              <div 
                key={app.id} 
                className='appointment-chip'
                draggable
                onDragStart={(e) => handleDragStart(e, app.id)}
                style={{ cursor: 'grab', opacity: draggedItem === app.id ? 0.5 : 1 }}
              >
                <div className='chip-content'>
                  <p className='chip-title'>{app.description}</p>
                  <p className='chip-date'>{app.date} • {app.time}</p>
                </div>
                <div className='chip-actions'>
                  <span className='priority-badge' style={{ backgroundColor: getPriorityColor(app.priority) }}>
                    {app.priority}
                  </span>
                  {getPreviousStatus(app.status) && (
                    <button 
                      onClick={() => handleStatusChange(app.id, getPreviousStatus(app.status)!)} 
                      className='btn-action btn-up'
                      title="Move up"
                    >
                      ↑
                    </button>
                  )}
                  {getNextStatus(app.status) && (
                    <button 
                      onClick={() => handleStatusChange(app.id, getNextStatus(app.status)!)} 
                      className='btn-action btn-down'
                      title="Move down"
                    >
                      ↓
                    </button>
                  )}
                  <button onClick={() => handleDelete(app.id)} className='btn-delete'>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPLETED Section */}
        <div 
          className='appointment-section'
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Completed')}
        >
          <div className='section-header'>
            <h2>COMPLETED <span className='count-badge'>{countByStatus('Completed')}</span></h2>
          </div>
          <div className='appointments-list'>
            <br />
            {getCompletedAppointments().map(app => (
              <div 
                key={app.id} 
                className='appointment-chip completed'
                draggable
                onDragStart={(e) => handleDragStart(e, app.id)}
                style={{ cursor: 'grab', opacity: draggedItem === app.id ? 0.5 : 1 }}
              >
                <div className='chip-content'>
                  <p className='chip-title'>{app.description}</p>
                  <p className='chip-date'>{app.date} • {app.time}</p>
                </div>
                <div className='chip-actions'>
                  <span className='priority-badge' style={{ backgroundColor: getPriorityColor(app.priority) }}>
                    {app.priority}
                  </span>
                  {getPreviousStatus(app.status) && (
                    <button 
                      onClick={() => handleStatusChange(app.id, getPreviousStatus(app.status)!)} 
                      className='btn-action btn-up'
                      title="Move up"
                    >
                      ↑
                    </button>
                  )}
                  <button onClick={() => handleDelete(app.id)} className='btn-delete'>✕</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;