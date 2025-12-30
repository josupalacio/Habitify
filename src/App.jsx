import { useState } from "react";
import "./App.css";
import { SideBar } from "./components/sidebar/Sidebar"
import Pomodoro from "./pages/pomodoro/Pomodoro";
import Checklist from "./pages/checklist/Checklist";
import Chatbot from "./pages/chatbot/Chatbot";
import Habit from "./pages/Habit";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  //const []
  return (
    <Router>
      <div className="h-screen w-full flex">
        <SideBar />
        <div className="flex-1">
          <Routes>
            <Route path="/pomodoro" element={<Pomodoro />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/habit" element={<Habit />} />
            <Route path="/" element={<Habit />} /> {/* Default page */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
