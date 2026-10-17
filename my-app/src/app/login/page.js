import AuthForm from "@/components/AuthForm";
import Nav from "@/components/Nav";
import UnoCard from "@/components/UnoCard";

export default function LoginPage() {
  return (
    <main className="gaming-surface relative min-h-screen overflow-hidden">
      <Nav />
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute -left-20 top-1/4 size-96 rounded-full bg-red-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 size-96 rounded-full bg-blue-600/10 blur-3xl" />

      {/* Decorative Background Floating Cards */}
      <div className="pointer-events-none absolute left-10 top-36 hidden opacity-20 -rotate-12 lg:block">
        <UnoCard card={{ color: "red", value: "7" }} />
      </div>
      <div className="pointer-events-none absolute right-16 top-48 hidden opacity-20 rotate-12 lg:block">
        <UnoCard card={{ color: "blue", value: "reverse" }} />
      </div>
      <div className="pointer-events-none absolute bottom-16 left-24 hidden opacity-20 rotate-6 lg:block">
        <UnoCard card={{ color: "yellow", value: "+2" }} />
      </div>
      <div className="pointer-events-none absolute bottom-20 right-28 hidden opacity-20 -rotate-12 lg:block">
        <UnoCard card={{ color: "wild", value: "+4" }} />
      </div>

      <section className="relative z-10 mx-auto max-w-xl px-4 py-12 md:py-16">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1 text-xs font-black uppercase tracking-wider text-yellow-300 backdrop-blur-md">
            <span>⚡</span> Player Authentication
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
            ENTER THE <span className="text-yellow-400">ARENA</span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Log in or create a player profile to earn XP, collect coins, and record match history.
          </p>
        </div>
        <AuthForm />
      </section>
    </main>
  );
}

