function openCodeEditor() {
    const editorHtml = `
        <div class="editor-container" style="height:100%; display:flex; flex-direction:column;">
            <div class="toolbar" style="background:#222; padding:5px;">
                <button onclick="runCode()">▶ Ejecutar</button>
            </div>
            <textarea id="code-area" style="flex-grow:1; background:#1e1e1e; color:#00ff00; font-family:monospace; padding:10px; border:none; outline:none;"></textarea>
        </div>
    `;
    // Aquí el código para meter ese HTML en tu ventana flotante...
}
