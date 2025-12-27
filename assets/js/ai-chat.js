// AI Chat Widget Logic

const CHAT_TEMPLATE = `
<div id="aiChatWidget" class="chat-widget hidden">
    <div class="chat-header">
        <div style="display:flex; align-items:center; gap:8px;">
            <span>🤖</span>
            <strong>Medical Companion</strong>
        </div>
        <button onclick="toggleChat()" class="btn-icon">✕</button>
    </div>
    <div class="chat-messages" id="chatMessages">
        <div class="message ai">
            Halo! Saya asisten AI anda. Ada kasus pasien yang perlu didiskusikan hari ini?
        </div>
    </div>
    <div class="chat-input-area">
        <input type="text" id="chatInput" placeholder="Ketik pertanyaan klinis..." onkeypress="handleChatKey(event)">
        <button onclick="sendMessage()" class="btn btn-primary btn-sm">➤</button>
    </div>
</div>
<button id="aiChatFab" onclick="toggleChat()" class="chat-fab">
    🤖
</button>
`;

document.addEventListener('DOMContentLoaded', () => {
    // Inject Chat UI
    const container = document.createElement('div');
    container.innerHTML = CHAT_TEMPLATE;
    document.body.appendChild(container); // Append to body to be overlay
});

function toggleChat() {
    const widget = document.getElementById('aiChatWidget');
    const fab = document.getElementById('aiChatFab');

    if (widget.classList.contains('hidden')) {
        widget.classList.remove('hidden');
        fab.classList.add('hidden');
        setTimeout(() => document.getElementById('chatInput').focus(), 100);
    } else {
        widget.classList.add('hidden');
        fab.classList.remove('hidden');
    }
}

function handleChatKey(e) {
    if (e.key === 'Enter') sendMessage();
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    // Add User Message
    addMessage(text, 'user');
    input.value = '';

    // Show Loading
    const loadingId = addMessage('Sedang berpikir...', 'ai', true);

    try {
        const apiKey = window.appState.config.api?.key;
        if (!apiKey) throw new Error('API Key belum diset di Settings.');

        // Contextual Prompt
        // We can inject current patient context if we are on patient detail page (future feature)
        // For now, just general chat.
        const systemInstruction = "Anda adalah asisten medis professional untuk dokter muda (Koas). Jawab dengan ringkas, berbasis bukti, dan fokus pada edukasi klinis. Gunakan bahasa Indonesia baku namun natural.";

        const fullPrompt = `${systemInstruction}\n\nUser: ${text}`;

        const response = await window.GeminiService.generateContent(fullPrompt, apiKey);

        // Remove loading
        removeMessage(loadingId);

        // Add AI Response
        addMessage(marked.parse ? marked.parse(response) : formatText(response), 'ai');

    } catch (error) {
        removeMessage(loadingId);
        addMessage(`Error: ${error.message}`, 'ai-error');
    }
}

function addMessage(text, type, isLoading = false) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = `message ${type} ${isLoading ? 'loading-msg' : ''}`;
    div.innerHTML = text; // Warning: XSS risk in real app, but text is from self/AI.
    if (isLoading) div.id = 'msg-' + Date.now();

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div.id;
}

function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function formatText(text) {
    // Simple formatter if marked.js is not present
    return text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
}
