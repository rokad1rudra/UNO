"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { io } from "socket.io-client";
import CyberAvatar from "./CyberAvatar";
import UnoCard from "./UnoCard";
import OpponentSeatsOverlay from "./OpponentSeatsOverlay";
import VictoryCelebrationOverlay from "./VictoryCelebrationOverlay";

const Arena3DTable = dynamic(() => import("./Arena3DTable"), { ssr: false });

const emojis = ["🔥", "😂", "😮", "💀", "🎯", "❤️"];

export default function RoomClient({ roomCode }) {
  const [room, setRoom] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [wildCard, setWildCard] = useState(null);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatFilter, setChatFilter] = useState("all"); // 'all' | 'match' | 'chat'
  const [turnTimer, setTurnTimer] = useState(15);
  const [activeReactions, setActiveReactions] = useState({});
  const [showVictoryPreview, setShowVictoryPreview] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("victory") === "true") {
        setShowVictoryPreview(true);
      }
    }
  }, []);

  // Load Room state via REST
  const loadRoom = useMemo(
    () => () => {
      fetch(`/api/rooms/${roomCode}`).then(async (res) => {
        setLoading(false);
        if (res.ok) {
          const data = await res.json();
          setRoom(data.room);
          setError("");
        } else {
          const err = await res.json().catch(() => ({}));
          setError(err?.error || "Room not found.");
        }
      });
    },
    [roomCode]
  );

  // Initial load Room state via REST
  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  // Load Current User
  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      if (response.ok) setUser((await response.json()).user);
      else window.location.href = "/login";
    });
  }, []);

  // Socket Connection
  useEffect(() => {
    if (!user) return;
    const nextSocket = io({ withCredentials: true });
    socketRef.current = nextSocket;

    const join = () => {
      nextSocket.emit("room:join", { roomCode }, (response) => {
        setLoading(false);
        if (response?.ok) {
          setRoom(response.room);
          setError("");
        } else {
          setError(response?.error || "Could not connect to room.");
        }
      });
    };

    nextSocket.on("connect", join);
    if (nextSocket.connected) join();

    nextSocket.on("connect_error", (err) => {
      setError(err?.message ? `Connection error: ${err.message}` : "Could not connect to game server.");
    });

    nextSocket.on("room:changed", loadRoom);

    nextSocket.on("game:event", (event) => {
      if (event?.text) setToast(event.text);
    });

    nextSocket.on("chat:new", loadRoom);

    nextSocket.on("reaction:new", (reaction) => {
      if (reaction?.username && reaction?.emoji) {
        setToast(`${reaction.username}: ${reaction.emoji}`);
        setActiveReactions((prev) => ({
          ...prev,
          [reaction.username]: { emoji: reaction.emoji, timestamp: Date.now() },
        }));
      }
      loadRoom();
    });

    return () => {
      socketRef.current = null;
      nextSocket.disconnect();
    };
  }, [user, roomCode, loadRoom]);

  // Turn Countdown Timer
  useEffect(() => {
    setTurnTimer(15);
    const interval = setInterval(() => {
      setTurnTimer((prev) => (prev > 0 ? prev - 1 : 15));
    }, 1000);
    return () => clearInterval(interval);
  }, [room?.currentPlayerIndex, room?.status]);

  // Auto-hide Toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  function emit(name, payload = {}) {
    setError("");
    socketRef.current?.emit(name, { roomCode, ...payload }, (response) => {
      if (!response?.ok) setError(response?.error || "Action failed.");
      loadRoom();
    });
  }

  function play(card, chosenColor) {
    if (card.color === "wild" && !chosenColor) {
      setWildCard(card);
      return;
    }
    emit("game:play", { cardId: card.id, chosenColor });
    setWildCard(null);
  }

  function sendChat(event) {
    event.preventDefault();
    if (!message.trim()) return;
    emit("chat:send", { message });
    setMessage("");
  }

  // Me and Opponents
  const me = room?.players?.find((p) => p.id === user?.id);
  const opponents = (room?.players || []).filter((p) => p.id !== user?.id);
  const activePlayer = room?.players?.[room?.currentPlayerIndex];

  // Active Color Theme Tokens
  const activeColor = room?.activeColor || "green";
  const activeColorTrackClass =
    activeColor === "green"
      ? "table-glow-green"
      : activeColor === "red"
      ? "table-glow-red"
      : activeColor === "blue"
      ? "table-glow-blue"
      : activeColor === "yellow"
      ? "table-glow-yellow"
      : "table-glow-green";

  const activeColorHex =
    activeColor === "green"
      ? "#22c55e"
      : activeColor === "red"
      ? "#ef4444"
      : activeColor === "blue"
      ? "#38bdf8"
      : activeColor === "yellow"
      ? "#facc15"
      : "#22c55e";

  // Pre-configured opponent seats matching Mockup 1:
  // Seat 0: Left (Mira spot)
  // Seat 1: Top-Left (Elara spot)
  // Seat 2: Top-Right (Kai spot)
  // Seat 3: Right (Leo spot)
  const seatPositions = [
    { position: "left", label: "Mira", color: "#ef4444", turnClass: "turn-ring-red" },
    { position: "top-left", label: "Elara", color: "#38bdf8", turnClass: "turn-ring-blue" },
    { position: "top-right", label: "Kai", color: "#22c55e", turnClass: "turn-ring-green" },
    { position: "right", label: "Leo", color: "#facc15", turnClass: "turn-ring-yellow" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center p-6 text-zinc-400">
        <div className="text-center">
          <div className="mx-auto mb-3 size-12 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
          <p className="font-bold uppercase tracking-wider text-sm">Entering Arena...</p>
        </div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-red-500/30 bg-[#0d121c]/90 p-8 text-center text-red-100 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-500/20 text-3xl font-black text-red-400">
          !
        </div>
        <h2 className="mb-2 text-2xl font-black">{error}</h2>
        <p className="mb-6 text-sm text-zinc-400">This room may have been closed or the table code is incorrect.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => loadRoom()}
            className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 font-bold text-white hover:bg-white/20"
          >
            Retry
          </button>
          <a
            href="/dashboard"
            className="rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-5 py-2.5 font-black text-zinc-950 glow-button"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="relative flex-1 w-full h-[calc(100vh-56px)] max-h-[calc(100vh-56px)] overflow-hidden arena-stadium-canvas flex flex-col justify-between select-none">
      {/* Real 3D Arena Table & Stadium Background (Three.js & React Three Fiber) */}
      <Arena3DTable
        room={room}
        user={user}
        me={me}
        opponents={opponents}
        activePlayer={activePlayer}
        activeColor={activeColor}
        activeColorHex={activeColorHex}
        turnTimer={turnTimer}
        activeReactions={activeReactions}
        onDrawCard={() => emit("game:draw")}
        onPlayCard={play}
      />

      {/* Opponent Seats Pure React DOM Overlay (Zero Three.js sub-roots) */}
      <OpponentSeatsOverlay
        opponents={opponents}
        activePlayer={activePlayer}
        turnTimer={turnTimer}
        activeReactions={activeReactions}
      />

      {/* Top Arena HUD Bar (Matches Mockup 1) */}
      <header className="relative z-20 flex items-center justify-between px-3 py-2 sm:px-6 w-full">
        {/* Active Color Capsule */}
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d1424]/85 px-4 py-2 shadow-xl backdrop-blur-md">
          <span
            className="size-6 rounded-lg shadow-lg transition-colors duration-300"
            style={{
              backgroundColor: activeColorHex,
              boxShadow: `0 0 16px ${activeColorHex}`,
            }}
          />
          <div className="leading-tight">
            <span className="block text-[9px] font-black uppercase tracking-widest text-zinc-400">ACTIVE COLOR:</span>
            <span className="text-sm font-black uppercase text-white tracking-wider">{activeColor}</span>
          </div>
        </div>

        {/* Center Title Plate */}
        <div className="rounded-2xl border border-white/10 bg-[#0d1424]/85 px-6 py-2 shadow-xl backdrop-blur-md">
          <h1 className="text-sm sm:text-base font-black tracking-widest text-white uppercase">UNO ONLINE ARENA</h1>
          <p className="text-[11px] font-bold text-zinc-400 text-center">
            {room.name} · <span className="font-mono text-yellow-300">{room.roomCode}</span>
          </p>
        </div>

        {/* Options / Action Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#121929]/90 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-xl backdrop-blur-md hover:border-yellow-400/50 hover:bg-[#1a233a] active:scale-95"
          >
            <span>Options</span>
            <span className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}>⌵</span>
          </button>

          {/* Menu Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-12 z-50 w-52 rounded-2xl border border-white/15 bg-[#0a0f1d]/95 p-2 shadow-2xl backdrop-blur-2xl">
              <div className="border-b border-white/10 px-3 py-2 text-[11px] text-zinc-400">
                <p className="font-bold text-white">{room.players?.length}/{room.maxPlayers} Players Seated</p>
                <p className="font-mono text-yellow-300 font-bold">Code: {room.roomCode}</p>
              </div>

              {room.status === "waiting" && room.hostId === user?.id && (
                <button
                  type="button"
                  onClick={() => {
                    emit("game:start");
                    setMenuOpen(false);
                  }}
                  className="mt-1 flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-2 text-xs font-black text-zinc-950 hover:brightness-110"
                >
                  ▶ Start Match
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(room.roomCode);
                  setToast("Room code copied to clipboard!");
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-zinc-200 hover:bg-white/10"
              >
                📋 Copy Code
              </button>

              <button
                type="button"
                onClick={() => {
                  setChatOpen(!chatOpen);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-zinc-200 hover:bg-white/10"
              >
                💬 {chatOpen ? "Hide Chat Widget" : "Show Chat Widget"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowVictoryPreview(true);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-yellow-300 hover:bg-yellow-400/10"
              >
                🏆 Victory Celebration
              </button>

              <button
                type="button"
                onClick={() => {
                  emit("room:leave");
                  window.location.href = "/dashboard";
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10"
              >
                🚪 Leave Table
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Floating Notifications / Toasts */}
      {toast && (
        <div className="fixed top-16 left-1/2 z-50 -translate-x-1/2 rounded-full border border-yellow-400/50 bg-[#0d1424]/95 px-6 py-2 text-xs font-black uppercase tracking-wider text-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.4)] backdrop-blur-xl animate-bounce">
          ⚡ {toast}
        </div>
      )}

      {/* Bottom Area: Centered SAY UNO Button + Hand Arc (Matches Mockup 1) */}
      <div className="relative z-20 flex flex-col items-center pb-2 px-2 w-full max-w-4xl mx-auto">
        {/* Glowing 3D "SAY UNO" Button directly above player's hand */}
        <div className="mb-2">
          <button
            type="button"
            onClick={() => emit("game:uno")}
            disabled={room.status !== "playing" || me?.finished}
            className="say-uno-gloss-btn rounded-full px-10 py-2.5 text-base font-black tracking-widest text-white uppercase shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
          >
            SAY UNO
          </button>
        </div>

        {/* Hand Status Bar */}
        <div className="mb-1 flex items-center justify-between w-full max-w-xl px-4 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${me?.isTurn ? "bg-emerald-400 animate-ping" : "bg-yellow-400"}`} />
            <span className={me?.isTurn ? "text-emerald-300 font-black text-sm drop-shadow" : "text-yellow-300/90 font-bold"}>
              {room.status === "finished"
                ? "Game finished"
                : me?.isTurn
                ? "⚡ YOUR TURN! Click a playable card or draw."
                : activePlayer
                ? `${activePlayer.username}'s turn...`
                : "Waiting to start..."}
            </span>
          </div>
          <span className="text-zinc-300 font-mono">
            Hand: <strong className="text-yellow-300">{me?.hand?.length || 0}</strong> cards
          </span>
        </div>

        {/* Realistic Fan-Spread Hand Arc (Matches Mockup 1) */}
        <div className="relative flex items-end justify-center w-full overflow-x-auto pb-1 pt-2 px-2">
          {(me?.hand || []).map((card, idx) => {
            const total = me?.hand?.length || 1;
            const mid = (total - 1) / 2;
            // Calculate realistic handheld fanning angle & vertical arc
            const tilt = Math.max(-14, Math.min(14, (idx - mid) * 3.5));
            const translateY = Math.abs(idx - mid) * 2;

            // Check if card is currently playable
            const isPlayable =
              me?.isTurn &&
              room.status === "playing" &&
              (card.color === "wild" ||
                card.color === room.activeColor ||
                card.value === room.topCard?.value);

            return (
              <div
                key={card.id}
                style={{
                  transform: `rotate(${tilt}deg) translateY(${translateY}px)`,
                }}
                className={`relative transition-all duration-200 ${idx !== 0 ? "-ml-5 sm:-ml-7" : "ml-0"}`}
              >
                <UnoCard
                  card={card}
                  playable={isPlayable}
                  disabled={!me?.isTurn || room.status !== "playing" || me?.finished}
                  onClick={() => play(card)}
                />
              </div>
            );
          })}

          {!me?.hand?.length && (
            <div className="py-4 text-center text-xs font-bold text-zinc-400 bg-black/40 rounded-xl px-4">
              {room.status === "waiting" ? "Cards will be dealt when match starts!" : "No cards in hand."}
            </div>
          )}
        </div>
      </div>

        {/* Bottom Left Quick Controls (Mockup 1) */}
        <div className="absolute bottom-4 left-6 z-30 hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => setToast("Arena table audio enabled")}
            className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1424]/80 text-zinc-300 shadow-xl backdrop-blur-md hover:border-white/30 hover:text-white"
            title="Audio Settings"
          >
            ⚙
          </button>
          <a
            href="/rules"
            target="_blank"
            className="flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-[#0d1424]/80 text-zinc-300 shadow-xl backdrop-blur-md hover:border-white/30 hover:text-white"
            title="Official Rules"
          >
            📖
          </a>
        </div>

        {/* Floating "CHAT & MATCH LOG" Widget (Matches Mockup 1) */}
        {chatOpen ? (
          <aside className="absolute bottom-4 right-4 z-40 w-80 sm:w-88 max-w-[calc(100vw-32px)] floating-chat-widget rounded-2xl p-3.5">
            {/* Header with Badges and Close button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-white">CHAT & MATCH LOG</h3>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setChatFilter("all")}
                    className={`rounded px-1.5 py-0.5 text-[8px] font-black uppercase ${
                      chatFilter === "all" ? "bg-purple-500 text-white" : "bg-white/10 text-zinc-400"
                    }`}
                  >
                    BADGES
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatFilter("match")}
                    className={`rounded px-1.5 py-0.5 text-[8px] font-black uppercase ${
                      chatFilter === "match" ? "bg-blue-500 text-white" : "bg-white/10 text-zinc-400"
                    }`}
                  >
                    PLAYED
                  </button>
                  <button
                    type="button"
                    onClick={() => setChatFilter("chat")}
                    className={`rounded px-1.5 py-0.5 text-[8px] font-black uppercase ${
                      chatFilter === "chat" ? "bg-emerald-500 text-white" : "bg-white/10 text-zinc-400"
                    }`}
                  >
                    CHAT
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="text-xs font-bold text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Message Feed */}
            <div className="my-2.5 h-44 sm:h-52 space-y-1.5 overflow-y-auto pr-1 text-xs">
              {/* Match Events */}
              {(chatFilter === "all" || chatFilter === "match") &&
                room.events?.slice(-12).map((event) => (
                  <div key={event.id} className="flex items-start gap-1.5 rounded-lg bg-white/[0.03] p-1.5 border border-white/5">
                    <span className="shrink-0 rounded bg-blue-500/25 px-1 py-0.2 text-[8px] font-black text-blue-300">
                      MATCH
                    </span>
                    <span className="text-[11px] text-zinc-300 leading-tight">{event.text}</span>
                  </div>
                ))}

              {/* Chat Messages */}
              {(chatFilter === "all" || chatFilter === "chat") &&
                room.chat?.slice(-20).map((c) => (
                  <div key={c.id} className="flex items-start gap-1.5 rounded-lg bg-white/[0.04] p-1.5 border border-white/5">
                    <span className="shrink-0 rounded bg-emerald-500/25 px-1 py-0.2 text-[8px] font-black text-emerald-300">
                      CHAT
                    </span>
                    <p className="text-[11px] leading-tight">
                      <strong className="text-yellow-300 mr-1">{c.username}:</strong>
                      <span className="text-zinc-200">{c.message}</span>
                    </p>
                  </div>
                ))}
            </div>

            {/* Quick Reactions Bar */}
            <div className="flex items-center justify-between gap-1 border-t border-white/10 pt-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => emit("reaction:send", { emoji })}
                  className="rounded-lg border border-white/10 bg-zinc-950/70 p-1.5 text-sm transition-transform hover:scale-125 hover:border-yellow-400 active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={sendChat} className="mt-2 flex items-center gap-1.5">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send match chat..."
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-yellow-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 px-3 py-1.5 text-xs font-black text-zinc-950 glow-button hover:brightness-110 active:scale-95"
              >
                ➤
              </button>
            </form>
          </aside>
        ) : (
          /* Minimized Chat Capsule Button */
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="absolute bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-white/15 bg-[#0d1424]/90 px-4 py-2 text-xs font-black uppercase text-yellow-300 shadow-2xl backdrop-blur-md hover:border-yellow-400"
          >
            <span>💬 Chat & Match Log</span>
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
          </button>
        )}

      {/* Wild Color Wheel Modal (Matches Mockup 1) */}
      {wildCard && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative rounded-3xl border border-white/20 bg-[#0c1220] p-8 text-center shadow-2xl">
            <h2 className="text-2xl font-black text-white">CHOOSE WILD COLOR</h2>
            <p className="mt-1 text-xs text-zinc-400">Select the active color for the next player</p>

            {/* 4-Quadrant Color Wheel */}
            <div className="relative mx-auto mt-6 size-60 overflow-hidden rounded-full border-4 border-zinc-950 shadow-2xl grid grid-cols-2 grid-rows-2">
              <button
                type="button"
                onClick={() => play(wildCard, "red")}
                className="bg-red-500 hover:brightness-125 font-black text-white uppercase text-sm flex items-center justify-center transition-all hover:scale-105"
              >
                RED
              </button>
              <button
                type="button"
                onClick={() => play(wildCard, "blue")}
                className="bg-sky-500 hover:brightness-125 font-black text-white uppercase text-sm flex items-center justify-center transition-all hover:scale-105"
              >
                BLUE
              </button>
              <button
                type="button"
                onClick={() => play(wildCard, "yellow")}
                className="bg-amber-400 hover:brightness-125 font-black text-zinc-950 uppercase text-sm flex items-center justify-center transition-all hover:scale-105"
              >
                YELLOW
              </button>
              <button
                type="button"
                onClick={() => play(wildCard, "green")}
                className="bg-emerald-500 hover:brightness-125 font-black text-white uppercase text-sm flex items-center justify-center transition-all hover:scale-105"
              >
                GREEN
              </button>
            </div>

            <button
              type="button"
              onClick={() => setWildCard(null)}
              className="mt-6 rounded-xl border border-white/20 px-6 py-2 text-xs font-bold text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Match Victory & Podium Celebration Overlay (Matches Mockup 3) */}
      {(room.status === "finished" || showVictoryPreview) && (
        <VictoryCelebrationOverlay
          room={room}
          user={user}
          onPlayAgain={() => {
            setShowVictoryPreview(false);
            emit("game:start");
          }}
          onBackToLobby={() => {
            emit("room:leave");
            window.location.href = "/dashboard";
          }}
          onClose={() => setShowVictoryPreview(false)}
        />
      )}
    </div>
  );
}
