import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    roomCode: { type: String, required: true, index: true },
    players: [
      {
        userId: String,
        username: String,
        placement: Number,
        cardsLeft: Number,
      },
    ],
    winner: {
      userId: String,
      username: String,
    },
    startedAt: Date,
    endedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.models.Match || mongoose.model("Match", matchSchema);
