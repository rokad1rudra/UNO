import Nav from "@/components/Nav";

const ruleItems = [
  {
    title: "Starting the Match & Turns",
    badge: "BASICS",
    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    desc: "Each player starts with 7 cards. Players take turns clockwise (or counter-clockwise if Reversed) matching the top card of the discard pile by color, number, or symbol.",
  },
  {
    title: "Action Cards & Penalties",
    badge: "ACTION",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    desc: "Skip blocks the next player's turn. Reverse switches table turn direction (acts as a skip in 1v1). Draw Two (+2) forces the next player to draw 2 cards and forfeits their turn.",
  },
  {
    title: "Wild & Wild Draw 4",
    badge: "WILD",
    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    desc: "Wild cards can be played on any card. The player selects the new active color (Red, Yellow, Green, or Blue). Wild +4 changes color AND forces the victim to draw 4 cards.",
  },
  {
    title: "Calling UNO Fast",
    badge: "CRITICAL",
    badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
    desc: "When down to exactly 1 card, you must click 'SAY UNO' immediately. If you false-call UNO with multiple cards, you are penalized with 2 penalty cards!",
  },
  {
    title: "Winning & Match Rewards",
    badge: "REWARDS",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    desc: "The first player to empty their hand claims 1st Place! Winners earn +120 XP, +75 Coins, and increase their win streak on the Global Leaderboard.",
  },
];

export default function RulesPage() {
  return (
    <main className="gaming-surface min-h-screen">
      <Nav />
      <section className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-yellow-300 backdrop-blur-md">
            <span>📖</span> Official Rulebook
          </div>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white md:text-5xl">
            HOW TO <span className="text-yellow-400">PLAY</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Master the standard rules and esports mechanics of UNO Arena.
          </p>
        </div>

        <div className="space-y-4">
          {ruleItems.map((item, index) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-[#0d121c]/80 p-5 sm:p-6 shadow-xl backdrop-blur-xl transition-all hover:border-white/20"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-black text-white">
                    0{index + 1}
                  </span>
                  <h2 className="text-base font-black text-white sm:text-lg">{item.title}</h2>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-300 sm:text-sm pl-10">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
