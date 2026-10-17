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
    <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-[#0d121c]/80 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
      {/* Mode Switcher */}
      <div className="mb-6 grid grid-cols-2 rounded-xl bg-zinc-950/80 p-1 border border-white/5">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`rounded-lg py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
            mode === "login"
              ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`rounded-lg py-2.5 text-xs font-black uppercase tracking-wider transition-all ${
            mode === "register"
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Register
        </button>
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="mb-1 block text-xs font-bold text-zinc-400">PLAYER USERNAME</label>
            <input
              name="username"
              required
              placeholder="e.g. ShadowGamer"
              className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50"
            />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-bold text-zinc-400">EMAIL ADDRESS</label>
          <input
            name="email"
            required
            type="email"
            placeholder="player@example.com"
            className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-zinc-400">PASSWORD</label>
          <input
            name="password"
            required
            type="password"
            placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-bold text-red-200">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 py-3.5 text-sm font-black uppercase tracking-wider text-zinc-950 shadow-xl shadow-yellow-400/20 glow-button disabled:opacity-60 hover:brightness-110 active:scale-[0.98]"
        >
          {loading ? "Authenticating..." : mode === "login" ? "Enter Arena" : "Create Account"}
        </button>
      </form>
    </div>
  );
}
