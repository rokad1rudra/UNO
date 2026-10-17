"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/leaderboard").then(async (response) => {
      const data = await response.json();
      if (response.ok) setUsers(data.users || []);
      else setError(data.error || "Could not load leaderboard.");
    });
  }, []);

  return (
    <main className="gaming-surface min-h-screen">
      <Nav />
      <section className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-yellow-300 backdrop-blur-md">
            <span>🏆</span> Global Hall of Fame
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
            LEADERBOARD <span className="text-yellow-400">RANKINGS</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Top champions ranked by verified arena match wins, coins, and earned XP.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-bold text-red-200">
            {error}
          </div>
        )}

        {/* Top 3 Podium Cards */}
        {users.length >= 3 && (
          <div className="mb-10 grid gap-4 sm:grid-cols-3 sm:items-end">
            {/* #2 Silver */}
            <div className="rounded-2xl border border-slate-400/30 bg-slate-900/40 p-5 text-center shadow-xl backdrop-blur-md order-2 sm:order-1">
              <span className="inline-block text-2xl">🥈</span>
              <div
                className="mx-auto mt-2 flex size-14 items-center justify-center rounded-full text-base font-black text-white shadow-lg border-2 border-slate-300"
                style={{ background: users[1]?.avatarColor || "#3b82f6" }}
              >
                {users[1]?.username?.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="mt-2 text-lg font-black text-white truncate">{users[1]?.username}</h3>
              <p className="text-xs text-slate-300 font-bold">{users[1]?.wins} Wins · {users[1]?.xp} XP</p>
            </div>

            {/* #1 Gold */}
            <div className="rounded-2xl border border-yellow-400/50 bg-gradient-to-b from-amber-500/15 via-zinc-950/80 to-zinc-950/90 p-6 text-center shadow-2xl shadow-yellow-400/10 backdrop-blur-md order-1 sm:order-2 sm:-translate-y-3">
              <span className="inline-block text-3xl">👑</span>
              <div
                className="mx-auto mt-2 flex size-16 items-center justify-center rounded-full text-lg font-black text-white shadow-xl shadow-yellow-400/20 border-4 border-yellow-400"
                style={{ background: users[0]?.avatarColor || "#ef4444" }}
              >
                {users[0]?.username?.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="mt-2 text-xl font-black text-yellow-300 truncate">{users[0]?.username}</h3>
              <p className="text-xs font-black text-white">{users[0]?.wins} Wins · {users[0]?.coins} Coins</p>
              <span className="mt-2 inline-block rounded-full bg-yellow-400/20 px-3 py-0.5 text-[10px] font-black uppercase text-yellow-300 border border-yellow-400/30">
                Arena Champion
              </span>
            </div>

            {/* #3 Bronze */}
            <div className="rounded-2xl border border-amber-700/30 bg-amber-950/20 p-5 text-center shadow-xl backdrop-blur-md order-3 sm:order-3">
              <span className="inline-block text-2xl">🥉</span>
              <div
                className="mx-auto mt-2 flex size-14 items-center justify-center rounded-full text-base font-black text-white shadow-lg border-2 border-amber-700"
                style={{ background: users[2]?.avatarColor || "#8b5cf6" }}
              >
                {users[2]?.username?.slice(0, 2).toUpperCase()}
              </div>
              <h3 className="mt-2 text-lg font-black text-white truncate">{users[2]?.username}</h3>
              <p className="text-xs text-amber-300 font-bold">{users[2]?.wins} Wins · {users[2]?.xp} XP</p>
            </div>
          </div>
        )}

        {/* Rankings Table */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d121c]/80 shadow-2xl backdrop-blur-xl">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-xs font-black uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="p-4 pl-6">Rank</th>
                <th className="p-4">Player</th>
                <th className="p-4">Wins</th>
                <th className="p-4">Losses</th>
                <th className="p-4">Coins</th>
                <th className="p-4 text-right pr-6">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user, index) => (
                <tr key={user._id} className="transition-colors hover:bg-white/[0.03]">
                  <td className="p-4 pl-6 font-black">
                    <span
                      className={`inline-flex size-7 items-center justify-center rounded-lg text-xs font-black ${
                        index === 0
                          ? "bg-yellow-400 text-zinc-950"
                          : index === 1
                          ? "bg-slate-300 text-zinc-950"
                          : index === 2
                          ? "bg-amber-700 text-white"
                          : "text-zinc-400 border border-white/10"
                      }`}
                    >
                      #{index + 1}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="size-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow"
                        style={{ background: user.avatarColor }}
                      >
                        {user.username?.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="font-bold text-white">{user.username}</span>
                    </div>
                  </td>
                  <td className="p-4 font-black text-yellow-300">{user.wins}</td>
                  <td className="p-4 text-zinc-400">{user.losses}</td>
                  <td className="p-4 font-bold text-amber-300">🪙 {user.coins}</td>
                  <td className="p-4 text-right pr-6 font-black text-emerald-400">{user.xp} XP</td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500 font-bold">
                    No players ranked yet. Play your first match to claim #1!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
