# CorpGuideAI - Frontend

This is the frontend user interface for the **CorpGuideAI HR Policy Assistant**. It provides a clean, chat-based interface for employees to interact with the AI assistant regarding company policies.

## 📋 Project Structure

This frontend is designed to work in conjunction with the backend located in the sibling directory:
`../CorpGuideAI-HR-Policy-Assistant`

```text
CorpGuideAI-HrPolicyAssistant/
├── CorpGuideAI-Frontend/       <-- You are here (UI)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── README.md
└── CorpGuideAI-HR-Policy-Assistant/  <-- Backend API (FastAPI)
```

## 🚀 How to Run

Since this is a vanilla HTML/CSS/JS application, you can run it using any static file server.

### Option 1: VS Code Live Server (Recommended)

1. Open this folder (`CorpGuideAI-Frontend`) in VS Code.
2. Install the **Live Server** extension.
3. Right-click on `index.html` and select **"Open with Live Server"**.

### Option 2: Python Simple HTTP Server

If you have Python installed, you can run a quick server from the command line:

```bash
# Run inside the CorpGuideAI-Frontend directory
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## ⚙️ Configuration

The frontend connects to the backend via a REST API.

**Default Configuration:**
The application is currently configured to connect to the **Live Production Server** on Hugging Face:

- URL: `https://yousefmohtady1-corpguideai.hf.space/chat`

**For Local Development:**
If you want to connect to a local backend instance:

1. Open `script.js`.
2. Comment out the Live URL and uncomment the Local URL:
   ```javascript
   // const API_URL = "https://yousefmohtady1-corpguideai.hf.space/chat";
   const API_URL = "http://127.0.0.1:8000/chat";
   ```

## ✨ Features

- **Modern Chat Interface**: Clean, "Sparkle" inspired design with responsive inputs.
- **Smart Logic**:
  - Send button enables only when text is entered.
  - Auto-expanding text area.
- **Markdown Support**: Renders bold text, lists, and formatting from AI responses.
- **History Management**: Client-side chat history to maintain context.
- **Reset Chat**: "New Chat" button to clear history and start fresh.
- **Typing Indicator**: Visual feedback while waiting for a response.
