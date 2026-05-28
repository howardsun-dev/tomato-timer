# Tomato Timer

[![GitHub license](https://img.shields.io/github/license/howardsun-dev/tomato-timer)](./LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/howardsun-dev/tomato-timer)](https://github.com/howardsun-dev/tomato-timer/issues)
[![GitHub stars](https://img.shields.io/github/stars/howardsun-dev/tomato-timer)](https://github.com/howardsun-dev/tomato-timer/stars)
[![GitHub last commit](https://img.shields.io/github/last-commit/howardsun-dev/tomato-timer)](https://github.com/howardsun-dev/tomato-timer/commits/main)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=flat&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat&logo=github-actions&logoColor=white)](https://github.com/howardsun-dev/tomato-timer/actions)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://github.com/howardsun-dev/tomato-timer/releases)

## Overview

**Tomato Timer** is a cross-platform desktop Pomodoro timer built with Electron and React. It features an always-on-top transparent overlay, customizable presets, and focus/break cycle tracking to help maintain productivity through proven time management techniques.

## ✨ Key Features

### ⏱️ Core Timer Functionality
- **Precise Countdown** - Hours, minutes, and seconds with second-level accuracy
- **11 Quick Presets** - 1m, 3m, 5m, 10m, 15m, 20m, 25m, 30m, 45m, 1h, 90m for common work intervals
- **Pomodoro Mode** - Traditional 25/5 work/break cycles with long break every 4th session
- **Custom Duration** - Set any timer length from 1 minute to 99 hours
- **Manual Controls** - Focus, Short Break, Long Break, Next session buttons

### 🖥️ Desktop Experience
- **Always-on-Top Overlay** - Transparent window that stays visible above all applications
- **Click-through Mode** - Toggle with `Ctrl/Cmd + 6` to interact with windows beneath the timer
- **Frameless Design** - Clean, borderless window with custom controls
- **System Tray Integration** - Background operation with quick access menu
- **Cross-Platform** - Consistent experience on Windows, macOS, and Linux

### 🔄 Productivity Features
- **Auto-queue Next Session** - Automatically start next Pomodoro cycle (toggleable)
- **Completed Focus Counter** - Visual tracking of accomplished focus blocks
- **Session History** - Track your productivity patterns over time
- **Sound Notifications** - Audio cues for session start/end (optional)
- **Visual Indicators** - Color-coded states for focus vs break periods

### ⚙️ Technical Excellence
- **Electron + React** - Modern desktop framework with component-based UI
- **TypeScript** - End-to-end type safety for enhanced reliability
- **Local Storage** - Persistent preferences and session data
- **Global Shortcuts** - System-wide hotkeys for timer control
- **Automatic Updates** - Ready for electron-updater implementation
- **Accessibility** - Keyboard navigation and screen reader friendly

## 🛠️ Tech Stack

### Desktop Framework
- **Electron** - Cross-platform desktop application framework
- **React** - Component-based UI library
- **TypeScript** - Static typing for JavaScript

### State & Storage
- **React State** - useState and useReducer for component state
- **localStorage** - Persistent user preferences and settings
- **Electron Storage** - app.getPath('userData') for application data

### Build & Distribution
- **electron-builder** - Packaging and distribution tool
- **GitHub Actions** - Automated build and release pipeline
- **Platform Specific** - NSIS (Windows), dmg (macOS), AppImage (Linux)

## 📐 Architecture Overview

```
┌─────────────────────────────┐
│        Main Process         │
│ (Electron/BrowserWindow)    │
├─────────────────────────────┤
│ │ Preload Script (Context)  │
│ ├─────────────────────────┤ │
│ │   Renderer Process        │ │
│ │   (React + TypeScript)    │ │
│ │ ├─────────────────────┤ │ │
│ │ │   Timer Logic         │ │ │
│ │ │   UI Components       │ │ │
│ │ │   Settings Panel      │ │ │
│ │ ├─────────────────────┤ │ │
│ │ │   Global Shortcuts    │ │ │
│ │ │   System Tray Menu    │ │ │
│ │ └─────────────────────┘ │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
                                    │
                                    ▼
                           ┌─────────────────┐
                           │   User Data Dir │
                           │ (localStorage,  │
                           │  settings.json) │
                           └─────────────────┘
```

## 🚀 Quick Start

### Development
```bash
# Clone repository
git clone https://github.com/howardsun-dev/tomato-timer.git
cd tomato-timer

# Install dependencies
npm install

# Start in development mode
npm start
# Opens Electron window with React devtools
```

### Production Usage
Download latest release from [GitHub Releases](https://github.com/howardsun-dev/tomato-timer/releases):

**Windows:**
1. Download the .exe installer
2. Run and follow installation wizard
3. Launch from Start menu or desktop shortcut

**macOS:**
1. Download the .dmg file
2. Open and drag Tomato Timer to Applications folder
3. Launch from Applications or Launchpad

**Linux:**
1. Download the AppImage
2. Make executable: `chmod +x Tomato-Timer-*.AppImage`
3. Run: `./Tomato-Timer-*.AppImage`
4. (Optional) Integrate with desktop menu using AppImage launcher

## 🧪 Testing & Quality

```bash
# Linting
npm run lint

# Type checking
npm run typecheck

# Format code
npm run format

# Run tests (when implemented)
npm test
```

## 📋 Perfect For

- **Software Developers** - Maintain focus during coding sessions
- **Writers & Creators** - Pomodoro technique for writing sessions
- **Students** - Study sessions with built-in break reminders
- **Professionals** - Time blocking and meeting preparation
- **Anyone** seeking to improve time management and productivity

## 💼 Skills Demonstrated

This project showcases proficiency in:
- **Electron Development** - Main/renderer process communication, preload scripts
- **React Desktop Applications** - Component-based UI with hooks
- **TypeScript** - End-to-end type safety in desktop context
- **Cross-Platform Build** - Windows/macOS/Linux packaging and distribution
- **User Experience Design** - Always-on-top windows, click-through modes
- **Productivity Tools** - Understanding of time management methodologies
- **Desktop Integration** - System tray, global shortcuts, notifications
- **Persistent Storage** - User preferences and application state management
- **GitHub Actions CI/CD** - Automated build, test, and release workflows

## 🎯 Pomodoro Technique Benefits

- **Improved Focus** - Timed intervals create urgency and reduce procrastination
- **Regular Breaks** - Prevents burnout and maintains mental freshness
- **Time Awareness** - Makes time tangible and measurable
- **Reduced Multitasking** - Encourages single-task focus during intervals
- **Better Planning** - Helps estimate effort for future tasks

## 🔮 Future Enhancements

- [ ] Toggl integration for time tracking export
- [ ] Customizable work/break ratios
- [ ] Daily/weekly productivity reports
- [ ] Ambient sound options (white noise, cafe sounds)
- [ ] Mission statement/goals setting per session
- [ ] Team mode with shared timers
- [ ] Dark/light theme switching
- [ ] Keyboard layout customization
- [ ] Progress bar visualization within timer display

## 📞 Support & Feedback

**Issues & Bug Reports**: [GitHub Issues](https://github.com/howardsun-dev/tomato-timer/issues)  
**Feature Requests**: [GitHub Discussions](https://github.com/howardsun-dev/tomato-timer/discussions)  
**Pull Requests**: Welcome! Please follow contribution guidelines  
**Email**: howardsun.swe@gmail.com

---

*Built by Howard Sun — Full-Stack Engineer specializing in Electron, React, and TypeScript desktop applications that enhance productivity and user experience.*
