import Nav from "@/components/Nav";

const rules = [
  "Each player starts with 7 cards. Match the discard pile by color or value.",
  "Wild cards can be played anytime and require choosing red, yellow, green, or blue.",
  "Skip jumps the next player. Reverse changes direction. With 2 players, Reverse acts like a skip.",
  "+2 makes the next player draw 2 and lose their turn. +4 does the same with 4 cards and changes color.",
  "Press Say UNO when you have one card. A false UNO call draws 2 cards.",
  "The first player to empty their hand wins. Wins, losses, coins, XP, and history are saved to MongoDB.",
];

export default function RulesPage() {
  return (
    <main className="gaming-surface min-h-screen">
      <Nav />
      <section className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-4xl font-black">Rules</h1>
        <div className="mt-6 space-y-3">
          {rules.map((rule, index) => (
            <div key={rule} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <p className="font-bold"><span className="mr-3 text-yellow-200">{index + 1}.</span>{rule}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
