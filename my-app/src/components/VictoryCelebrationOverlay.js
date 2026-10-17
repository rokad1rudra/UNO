"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CyberAvatar from "./CyberAvatar";

// Procedural Canvas Golden Confetti & Falling Embers ("Motion Perfect" Physics)
function VictoryConfettiCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Golden foil palette
    const goldPalette = [
      { base: "#facc15", highlight: "#fef08a", shadow: "#ca8a04" },
      { base: "#fbbf24", highlight: "#fffbeb", shadow: "#b45309" },
      { base: "#eab308", highlight: "#fde047", shadow: "#a16207" },
      { base: "#f59e0b", highlight: "#fef3c7", shadow: "#92400e" },
      { base: "#ffffff", highlight: "#ffffff", shadow: "#e2e8f0" },
      { base: "#ffd700", highlight: "#fff9c4", shadow: "#c59b27" },
    ];

    // Generate ~110 tumbling golden confetti ribbons
    const ribbonCount = Math.min(120, Math.floor(window.innerWidth / 12));
    const ribbons = Array.from({ length: ribbonCount }, (_, i) => {
      const palette = goldPalette[i % goldPalette.length];
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * -window.innerHeight * 1.2, // Staggered start above the screen
        width: Math.random() * 8 + 8, // 8-16px
        height: Math.random() * 12 + 12, // 12-24px
        palette,
        vy: Math.random() * 2.2 + 1.6, // Downward velocity
        swaySpeed: Math.random() * 0.03 + 0.015,
        swayAmp: Math.random() * 2.5 + 1.2,
        swayOffset: Math.random() * Math.PI * 2,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.08,
        vRotY: (Math.random() - 0.5) * 0.07,
        vRotZ: (Math.random() - 0.5) * 0.04,
        opacity: Math.random() * 0.4 + 0.6,
      };
    });

    // Generate ~45 floating golden sparks / embers
    const emberCount = 45;
    const embers = Array.from({ length: emberCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 2.5 + 1.0,
      vy: Math.random() * 0.9 + 0.4,
      vx: (Math.random() - 0.5) * 0.6,
      pulseSpeed: Math.random() * 0.04 + 0.02,
      pulseOffset: Math.random() * Math.PI * 2,
      maxAlpha: Math.random() * 0.5 + 0.4,
    }));

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw glowing sparks / embers
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y += e.vy;
        e.x += e.vx + Math.sin(time * 0.02 + e.pulseOffset) * 0.4;
        if (e.y > canvas.height + 20) {
          e.y = -10;
          e.x = Math.random() * canvas.width;
        }

        const alpha = (Math.sin(time * e.pulseSpeed + e.pulseOffset) * 0.3 + 0.7) * e.maxAlpha;
        const grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.radius * 2);
        grad.addColorStop(0, `rgba(254, 240, 138, ${alpha})`);
        grad.addColorStop(0.4, `rgba(234, 179, 8, ${alpha * 0.8})`);
        grad.addColorStop(1, "rgba(234, 179, 8, 0)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw 3D tumbling golden ribbons
      for (let i = 0; i < ribbons.length; i++) {
        const r = ribbons[i];
        r.y += r.vy;
        r.x += Math.sin(time * r.swaySpeed + r.swayOffset) * r.swayAmp;
        r.rotX += r.vRotX;
        r.rotY += r.vRotY;
        r.rotZ += r.vRotZ;

        // Wrap to above the screen when falling below
        if (r.y > canvas.height + 40) {
          r.y = -30 - Math.random() * 50;
          r.x = Math.random() * canvas.width;
        }

        // 3D perspective projection scaling
        const cosY = Math.cos(r.rotY);
        const cosX = Math.cos(r.rotX);
        const scaleW = Math.abs(cosY);
        const scaleH = Math.abs(cosX);

        if (scaleW < 0.05 && scaleH < 0.05) continue;

        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.rotate(r.rotZ);
        ctx.scale(scaleW, scaleH);

        // Realistic metallic sheen based on face angle facing camera
        const isBackFace = cosY * cosX < 0;
        const color = isBackFace ? r.palette.shadow : (scaleW > 0.7 ? r.palette.highlight : r.palette.base);

        ctx.fillStyle = color;
        ctx.globalAlpha = r.opacity;
        ctx.beginPath();
        ctx.rect(-r.width / 2, -r.height / 2, r.width, r.height);
        ctx.fill();

        // Top specular shine streak
        if (!isBackFace && scaleW > 0.5) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
          ctx.fillRect(-r.width / 2, -r.height / 2, r.width, 2.5);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 size-full"
    />
  );
}

