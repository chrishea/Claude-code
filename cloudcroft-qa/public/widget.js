(function() {
  'use strict';

  // Configuration
  const WIDGET_ID = 'cloudcroft-qa-widget';
  const API_ENDPOINT = window.CloudcroftQA?.apiUrl || 'http://localhost:3000/api/ask';

  // Styles
  const styles = `
    #${WIDGET_ID} {
      --cqa-primary: #2563eb;
      --cqa-primary-hover: #1d4ed8;
      --cqa-bg: #ffffff;
      --cqa-text: #1f2937;
      --cqa-text-light: #6b7280;
      --cqa-border: #e5e7eb;
      --cqa-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: var(--cqa-text);
    }

    #${WIDGET_ID} * {
      box-sizing: border-box;
    }

    /* Floating button */
    .cqa-float-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--cqa-primary);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: var(--cqa-shadow);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s, background-color 0.2s;
      z-index: 9998;
    }

    .cqa-float-btn:hover {
      background: var(--cqa-primary-hover);
      transform: scale(1.05);
    }

    .cqa-float-btn svg {
      width: 28px;
      height: 28px;
    }

    /* Chat window */
    .cqa-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 500px;
      max-height: calc(100vh - 120px);
      background: var(--cqa-bg);
      border-radius: 12px;
      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9999;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      pointer-events: none;
      transition: opacity 0.2s, transform 0.2s;
    }

    .cqa-window.cqa-open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    /* Header */
    .cqa-header {
      background: var(--cqa-primary);
      color: white;
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .cqa-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .cqa-header p {
      margin: 4px 0 0;
      font-size: 12px;
      opacity: 0.9;
    }

    .cqa-close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      opacity: 0.8;
      transition: opacity 0.2s;
    }

    .cqa-close-btn:hover {
      opacity: 1;
    }

    /* Messages area */
    .cqa-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .cqa-message {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.4;
    }

    .cqa-message.cqa-user {
      align-self: flex-end;
      background: var(--cqa-primary);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .cqa-message.cqa-bot {
      align-self: flex-start;
      background: #f3f4f6;
      color: var(--cqa-text);
      border-bottom-left-radius: 4px;
    }

    .cqa-message.cqa-bot p {
      margin: 0 0 8px;
    }

    .cqa-message.cqa-bot p:last-child {
      margin-bottom: 0;
    }

    .cqa-message.cqa-bot strong {
      font-weight: 600;
    }

    .cqa-message.cqa-bot ul, .cqa-message.cqa-bot ol {
      margin: 8px 0;
      padding-left: 20px;
    }

    .cqa-message.cqa-bot li {
      margin: 4px 0;
    }

    /* Typing indicator */
    .cqa-typing {
      display: flex;
      gap: 4px;
      padding: 12px 14px;
      background: #f3f4f6;
      border-radius: 12px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
    }

    .cqa-typing span {
      width: 8px;
      height: 8px;
      background: var(--cqa-text-light);
      border-radius: 50%;
      animation: cqa-bounce 1.4s infinite ease-in-out both;
    }

    .cqa-typing span:nth-child(1) { animation-delay: -0.32s; }
    .cqa-typing span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes cqa-bounce {
      0%, 80%, 100% { transform: scale(0.6); }
      40% { transform: scale(1); }
    }

    /* Input area */
    .cqa-input-area {
      padding: 12px 16px;
      border-top: 1px solid var(--cqa-border);
      display: flex;
      gap: 8px;
    }

    .cqa-input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid var(--cqa-border);
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .cqa-input:focus {
      border-color: var(--cqa-primary);
    }

    .cqa-input::placeholder {
      color: var(--cqa-text-light);
    }

    .cqa-send-btn {
      padding: 10px 16px;
      background: var(--cqa-primary);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .cqa-send-btn:hover:not(:disabled) {
      background: var(--cqa-primary-hover);
    }

    .cqa-send-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Welcome message */
    .cqa-welcome {
      text-align: center;
      padding: 20px;
      color: var(--cqa-text-light);
    }

    .cqa-welcome h4 {
      margin: 0 0 8px;
      color: var(--cqa-text);
      font-size: 16px;
    }

    .cqa-welcome p {
      margin: 0;
      font-size: 14px;
    }

    /* Powered by */
    .cqa-powered {
      text-align: center;
      padding: 8px;
      font-size: 11px;
      color: var(--cqa-text-light);
      border-top: 1px solid var(--cqa-border);
    }

    .cqa-powered a {
      color: var(--cqa-primary);
      text-decoration: none;
    }

    /* Inline mode */
    #${WIDGET_ID}.cqa-inline .cqa-float-btn {
      display: none;
    }

    #${WIDGET_ID}.cqa-inline .cqa-window {
      position: relative;
      bottom: auto;
      right: auto;
      width: 100%;
      height: 450px;
      max-width: none;
      max-height: none;
      opacity: 1;
      transform: none;
      pointer-events: auto;
    }
  `;

  // Create widget HTML
  function createWidget() {
    const container = document.createElement('div');
    container.id = WIDGET_ID;

    // Check for inline mode
    const config = window.CloudcroftQA || {};
    if (config.inline) {
      container.className = 'cqa-inline';
    }

    container.innerHTML = `
      <style>${styles}</style>

      <button class="cqa-float-btn" aria-label="Open chat">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <div class="cqa-window ${config.inline ? 'cqa-open' : ''}">
        <div class="cqa-header">
          <div>
            <h3>Ask About Cloudcroft</h3>
            <p>Your local guide to the mountain</p>
          </div>
          ${!config.inline ? `
            <button class="cqa-close-btn" aria-label="Close chat">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ` : ''}
        </div>

        <div class="cqa-messages">
          <div class="cqa-welcome">
            <h4>Welcome!</h4>
            <p>Ask me anything about Cloudcroft, New Mexico - events, attractions, dining, history, and more.</p>
          </div>
        </div>

        <div class="cqa-input-area">
          <input type="text" class="cqa-input" placeholder="Ask a question..." maxlength="500">
          <button class="cqa-send-btn">Send</button>
        </div>

        <div class="cqa-powered">
          Powered by <a href="https://cloudcroftreader.com" target="_blank">Cloudcroft Reader</a>
        </div>
      </div>
    `;

    // Find target container or append to body
    const target = config.container ? document.querySelector(config.container) : document.body;
    target.appendChild(container);

    return container;
  }

  // Format message with basic markdown
  function formatMessage(text) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n- /g, '</p><ul><li>')
      .replace(/\n(\d+)\. /g, '</p><ol><li>')
      .replace(/<\/li>\n- /g, '</li><li>')
      .replace(/<\/li>\n(\d+)\. /g, '</li><li>')
      .replace(/<ul><li>([^<]*(?:<li>[^<]*)*)<\/li>/g, '<ul><li>$1</li></ul>')
      .replace(/<ol><li>([^<]*(?:<li>[^<]*)*)<\/li>/g, '<ol><li>$1</li></ol>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

  // Initialize widget
  function init() {
    const widget = createWidget();
    const floatBtn = widget.querySelector('.cqa-float-btn');
    const chatWindow = widget.querySelector('.cqa-window');
    const closeBtn = widget.querySelector('.cqa-close-btn');
    const messagesContainer = widget.querySelector('.cqa-messages');
    const input = widget.querySelector('.cqa-input');
    const sendBtn = widget.querySelector('.cqa-send-btn');

    let isOpen = window.CloudcroftQA?.inline || false;

    // Toggle chat
    function toggleChat() {
      isOpen = !isOpen;
      chatWindow.classList.toggle('cqa-open', isOpen);
      if (isOpen) input.focus();
    }

    if (floatBtn) floatBtn.addEventListener('click', toggleChat);
    if (closeBtn) closeBtn.addEventListener('click', toggleChat);

    // Add message to chat
    function addMessage(text, isUser = false) {
      const welcome = messagesContainer.querySelector('.cqa-welcome');
      if (welcome) welcome.remove();

      const msg = document.createElement('div');
      msg.className = `cqa-message ${isUser ? 'cqa-user' : 'cqa-bot'}`;

      if (isUser) {
        msg.textContent = text;
      } else {
        msg.innerHTML = formatMessage(text);
      }

      messagesContainer.appendChild(msg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return msg;
    }

    // Show typing indicator
    function showTyping() {
      const typing = document.createElement('div');
      typing.className = 'cqa-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      messagesContainer.appendChild(typing);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      return typing;
    }

    // Send message
    async function sendMessage() {
      const question = input.value.trim();
      if (!question) return;

      // Add user message
      addMessage(question, true);
      input.value = '';
      sendBtn.disabled = true;

      // Show typing
      const typing = showTyping();

      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question })
        });

        const data = await response.json();
        typing.remove();

        if (data.error) {
          addMessage('Sorry, I encountered an error. Please try again.');
        } else {
          addMessage(data.answer);
        }
      } catch (error) {
        typing.remove();
        addMessage('Sorry, I couldn\'t connect to the server. Please try again later.');
      }

      sendBtn.disabled = false;
      input.focus();
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
