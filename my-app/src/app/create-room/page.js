"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

export default function CreateRoomPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = form.get("name")?.trim();
    const maxPlayers = Number(form.get("maxPlayers")) || 10;
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, maxPlayers }),
      });
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        setError(data?.error || "Could not create room.");
        return;
      }
      window.location.href = `/room/${data.room.roomCode}`;
    } catch (err) {
      setLoading(false);
      setError(err?.message || "Could not connect to game server.");
    }
  }

  return (
    <main className="gaming-surface relative min-h-screen overflow-hidden">
      <Nav />
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-20 top-1/4 size-80 rounded-full bg-cyan-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 size-80 rounded-full bg-red-600/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-xl px-4 py-12 md:py-16">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-cyan-300 backdrop-blur-md">
            <span>⚡</span> Custom Table Setup
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            HOST A <span className="text-yellow-400">TABLE</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Set your table rules, choose player limit, and invite your squad.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d121c]/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Table Name
              </label>
              <input
                name="name"
                required
                placeholder="e.g. Championship Arena #1"
                className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Max Players (2 - 10)
              </label>
              <select
                name="maxPlayers"
                defaultValue="10"
                className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50"
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                  <option key={count} value={count} className="bg-zinc-950 text-white">
                    {count} Players {count === 2 ? "(1v1 Duel)" : count === 10 ? "(Maximum Chaos)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-200">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 py-3.5 text-sm font-black uppercase tracking-wider text-zinc-950 shadow-xl shadow-red-500/20 glow-button disabled:opacity-60 hover:brightness-110 active:scale-[0.98]"
            >
              {loading ? "Initializing Table..." : "Create Table Now"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
