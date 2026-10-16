"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me").then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    });
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded bg-red-500 text-xl font-black shadow-lg shadow-red-500/20">
            U
          </span>
          <span className="text-lg font-black tracking-wide">UNO Arena</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-zinc-300 md:flex">
          <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
          <Link href="/leaderboard" className="hover:text-white">Leaderboard</Link>
          <Link href="/rules" className="hover:text-white">Rules</Link>
          <Link href="/profile" className="hover:text-white">Profile</Link>
        </nav>
        {user ? (
          <button onClick={logout} className="rounded border border-white/15 px-4 py-2 text-sm hover:bg-white/10">
            Logout
          </button>
        ) : (
          <Link href="/login" className="rounded bg-yellow-300 px-4 py-2 text-sm font-bold text-zinc-950 glow-button">
            Play Now
          </Link>
        )}
      </div>
    </header>
  );
}
