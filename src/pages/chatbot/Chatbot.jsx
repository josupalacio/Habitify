import React, { useState } from "react";

// Prompts locales y respuestas
const prompts = [
  ["hola", "hey", "buenas"],
  ["cómo estás", "qué tal"]
];
const replies = [
  ["¡Hola!", "¡Hey!"],
  ["Bien, gracias. ¿Y tú?", "Todo bien, ¿y tú?"]
];

const alternative = ["No entiendo 🤔"];

// Función para buscar respuesta local
const getBotResponseLocal = (input) => {
  const cleaned = input
    .toLowerCase()
    .replace(/(.)\1+/g, "$1") // elimina letras repetidas
    .replace(/[^\w\s]/gi, ""); // elimina signos de puntuación
  for (let i = 0; i < prompts.length; i++) {
    if (prompts[i].includes(cleaned)) {
      const resList = replies[i];
      return resList[Math.floor(Math.random() * resList.length)];
    }
  }
  return null;
};

const Chatbot = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Mensaje del usuario
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    // Intento de respuesta local
    let botText = getBotResponseLocal(input);

    if (!botText) {
      try {
        const url =
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

        console.log("🟢 Enviando petición a Gemini...");
        console.log("URL:", url);
        console.log("Input del usuario:", input);

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: input }] }] }),
        });

        console.log("Respuesta HTTP:", response.status, response.statusText);

        const data = await response.json();
        console.log("Data recibida de Gemini:", data);

        botText = data.candidates?.[0]?.content?.parts?.[0]?.text || alternative[0];

        // Mensaje de éxito
        console.log("✅ Respuesta del bot:", botText);
      } catch (error) {
        console.error("❌ Error al conectar con Gemini:", error);
        botText = "Error al conectar con Gemini ❌";
      }
    }

    // Mensaje del bot
    const botMsg = { from: "bot", text: botText };
    setMessages((prev) => [...prev, botMsg]);

    setInput("");
  };


  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1 className="chatbot-title">Chat-Bot</h1>
      </div>
      <div className="chatbot-body">
        <div className="messages-wrapper">
          <div className="messages-box">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-row ${msg.from === "user" ? "right" : "left"}`}>
                <div className={`message-bubble ${msg.from === "user" ? "right" : "left"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={{ flex: 1, padding: "0.5rem", borderRadius: "0.5rem", border: "1px solid #4b5563", backgroundColor: "#1f2937", color: "white" }}
          />
          <button onClick={handleSend} style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", cursor: "pointer", backgroundColor: "#374151", color: "white", border: "none" }}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
