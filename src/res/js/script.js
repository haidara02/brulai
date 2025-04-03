const vscode = acquireVsCodeApi();
const askBtn = document.getElementById('askBtn');
const response = document.getElementById('response');

askBtn.addEventListener('click', () => {
    const text = document.getElementById('prompt').value;
    if (text.trim() === '') return;

    appendMessage(`You: ${text}`, true);
    document.getElementById('loading').style.display = 'block';

    vscode.postMessage({ command: 'chat', text });
});


const promptInput = document.getElementById('prompt');
promptInput.addEventListener('keypress', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        askBtn.click();
    }
});

window.addEventListener('message', event => {
    const { command, text } = event.data;
    if (command === 'chatResponse') {
        document.getElementById('loading').style.display = 'none';

        // Format <think> content into a Markdown blockquote with italics
        let formattedText = text.replace(
            /<think>([\s\S]*?)<\/think>/g,
            (match, content) => {
                // Split into lines, add '>' at the start of each
                // const quotedContent = content
                //     .trim()
                //     .split("\n") // Keep newlines intact
                //     .map(line => `> ${line.trim()}`) // Add '>' for blockquote + italics
                //     .join("\n\n"); // Use double newlines for Markdown to force breaks

                return `\n<blockquote>\n ${content}\n</blockquote>\n`;
            }
        );

         const cleanMarkdown = DOMPurify.sanitize(marked.parse(formattedText));
        appendMessage(cleanMarkdown);
    }
});

// Append chat message with animation
function appendMessage(htmlContent, isUser = false) {
    if (isUser) {
        // Create a new message for the user
        const msgContainer = document.createElement('div');
        msgContainer.classList.add('chat-message', 'user-message');
        msgContainer.innerText = htmlContent;
        response.appendChild(msgContainer);
    } else {
        // Check if a bot message already exists and update it instead of adding a new one
        let botMessage = response.querySelector('.bot-message:last-child');

        if (!botMessage) {
            // If no bot message exists, create a new one
            botMessage = document.createElement('div');
            botMessage.classList.add('chat-message', 'bot-message');
            response.appendChild(botMessage);
        }

        // Update the existing bot message
        botMessage.innerHTML = htmlContent;
    }

    response.scrollTop = response.scrollHeight; // Auto-scroll
}