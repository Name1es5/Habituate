import type { AppSettings, Session } from "./types";

const SETTINGS_KEY = "erp_settings";
const SESSIONS_KEY = "erp_sessions";
const NOTIF_KEY = "erp_notif";

const defaultSettings: AppSettings = {
  triggerWords: [],
  hobbySearchTerms: [],
  imageSearchTerms: [],
  triggerFrequency: "normal",
  showPugBuddy: true,
  calmingMusic: false,
  wordDifficulty: {},
};

export interface NotifSettings {
  enabled: boolean;
  time: string; // "HH:MM" 24h
}

const defaultNotifSettings: NotifSettings = {
  enabled: false,
  time: "19:00",
};

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(s: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function getNotifSettings(): NotifSettings {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    return raw ? { ...defaultNotifSettings, ...JSON.parse(raw) } : defaultNotifSettings;
  } catch {
    return defaultNotifSettings;
  }
}

export function saveNotifSettings(s: NotifSettings) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(s));
}

export function getSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: Session) {
  const sessions = getSessions();
  sessions.unshift(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function hasSessionToday(): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return getSessions().some((s) => s.date.slice(0, 10) === today);
}

export function getStreak(): number {
  const sessions = getSessions();
  if (sessions.length === 0) return 0;

  const days = new Set(sessions.map((s) => s.date.slice(0, 10)));
  const sorted = Array.from(days).sort().reverse();

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}
