# 🏥 Medical Assistant

An intelligent medical assistant app for clinical clerks (koas), powered by Gemini AI.

## ✨ Features
- 📝 **Offline Patient Database**: Access patient data without internet.
- 📋 **SOAP Notes**: Standardized medical note-taking.
- 🤖 **AI Consultant**: Chat with Gemini 2.5 Flash for case analysis and planning recommendations.
- 🔔 **Morning Briefing**: Automated urgency checks.
- 🚀 **Deployment Ready**: Auto-deploy to GitHub Pages.

## 🛠️ Prerequisites
- [Node.js](https://nodejs.org/) (Installed)
- [Git](https://git-scm.com/)

## 🚀 Quick Start (Local)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Local Server**
   ```bash
   npm start
   ```
   Access the app at `http://localhost:3000`

## 🌍 Deployment (GitHub Pages)

This project is configured to automatically deploy to GitHub Pages.

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy: Tahap 2 Complete"
   git push origin main
   ```

2. **Enable Pages**
   - Go to GitHub Repo -> **Settings** -> **Pages**.
   - Under **Build and deployment**, select **GitHub Actions** as the source.

## 🏗️ Development Roadmap

### ✅ Tahap 1: Foundation
- [x] Basic HTML/CSS/JS Structure
- [x] Offline Database (LocalStorage)
- [x] Dashboard UI

### ✅ Tahap 2: Intelligence & Refactor
- [x] Refactor to Modular Assets
- [x] Gemini 2.5 Flash Integration
- [x] Chat Widget & AI Analysis Tools

### 🔜 Tahap 3: Advanced (Planned)
- [ ] **PWA Support**: Install input App on Android/iOS home screen.
- [ ] **Voice Input**: Dictate SOAP notes using speech-to-text.
- [ ] **Real Backend**: Sync data across devices (Firebase/Supabase).
- [ ] **PDF Export**: Generate text/PDF for case reports.

## 📂 Project Structure

```
medical-assistant/
├── .github/workflows/  # Deployment scripts
├── assets/
│   ├── css/            # Styles
│   └── js/             # Logic (AI, DB, App)
├── docs/               # Documentation
├── index.html          # Entry point
└── package.json        # NPM Config
```

## 👨‍⚕️ Credits
Made with ❤️ for Medical Students.
