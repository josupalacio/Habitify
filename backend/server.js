import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import path from 'path';
import { Pool } from 'pg'; 

dotenv.config({ path: path.resolve('./backend/.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Configuración de base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'habitify',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

app.use(cors())

// Verificar que la API key esté configurada
if (!API_KEY) {
  console.error('ERROR: GEMINI_API_KEY environment variable is not set');
  process.exit(1);
}

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

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
      contents: [
        {
          role: "user",
          parts: [{ text: message }]
        }
      ]
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

// Ruta para crear un nuevo hábito
app.post('/api/habits', async (req, res) => {
  const { user_id, name, color, is_glossy, description, frequency, time_preference, icon_key } = req.body;
  
  try {
    // Obtener el máximo sort_order para el usuario
    const maxOrderResult = await pool.query(
      'SELECT COALESCE(MAX(sort_order), 0) as max_order FROM habits WHERE user_id = $1',
      [user_id]
    );
    const newSortOrder = maxOrderResult.rows[0].max_order + 1;
    
    const query = `
      INSERT INTO habits (user_id, name, color, is_glossy, description, frequency, time_preference, icon_key, sort_order)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [user_id, name, color, is_glossy, description, frequency, time_preference, icon_key, newSortOrder];
    const result = await pool.query(query, values);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ error: 'Error creating habit' });
  }
});

// Ruta para obtener todos los hábitos de un usuario
app.get('/api/habits/:user_id', async (req, res) => {
  const { user_id } = req.params;
  
  try {
    const query = `
      SELECT * FROM habits 
      WHERE user_id = $1 AND is_active = true 
      ORDER BY sort_order DESC, created_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ error: 'Error fetching habits' });
  }
});

// Ruta para actualizar un hábito
app.put('/api/habits/:id', async (req, res) => {
  const { id } = req.params;
  const { name, color, is_glossy, description, frequency, time_preference, icon_key } = req.body;
  
  try {
    const query = `
      UPDATE habits 
      SET name = $1, color = $2, is_glossy = $3, description = $4, frequency = $5, time_preference = $6, icon_key = $7
      WHERE id = $8
      RETURNING *
    `;
    
    const values = [name, color, is_glossy, description, frequency, time_preference, icon_key, id];
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating habit:', error);
    res.status(500).json({ error: 'Error updating habit' });
  }
});

// Ruta para eliminar un hábito (soft delete)
app.delete('/api/habits/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const query = 'UPDATE habits SET is_active = false WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }
    
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ error: 'Error deleting habit' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  const isRailway = !!process.env.RAILWAY_ENVIRONMENT;

  console.log("✅ Server running");
  console.log(`🧩 Environment: ${isRailway ? "Railway" : "Local"}`);
  console.log(`🔌 Port: ${PORT}`);

  if (isRailway) {
    console.log("📝 Health check: /health");
  } else {
    console.log(`📝 Health check: http://localhost:${PORT}/health`);
  }
});