import { NextResponse } from "next/server";
import { getCurrentUserToken } from "@/lib/auth";
import { createRoom, getPublicRoom, joinRoom, listPublicRooms } from "@/lib/game/uno-engine";

export async function GET() {
  const rooms = listPublicRooms();
  return NextResponse.json({ rooms });
}

export async function POST(request) {
  const user = await getCurrentUserToken();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const body = await request.json();
  const room = createRoom(user, body);
  return NextResponse.json({ room: getPublicRoom(room.roomCode, user.id) }, { status: 201 });
}

export async function PATCH(request) {
  const user = await getCurrentUserToken();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const { roomCode } = await request.json();
  const result = joinRoom(roomCode, user);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ room: getPublicRoom(result.room.roomCode, user.id) });
}
