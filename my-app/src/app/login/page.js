import AuthForm from "@/components/AuthForm";
import Nav from "@/components/Nav";

export default function LoginPage() {
  return (
    <main className="gaming-surface min-h-screen">
      <Nav />
      <section className="mx-auto max-w-5xl px-4 py-14">
        <h1 className="mb-3 text-center text-4xl font-black">Enter the Arena</h1>
        <p className="mb-8 text-center text-zinc-300">Log in or create your profile to track wins, XP, coins, and history.</p>
        <AuthForm />
      </section>
    </main>
  );
}
