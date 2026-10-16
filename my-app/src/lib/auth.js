import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const authCookieName = "uno_token";
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";

export function signUser(user) {
  return jwt.sign(
    {
      id: user._id?.toString() || user.id,
      username: user.username,
      email: user.email,
    },
    jwtSecret,
    { expiresIn: "7d" },
  );
}

export async function getCurrentUserToken() {
  const store = await cookies();
  const token = store.get(authCookieName)?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, jwtSecret);
  } catch {
    return null;
  }
}

export function userPayload(user) {
  return {
    id: user._id?.toString() || user.id,
    username: user.username,
    email: user.email,
    avatarColor: user.avatarColor,
    wins: user.wins || 0,
    losses: user.losses || 0,
    coins: user.coins || 0,
    xp: user.xp || 0,
  };
}
