import React from 'react';

export const StudyHabitSimple: React.FC = () => {
  console.log('StudyHabitSimple component mounted');
  
  return (
    <div style={{ padding: '2rem', background: '#1a1a2e', color: '#fff', minHeight: '100vh' }}>
      <h1>Estudiar - Versión Simple</h1>
      <p>Este es un componente simplificado para probar la ruta.</p>
    </div>
  );
};
