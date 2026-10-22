"use client";

import React from "react";
import { BellRing, VolumeX, Eye } from "lucide-react";
import { ActiveAartiAlarm } from "@/lib/aartiAlarmEngine";

interface AlarmOverlayProps {
  alarm: ActiveAartiAlarm | null;
  onDismiss: () => void;
  onGoToDarshan?: () => void;
}

export default function AlarmRingingOverlay({
  alarm,
  onDismiss,
  onGoToDarshan,
}: AlarmOverlayProps) {
  if (!alarm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#FAF5EE] border-2 border-red-500 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl space-y-6 animate-bounce-short">
        {/* Pulsing Alarm Bell Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-red-500/40">
            <BellRing className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider mb-2">
            🔔 Aarti Time Arrived ({alarm.timeStr})
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#2A1214]">
            {alarm.aartiName}
          </h2>
          <p className="text-sm font-medium text-amber-900 mt-1">
            {alarm.templeName}
          </p>
          <p className="text-xs text-[#7A6456] mt-0.5">{alarm.deity}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full py-3.5 px-4 bg-[#2C1315] hover:bg-black text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition-colors"
          >
            <VolumeX className="w-4 h-4 text-red-400" />
            <span>Stop & Dismiss Alarm</span>
          </button>

          {onGoToDarshan && (
            <button
              type="button"
              onClick={() => {
                onDismiss();
                onGoToDarshan();
              }}
              className="w-full py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Watch Live Aarti Sanctum</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}