"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Loader2,
  Sparkles,
  Film,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Flame,
  Bell,
  Radio,
  CheckCircle2,
} from "lucide-react";

interface SceneTiming {
  id: number;
  startSec: number;
  endSec: number;
  phase: string;
  marathiVO: string;
  headline: string;
  subtext: string;
  badge: string;
  tone: string;
}

const SCENES: SceneTiming[] = [
  {
    id: 1,
    startSec: 0,
    endSec: 6,
    phase: "THE DISCONNECT",
    marathiVO:
      "“गाव सोडलं... करिअरसाठी शहर गाठलं. पण सकाळी देवाची काकड आरती ऐकल्याशिवाय दिवसाची सुरुवात कधी अपूर्ण वाटली आहे का?”",
    headline: "घर दूर आहे...\nपण भक्ती नाही.",
    subtext: "Stuck in the city rush, missing the morning aarti back home.",
    badge: "५०० KM AWAY FROM HOME",
    tone: "#170A0C",
  },
  {
    id: 2,
    startSec: 6,
    endSec: 14,
    phase: "THE SACRED AWAKENING",
    marathiVO:
      "“आता तुमची सकाळ थेट मंदिराच्या गाभाऱ्यातून सुरू होईल. एकही आरती कधी चुकणार नाही.”",
    headline: "🔔 04:30 AM\nकाकड आरती सुरू होत आहे",
    subtext: "श्री विठ्ठल रुक्मिणी मंदिर • पंढरपूर",
    badge: "DAILY REAL-TIME AARTI ALARMS",
    tone: "#280E11",
  },
  {
    id: 3,
    startSec: 14,
    endSec: 20,
    phase: "THE SANCTUM EXPERIENCE",
    marathiVO:
      "“अधिकृत लाइव्ह दर्शन, थेट देवस्थान ट्रस्टकडून. कोणत्याही मध्यस्थांशिवाय.”",
    headline: "१००% अधिकृत\nट्रस्ट लाइव्ह स्ट्रीम 🪔",
    subtext: "पंढरपूर • काशी विश्वनाथ • तिरुमला बालाजी • शिर्डी",
    badge: "DIRECT GARBHAGRIHA STREAM",
    tone: "#361215",
  },
  {
    id: 4,
    startSec: 20,
    endSec: 25,
    phase: "THE SACRED ANCHOR",
    marathiVO:
      "“आजच दर्शन सुरू करा. तुमच्या खिशातील पवित्र मंदिर — Darshan.”",
    headline: "तुमच्या खिशातील\nपवित्र मंदिर 🚩",
    subtext: "५०,०००+ भाविक दररोज जोडलेले",
    badge: "DARSHAN APP",
    tone: "#1A0608",
  },
];

const TOTAL_DURATION = 25; // 25 Seconds exact match to Concept 1

