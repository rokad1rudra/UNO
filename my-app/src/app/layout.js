import "./globals.css";

export const metadata = {
  title: "UNO Arena",
  description: "A real-time multiplayer UNO game built with Next.js and Socket.io.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-zinc-950 text-white">{children}</body>
    </html>
  );
}
