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
    <main className="gaming-surface min-h-screen">
      <Nav />
      <section className="mx-auto max-w-xl px-4 py-12">
        <h1 className="mb-6 text-4xl font-black">Join Room</h1>
        <form onSubmit={submit} className="space-y-4 rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <input name="roomCode" required maxLength="6" placeholder="ROOM CODE" className="w-full rounded border border-white/10 bg-zinc-950 px-4 py-3 text-center text-2xl font-black uppercase tracking-widest outline-none focus:border-yellow-300" />
          {error && <p className="text-sm text-red-200">{error}</p>}
          <button disabled={loading} className="w-full rounded bg-blue-500 px-5 py-3 font-black disabled:opacity-60">
            {loading ? "Joining..." : "Join Table"}
          </button>
        </form>
      </section>
    </main>
  );
}
