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

  const level = user ? Math.floor((user.xp || 0) / 250) + 1 : 1;
  const xpCurrent = user ? (user.xp || 0) % 250 : 0;
  const xpPercent = Math.min(Math.round((xpCurrent / 250) * 100), 100);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07090e]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center">
            <div className="size-9 rounded-xl bg-gradient-to-br from-red-500 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-red-500/25 transition-transform group-hover:scale-105">
              <div className="flex size-full items-center justify-center rounded-[10px] bg-zinc-950 font-black italic text-yellow-300 text-sm">
                UNO
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 size-3 rounded-full bg-emerald-500 ring-2 ring-[#07090e]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-wider text-white uppercase flex items-center gap-1.5">
              UNO <span className="text-yellow-400">ARENA</span>
            </span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden items-center gap-6 text-sm font-bold text-zinc-300 md:flex">
          <Link href="/dashboard" className="transition-colors hover:text-yellow-300">
            Play
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-yellow-300">
            Lobbies
          </Link>
          <Link href="/leaderboard" className="transition-colors hover:text-yellow-300">
            Leaderboards
          </Link>
          <Link href="/rules" className="transition-colors hover:text-yellow-300">
            Rules
          </Link>
        </nav>

        {/* Right Section: User Profile Bar or Auth Button */}
        {user ? (
          <div className="flex items-center gap-3">
            {/* Player Stats Pill (Desktop) */}
            <div className="hidden items-center gap-3.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-4 lg:flex">
              <Link href="/profile" className="flex items-center gap-2.5">
                <div
                  className="flex size-8 items-center justify-center rounded-full text-xs font-black shadow-md"
                  style={{ background: user.avatarColor || "#ef4444" }}
                >
                  {user.username?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 leading-none">
                    <p className="max-w-28 truncate text-xs font-bold text-white">{user.username}</p>
                    <span className="rounded bg-yellow-400/20 px-1 py-0.2 text-[10px] font-black text-yellow-300">
                      Lv.{level}
                    </span>
                  </div>
                  {/* XP Bar */}
                  <div className="mt-1 flex items-center gap-1.5">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-300"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-zinc-400">{user.xp || 0} XP</span>
                  </div>
                </div>
              </Link>

              {/* Coin Wallet */}
              <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-black text-amber-300 border border-amber-500/20">
                <span>🪙</span>
                <span>{(user.coins || 0).toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/profile"
              className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-xs font-bold text-zinc-200 hover:bg-white/10 lg:hidden"
            >
              Profile
            </Link>

            <button
              onClick={logout}
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-200 transition-colors hover:bg-red-500/20"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-2 text-xs font-black text-zinc-950 shadow-lg shadow-yellow-400/20 glow-button hover:brightness-110"
            >
              Enter Arena
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
