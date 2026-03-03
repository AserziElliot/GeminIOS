const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de la IA (Render tomará la clave de tus variables de entorno)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.static('public')); // Esto busca tu index.html dentro de una carpeta llamada 'public'
app.use(express.json());

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
