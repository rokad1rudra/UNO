import Nav from "@/components/Nav";
import RoomClient from "@/components/RoomClient";

export default async function RoomPage({ params }) {
  const { roomCode } = await params;
  return (
    <main className="gaming-surface h-screen max-h-screen overflow-hidden flex flex-col">
      <Nav />
      <RoomClient roomCode={roomCode.toUpperCase()} />
    </main>
  );
}
