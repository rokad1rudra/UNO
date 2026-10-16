import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, lowercase: true, trim: true, unique: true },
    passwordHash: { type: String, required: true },
    avatarColor: { type: String, default: "#ef4444" },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    coins: { type: Number, default: 250 },
    xp: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
