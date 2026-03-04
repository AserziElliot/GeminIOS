const socket = io();

// Motor para crear ventanas
function createWindow(title, contentHtml) {
    const container = document.getElementById('window-container');
    
    const windowDiv = document.createElement('div');
    windowDiv.className = 'window';
    windowDiv.style.top = "100px";
    windowDiv.style.left = "100px";

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

// --- FUNCIONES DE LAS APPS ---

function openAI() {
    const html = `
        <div class="ai-app">
            <div id="ai-response" style="margin-bottom:10px; color:#00ff00; font-family:monospace;">
                Esperando comando...
            </div>
            <input type="text" id="ai-input" placeholder="Pregunta a Gemini..." 
                style="width:80%; background:black; color:white; border:1px solid #333;">
            <button onclick="askGemini()">Enviar</button>
        </div>
    `;
    createWindow("✨ Gemini AI", html);
}

async function askGemini() {
    const input = document.getElementById('ai-input');
    const responseArea = document.getElementById('ai-response');
    const prompt = input.value;
    
    responseArea.innerText = "Pensando...";
    
    const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt })
    });
    const data = await res.json();
    responseArea.innerText = data.text;
}

function openDocs() {
    const html = `<textarea style="width:100%; height:100%; background:white; color:black; border:none; outline:none; font-family:serif;" placeholder="Escribe aquí tu documento..."></textarea>`;
    createWindow("📝 GeminDocs", html);
}

// Función para poder arrastrar las ventanas
function makeDraggable(el) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = el.querySelector('.window-header');
    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
