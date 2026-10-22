// lib/aartiAlarmEngine.ts

export interface ActiveAartiAlarm {
  id: string; // e.g. "pandharpur-vitthal-Kakad Aarti"
  templeId: string;
  templeName: string;
  deity: string;
  aartiName: string;
  timeStr: string; // e.g. "04:30 AM" or "06:00 AM"
  enabled: boolean;
}

// Convert "06:00 AM" or "06:30 PM" to 24hr { hours, minutes }
export function parseTimeTo24H(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}

// Calculate remaining ms until the alarm time
export function getRemainingMs(timeStr: string): number | null {
  const parsed = parseTimeTo24H(timeStr);
  if (!parsed) return null;

  const now = new Date();
  const target = new Date();
  target.setHours(parsed.hours, parsed.minutes, 0, 0);

  // If time has already passed today, ring tomorrow
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - now.getTime();
}

// Sound loop controller using Web Audio API (Zero external mp3 files needed)
class SoundAlarmPlayer {
  private ctx: AudioContext | null = null;
  private intervalId: NodeJS.Timeout | null = null;

  startRinging() {
    this.stopRinging();

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    const ringBell = () => {
      if (!this.ctx || this.ctx.state === "closed") return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const now = this.ctx.currentTime;
      const fundamental = 659.25; // E5 sacred bell tone
      const harmonics = [1, 2.05, 3.02, 4.3];
      const gains = [0.4, 0.25, 0.15, 0.08];

      harmonics.forEach((h, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = idx === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(fundamental * h, now);

        gain.gain.setValueAtTime(gains[idx], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 1.8);
      });
    };

    // Ring immediately and repeat every 1.5 seconds until stopped
    ringBell();
    this.intervalId = setInterval(ringBell, 1500);
  }

  stopRinging() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx && this.ctx.state !== "closed") {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const alarmAudio = new SoundAlarmPlayer();