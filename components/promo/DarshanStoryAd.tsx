"use client";

import React, { useState, useRef } from "react";
import { Download, Film, Sparkles, CheckCircle2, Loader2, Play } from "lucide-react";

interface AdSceneConfig {
  tagline: string;
  headline: string;
  subtext: string;
  hindiHeadline: string;
  color: string;
}

const SCENES: AdSceneConfig[] = [
  {
    tagline: "OFFICIAL LIVE SANCTUMS",
    headline: "Distance Fades.\nDevotion Remains.",
    hindiHeadline: "घर बैठे Live दर्शन 🪔",
    subtext: "Pandharpur • Kashi Vishwanath • Tirupati Balaji",
    color: "#EA580C",
  },
  {
    tagline: "REAL-TIME AARTI ALARMS",
    headline: "Wake Up to Sacred\nTemple Bells.",
    hindiHeadline: "कधीही आरती चुकणार नाही 🔔",
    subtext: "Daily alarms for Kakad, Bhog & Shej Aarti.",
    color: "#DC2626",
  },
  {
    tagline: "ZERO QUEUES • DIRECT TRUSTS",
    headline: "Verified Sanctum Passes\nDirect from Temples.",
    hindiHeadline: "थेट अधिकृत दर्शन पास 🎟️",
    subtext: "No broker fees. Pure darshan.",
    color: "#D97706",
  },
  {
    tagline: "BHARAT'S DIGITAL TEMPLE PLATFORM",
    headline: "Experience the Divine.\nWherever You Are.",
    hindiHeadline: "Darshan 🚩",
    subtext: "Visit darshan.in to start your live darshan.",
    color: "#B45309",
  },
];

