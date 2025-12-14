// ==========================================
// Connection and Memory Settings
// ==========================================

// رابط السيرفر (لوكال حالياً)
const API_URL = "https://yousefmohtady1-corpguideai.hf.space/chat";

// مخزن الذاكرة
let chatHistory = [];

// ==========================================
// UI Elements (Here was the fix!)
// ==========================================
// 1. تصحيح الاسم: في HTML اسمه chat-container مش chat-box
const chatContainer = document.getElementById('chat-container'); 
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const resetBtn = document.getElementById('reset-btn'); // زرار نيو شات

// ==========================================
// ✨ The Missing Piece: Input Listener ✨
// ==========================================
// ده الكود اللي كان ناقص عشان الزرار ينور والبوكس يكبر
userInput.addEventListener('input', function() {
    // 1. Auto-resize height
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';

    // 2. Enable/Disable Button
    if (this.value.trim() !== '') {
        sendBtn.disabled = false;
        sendBtn.style.opacity = "1";
        sendBtn.style.cursor = "pointer";
    } else {
        sendBtn.disabled = true;
        sendBtn.style.opacity = "0.5";
        sendBtn.style.cursor = "default";
    }
});

// ==========================================
// Core Functions
// ==========================================

async function sendMessage() {
    const question = userInput.value.trim();
    if (!question) return;

    // Display user message
    appendMessage(question, 'user');
    
    // Reset Input UI
    userInput.value = ''; 
    userInput.style.height = 'auto'; // نرجع الحجم للطبيعي
    sendBtn.disabled = true; // نعطل الزرار تاني
    sendBtn.style.opacity = "0.5";
    sendBtn.style.cursor = "default";

    // Show loading
    const loadingId = appendLoading();

    try {
        const payload = {
            question: question,
            chat_history: chatHistory
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();

        // Remove loading and show answer
        removeLoading(loadingId);
        
        // استخدام marked لتحويل النص لـ HTML منسق (Markdown)
        // data.answer جاي نص عادي، marked هيخليه Bold و List وكدا
        const formattedAnswer = marked.parse(data.answer); 
        appendMessage(formattedAnswer, 'bot', true); // true يعني ده HTML جاهز

        // Update Memory
        chatHistory.push(["human", question]);
        chatHistory.push(["ai", data.answer]);

    } catch (error) {
        console.error("Error:", error);
        removeLoading(loadingId);
        appendMessage("Sorry, backend is offline or an error occurred. 😔", 'bot');
    }
}

function startNewChat() {
    chatHistory = [];
    // نرجع شكل الشات للبداية (رسالة الترحيب)
    chatContainer.innerHTML = `
        <div class="message bot-message welcome-message">
            <div class="avatar-container">
                <span class="bot-avatar">🤖</span>
            </div>
            <div class="message-content">
                <h3>Fresh start!</h3>
                <p>Ask me anything about HR policies.</p>
            </div>
        </div>
    `;
    userInput.value = '';
    userInput.style.height = 'auto';
    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.5";
}

// ==========================================
// UI Helpers
// ==========================================

function appendMessage(content, sender, isHTML = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');

    const avatarChar = sender === 'user' ? '👤' : '🤖';

    let contentHtml = content;
    if (!isHTML) {
        // لو نص عادي من اليوزر، نحميه ونحوله لسطور
        contentHtml = content.replace(/\n/g, '<br>');
        contentHtml = `<p>${contentHtml}</p>`;
    }

    msgDiv.innerHTML = `
        <div class="avatar-container">
            <span class="${sender}-avatar">${avatarChar}</span>
        </div>
        <div class="message-content">
            ${contentHtml}
        </div>
    `;

    chatContainer.appendChild(msgDiv); // صلحنا الاسم هنا
    scrollToBottom();
}

function appendLoading() {
    const id = 'loading-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', 'bot-message');
    msgDiv.id = id;
    msgDiv.innerHTML = `
        <div class="avatar-container"><span class="bot-avatar">🤖</span></div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
        </div>`;
    chatContainer.appendChild(msgDiv); // صلحنا الاسم هنا
    scrollToBottom();
    return id;
}

function removeLoading(id) {
    const element = document.getElementById(id);
    if (element) element.remove();
}

function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight; // صلحنا الاسم هنا
}

// ==========================================
// Event Listeners
// ==========================================

sendBtn.addEventListener('click', sendMessage);
resetBtn.addEventListener('click', startNewChat); // تشغيل زرار نيو شات

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // منع سطر جديد
        if (!sendBtn.disabled) {
            sendMessage();
        }
    }
});

// Focus on load
window.onload = () => userInput.focus();