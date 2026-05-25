# electron-timer-app

A compact Electron + React timer with an always-on-top transparent overlay.

Hotkey: `Ctrl/Cmd + 6` toggles overlay click-through mode.

## Features

- Countdown timer with hours, minutes, and seconds
- Quick presets: 5m, 10m, 15m, 25m, 45m, 1h
- Frameless transparent always-on-top window
- Click-through overlay mode
- Alarm sound when the timer completes

## Project Setup

### Install

Requires Node.js 22.12+ and npm 10+.

```bash
npm install
```

### Development

```bash
npm run dev
```

### Quality checks

```bash
npm test
npm run lint:check
npm run typecheck
npm run build
```

### Build installers

```bash
# For Windows
npm run build:win

# For macOS
npm run build:mac

# For Linux
npm run build:linux
```
