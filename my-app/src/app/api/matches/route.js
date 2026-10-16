import { NextResponse } from "next/server";
import { getCurrentUserToken } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Match from "@/models/Match";

export async function GET() {
  try {
    const user = await getCurrentUserToken();
    if (!user) return NextResponse.json({ matches: [] });

    await connectDB();
    const matches = await Match.find({ "players.userId": user.id }).sort({ endedAt: -1 }).limit(25).lean();
    return NextResponse.json({ matches });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not load match history." }, { status: 500 });
  }
}