// 3D Trophy SVG Graphic (Matches Mockup 3)
function GoldTrophy3D() {
  return (
    <div className="relative size-16 sm:size-20 flex items-center justify-center filter drop-shadow-[0_8px_20px_rgba(234,179,8,0.65)]">
      {/* Radiant Glow Behind Trophy */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-yellow-500/40 via-amber-400/30 to-transparent blur-xl animate-pulse" />

      <svg viewBox="0 0 120 120" className="size-full relative z-10">
        <defs>
          <linearGradient id="goldCup" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#facc15" />
            <stop offset="65%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>
          <linearGradient id="goldRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="goldBase" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#854d0e" />
            <stop offset="30%" stopColor="#facc15" />
            <stop offset="70%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#713f12" />
          </linearGradient>
        </defs>

        {/* Trophy Handles */}
        <path
          d="M 28 36 C 12 36 12 66 28 70 L 34 68 C 24 64 24 42 34 38 Z"
          fill="url(#goldCup)"
          stroke="#ca8a04"
          strokeWidth="1.5"
        />
        <path
          d="M 92 36 C 108 36 108 66 92 70 L 86 68 C 96 64 96 42 86 38 Z"
          fill="url(#goldCup)"
          stroke="#ca8a04"
          strokeWidth="1.5"
        />

        {/* Trophy Main Cup */}
        <path
          d="M 32 30 L 88 30 C 88 56 74 74 60 76 C 46 74 32 56 32 30 Z"
          fill="url(#goldCup)"
          stroke="#713f12"
          strokeWidth="1"
        />

        {/* Cup Rim Top */}
        <ellipse cx="60" cy="30" rx="28" ry="6" fill="url(#goldRim)" stroke="#fef08a" strokeWidth="1" />

        {/* UNO Text & "1" on Cup Face */}
        <text x="60" y="47" textAnchor="middle" fill="#713f12" fontSize="9" fontWeight="900" fontStyle="italic">
          UNO
        </text>
        <text x="60" y="66" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="900" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
          1
        </text>

        {/* Trophy Stem & Pedestal */}
        <path d="M 54 75 L 66 75 L 64 88 L 56 88 Z" fill="url(#goldCup)" />
        <ellipse cx="60" cy="89" rx="14" ry="3.5" fill="url(#goldRim)" />
        <path d="M 44 91 L 76 91 L 80 102 L 40 102 Z" fill="url(#goldBase)" stroke="#ca8a04" strokeWidth="1" />
        <ellipse cx="60" cy="91" rx="16" ry="3" fill="#fef08a" />
        <ellipse cx="60" cy="102" rx="20" ry="4" fill="#854d0e" />

        {/* Specular Highlights */}
        <path d="M 38 34 Q 44 54 52 68" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
        <circle cx="48" cy="36" r="2" fill="#ffffff" opacity="0.9" />
        <circle cx="78" cy="42" r="1.5" fill="#ffffff" opacity="0.9" />
      </svg>
    </div>
  );
}

// 3D Floating Fanned Uno Cards (Matches Mockup 3)
function FloatingVictoryCardGroup({ isLeft = true }) {
  return (
    <div className={`relative flex items-center ${isLeft ? "-rotate-6" : "rotate-6"} filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] animate-pulse`}>
      {/* Back card (Dark UNO back) */}
      <div className={`w-20 h-32 sm:w-24 sm:h-36 rounded-2xl p-1 bg-gradient-to-br from-zinc-800 to-black border border-white/20 shadow-2xl ${isLeft ? "-rotate-12 -mr-10" : "rotate-12 -ml-10"} z-0`}>
        <div className="size-full rounded-xl bg-zinc-950 border border-white/10 flex flex-col items-center justify-center p-2">
          <div className="size-14 rounded-full bg-gradient-to-br from-red-600 via-amber-500 to-yellow-400 flex items-center justify-center shadow-lg -rotate-12">
            <span className="text-sm font-black italic text-yellow-300 drop-shadow">UNO</span>
          </div>
        </div>
      </div>

      {/* Front card (Wild Card) */}
      <div className={`w-20 h-32 sm:w-24 sm:h-36 rounded-2xl p-1 bg-gradient-to-br from-zinc-700 to-zinc-900 border-2 border-white/40 shadow-2xl z-10 ${isLeft ? "rotate-6" : "-rotate-6"}`}>
        <div className="size-full rounded-xl bg-zinc-950 border border-white/20 flex flex-col items-center justify-center p-2">
          <div className="size-14 rounded-full overflow-hidden border-2 border-white/50 shadow-inner grid grid-cols-2 grid-rows-2">
            <div className="bg-red-500" />
            <div className="bg-sky-500" />
            <div className="bg-amber-400" />
            <div className="bg-emerald-500" />
          </div>
          <span className="mt-1 text-[8px] font-black uppercase tracking-widest text-yellow-300">
            WILD
          </span>
        </div>
      </div>
    </div>
  );
}

// Main Victory Celebration Overlay Component (Mockup 3)
export default function VictoryCelebrationOverlay({
  room,
  user,
  onPlayAgain,
  onBackToLobby,
  onClose,
}) {
  const [copied, setCopied] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [xpAnimated, setXpAnimated] = useState(0);

  // Compute 1st, 2nd, and 3rd place rankings
  const rankings = useMemo(() => {
    if (!room) return [];

    const players = [...(room.players || [])];

    // Priority 1: Use official placement if available
    const hasPlacements = players.some((p) => typeof p.placement === "number");

    if (hasPlacements) {
      return players.sort((a, b) => (a.placement || 99) - (b.placement || 99));
    }

    // Priority 2: Use room.winner as 1st, remaining sorted by cardCount
    const winnerId = room.winner?.id;
    return players.sort((a, b) => {
      if (a.id === winnerId) return -1;
      if (b.id === winnerId) return 1;
      return (a.cardCount ?? 99) - (b.cardCount ?? 99);
    });
  }, [room]);

  const firstPlace = rankings[0];
  const secondPlace = rankings[1];
  const thirdPlace = rankings[2];

  const isViewerWinner = user && firstPlace && (user.id === firstPlace.id || user.username === firstPlace.username);

  // Animate XP bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setXpAnimated(82);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Compute realistic match duration
  const matchTimeFormatted = useMemo(() => {
    if (!room?.startedAt) return "04:18";
    const start = new Date(room.startedAt).getTime();
    const end = Date.now();
    const rawDiffSec = Math.max(10, Math.floor((end - start) / 1000));
    // If room has been open for hours in dev, display a realistic match duration
    const effectiveSec = rawDiffSec > 1800 ? (240 + (rawDiffSec % 360)) : rawDiffSec;
    const mins = Math.floor(effectiveSec / 60).toString().padStart(2, "0");
    const secs = (effectiveSec % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }, [room?.startedAt]);

  const handleShare = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const shareText = `🏆 ${firstPlace?.username || "A Champion"} won the UNO match in UNO Arena! Match Code: ${room?.roomCode} — ${url}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  // If player minimized to view the 3D table
  if (minimized) {
    return (
      <div className="fixed top-20 right-6 z-50">
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 rounded-2xl border border-yellow-400/60 bg-[#0d1424]/95 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.5)] backdrop-blur-xl transition-all hover:scale-105 active:scale-95"
        >
          <span>🏆 Show Victory Celebration</span>
          <span className="size-2 rounded-full bg-yellow-400 animate-ping" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-y-auto px-4 py-6 sm:py-8 bg-[#040814]/92 backdrop-blur-md select-none">
      {/* 1. Golden Confetti & Embers Rain System ("Motion Perfect" Physics) */}
      <VictoryConfettiCanvas />

      {/* 2. Radial Victory Golden Ambient Spotlight Bloom in Background */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 size-[650px] sm:size-[850px] rounded-full bg-radial from-amber-500/25 via-yellow-600/10 to-transparent blur-3xl" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-t from-transparent via-yellow-500/5 to-transparent" />
      </div>

      {/* Top Bar with UNO Arena Logo and "View Table" toggle */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-5xl">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 font-black italic text-white text-xs shadow-lg">
            UNO
          </div>
          <span className="text-xs font-black tracking-widest text-zinc-300 uppercase">
            ARENA CHAMPIONSHIP
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMinimized(true)}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold text-zinc-300 backdrop-blur-md transition-all hover:bg-white/15 hover:text-white"
          >
            <span>👁️ View Table</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center size-8 rounded-full border border-white/15 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/15 transition-all text-xs font-bold"
              title="Close Celebration"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Celebration Core */}
      <div className="relative z-30 flex flex-col items-center w-full max-w-4xl my-auto py-2">
        {/* Floating Background Cards on Left & Right (Matches Mockup 3) */}
        <div className="pointer-events-none absolute -left-8 sm:-left-16 top-16 hidden md:block">
          <FloatingVictoryCardGroup isLeft={true} />
        </div>
        <div className="pointer-events-none absolute -right-8 sm:-right-16 top-16 hidden md:block">
          <FloatingVictoryCardGroup isLeft={false} />
        </div>

        {/* 1. Golden Crown Icon & Header */}
        <div className="flex flex-col items-center text-center mb-2 sm:mb-3">
          <div className="relative mb-0.5 filter drop-shadow-[0_4px_16px_rgba(250,204,21,0.7)] animate-bounce duration-1000">
            {/* Golden 3D Crown */}
            <svg viewBox="0 0 64 48" className="w-10 h-7 sm:w-12 sm:h-9 fill-yellow-400">
              <defs>
                <linearGradient id="crownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="40%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              <path
                d="M 6 40 L 58 40 L 52 14 L 38 28 L 32 6 L 26 28 L 12 14 Z"
                fill="url(#crownGrad)"
                stroke="#b45309"
                strokeWidth="1.5"
              />
              <circle cx="32" cy="6" r="3.5" fill="#fef08a" />
              <circle cx="12" cy="14" r="3" fill="#fef08a" />
              <circle cx="52" cy="14" r="3" fill="#fef08a" />
              <rect x="6" y="38" width="52" height="6" rx="3" fill="#b45309" />
              <circle cx="20" cy="41" r="1.5" fill="#fef08a" />
              <circle cx="32" cy="41" r="1.5" fill="#fef08a" />
              <circle cx="44" cy="41" r="1.5" fill="#fef08a" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black italic tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-yellow-500 drop-shadow-[0_6px_30px_rgba(250,204,21,0.75)]">
            VICTORY!
          </h1>
          <p className="mt-0.5 text-xs sm:text-sm font-bold tracking-wide text-zinc-300">
            {isViewerWinner ? (
              <span className="text-yellow-300 font-black">Celebrating you in 1st place! 🏆</span>
            ) : (
              <span>
                Celebrating <strong className="text-yellow-300">{firstPlace?.username || "A Champion"}</strong> in 1st place!
              </span>
            )}
          </p>
        </div>

        {/* 2. 3D Winners' Podium (1st, 2nd, 3rd) */}
        <div className="relative flex items-end justify-center gap-3 sm:gap-6 w-full max-w-2xl px-2 mb-4">
          {/* 2nd Place (Silver Podium - Left) */}
          {secondPlace && (
            <div className="flex flex-col items-center flex-1 max-w-[170px] animate-fade-in-up">
              {/* Silver Crown Emblem & Avatar */}
              <div className="relative mb-1 flex flex-col items-center">
                <span className="mb-0.5 text-xs text-slate-300 font-black">👑 2nd</span>
                <div className="relative p-1 rounded-2xl bg-gradient-to-b from-slate-200 to-slate-400 shadow-[0_0_20px_rgba(148,163,184,0.4)]">
                  <CyberAvatar name={secondPlace.username} index={1} size="sm" />
                  <div className="absolute -bottom-2 -right-1 rounded-full border border-slate-300 bg-slate-900 px-1.5 py-0.2 text-[9px] font-black text-slate-200">
                    Lv.2
                  </div>
                </div>
                <span className="mt-1 text-xs font-black text-slate-200 truncate max-w-[120px]">
                  {secondPlace.username}
                </span>
              </div>

              {/* Silver Stepped Cylinder Pedestal */}
              <div className="w-full h-18 sm:h-22 rounded-t-2xl border-t-2 border-x border-slate-300/60 bg-gradient-to-b from-slate-400 via-slate-600 to-slate-800 shadow-[0_15px_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-start pt-2">
                <div className="text-lg sm:text-xl font-black italic text-slate-100 drop-shadow">
                  2nd
                </div>
              </div>
            </div>
          )}

          {/* 1st Place (Gold Podium - Center Champion) */}
          {firstPlace && (
            <div className="relative -mt-4 flex flex-col items-center flex-1 max-w-[210px] z-10 animate-fade-in-up">
              {/* 3D Gold Trophy */}
              <GoldTrophy3D />

              {/* Golden Ring Avatar & Name */}
              <div className="relative mb-1 flex flex-col items-center -mt-1">
                <div className="relative p-1 rounded-2xl bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600 shadow-[0_0_35px_rgba(250,204,21,0.7)] animate-pulse">
                  <CyberAvatar name={firstPlace.username} index={0} size="md" />
                  <div className="absolute -bottom-2 -right-1 rounded-full border border-yellow-300 bg-amber-950 px-2 py-0.5 text-[9px] font-black text-yellow-300">
                    Lv.5
                  </div>
                </div>
                <span className="mt-1 text-sm font-black text-yellow-300 truncate max-w-[140px] drop-shadow">
                  {firstPlace.username}
                </span>
              </div>

              {/* Gold Stepped Cylinder Pedestal */}
              <div className="w-full h-24 sm:h-28 rounded-t-2xl border-t-4 border-x-2 border-yellow-300 bg-gradient-to-b from-amber-400 via-yellow-600 to-amber-900 shadow-[0_20px_45px_rgba(234,179,8,0.4)] flex flex-col items-center justify-start pt-2">
                <div className="text-xl sm:text-2xl font-black italic text-yellow-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                  1st
                </div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-200">
                  WINNER
                </span>
              </div>
            </div>
          )}

          {/* 3rd Place (Bronze Podium - Right) */}
          {thirdPlace && (
            <div className="flex flex-col items-center flex-1 max-w-[170px] animate-fade-in-up">
              {/* Bronze Crown Emblem & Avatar */}
              <div className="relative mb-1 flex flex-col items-center">
                <span className="mb-0.5 text-xs text-amber-600 font-black">👑 3rd</span>
                <div className="relative p-1 rounded-2xl bg-gradient-to-b from-amber-600 to-amber-800 shadow-[0_0_20px_rgba(217,119,6,0.4)]">
                  <CyberAvatar name={thirdPlace.username} index={2} size="sm" />
                  <div className="absolute -bottom-2 -right-1 rounded-full border border-amber-600 bg-zinc-900 px-1.5 py-0.2 text-[9px] font-black text-amber-300">
                    Lv.1
                  </div>
                </div>
                <span className="mt-1 text-xs font-black text-zinc-300 truncate max-w-[120px]">
                  {thirdPlace.username}
                </span>
              </div>

              {/* Bronze Stepped Cylinder Pedestal */}
              <div className="w-full h-16 sm:h-20 rounded-t-2xl border-t-2 border-x border-amber-600/60 bg-gradient-to-b from-amber-600 via-amber-800 to-zinc-900 shadow-[0_15px_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-start pt-2">
                <div className="text-lg sm:text-xl font-black italic text-amber-200 drop-shadow">
                  3rd
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Rewards & Match Stats Container (Matches Mockup 3) */}
        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0c1424]/85 p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-center">
            {/* Panel A: XP Earned & Progress */}
            <div className="flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-3 sm:p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-emerald-400 drop-shadow">
                  +120 XP earned
                </span>
                <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-black uppercase text-emerald-300">
                  XP
                </span>
              </div>

              {/* XP Animated Progress Bar */}
              <div className="my-2.5">
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    style={{ width: `${xpAnimated}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400 font-bold">
                  <span>Level: 39</span>
                  <span className="text-emerald-300">82%</span>
                </div>
              </div>

              <div className="text-[11px] font-black text-amber-300 flex items-center gap-1">
                <span>WIN STREAK:</span>
                <span className="text-yellow-400">🔥 5 WINS</span>
              </div>
            </div>

            {/* Panel B: Coins Earned */}
            <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-yellow-500/20 bg-yellow-950/20 p-3 sm:p-3.5">
              <span className="text-sm font-black text-yellow-300 drop-shadow">
                +75 COINS
              </span>

              {/* 3D Coin Stack Icon */}
              <div className="my-1.5 relative size-10 flex items-center justify-center filter drop-shadow-[0_4px_10px_rgba(234,179,8,0.5)]">
                <div className="size-8 rounded-full border-2 border-yellow-200 bg-gradient-to-tr from-amber-600 via-yellow-400 to-yellow-200 flex items-center justify-center text-xs font-black text-amber-950 shadow-inner">
                  🪙
                </div>
              </div>

              <div className="text-xs font-black text-yellow-200">
                Total: 🪙 {user?.coins ? (user.coins + 75).toLocaleString() : "1,450"}
              </div>
            </div>

            {/* Panel C: Match Stats */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-3.5 text-xs">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">
                MATCH STATS
              </h4>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Cards Played:</span>
                  <strong className="text-white">{room?.discardCount || 24}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Penalties Dodged:</span>
                  <strong className="text-white">4</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Draw 4 Used:</span>
                  <strong className="text-white">2</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Match Time:</span>
                  <strong className="text-yellow-300">{matchTimeFormatted}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. High-Impact Action Buttons (Matches Mockup 3) */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 w-full max-w-2xl">
          {/* Button 1: PLAY AGAIN */}
          <button
            type="button"
            onClick={onPlayAgain}
            className="flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-2xl border-t border-emerald-300 bg-gradient-to-b from-emerald-500 to-green-700 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_10px_25px_rgba(16,185,129,0.45)] transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-base">🔄</span>
            <div className="text-left leading-tight">
              <div>PLAY AGAIN</div>
              <div className="text-[9px] text-emerald-100 font-normal opacity-80">Deal New Hand</div>
            </div>
          </button>

          {/* Button 2: BACK TO LOBBY */}
          <button
            type="button"
            onClick={onBackToLobby}
            className="flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-2xl border-t border-sky-300 bg-gradient-to-b from-sky-500 to-blue-700 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_10px_25px_rgba(14,165,233,0.45)] transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-base">🏠</span>
            <div className="text-left leading-tight">
              <div>BACK TO LOBBY</div>
              <div className="text-[9px] text-sky-100 font-normal opacity-80">Return to Rooms</div>
            </div>
          </button>

          {/* Button 3: SHARE VICTORY */}
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-2xl border-t border-amber-300 bg-gradient-to-b from-amber-500 to-orange-600 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_10px_25px_rgba(245,158,11,0.45)] transition-all hover:scale-105 active:scale-95"
          >
            <span className="text-base">{copied ? "📋" : "🔗"}</span>
            <div className="text-left leading-tight">
              <div>{copied ? "COPIED LINK!" : "SHARE VICTORY"}</div>
              <div className="text-[9px] text-amber-100 font-normal opacity-80">
                {copied ? "Ready to Paste" : "Share Score"}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