export default function VideoAdPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Synthesize Bell Harmonics into an AudioNode for the video stream
  const playBellChime = (ctx: AudioContext, dest: MediaStreamAudioDestinationNode) => {
    const now = ctx.currentTime;
    [587.33, 1174.66, 1762].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      osc.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 1.8);
    });
  };

  const handleGenerateAndDownloadMP4 = async () => {
    setIsGenerating(true);
    setProgress(0);
    setVideoUrl(null);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Standard 9:16 vertical resolution for Reels/Stories
    const width = 720;
    const height = 1280;
    canvas.width = width;
    canvas.height = height;

    // Setup Web Audio Stream Destination
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const audioDest = audioCtx.createMediaStreamDestination();

    // Combine Canvas stream + Audio stream
    const canvasStream = canvas.captureStream(30); // 30 FPS
    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioDest.stream.getAudioTracks(),
    ]);

    // Choose preferred video container
    let mimeType = "video/mp4";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = "video/webm;codecs=vp9,opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm";
      }
    }

    const mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: 4_500_000,
    });

    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: mimeType });
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
      setIsGenerating(false);

      // Trigger automatic file download
      const a = document.createElement("a");
      a.href = url;
      a.download = `darshan-video-ad.${mimeType.includes("mp4") ? "mp4" : "webm"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    mediaRecorder.start();

    // 15-second total video duration at 30fps = 450 frames
    const totalFrames = 450;
    const framesPerScene = totalFrames / SCENES.length;

    let frame = 0;

    const renderLoop = () => {
      if (frame >= totalFrames) {
        mediaRecorder.stop();
        audioCtx.close();
        return;
      }

      const sceneIndex = Math.min(
        Math.floor(frame / framesPerScene),
        SCENES.length - 1
      );
      const scene = SCENES[sceneIndex];
      const sceneProgress = (frame % framesPerScene) / framesPerScene;

      // Play bell sound at the start of each scene
      if (frame % Math.floor(framesPerScene) === 0) {
        playBellChime(audioCtx, audioDest);
      }

      // --- 1. Draw Deep Velvet Maroon Gradient Background ---
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        height / 1.4
      );
      bgGrad.addColorStop(0, "#2F1113");
      bgGrad.addColorStop(1, "#0D0405");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // --- 2. Dynamic Ambient Golden Orbs ---
      const pulse = Math.sin(frame * 0.08) * 30;
      const orbGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.38,
        10,
        width / 2,
        height * 0.38,
        280 + pulse
      );
      orbGrad.addColorStop(0, "rgba(245, 158, 11, 0.28)");
      orbGrad.addColorStop(1, "rgba(220, 38, 38, 0)");
      ctx.fillStyle = orbGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.38, 280 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // --- 3. Top Progress Indicators (Instagram/Status Style) ---
      const barSpacing = 8;
      const barWidth = (width - 60 - barSpacing * (SCENES.length - 1)) / SCENES.length;
      for (let i = 0; i < SCENES.length; i++) {
        const x = 30 + i * (barWidth + barSpacing);
        ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
        ctx.fillRect(x, 40, barWidth, 6);

        if (i < sceneIndex) {
          ctx.fillStyle = "#F59E0B";
          ctx.fillRect(x, 40, barWidth, 6);
        } else if (i === sceneIndex) {
          ctx.fillStyle = "#F59E0B";
          ctx.fillRect(x, 40, barWidth * sceneProgress, 6);
        }
      }

      // --- 4. Brand Header ---
      ctx.fillStyle = "#EA580C";
      ctx.beginPath();
      ctx.arc(60, 95, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 24px serif";
      ctx.textAlign = "left";
      ctx.fillText("Darshan", 95, 98);

      ctx.fillStyle = "#F59E0B";
      ctx.font = "bold 11px sans-serif";
      ctx.fillText("BHARAT'S TEMPLE APP", 95, 114);

      // Live Indicator
      ctx.fillStyle = "#DC2626";
      ctx.beginPath();
      ctx.arc(width - 80, 100, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("LIVE", width - 68, 104);

      // --- 5. Scene Eyebrow Badge ---
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(245, 158, 11, 0.15)";
      ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
      ctx.lineWidth = 1.5;
      const badgeY = 320;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 160, badgeY - 22, 320, 36, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#FBBF24";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(scene.tagline, width / 2, badgeY);

      // --- 6. Hindi Hook Highlight ---
      ctx.fillStyle = "#FDE68A";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText(scene.hindiHeadline, width / 2, 420);

      // --- 7. Main Animated Headline ---
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 44px serif";
      const lines = scene.headline.split("\n");
      lines.forEach((line, idx) => {
        ctx.fillText(line, width / 2, 510 + idx * 56);
      });

      // --- 8. Subtext ---
      ctx.fillStyle = "#D6C7B8";
      ctx.font = "18px sans-serif";
      ctx.fillText(scene.subtext, width / 2, 670);

      // --- 9. Verified Sanctum Trust Badges ---
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.beginPath();
      ctx.roundRect(width / 2 - 200, 750, 400, 50, 14);
      ctx.fill();

      ctx.fillStyle = "#FDE68A";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("✦ Pandharpur • Kashi • Tirupati • Shirdi ✦", width / 2, 781);

      // --- 10. Bottom Swipe-up / CTA Button ---
      const ctaGrad = ctx.createLinearGradient(width / 2 - 220, 1080, width / 2 + 220, 1150);
      ctaGrad.addColorStop(0, "#EA580C");
      ctaGrad.addColorStop(1, "#DC2626");

      ctx.fillStyle = ctaGrad;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 220, 1080, 440, 70, 24);
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("WATCH LIVE DARSHAN NOW ➔", width / 2, 1124);

      ctx.fillStyle = "#9C8578";
      ctx.font = "13px sans-serif";
      ctx.fillText("Visit darshan.in or tap link in story", width / 2, 1180);

      frame++;
      setProgress(Math.round((frame / totalFrames) * 100));
      requestAnimationFrame(renderLoop);
    };

    renderLoop();
  };

  return (
    <main className="min-h-screen bg-[#110506] text-white flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-xl w-full text-center space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vertical Video Generator (9:16)</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-amber-100">
            Export Video Ad for WhatsApp & Instagram
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm">
            Generate and download a high-definition 15-second vertical commercial with synchronized temple bell audio.
          </p>
        </div>

        {/* Hidden / Live Render Canvas */}
        <div className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-600/40 bg-black flex justify-center items-center w-[270px] h-[480px]">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain"
            style={{ width: "270px", height: "480px" }}
          />

          {!isGenerating && !videoUrl && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-4 text-center">
              <Film className="w-12 h-12 text-amber-500 mb-2" />
              <p className="text-xs text-stone-200">
                Click below to render the 15-second video ad with audio
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 p-4 text-center space-y-2">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
              <p className="text-sm font-bold text-amber-200">Rendering Video...</p>
              <p className="text-xs text-stone-300">{progress}% completed</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerateAndDownloadMP4}
            className="w-full py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:opacity-50 shadow-xl shadow-orange-600/30 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rendering Frames ({progress}%)...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Generate & Download MP4 Video</span>
              </>
            )}
          </button>

          {videoUrl && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-left space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Video Generated & Downloaded!</span>
              </div>
              <p className="text-[11px] text-stone-300">
                If the automatic download did not trigger, you can preview or save it directly:
              </p>
              <video
                src={videoUrl}
                controls
                className="w-full rounded-xl border border-white/10 mt-2 aspect-[9/16] max-h-60 mx-auto"
              />
            </div>
          )}
        </div>

      </div>
    </main>
  );
}