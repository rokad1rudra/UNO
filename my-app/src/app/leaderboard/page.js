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
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-4xl font-black">Leaderboard</h1>
        <p className="mt-2 text-zinc-300">Ranked by wins, XP, and coins.</p>
        {error && <p className="mt-6 rounded border border-red-400/30 bg-red-500/10 p-4 text-red-100">{error}</p>}
        <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/[0.06] text-zinc-300">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Player</th>
                <th className="p-4">Wins</th>
                <th className="p-4">Losses</th>
                <th className="p-4">Coins</th>
                <th className="p-4">XP</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-t border-white/10 bg-zinc-950/50">
                  <td className="p-4 font-black">#{index + 1}</td>
                  <td className="p-4">
                    <span className="mr-2 inline-block size-3 rounded-full" style={{ background: user.avatarColor }} />
                    {user.username}
                  </td>
                  <td className="p-4">{user.wins}</td>
                  <td className="p-4">{user.losses}</td>
                  <td className="p-4">{user.coins}</td>
                  <td className="p-4">{user.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
