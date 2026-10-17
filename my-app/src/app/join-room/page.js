"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

export default function JoinRoomPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const roomCode = String(form.get("roomCode") || "").trim().toUpperCase();
    if (!roomCode) return;
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/rooms/${roomCode}`);
      const data = await response.json();
      setLoading(false);
      if (!response.ok) {
        setError(data?.error || "Room not found.");
        return;
      }
      if (data.room?.status !== "waiting") {
        setError("This match has already started.");
        return;
      }
      if (data.room?.players?.length >= data.room?.maxPlayers) {
        setError("Room is full.");
        return;
      }
      window.location.href = `/room/${roomCode}`;
    } catch {
      setLoading(false);
      setError("Could not check room status.");
    }
  }

  return (
    <main className="gaming-surface relative min-h-screen overflow-hidden">
      <Nav />
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-20 top-1/4 size-80 rounded-full bg-yellow-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 size-80 rounded-full bg-blue-600/10 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-xl px-4 py-12 md:py-16">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-yellow-300 backdrop-blur-md">
            <span>⚡</span> Instant Lobby Access
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            JOIN A <span className="text-yellow-400">TABLE</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter the 6-character room code provided by your host.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d121c]/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-300 uppercase tracking-wider text-center">
                Enter 6-Digit Room Code
              </label>
              <input
                name="roomCode"
                required
                maxLength={6}
                placeholder="e.g. 88KFO3"
                className="w-full rounded-xl border border-white/15 bg-zinc-950/80 px-4 py-3.5 text-center text-3xl font-black uppercase tracking-widest text-yellow-300 placeholder-zinc-700 outline-none transition-all focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-200 text-center">
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-xl shadow-blue-500/20 glow-button disabled:opacity-60 hover:brightness-110 active:scale-[0.98]"
            >
              {loading ? "Checking Table Status..." : "Join Table Now →"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
