const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.static('public'));
const server = http.createServer(app);
const io = new Server(server);

// Configuración de la IA (Render tomará la clave de tus variables de entorno)
app.post('/api/ai', async (req, res) => {
    // Si no hay API KEY, devolvemos una respuesta de simulación
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "") {
        return res.json({ 
            text: "(Modo Local) GeminIOS: Todavía no tengo mi cerebro conectado (API Key), pero el sistema operativo funciona correctamente. ¡Configura la clave en Render!" 
        });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(req.body.prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        res.status(500).json({ error: "Error en la conexión con el cerebro de Gemini." });
    }
});

// --- ENDPOINT PARA LA IA ---
app.post('/api/ai', async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(req.body.prompt);
        const response = await result.response;
        res.json({ text: response.text() });
    } catch (error) {
        res.status(500).json({ error: "Error con Gemini AI" });
    }
});

// --- LÓGICA DEL CHAT EN LÍNEA ---
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado a GeminIOS');
    
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg); // Envía el mensaje a todos los conectados
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`♊ GeminIOS Online en el puerto ${PORT}`);
});
