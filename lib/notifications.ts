// lib/notifications.ts

export interface ScheduledAartiAlert {
  id: string; // e.g. "pandharpur-vitthal-Kakad Aarti"
  templeId: string;
  templeName: string;
  deity: string;
  aartiName: string;
  timeStr: string; // e.g. "04:30 AM" or "06:00 AM"
  minutesBefore: number; // e.g. 5, 10, or 15 mins
  enabled: boolean;
  repeatDaily: boolean;
}

// Convert "06:00 AM" or "06:30 PM" into { hours, minutes } in 24-hr format
export function parseAartiTimeTo24Hour(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}

// Calculate milliseconds until next occurrence of the aarti alert
export function getMillisecondsUntilAlert(timeStr: string, minutesBefore: number = 5): number | null {
  const parsed = parseAartiTimeTo24Hour(timeStr);
  if (!parsed) return null;

  const now = new Date();
  const alertTime = new Date();
  alertTime.setHours(parsed.hours, parsed.minutes, 0, 0);

  // Subtract offset (e.g. notify 5 or 10 minutes prior)
  alertTime.setMinutes(alertTime.getMinutes() - minutesBefore);

  // If time has already passed today, schedule for tomorrow
  if (alertTime.getTime() <= now.getTime()) {
    alertTime.setDate(alertTime.getDate() + 1);
  }

  return alertTime.getTime() - now.getTime();
}

// Request Notification Permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  if (Notification.permission === "granted") {
    return "granted";
  }
  return await Notification.requestPermission();
}

// Trigger browser notification directly
export function triggerAartiNotification(alert: ScheduledAartiAlert) {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  if (Notification.permission === "granted") {
    const title = `🔔 ${alert.aartiName} Starting Soon`;
    const body = `${alert.aartiName} at ${alert.templeName} (${alert.deity}) begins at ${alert.timeStr}. Join the live sanctum darshan!`;

    new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: alert.id,
      requireInteraction: true,
    });
  }
}

// Generate Google Calendar Link for recurring phone notifications
export function getGoogleCalendarUrl(templeName: string, aartiName: string, timeStr: string): string {
  const parsed = parseAartiTimeTo24Hour(timeStr);
  if (!parsed) return "#";

  const pad = (n: number) => String(n).padStart(2, "0");
  const today = new Date();
  const dateStr = `${today.getFullYear()}${pad(today.getMonth() + 1)}${pad(today.getDate())}`;
  const startIso = `${dateStr}T${pad(parsed.hours)}${pad(parsed.minutes)}00`;

  // Assume 30 min duration
  const endHours = parsed.hours + (parsed.minutes >= 30 ? 1 : 0);
  const endMinutes = (parsed.minutes + 30) % 60;
  const endIso = `${dateStr}T${pad(endHours % 24)}${pad(endMinutes)}00`;

  const title = encodeURIComponent(`🔔 ${aartiName} — ${templeName}`);
  const details = encodeURIComponent(
    `Daily ${aartiName} alert from Divine Darshan platform. Connect for live sanctum darshan.`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&recur=RRULE:FREQ=DAILY&details=${details}`;
}

// Generate an .ics file download for Apple Calendar / Android native alarms
export function downloadIcsAlarmFile(templeName: string, aartiName: string, timeStr: string) {
  const parsed = parseAartiTimeTo24Hour(timeStr);
  if (!parsed) return;

  const pad = (n: number) => String(n).padStart(2, "0");
  const today = new Date();
  const dateStr = `${today.getFullYear()}${pad(today.getMonth() + 1)}${pad(today.getDate())}`;
  const startIso = `${dateStr}T${pad(parsed.hours)}${pad(parsed.minutes)}00`;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Divine Darshan//Aarti Notification//EN
BEGIN:VEVENT
UID:${Date.now()}@divinedarshan.com
DTSTAMP:${dateStr}T000000Z
DTSTART:${startIso}
RRULE:FREQ=DAILY
SUMMARY:🔔 ${aartiName} - ${templeName}
DESCRIPTION:Daily ${aartiName} reminder on Divine Darshan.
BEGIN:VALARM
TRIGGER:-PT10M
ACTION:DISPLAY
DESCRIPTION:Reminder: ${aartiName} starts in 10 minutes
END:VALARM
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${templeName.replace(/\s+/g, "_")}_${aartiName.replace(/\s+/g, "_")}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}