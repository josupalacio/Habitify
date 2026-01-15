import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Verificar que la API key esté configurada
if (!API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is not set');
  process.exit(1);
}

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// Almacenar historial de chat
let chatHistory = [];

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// Ruta para enviar mensajes
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Agregar mensaje del usuario al historial
    chatHistory.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // Preparar el payload para Gemini
    const payload = {
      contents: chatHistory,
    };

    // Llamar a la API de Gemini
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Error from Gemini API' });
    }

    // Extraer la respuesta de Gemini
    const geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini';

    // Agregar respuesta de Gemini al historial
    chatHistory.push({
      role: 'model',
      parts: [{ text: geminiResponse }],
    });

    res.json({ response: geminiResponse });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Ruta para limpiar el historial
app.post('/api/chat/reset', (req, res) => {
  chatHistory = [];
  res.json({ message: 'Chat history reset' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
});