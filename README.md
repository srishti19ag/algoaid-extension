# 🧠 AlgoAid – Your LeetCode AI Hint Helper

AlgoAid is a browser extension that brings AI-powered hints and full solutions directly to your LeetCode problems. Designed to help you think better, not just faster.

---

## 🚀 Features

- 🔍 Automatically detects LeetCode problem titles
- 💡 Displays **3 intelligent hints** per question
- 📜 Full AI-generated solution (on demand)
- 🌙 Dark mode toggle
- 📋 Copy-to-clipboard functionality
- ⚙️ Gemini AI-powered backend
- 🧩 Chrome Extension with clean, modern UI

---


## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS


**Backend:**
- Node.js + Express
- Gemini API (Google AI)
- dotenv for managing secrets

---

## 📁 Folder Structure
```bash
algoaid/
├── backend/             # Node.js + Express API
│   └── .env             # Gemini API key (not committed)
├── extension/           # React +Vite
│   ├── public/
│   ├── src/
│   └── vite.config.js
├── README.md
└── .gitignore
```
---

## 🔧 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/algoaid.git
cd algoaid
```
### 2. Setup Environment Variables
In the backend/ folder, create a .env file
```bash
GEMINI_API_KEY=your-gemini-api-key
```
### 3. Install Dependencies
```bash
# Frontend (extension)
cd extension
npm install

# Backend
cd ../backend
npm install

```
### 4. Run the App Locally
In two separate terminal windows:
```bash
# Start backend server
cd backend
npm start

# Start frontend (extension dev)
cd extension
npm run dev
```
### 5. Load Extension in Chrome
-Open chrome://extensions/
-Enable Developer Mode (top right)
-Click Load unpacked
-Select the extension/dist folder (after npm run dev builds it)

### ✅ You’re now ready to use AlgoAid on LeetCode!
---

## 📫 Feedback & Support
This is my first time building a browser extension — I’d love your feedback!





