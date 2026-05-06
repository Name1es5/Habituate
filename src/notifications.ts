import { getNotifSettings, hasSessionToday } from "./store";

let scheduledTimer: ReturnType<typeof setTimeout> | null = null;

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return Promise.resolve("denied");
  return Notification.requestPermission();
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

function showReminderNotification() {
  if (Notification.permission !== "granted") return;
  if (hasSessionToday()) return;

  new Notification("ERP Exercise", {
    body: "Time for your daily ERP session. You've got this.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: "erp-daily-reminder",
  });
}

export function scheduleNotification() {
  if (scheduledTimer) {
    clearTimeout(scheduledTimer);
    scheduledTimer = null;
  }

  const { enabled, time } = getNotifSettings();
  if (!enabled || Notification.permission !== "granted") return;

  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  // If the time has already passed today, schedule for tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const msUntil = target.getTime() - now.getTime();

  scheduledTimer = setTimeout(() => {
    showReminderNotification();
    // Reschedule for the next day
    scheduleNotification();
  }, msUntil);
}

// Call once on app load
export function initNotifications() {
  scheduleNotification();

  // Also show immediately if it's past the reminder time and no session yet today
  const { enabled, time } = getNotifSettings();
  if (!enabled || Notification.permission !== "granted") return;

  const [hours, minutes] = time.split(":").map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  if (now >= target && !hasSessionToday()) {
    showReminderNotification();
  }
}
