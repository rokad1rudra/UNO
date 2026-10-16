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

  return (
    <main className="gaming-surface min-h-screen">
      <Nav />
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-4xl font-black">Profile</h1>
        {user && (
          <div className="mt-6 grid gap-5 lg:grid-cols-[330px_1fr]">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <div className="mb-4 size-20 rounded-lg" style={{ background: user.avatarColor }} />
              <h2 className="text-2xl font-black">{user.username}</h2>
              <p className="text-zinc-400">{user.email}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["Wins", user.wins],
                  ["Losses", user.losses],
                  ["Coins", user.coins],
                  ["XP", user.xp],
                ].map(([label, value]) => (
                  <div key={label} className="rounded border border-white/10 bg-zinc-950/70 p-4">
                    <p className="text-xs uppercase text-zinc-500">{label}</p>
                    <p className="text-2xl font-black">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-xl font-black">Match History</h2>
              <div className="mt-4 space-y-3">
                {matches.map((match) => (
                  <div key={match._id} className="rounded border border-white/10 bg-zinc-950/70 p-4">
                    <p className="font-bold">Room {match.roomCode}</p>
                    <p className="text-sm text-zinc-400">Winner: {match.winner?.username} · {new Date(match.endedAt).toLocaleString()}</p>
                  </div>
                ))}
                {!matches.length && <p className="text-zinc-400">No completed matches yet.</p>}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
