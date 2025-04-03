"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebviewContent = getWebviewContent;
function getWebviewContent() {
    return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BrulAI Chat</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #1e1e1e; color: white; padding: 1rem; }
            textarea { width: 100%; box-sizing: border-box; padding: 0.5rem; background-color: #252526; color: white; border: 1px solid #3c3c3c; border-radius: 5px; }
            #response { border: 1px solid #3c3c3c; background-color: #252526; padding: 1rem; margin-top: 1rem; min-height: 2rem; border-radius: 5px; overflow-y: auto; max-height: 300px; }
            button { background-color: #007acc; color: white; border: none; padding: 0.5rem 1rem; cursor: pointer; border-radius: 5px; }
            button:hover { background-color: #005fa3; }
        </style>
    </head>
    <body>
        <h2>BrulAI Chat</h2>
        <div id="chat"></div>
        <textarea id="prompt" rows="3" placeholder="Ask me something..."></textarea>
        <br />
        <button id="askBtn">Ask</button>
        <div id="response"></div>
        <script>
            const vscode = acquireVsCodeApi();
            const askBtn = document.getElementById('askBtn');
            askBtn.addEventListener('click', () => {
                const text = document.getElementById('prompt').value;
                if (text.trim() === '') return;
                vscode.postMessage({ command: 'chat', text });
            });
            
            const response = document.getElementById('response');
            window.addEventListener('message', event => {
                const { command, text } = event.data;
				if (command === 'chatResponse') {
					response.innerText = text;
                    response.scrollTop = response.scrollHeight;
				}
            });

            const prompt = document.getElementById('prompt');
            prompt.addEventListener('keypress', event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    askBtn.click();
                }
            });
            
        </script>
    </body>
    </html>
    `;
}
//# sourceMappingURL=webviewContent.js.map