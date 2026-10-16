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
    <main className="gaming-surface min-h-screen">
      <Nav />
      <section className="mx-auto max-w-xl px-4 py-12">
        <h1 className="mb-6 text-4xl font-black">Create Room</h1>
        <form onSubmit={submit} className="space-y-4 rounded-lg border border-white/10 bg-white/[0.04] p-6">
          <input name="name" placeholder="Room name" className="w-full rounded border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-300" />
          <select name="maxPlayers" defaultValue="10" className="w-full rounded border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-300">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => <option key={count}>{count}</option>)}
          </select>
          {error && <p className="text-sm text-red-200">{error}</p>}
          <button disabled={loading} className="w-full rounded bg-red-500 px-5 py-3 font-black disabled:opacity-60">
            {loading ? "Creating..." : "Create Table"}
          </button>
        </form>
      </section>
    </main>
  );
}