export default function EmotionalAdGenerator() {
  const [currentSec, setCurrentSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [videoDownloadUrl, setVideoDownloadUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Active scene pointer
  const activeScene =
    SCENES.find((s) => currentSec >= s.startSec && currentSec < s.endSec) ||
    SCENES[SCENES.length - 1];

  // Browser Preview Loop (100ms ticks)
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSec((prev) => {
        if (prev >= TOTAL_DURATION) return 0;
        return Number((prev + 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Audio effects synthesizer for Preview (Chime at scene changes)
  useEffect(() => {
    if (isMuted || !isPlaying) return;

    const secInt = Math.floor(currentSec);
    // Trigger brass chime on Scene 2 (Aarti Awakening) and Scene 3 (Sanctum)
    if (secInt === 6 || secInt === 14) {
      try {
        const AudioClass = window.AudioContext || window.webkitAudioContext;
        if (!audioCtxRef.current && AudioClass) {
          audioCtxRef.current = new AudioClass();
        }
        const ctx = audioCtxRef.current;
        if (ctx) {
          if (ctx.state === "suspended") ctx.resume();
          const now = ctx.currentTime;
          [587.33, 1174.66, 1762].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(0.25 / (idx + 1), now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 2.2);
          });
        }
      } catch {}
    }
  }, [currentSec, isMuted, isPlaying]);

  // Canvas Video Rendering Engine (Generates exact 25s 9:16 MP4 file)
  const renderAndExportMP4 = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setVideoDownloadUrl(null);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Standard high-definition 9:16 mobile canvas (720x1280)
    const W = 720;
    const H = 1280;
    canvas.width = W;
    canvas.height = H;

    // Web Audio Synthesizer Destination
    const AudioClass = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioClass();
    const dest = audioCtx.createMediaStreamDestination();

    // Constant soothing Tanpura / Sitar harmonic drone throughout the 25s
    const tanpuraOsc = audioCtx.createOscillator();
    const tanpuraGain = audioCtx.createGain();
    tanpuraOsc.type = "sine";
    tanpuraOsc.frequency.setValueAtTime(146.83, audioCtx.currentTime); // D3 tonic drone
    tanpuraGain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    tanpuraOsc.connect(tanpuraGain);
    tanpuraGain.connect(dest);
    tanpuraOsc.start();

    // Sacred Bell function
    const ringBell = (timeOffset: number) => {
      [587.33, 1174.66, 1762].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(freq, timeOffset);
        gain.gain.setValueAtTime(0.22 / (idx + 1), timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.0001, timeOffset + 2.4);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(timeOffset);
        osc.stop(timeOffset + 2.4);
      });
    };

    const canvasStream = canvas.captureStream(30); // 30 FPS
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ]);

    let mimeType = "video/mp4";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm;codecs=vp9,opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }
    }

    const recorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 4_500_000,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      setVideoDownloadUrl(url);
      setIsExporting(false);

      const a = document.createElement("a");
      a.href = url;
      a.download = `darshan-aaichi-aathvan-ad.${mimeType.includes("mp4") ? "mp4" : "webm"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    recorder.start();

    // 25 seconds @ 30 FPS = 750 frames
    const totalFrames = 750;
    let frame = 0;

    const renderFrame = () => {
      if (frame >= totalFrames) {
        recorder.stop();
        tanpuraOsc.stop();
        audioCtx.close();
        return;
      }

      const currentSecond = frame / 30;
      const scene =
        SCENES.find((s) => currentSecond >= s.startSec && currentSecond < s.endSec) ||
        SCENES[SCENES.length - 1];

      // Audio triggers on frame boundaries
      if (frame === 6 * 30 || frame === 14 * 30) {
        ringBell(audioCtx.currentTime);
      }

      // 1. Atmosphere Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, scene.tone);
      bgGrad.addColorStop(1, "#070203");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // 2. Sanctum Warmth Radial Pulse
      const pulse = Math.sin(frame * 0.07) * 35;
      const orb = ctx.createRadialGradient(
        W / 2,
        H * 0.36,
        15,
        W / 2,
        H * 0.36,
        280 + pulse
      );
      orb.addColorStop(0, "rgba(245, 158, 11, 0.3)");
      orb.addColorStop(1, "rgba(220, 38, 38, 0)");
      ctx.fillStyle = orb;
      ctx.beginPath();
      ctx.arc(W / 2, H * 0.36, 280 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // 3. Floating Flower Petals / Diya Sparks (Scene 3 & 4)
      if (currentSecond >= 14) {
        for (let i = 0; i < 7; i++) {
          const petalY = ((frame * 2.5 + i * 160) % H);
          const petalX = (W / 2) + Math.sin(frame * 0.05 + i) * 220;
          ctx.fillStyle = i % 2 === 0 ? "rgba(251, 191, 36, 0.6)" : "rgba(248, 113, 113, 0.5)";
          ctx.beginPath();
          ctx.arc(petalX, H - petalY, 5 + (i % 3), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. WhatsApp / Story Style Progress Segments (4 scenes)
      const pad = 24;
      const gap = 8;
      const segW = (W - pad * 2 - gap * (SCENES.length - 1)) / SCENES.length;
      SCENES.forEach((s, idx) => {
        const x = pad + idx * (segW + gap);
        ctx.fillStyle = "rgba(255, 255, 255, 0.22)";
        ctx.fillRect(x, 40, segW, 6);

        if (currentSecond >= s.endSec) {
          ctx.fillStyle = "#F59E0B";
          ctx.fillRect(x, 40, segW, 6);
        } else if (currentSecond >= s.startSec && currentSecond < s.endSec) {
          const sceneProg = (currentSecond - s.startSec) / (s.endSec - s.startSec);
          ctx.fillStyle = "#F59E0B";
          ctx.fillRect(x, 40, segW * sceneProg, 6);
        }
      });

      // 5. Header Brand Stamp
      ctx.fillStyle = "#EA580C";
      ctx.beginPath();
      ctx.arc(58, 100, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 24px serif";
      ctx.textAlign = "left";
      ctx.fillText("Darshan", 90, 103);

      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("BHARAT'S DIGITAL TEMPLE", 90, 120);

      // Live Sanctum Badge
      ctx.fillStyle = "#DC2626";
      ctx.beginPath();
      ctx.arc(W - 80, 102, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("LIVE", W - 68, 107);

      // 6. Scene Phase Eyebrow
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(245, 158, 11, 0.16)";
      ctx.strokeStyle = "rgba(245, 158, 11, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(W / 2 - 170, 310, 340, 38, 19);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#FBBF24";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText(scene.badge, W / 2, 334);

      // 7. Core Marathi Kinetic Typography
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 46px serif";
      const lines = scene.headline.split("\n");
      lines.forEach((l, i) => {
        ctx.fillText(l, W / 2, 450 + i * 58);
      });

      // 8. Subtext
      ctx.fillStyle = "#D6C7B8";
      ctx.font = "20px sans-serif";
      ctx.fillText(scene.subtext, W / 2, 600);

      // 9. Synchronized Emotional Voiceover Subtitle Box (Concept 1 Script)
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.strokeStyle = "rgba(251, 191, 36, 0.3)";
      ctx.beginPath();
      ctx.roundRect(W / 2 - 290, 680, 580, 150, 20);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#FDE68A";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText("VOICEOVER (आईची आठवण):", W / 2, 720);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "italic 18px serif";
      const voWords = scene.marathiVO.split(" ");
      let line1 = "";
      let line2 = "";
      voWords.forEach((word, idx) => {
        if (idx < 7) line1 += word + " ";
        else line2 += word + " ";
      });
      ctx.fillText(line1.trim(), W / 2, 765);
      if (line2) ctx.fillText(line2.trim(), W / 2, 798);

      // 10. Shrines Proof Bar
      ctx.fillStyle = "rgba(245, 158, 11, 0.1)";
      ctx.beginPath();
      ctx.roundRect(W / 2 - 220, 870, 440, 44, 12);
      ctx.fill();

      ctx.fillStyle = "#FDE68A";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("✦ पंढरपूर • काशी • तिरुमला बालाजी • शिर्डी ✦", W / 2, 897);

      // 11. Bottom Call to Action
      const ctaGrad = ctx.createLinearGradient(W / 2 - 230, 1080, W / 2 + 230, 1150);
      ctaGrad.addColorStop(0, "#EA580C");
      ctaGrad.addColorStop(1, "#DC2626");
      ctx.fillStyle = ctaGrad;
      ctx.beginPath();
      ctx.roundRect(W / 2 - 230, 1080, 460, 72, 24);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("आजच दर्शन सुरू करा ➔", W / 2, 1125);

      ctx.fillStyle = "#9C8578";
      ctx.font = "13px sans-serif";
      ctx.fillText("बायोमधील लिंकवर टॅप करा | darshan.in", W / 2, 1180);

      frame++;
      setExportProgress(Math.round((frame / totalFrames) * 100));
      requestAnimationFrame(renderFrame);
    };

    renderFrame();
  };

  return (
    <main className="min-h-screen bg-[#0C0305] text-white flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-xl w-full text-center space-y-6">
        
        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Script: Concept 1 &ldquo;आईची आठवण&rdquo; (25s Vertical)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-amber-100">
            Darshan — Animated Video Ad
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Watch the synchronized live preview below or click export to render an MP4 for WhatsApp Status & Instagram Reels.
          </p>
        </div>

        {/* 9:16 Video Player Card */}
        <div
          className="relative mx-auto w-[330px] aspect-[9/16] rounded-[2.5rem] overflow-hidden border-4 border-amber-500/40 shadow-2xl bg-black flex flex-col justify-between p-6 select-none transition-colors duration-700"
          style={{ backgroundColor: activeScene.tone }}
        >
          {/* Top Progress Segments */}
          <div className="space-y-3 z-10">
            <div className="flex gap-1.5 h-1">
              {SCENES.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex-1 h-full bg-white/20 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-amber-400 transition-all ${
                      currentSec >= s.endSec
                        ? "w-full"
                        : currentSec >= s.startSec
                        ? "w-full duration-100 ease-linear"
                        : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-md">
                  <Flame className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="text-left">
                  <span className="font-serif font-bold text-sm tracking-wide text-white block leading-none">
                    Darshan
                  </span>
                  <span className="text-[8px] uppercase tracking-wider text-amber-300 font-semibold">
                    Temple Portal
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  title={isMuted ? "Unmute bell" : "Mute bell"}
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  {isPlaying ? (
                    <RotateCcw className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-white" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Scene Content */}
          <div
            key={activeScene.id}
            className="my-auto space-y-3 text-center z-10 animate-in fade-in duration-300"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold tracking-wider uppercase">
              {activeScene.badge}
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white leading-tight whitespace-pre-line tracking-tight drop-shadow-md">
              {activeScene.headline}
            </h2>

            <p className="text-xs text-stone-300 leading-relaxed max-w-[260px] mx-auto">
              {activeScene.subtext}
            </p>

            {/* Voiceover Captions Box */}
            <div className="bg-black/60 border border-amber-500/20 rounded-xl p-3 text-left space-y-1">
              <span className="text-[9px] uppercase tracking-widest text-amber-400 font-bold block">
                🎙️ Voiceover (Marathi)
              </span>
              <p className="text-[11px] text-white/95 italic leading-snug">
                {activeScene.marathiVO}
              </p>
            </div>
          </div>

          {/* Bottom Swipe Bar */}
          <div className="space-y-1.5 z-10 text-center">
            <div className="w-full py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 shadow-xl shadow-orange-600/40 flex items-center justify-center gap-1.5">
              <span>आजच दर्शन सुरू करा ➔</span>
            </div>
            <span className="text-[10px] text-stone-400 block">
              0:{Math.floor(currentSec).toString().padStart(2, "0")} / 0:25 • darshan.in
            </span>
          </div>

          {/* Offscreen Rendering Canvas */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Export / Download MP4 Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            disabled={isExporting}
            onClick={renderAndExportMP4}
            className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rendering 25s Video ({exportProgress}%)...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Concept 1 Video as MP4</span>
              </>
            )}
          </button>

          {videoDownloadUrl && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-left space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Video Generated and Saved to Downloads!</span>
              </div>
              <video
                src={videoDownloadUrl}
                controls
                className="w-full rounded-xl border border-white/10 mt-2 aspect-[9/16] max-h-56 mx-auto"
              />
            </div>
          )}
        </div>

      </div>
    </main>
  );
}