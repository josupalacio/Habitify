import { useState } from "react";
import "./App.css";
import { SidebarWorking } from "./components/sidebar/SidebarWorking";
import Pomodoro from "./pages/pomodoro/Pomodoro";
import Checklist from "./pages/checklist/Checklist";
import Chatbot from "./pages/chatbot/Chatbot";
import Dashboard from "./pages/dashboard/Dashboard";
import Appointments from "./pages/appointments/Appointments";
import { DynamicHabit } from "./pages/habit/DynamicHabit";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, useSidebar } from "./contexts/SidebarContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

import Login from "./pages/auth/Login";

import { StudyHabit } from "./pages/habit/study-habit/study";
import { GymHabit } from "./pages/habit/gym-habit/gym";
import { ReadHabit } from "./pages/habit/read-habit/read";

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-white text-center">
          <p>Loading Habitify...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="h-screen w-full">
      <SidebarWorking />
      <div className="flex-1" style={{ paddingLeft: '250px' }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/study" element={<StudyHabit />} />
          <Route path="/gym" element={<GymHabit />} />
          <Route path="/read" element={<ReadHabit />} />
          <Route path="/habit/:habitName" element={<DynamicHabit />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <AppContent />
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;
