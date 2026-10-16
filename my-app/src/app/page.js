import Link from "next/link";
import Nav from "@/components/Nav";
import UnoCard from "@/components/UnoCard";

export default function Home() {
  return (
    <main className="gaming-surface min-h-screen">
      <Nav />
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div>
          <p className="mb-4 inline-flex rounded border border-yellow-300/40 bg-yellow-300/10 px-3 py-1 text-sm font-bold text-yellow-200">
            2-10 players · live rooms · chat · reactions
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-7xl">UNO Arena</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-300">
            Create a room, share the code, and play a complete real-time UNO match with animated cards, turn validation,
            penalties, XP, coins, match history, and a leaderboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/login" className="rounded bg-yellow-300 px-6 py-3 font-black text-zinc-950 glow-button">Start Playing</Link>
            <Link href="/rules" className="rounded border border-white/15 px-6 py-3 font-bold hover:bg-white/10">Read Rules</Link>
          </div>
        </div>
        <div className="relative min-h-96">
          <div className="absolute left-4 top-8 rotate-[-12deg]"><UnoCard card={{ color: "red", value: "+2" }} /></div>
          <div className="absolute left-28 top-20 rotate-[8deg]"><UnoCard card={{ color: "blue", value: "reverse" }} /></div>
          <div className="absolute right-24 top-6 rotate-[14deg]"><UnoCard card={{ color: "wild", value: "+4" }} /></div>
          <div className="absolute bottom-12 left-20 rotate-[6deg]"><UnoCard card={{ color: "green", value: "skip" }} /></div>
          <div className="absolute bottom-8 right-10 rotate-[-8deg]"><UnoCard card={{ color: "yellow", value: "9" }} /></div>
        </div>
      </section>
      <section className="border-t border-white/10 bg-zinc-950/70">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 md:grid-cols-4">
          {["Socket.io rooms", "MongoDB profiles", "UNO engine", "Mobile ready"].map((item) => (
            <div key={item} className="rounded border border-white/10 bg-white/[0.03] p-4 font-bold text-zinc-200">{item}</div>
          ))}
        </div>
      </section>
    </main>
  );
}
