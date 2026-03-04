const socket = io();

// Motor de creación de ventanas dinámicas
function createWindow(title, contentHtml) {
    const container = document.getElementById('window-container');
    if (!container) return;

    const windowDiv = document.createElement('div');
    windowDiv.className = 'window';
    
    // Posicionamiento aleatorio inteligente
    const top = Math.floor(Math.random() * 150) + 50;
    const left = Math.floor(Math.random() * 150) + 50;
    windowDiv.style.top = `${top}px`;
    windowDiv.style.left = `${left}px`;

    windowDiv.innerHTML = `
        <div class="window-header">
            <span>${title}</span>
            <button class="close-btn" onclick="this.closest('.window').remove()">×</button>
        </div>
        <div class="window-content">
            ${contentHtml}
        </div>
    `;

    container.appendChild(windowDiv);
    makeDraggable(windowDiv);
}
// Aplicación de IA
function openAI() {
    const html = `
        <div class="ai-app">
            <div id="ai-response" style="height:120px; overflow-y:auto; color:#00ff00; font-family:monospace; background:#000; padding:5px; margin-bottom:10px; border-radius:4px;">
                > Sistema listo. Esperando consulta...
            </div>
            <div style="display:flex; gap:5px;">
                <input type="text" id="ai-input" placeholder="Pregunta algo..." style="flex-grow:1; background:#222; color:white; border:1px solid #444; padding:5px;">
                <button onclick="askGemini()" style="background:#3a3a5e; color:white; border:none; padding:5px 10px; cursor:pointer;">Enviar</button>
            </div>
        </div>
    `;
    createWindow("✨ Gemini AI", html);
}

async function askGemini() {
    const input = document.getElementById('ai-input');
    const responseArea = document.getElementById('ai-response');
    if (!input.value) return;

    const prompt = input.value;
    input.value = "";
    responseArea.innerHTML += `<div style="color:#aaa;">Usted: ${prompt}</div>`;
    
    try {
        const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });
        const data = await res.json();
        responseArea.innerHTML += `<div style="color:#00ff00;">GeminIOS: ${data.text}</div>`;
        responseArea.scrollTop = responseArea.scrollHeight;
    } catch (e) {
        responseArea.innerHTML += `<div style="color:red;">Error de conexión.</div>`;
    }
}
// Aplicaciones simples
function openDocs() {
    createWindow("📝 GeminDocs", `<textarea style="width:100%; height:150px; background:#fff; color:#000; border:none; resize:none;" placeholder="Escribe aquí..."></textarea>`);
}

function openCode() {
    createWindow("💻 Code Studio", `<div style="background:#1e1e1e; color:#d4d4d4; padding:10px; font-family:monospace; height:150px; border-radius:4px;">// Editor de código v1.0<br><span style="color:#6a9955;">/* Bienvenido */</span><br><br>> <span style="animation: blink 1s infinite;">_</span></div>`);
}

function openChat() {
    createWindow("💬 Chat Global", `<div id="chat-box" style="height:120px; overflow-y:auto; background:rgba(0,0,0,0.3); margin-bottom:10px; padding:5px;"></div><input type="text" placeholder="Escribe..." style="width:100%; background:#222; color:#fff; border:1px solid #444;">`);
}

// Sistema de arrastre de ventanas (Drag & Drop)
function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = el.querySelector('.window-header');
    
    header.onmousedown = (e) => {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = () => {
            document.onmouseup = null;
            document.onmousemove = null;
        };
        document.onmousemove = (e) => {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        };
    };
}
