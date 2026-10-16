import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({})
      .sort({ wins: -1, xp: -1, coins: -1 })
      .limit(50)
      .select("username avatarColor wins losses coins xp")
      .lean();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not load leaderboard." }, { status: 500 });
  }
}
