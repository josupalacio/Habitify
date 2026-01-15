// frontend/src/pages/chatbot/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";
import { FaArrowUp } from "react-icons/fa6";
import MarkdownRenderer from "../../components/chatbot/MarkdownRenderer";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const welcomeMessages = [
    "¡Hola Josué! ¿En qué puedo ayudarte hoy?",
    "Bienvenido Josué, ¿qué te gustaría lograr?",
    "¡Hey Josué! ¿Cómo puedo asistirte con tus hábitos?",
    "Hola Josué, ¿qué necesitas saber sobre productividad?",
    "¡Buenas Josué! ¿Listo para mejorar tus hábitos?"
  ];

  const getRandomWelcomeMessage = () =>
    welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

  const sendMessageToBackend = async (userMessage) => {
    try {
      // Llamada al backend
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "hola" }),
      });


      if (!response.ok) throw new Error(`Backend error: ${response.status}`);

      const data = await response.json();
      return data.response || "No response from Gemini";
    } catch (error) {
      console.error("Error connecting to backend:", error);
      return `Error al conectar con el servidor (${BACKEND_URL}). Verifica que esté activo.`;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (!hasStarted) setHasStarted(true);
    setIsLoading(true);

    const botText = await sendMessageToBackend(input);
    const botMsg = { from: "bot", text: botText };
    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="chatbot-container">
      {!hasStarted ? (
        <div className="welcome-screen">
          <div className="welcome-content">
            <h2 className="welcome-message">{getRandomWelcomeMessage()}</h2>
            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu mensaje aquí..."
                className="welcome-input"
                autoFocus
              />
              <button onClick={handleSend} className="send-button">
                <FaArrowUp />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="chatbot-header">
            <h1 className="chatbot-title">Chat-Bot</h1>
          </div>
          <div className="chatbot-body">
            <div className="messages-wrapper">
              <div className="messages-box">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message-row ${msg.from === "user" ? "right" : "left"}`}>
                    <div className={`message-bubble ${msg.from === "user" ? "user" : "bot"}`}>
                      {msg.from === "bot" ? <MarkdownRenderer text={msg.text} /> : msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message-row left">
                    <div className="message-bubble bot">
                      <span className="typing-indicator"><span></span><span></span><span></span></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="input-fixed">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu mensaje..."
                className="chat-input"
              />
              <button onClick={handleSend} className="send-button">
                <FaArrowUp />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot;
