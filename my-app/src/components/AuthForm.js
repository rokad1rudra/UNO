"use client";

import { useState } from "react";

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());
    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <div className="mx-auto max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30">
      <div className="mb-6 grid grid-cols-2 rounded bg-zinc-900 p-1">
        <button onClick={() => setMode("login")} className={`rounded px-4 py-2 font-bold ${mode === "login" ? "bg-red-500" : "text-zinc-400"}`}>
          Login
        </button>
        <button onClick={() => setMode("register")} className={`rounded px-4 py-2 font-bold ${mode === "register" ? "bg-blue-500" : "text-zinc-400"}`}>
          Register
        </button>
      </div>
      <form onSubmit={submit} className="space-y-4">
        {mode === "register" && (
          <input name="username" required placeholder="Username" className="w-full rounded border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-300" />
        )}
        <input name="email" required type="email" placeholder="Email" className="w-full rounded border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-300" />
        <input name="password" required type="password" placeholder="Password" className="w-full rounded border border-white/10 bg-zinc-950 px-4 py-3 outline-none focus:border-yellow-300" />
        {error && <p className="rounded border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        <button disabled={loading} className="w-full rounded bg-yellow-300 px-5 py-3 font-black text-zinc-950 glow-button disabled:opacity-60">
          {loading ? "Loading..." : mode === "login" ? "Enter Arena" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
