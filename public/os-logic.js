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
