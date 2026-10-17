"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      if (response.ok) setUser((await response.json()).user);
      else window.location.href = "/login";
    });
    fetch("/api/matches").then(async (response) => {
      if (response.ok) setMatches((await response.json()).matches || []);
    });
  }, []);

  const level = user ? Math.floor((user.xp || 0) / 250) + 1 : 1;
  const xpCurrent = user ? (user.xp || 0) % 250 : 0;
  const xpPercent = Math.min(Math.round((xpCurrent / 250) * 100), 100);
  const winRate =
    user && user.wins + user.losses > 0
      ? Math.round((user.wins / (user.wins + user.losses)) * 100)
      : 0;

  return (
    <main className="gaming-surface min-h-screen">
      <Nav />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-yellow-300 backdrop-blur-md">
            <span>🎮</span> Career Statistics
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
            PLAYER <span className="text-yellow-400">PROFILE</span>
          </h1>
        </div>

        {user && (
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            {/* Identity & Rank Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0d121c]/80 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <div
                  className="flex size-18 items-center justify-center rounded-2xl text-2xl font-black text-white shadow-xl border-2 border-white/20"
                  style={{ background: user.avatarColor || "#ef4444" }}
                >
                  {user.username?.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-black text-white">{user.username}</h2>
                  <p className="truncate text-xs text-zinc-400">{user.email}</p>
                  <span className="mt-1.5 inline-block rounded-full bg-yellow-400/20 px-2.5 py-0.5 text-xs font-black text-yellow-300 border border-yellow-400/30">
                    Level {level} Arena Player
                  </span>
                </div>
              </div>

              {/* Level Progress */}
              <div className="mt-6 border-t border-white/10 pt-5">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-zinc-400">XP Progress</span>
                  <span className="text-yellow-400 font-black">{xpCurrent} / 250 XP</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-950">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-500"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-zinc-950/70 p-3.5">
                  <p className="text-[10px] font-black uppercase text-zinc-500">WINS</p>
                  <p className="text-2xl font-black text-yellow-300">{user.wins || 0}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-950/70 p-3.5">
                  <p className="text-[10px] font-black uppercase text-zinc-500">LOSSES</p>
                  <p className="text-2xl font-black text-zinc-400">{user.losses || 0}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-950/70 p-3.5">
                  <p className="text-[10px] font-black uppercase text-zinc-500">COINS</p>
                  <p className="text-2xl font-black text-amber-300">🪙 {user.coins || 0}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-zinc-950/70 p-3.5">
                  <p className="text-[10px] font-black uppercase text-zinc-500">WIN RATE</p>
                  <p className="text-2xl font-black text-emerald-400">{winRate}%</p>
                </div>
              </div>
            </div>

            {/* Match History */}
            <div className="rounded-2xl border border-white/10 bg-[#0d121c]/80 p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
              <h2 className="text-xl font-black text-white">Recent Match History</h2>
              <p className="text-xs text-zinc-400">Your recent games played in UNO Arena</p>

              <div className="mt-5 space-y-3">
                {matches.length > 0 ? (
                  matches.map((match) => (
                    <div
                      key={match._id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/5 bg-zinc-950/70 p-4 transition-all hover:border-white/15"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-yellow-300 text-sm">Room {match.roomCode}</span>
                          <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold text-zinc-300">
                            {match.players?.length || 2} Players
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-400">
                          Winner: <span className="font-black text-white">{match.winner?.username}</span> ·{" "}
                          {new Date(match.endedAt).toLocaleDateString()} at {new Date(match.endedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      <span
                        className={`rounded-lg px-3 py-1 text-xs font-black uppercase ${
                          match.winner?.userId === user._id
                            ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                            : "bg-white/5 text-zinc-400"
                        }`}
                      >
                        {match.winner?.userId === user._id ? "🏆 VICTORY" : "FINISHED"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500 font-bold">
                    No completed matches yet. Jump into an arena match to write your legacy!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
