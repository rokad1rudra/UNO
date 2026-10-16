import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { authCookieName, signUser, userPayload } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();
    const cleanUsername = String(username || "").trim();
    const cleanEmail = String(email || "").toLowerCase().trim();
    if (!cleanUsername || !cleanEmail || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    await connectDB();
    const existing = await User.findOne({ $or: [{ email: cleanEmail }, { username: cleanUsername }] });
    if (existing) {
      return NextResponse.json({ error: "Username or email is already taken." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const avatarColor = ["#ef4444", "#facc15", "#22c55e", "#3b82f6"][Math.floor(Math.random() * 4)];
    const user = await User.create({ username: cleanUsername, email: cleanEmail, passwordHash, avatarColor });
    const token = signUser(user);
    const response = NextResponse.json({ user: userPayload(user) }, { status: 201 });
    response.cookies.set(authCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message || "Registration failed." }, { status: 500 });
  }
}
