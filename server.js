const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');

const app = express(); // Definición esencial primero
const server = http.createServer(app);
const io = new Server(server);

// Configuración de Middlewares
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

// Inicialización de Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Endpoint único para la IA
app.post('/api/ai', async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
        return res.json({ text: "(Modo Local) GeminIOS: No hay API Key configurada en Render." });
    }
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(req.body.prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        res.status(500).json({ error: "Error en la conexión con Gemini." });
    }
});

// Chat en tiempo real
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`♊ GeminIOS ejecutándose en puerto ${PORT}`);
});
