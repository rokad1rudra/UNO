import Link from "next/link";
import Nav from "@/components/Nav";
import UnoCard from "@/components/UnoCard";

export default function Home() {
  return (
    <main className="gaming-surface min-h-screen">
      <Nav />
      <section className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center lg:py-24">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute left-1/4 top-10 size-72 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-1/3 size-80 rounded-full bg-red-500/15 blur-3xl" />

        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-yellow-300 backdrop-blur-md">
            <span className="size-2 rounded-full bg-yellow-400 animate-ping" />
            2-10 Players · Real-Time Online Arena
          </div>

          <h1 className="max-w-3xl text-5xl font-black tracking-tight text-white md:text-7xl lg:leading-[1.1]">
            THE ULTIMATE <br />
            <span className="bg-gradient-to-r from-red-500 via-yellow-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
              UNO ARENA
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg">
            Host private tables, challenge friends, or jump into public lobbies. Experience live turn indicators,
            instant penalty calls, interactive wild color wheels, and climb the global leaderboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/login"
              className="rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 px-8 py-4 text-base font-black uppercase tracking-wider text-zinc-950 shadow-xl shadow-yellow-400/25 glow-button hover:brightness-110"
            >
              Enter Arena
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/20 bg-white/[0.06] px-7 py-4 text-base font-bold text-white backdrop-blur-md hover:bg-white/10"
            >
              Browse Tables
            </Link>
            <Link
              href="/rules"
              className="rounded-xl border border-white/10 px-5 py-4 text-sm font-bold text-zinc-400 hover:text-white"
            >
              Game Rules →
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 max-w-lg">
            <div>
              <p className="text-2xl font-black text-white">100%</p>
              <p className="text-xs text-zinc-400 font-medium">Official Rules</p>
            </div>
            <div>
              <p className="text-2xl font-black text-yellow-400">10 Max</p>
              <p className="text-xs text-zinc-400 font-medium">Players / Table</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">&lt;50ms</p>
              <p className="text-xs text-zinc-400 font-medium">Live WebSockets</p>
            </div>
          </div>
        </div>

        {/* Floating 3D Cards Showcase */}
        <div className="relative flex min-h-[380px] items-center justify-center sm:min-h-[440px]">
          <div className="relative size-80 sm:size-96">
            {/* Center Felt Glow Disk */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-blue-900/40 via-zinc-900/80 to-red-900/40 border border-white/10 shadow-2xl backdrop-blur-sm" />

            {/* Red +2 */}
            <div className="absolute left-4 top-10 -rotate-12 transition-transform duration-300 hover:scale-110 hover:z-30">
              <UnoCard card={{ color: "red", value: "+2" }} />
            </div>

            {/* Blue Reverse */}
            <div className="absolute left-24 top-4 rotate-6 transition-transform duration-300 hover:scale-110 hover:z-30">
              <UnoCard card={{ color: "blue", value: "reverse" }} />
            </div>

            {/* Wild +4 */}
            <div className="absolute right-12 top-12 rotate-12 transition-transform duration-300 hover:scale-110 hover:z-30">
              <UnoCard card={{ color: "wild", value: "+4" }} />
            </div>

            {/* Green Skip */}
            <div className="absolute bottom-16 left-16 -rotate-6 transition-transform duration-300 hover:scale-110 hover:z-30">
              <UnoCard card={{ color: "green", value: "skip" }} />
            </div>

            {/* Yellow 9 */}
            <div className="absolute bottom-10 right-14 rotate-12 transition-transform duration-300 hover:scale-110 hover:z-30">
              <UnoCard card={{ color: "yellow", value: "9" }} />
            </div>

            {/* Center UNO Deck Back */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-3 shadow-2xl">
              <UnoCard back />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Badges Footer */}
      <section className="border-t border-white/10 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4">
          {[
            { title: "Socket.io Engine", desc: "Sub-second live card sync" },
            { title: "Smart Penalty Logic", desc: "Automated +2 & +4 draw rules" },
            { title: "Fast Room Codes", desc: "Join any match in 2 seconds" },
            { title: "XP & Leaderboards", desc: "Track wins, coins & stats" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="font-black text-sm text-white">{item.title}</p>
              <p className="mt-1 text-xs text-zinc-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
