"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import UnoCard from "@/components/UnoCard";

export default function DashboardPage() {
  const [code, setCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [publicRooms, setPublicRooms] = useState([]);
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    // Fetch live public rooms
    fetch("/api/rooms").then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setPublicRooms(data.rooms || []);
      }
    });

    // Fetch leaderboard preview
    fetch("/api/leaderboard").then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setLeaders((data.users || []).slice(0, 4));
      }
    });
  }, []);

  async function handleJoin(e) {
    e?.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;
    setJoinError("");
    setLoadingJoin(true);

    try {
      const res = await fetch(`/api/rooms/${cleanCode}`);
      const data = await res.json();
      setLoadingJoin(false);
      if (!res.ok) {
        setJoinError(data?.error || "Room not found.");
        return;
      }
      if (data.room?.status !== "waiting") {
        setJoinError("This match has already started.");
        return;
      }
      if (data.room?.players?.length >= data.room?.maxPlayers) {
        setJoinError("Room is full.");
        return;
      }
      window.location.href = `/room/${cleanCode}`;
    } catch {
      setLoadingJoin(false);
      setJoinError("Could not join room.");
    }
  }

  return (
    <main className="gaming-surface min-h-screen">
      <Nav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        {/* Top Action Cards (Matches Mockup 2) */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Create Custom Room Card */}
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-[#0c1626]/90 via-[#0a101d]/90 to-[#070b14]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            {/* Ambient Cyan Glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-cyan-500/15 blur-3xl" />

            {/* Floating Mini 3D Cards */}
            <div className="mb-4 flex items-center gap-1.5">
              <div className="-rotate-12 transition-transform hover:scale-105">
                <UnoCard small card={{ color: "red", value: "7" }} />
              </div>
              <div className="rotate-3 transition-transform hover:scale-105 -ml-4 z-10">
                <UnoCard small card={{ color: "blue", value: "reverse" }} />
              </div>
              <div className="rotate-12 transition-transform hover:scale-105 -ml-4 z-20">
                <UnoCard small card={{ color: "wild", value: "wild" }} />
              </div>
            </div>

            <h2 className="text-2xl font-black text-white sm:text-3xl">Create Custom Room</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-400">
              Host your own UNO match, select player limits (2–10), and invite friends with your unique code.
            </p>

            <div className="mt-6">
              <Link
                href="/create-room"
                className="inline-flex items-center rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-6 py-3 text-sm font-black uppercase tracking-wider text-cyan-200 transition-all hover:bg-cyan-500/30 hover:border-cyan-400 shadow-lg shadow-cyan-500/10 active:scale-95"
              >
                Create Room →
              </Link>
            </div>
          </div>

          {/* Join Room with Code Card */}
          <div className="relative overflow-hidden rounded-2xl border border-yellow-500/40 bg-gradient-to-br from-[#1a160c]/90 via-[#120f09]/90 to-[#07090e]/90 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            {/* Ambient Yellow Glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-yellow-500/15 blur-3xl" />

            {/* Floating Mini 3D Cards */}
            <div className="mb-4 flex items-center gap-1.5">
              <div className="-rotate-12 transition-transform hover:scale-105">
                <UnoCard small card={{ color: "green", value: "+2" }} />
              </div>
              <div className="rotate-12 transition-transform hover:scale-105 -ml-4 z-10">
                <UnoCard small card={{ color: "yellow", value: "5" }} />
              </div>
            </div>

            <h2 className="text-2xl font-black text-white sm:text-3xl">Join Room with Code</h2>
            <p className="mt-2 text-sm text-zinc-400">Enter a specific 6-character room code to jump into a table.</p>

            <form onSubmit={handleJoin} className="mt-6 flex flex-wrap items-center gap-3">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                placeholder="Enter Code"
                className="min-w-0 flex-1 rounded-xl border border-white/15 bg-zinc-950/80 px-4 py-3 text-base font-black tracking-widest text-yellow-300 placeholder-zinc-600 outline-none transition-all focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 uppercase"
              />
              <button
                disabled={loadingJoin || !code.trim()}
                className="rounded-xl border border-yellow-400/40 bg-yellow-400/20 px-6 py-3 text-sm font-black uppercase tracking-wider text-yellow-200 transition-all hover:bg-yellow-400/30 hover:border-yellow-400 disabled:opacity-40 active:scale-95"
              >
                {loadingJoin ? "Joining..." : "Join"}
              </button>
            </form>
            {joinError && <p className="mt-2 text-xs font-bold text-red-400">{joinError}</p>}
          </div>
        </div>

        {/* Bottom Section: Active Public Tables & Global Leaderboard (Matches Mockup 2) */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          {/* Active Public Tables */}
          <section className="rounded-2xl border border-white/10 bg-[#0d121c]/70 p-6 backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white">Active Public Tables</h3>
                <p className="text-xs text-zinc-400">Join an open table or spectate live matches</p>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                {publicRooms.length} Live
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {publicRooms.length > 0 ? (
                publicRooms.map((room) => (
                  <div
                    key={room.roomCode}
                    className="flex flex-col justify-between rounded-xl border border-white/10 bg-zinc-950/70 p-4 transition-all hover:border-white/20"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-black text-white text-base">{room.name}</p>
                        <span className="text-xs font-bold text-zinc-400">
                          {room.playerCount}/{room.maxPlayers}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">
                        Status:{" "}
                        <span className={room.status === "waiting" ? "text-yellow-300 font-bold" : "text-emerald-400 font-bold"}>
                          {room.status === "waiting" ? "Waiting for Players" : "Playing"}
                        </span>
                      </p>
                      <p className="text-[11px] text-zinc-500">Code: <span className="text-yellow-200 font-mono font-bold">{room.roomCode}</span></p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-zinc-500">Arena Map</span>
                      <Link
                        href={`/room/${room.roomCode}`}
                        className="rounded-lg bg-white/10 px-4 py-1.5 text-xs font-black uppercase text-white hover:bg-yellow-400 hover:text-zinc-950 transition-colors"
                      >
                        Join Table
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                // Sample Public Lobbies when no active rooms exist yet
                [
                  { name: "Arena Table #10345", players: "3/10", status: "Waiting for Host", map: "Skyfall" },
                  { name: "Pro Clash #10421", players: "8/10", status: "Playing", map: "Colosseum" },
                  { name: "Speed Table #10398", players: "5/10", status: "Waiting for Players", map: "Neon City" },
                  { name: "Casual Fun #10502", players: "9/10", status: "Playing", map: "Midnight" },
                ].map((sample) => (
                  <div
                    key={sample.name}
                    className="flex flex-col justify-between rounded-xl border border-white/10 bg-zinc-950/70 p-4 transition-all hover:border-white/20"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate font-black text-white text-base">{sample.name}</p>
                        <span className="text-xs font-bold text-zinc-400">{sample.players}</span>
                      </div>
                      <p className="mt-1 text-xs text-zinc-400">
                        Status:{" "}
                        <span className={sample.status.includes("Waiting") ? "text-yellow-300 font-bold" : "text-emerald-400 font-bold"}>
                          {sample.status}
                        </span>
                      </p>
                      <p className="text-[11px] text-zinc-500">Map: {sample.map}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-zinc-500">Custom Lobby</span>
                      <Link
                        href="/create-room"
                        className="rounded-lg bg-white/10 px-4 py-1.5 text-xs font-black uppercase text-white hover:bg-yellow-400 hover:text-zinc-950 transition-colors"
                      >
                        Host Now
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Global Leaderboard Preview Card (Matches Mockup 2) */}
          <section className="rounded-2xl border border-red-500/30 bg-gradient-to-br from-[#1c0d12]/80 via-[#120a0f]/80 to-[#0a0709]/80 p-6 shadow-2xl backdrop-blur-md">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-white">Global Leaderboard</h3>
                <p className="text-xs text-zinc-400">Top arena champions</p>
              </div>
              <Link href="/leaderboard" className="text-xs font-bold text-yellow-400 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-2.5">
              {(leaders.length > 0
                ? leaders
                : [
                    { username: "ShadowX", wins: 2850, streak: 15, avatarColor: "#ef4444" },
                    { username: "GamerGirl_88", wins: 2720, streak: 11, avatarColor: "#ec4899" },
                    { username: "SwiftAce", wins: 2610, streak: 9, avatarColor: "#3b82f6" },
                    { username: "VoidWalker", wins: 2550, streak: 7, avatarColor: "#8b5cf6" },
                  ]
              ).map((player, index) => (
                <div
                  key={player.username + index}
                  className={`flex items-center justify-between rounded-xl p-3 border transition-all ${
                    index === 0
                      ? "border-yellow-400/40 bg-yellow-400/10 shadow-lg shadow-yellow-400/10"
                      : "border-white/5 bg-zinc-950/70"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                        index === 0
                          ? "bg-yellow-400 text-zinc-950"
                          : index === 1
                          ? "bg-slate-300 text-zinc-950"
                          : index === 2
                          ? "bg-amber-700 text-white"
                          : "text-zinc-500"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span
                      className="size-8 shrink-0 rounded-full flex items-center justify-center text-xs font-black shadow"
                      style={{ background: player.avatarColor || "#ef4444" }}
                    >
                      {player.username?.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 truncate">
                      <p className="truncate font-black text-sm text-white">{player.username}</p>
                      <p className="text-[11px] text-zinc-400">
                        🔥 Win Streak: <span className="font-bold text-amber-300">{player.streak || (player.wins % 12) + 3}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-sm font-black text-yellow-300">
                      <span>🏆</span>
                      <span>{player.wins || 100}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

