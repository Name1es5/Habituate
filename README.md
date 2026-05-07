# ERP Practice App

A mobile-first progressive web app for practising **Exposure and Response Prevention (ERP)** — the evidence-based therapy for OCD and anxiety.

ERP works by deliberately exposing yourself to a trigger and sitting with the discomfort without performing a compulsion, until the anxiety naturally subsides. This app simulates that process using realistic-looking mock social media posts that contain your personal trigger words.

---

## How it works

1. **Add trigger words** in Settings — words or phrases that tend to spike your anxiety.
2. **Start a session** from the home screen. Choose a duration (1–60 min) and a mode.
3. During the session, a mock Reddit, Twitter, or Discord post appears containing your trigger word. Stay with it. Don't close the app, don't seek reassurance.
4. When the session ends, **log your anxiety** — peak level and where you are now. Watching that number drop over time is the evidence that ERP is working.

### Modes

| Mode | Description |
|------|-------------|
| **Standard** | Full session focused on trigger exposure |
| **Hybrid** | First half is trigger exposure; second half auto-searches a hobby topic you enjoy |
| **Split** | Trigger mock and hobby search side by side for the entire session — the trigger is always visible |

### Trigger word frequency

Controlled in Settings → Trigger Words:

| Setting | Appearances per post |
|---------|----------------------|
| **Less** | Once, in the post body only |
| **Normal** | 2–3 times across body and replies |
| **More** | 4–5 times across body, username, and replies |

### Home screen

- **10-week streak grid** — a square for every day, filled when you completed a session
- **Anxiety reduction stat** — updates dynamically based on your streak, showing the approximate improvement associated with consistent ERP practice
- **Daily fact** — a rotating evidence-based fact about avoidance and OCD, shown before every session

---

## Setup

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone git@github.com:Name1es5/erp-app.git
cd erp-app
npm install
```

---

## Running

### Development (live reload, no build step)

```bash
npm run dev
```

On Windows, double-click `launch-dev.bat` in the repo folder — it installs dependencies and starts the server automatically.

Or with Docker (recommended on Raspberry Pi — no local Node required):

```bash
docker compose --profile dev up dev
```

Access at `http://localhost:5173`

### Production

Builds a static site served by nginx:

```bash
docker compose up
```

Access at `http://localhost:8081`

---

## Deployment on Raspberry Pi

1. Clone the repo onto the Pi (use SSH, not HTTPS):
   ```bash
   git clone git@github.com:Name1es5/erp-app.git
   ```
2. Make sure your user owns the target directory before cloning:
   ```bash
   sudo chown -R $USER:$USER /mnt/configs
   ```
3. Run the production compose service:
   ```bash
   cd erp-app
   docker compose up -d
   ```
4. The app is available at `http://<pi-ip>:8081` from any device on the same network.

To pull updates:
```bash
git pull
docker compose up -d --build
```

---

## Tech stack

- **React 19** + TypeScript
- **Tailwind CSS** v3
- **Vite** + `vite-plugin-pwa` (installable as a PWA)
- **React Router** v7
- All data stored in `localStorage` — no backend, no accounts

---

## Privacy

Everything stays on your device. No data is sent anywhere. Trigger words and session history are stored only in your browser's local storage.
