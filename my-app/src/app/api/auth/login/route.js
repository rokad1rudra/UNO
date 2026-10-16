import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { authCookieName, signUser, userPayload } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    await connectDB();
    const user = await User.findOne({ email: String(email || "").toLowerCase() });
    const valid = user && (await bcrypt.compare(password || "", user.passwordHash));
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = signUser(user);
    const response = NextResponse.json({ user: userPayload(user) });
    response.cookies.set(authCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message || "Login failed." }, { status: 500 });
  }
}
