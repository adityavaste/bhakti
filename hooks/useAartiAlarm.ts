"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ActiveAartiAlarm,
  getRemainingMs,
  alarmAudio,
} from "@/lib/aartiAlarmEngine";

const STORAGE_KEY = "divine_darshan_alarms";

export function useAartiAlarm() {
  const [alarms, setAlarms] = useState<ActiveAartiAlarm[]>([]);
  const [ringingAlarm, setRingingAlarm] = useState<ActiveAartiAlarm | null>(null);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Load alarms from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setAlarms(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load alarms:", e);
    }
  }, []);

  const saveAlarms = (newAlarms: ActiveAartiAlarm[]) => {
    setAlarms(newAlarms);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newAlarms));
    }
  };

  // Trigger sound, vibration, and push banner
  const fireAlarm = useCallback((alarm: ActiveAartiAlarm) => {
    setRingingAlarm(alarm);
    alarmAudio.startRinging();

    // Vibrate device (if mobile)
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate([500, 200, 500, 200, 1000]);
    }

    // System Notification banner
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(`🔔 Aarti Alarm: ${alarm.aartiName}`, {
          body: `${alarm.aartiName} at ${alarm.templeName} is starting now (${alarm.timeStr}). Tap to open live sanctum!`,
          requireInteraction: true,
          tag: alarm.id,
        });
      }
    }
  }, []);

  // Stop the current ringing alarm
  const dismissAlarm = useCallback(() => {
    alarmAudio.stopRinging();
    setRingingAlarm(null);
  }, []);

  // Schedule timer loop
  const scheduleAlarm = useCallback(
    (alarm: ActiveAartiAlarm) => {
      if (timersRef.current.has(alarm.id)) {
        clearTimeout(timersRef.current.get(alarm.id)!);
        timersRef.current.delete(alarm.id);
      }

      if (!alarm.enabled) return;

      const ms = getRemainingMs(alarm.timeStr);
      if (ms === null) return;

      const timerId = setTimeout(() => {
        fireAlarm(alarm);
        // Automatically re-schedule for tomorrow
        scheduleAlarm(alarm);
      }, ms);

      timersRef.current.set(alarm.id, timerId);
    },
    [fireAlarm]
  );

  // Arm all enabled alarms
  useEffect(() => {
    alarms.forEach((a) => {
      if (a.enabled) scheduleAlarm(a);
    });

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current.clear();
    };
  }, [alarms, scheduleAlarm]);

  // Toggle or create alarm
  const toggleAlarm = async (
    templeId: string,
    templeName: string,
    deity: string,
    aartiName: string,
    timeStr: string
  ) => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    }

    const alarmId = `${templeId}-${aartiName}`;
    const existing = alarms.find((a) => a.id === alarmId);

    if (existing) {
      const updated = alarms.map((a) =>
        a.id === alarmId ? { ...a, enabled: !a.enabled } : a
      );
      saveAlarms(updated);
    } else {
      const newAlarm: ActiveAartiAlarm = {
        id: alarmId,
        templeId,
        templeName,
        deity,
        aartiName,
        timeStr,
        enabled: true,
      };
      saveAlarms([...alarms, newAlarm]);
    }
  };

  const isAlarmSet = (templeId: string, aartiName: string): boolean => {
    const found = alarms.find((a) => a.id === `${templeId}-${aartiName}`);
    return Boolean(found && found.enabled);
  };

  return {
    alarms,
    ringingAlarm,
    toggleAlarm,
    dismissAlarm,
    isAlarmSet,
  };
}