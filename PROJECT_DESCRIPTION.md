# ERP Exercise App

A personal Exposure and Response Prevention (ERP) therapy tool for OCD, designed to simulate realistic trigger-word encounters in familiar social media contexts.

## What It Does

ERP therapy works by exposing you to anxiety-triggering stimuli while resisting compulsions, allowing anxiety to naturally habituate over time. This app replicates the unpredictable, naturalistic way trigger words appear online — in usernames, post bodies, or replies — so exposures feel genuine rather than artificial.

## Features

### Core Exercise
- **Mock social UIs** — realistic replicas of Reddit, Twitter, and Discord are generated for each session
- **Randomized platform** — the platform is randomly selected each session so you can't anticipate it
- **Randomized trigger placement** — the trigger word appears in a username, post body, or reply at random
- **Delayed reveal** — the trigger word appears after a random 3–10 second delay, simulating natural scrolling discovery
- **Countdown timer** — set your session duration (1–60 minutes); a progress bar tracks elapsed time
- **Exit button** — end the session early at any time and still log your results

### Hybrid Mode
The session is split into two halves:
1. **First half** — trigger word exposure in the mock social UI
2. **Second half** — a live Google search iframe auto-searches a random term from your preset hobby list, helping you approach previously avoided enjoyable activities

### Settings
- Add and remove **trigger words** that get embedded into generated content
- Add and remove **hobby search terms** used in hybrid mode's second half

### Post-Exercise Check-In
After every session, rate:
- **Peak anxiety** during the session (1–7)
- **Current anxiety** right now (1–7)

Ratings are labeled (Very mild → Extreme) and saved to your history.

### Session History & Streak Tracker
- Every completed session is logged with date, duration, mode, platform, and both anxiety ratings
- A **day streak counter** tracks consecutive days with at least one session
- Anxiety bars visualize your ratings across sessions so you can see habituation over time

## Tech Stack

- **React + TypeScript** (Vite)
- **Tailwind CSS**
- **React Router** for navigation
- **localStorage** for all data persistence — no account, no server, fully private

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

1. Go to **Settings** and add at least one trigger word
2. Optionally add hobby search terms to unlock Hybrid mode
3. Hit **Start Exercise**, pick your duration and mode, and begin
