import { NextResponse } from "next/server";
import { getCurrentUserToken } from "@/lib/auth";
import { getPublicRoom } from "@/lib/game/uno-engine";

export async function GET(_request, { params }) {
  const user = await getCurrentUserToken();
  const { roomCode } = await params;
  const room = getPublicRoom(roomCode, user?.id);
  if (!room) return NextResponse.json({ error: "Room not found." }, { status: 404 });
  return NextResponse.json({ room });
}
