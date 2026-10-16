import { NextResponse } from "next/server";
import { getCurrentUserToken, userPayload } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const tokenUser = await getCurrentUserToken();
    if (!tokenUser) return NextResponse.json({ user: null }, { status: 401 });

    await connectDB();
    const user = await User.findById(tokenUser.id);
    if (!user) return NextResponse.json({ user: null }, { status: 401 });
    return NextResponse.json({ user: userPayload(user) });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not load user." }, { status: 500 });
  }
}
