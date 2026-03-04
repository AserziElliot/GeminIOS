const socket = io();

async function openAI() {
    const promptUser = prompt("♊ GeminIOS AI: ¿Qué quieres saber?");
    if (!promptUser) return;

    try {
        const res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptUser })
        });
        const data = await res.json();
        alert(data.text);
    } catch (err) {
        alert("Hubo un error al conectar con la IA.");
    }
}

function openChat() {
    alert("Chat Global iniciado. Revisa la consola (F12) para ver mensajes.");
}

function openDocs() { alert("GeminDocs cargando..."); }
function openCode() { alert("Code Studio iniciado..."); }
