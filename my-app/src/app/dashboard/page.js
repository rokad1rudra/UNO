import Link from "next/link";
import Nav from "@/components/Nav";

export default function DashboardPage() {
  return (
    <main className="gaming-surface min-h-screen">
      <Nav />
      <section className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="text-4xl font-black">Dashboard</h1>
        <p className="mt-2 text-zinc-300">Host a table or jump into a friend&apos;s room code.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <Link href="/create-room" className="rounded-lg border border-red-400/30 bg-red-500/10 p-6 hover:bg-red-500/20">
            <h2 className="text-2xl font-black">Create Room</h2>
            <p className="mt-2 text-zinc-300">Choose player limit, invite friends, and start when everyone is ready.</p>
          </Link>
          <Link href="/join-room" className="rounded-lg border border-blue-400/30 bg-blue-500/10 p-6 hover:bg-blue-500/20">
            <h2 className="text-2xl font-black">Join Room</h2>
            <p className="mt-2 text-zinc-300">Enter a six-character room code and take your seat at the table.</p>
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href="/leaderboard" className="rounded border border-white/10 bg-white/[0.04] p-5 font-bold">Leaderboard</Link>
          <Link href="/profile" className="rounded border border-white/10 bg-white/[0.04] p-5 font-bold">Profile</Link>
          <Link href="/rules" className="rounded border border-white/10 bg-white/[0.04] p-5 font-bold">Rules</Link>
        </div>
      </section>
    </main>
  );
}
