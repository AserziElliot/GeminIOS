const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require('path');

const app = express(); // Primero creamos la app
const server = http.createServer(app);
const io = new Server(server);

// Middleware necesario
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la IA
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "TU_KEY_AQUI");

app.post('/api/ai', async (req, res) => {
    if (!process.env.GEMINI_API_KEY) {
        return res.json({ text: "(Modo Local) Configura la API Key en Render para activar mi cerebro." });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(req.body.prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        res.status(500).json({ error: "Error con Gemini AI" });
    }
});

// Lógica de Socket.io
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`♊ GeminIOS listo en puerto ${PORT}`);
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`♊ GeminIOS Online en el puerto ${PORT}`);
});
