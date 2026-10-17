"use client";

import CyberAvatar from "./CyberAvatar";

// Opponent Pods rendered in pure React DOM overlay with deterministic inline positioning
export default function OpponentSeatsOverlay({
  opponents = [],
  activePlayer,
  turnTimer,
  activeReactions = {},
}) {
  const getSeatConfig = (idx, total) => {
    if (total <= 1) {
      return {
        left: "50%",
        top: "21%",
        transform: "translate(-50%, -50%)",
        color: "#22c55e",
        ringClass: "turn-ring-green",
      };
    }
    if (total === 2) {
      const presets = [
        { left: "26%", top: "24%", transform: "translate(-50%, -50%)", color: "#38bdf8", ringClass: "turn-ring-blue" },
        { left: "74%", top: "24%", transform: "translate(-50%, -50%)", color: "#facc15", ringClass: "turn-ring-yellow" },
      ];
      return presets[idx % 2];
    }
    if (total === 3) {
      const presets = [
        { left: "14%", top: "38%", transform: "translate(-50%, -50%)", color: "#ef4444", ringClass: "turn-ring-red" },
        { left: "50%", top: "21%", transform: "translate(-50%, -50%)", color: "#22c55e", ringClass: "turn-ring-green" },
        { left: "86%", top: "38%", transform: "translate(-50%, -50%)", color: "#facc15", ringClass: "turn-ring-yellow" },
      ];
      return presets[idx % 3];
    }
    // 4 or more
    const presets = [
      { left: "12%", top: "40%", transform: "translate(-50%, -50%)", color: "#ef4444", ringClass: "turn-ring-red" },
      { left: "32%", top: "23%", transform: "translate(-50%, -50%)", color: "#38bdf8", ringClass: "turn-ring-blue" },
      { left: "68%", top: "23%", transform: "translate(-50%, -50%)", color: "#22c55e", ringClass: "turn-ring-green" },
      { left: "88%", top: "40%", transform: "translate(-50%, -50%)", color: "#facc15", ringClass: "turn-ring-yellow" },
    ];
    return presets[idx % presets.length];
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden">
      {opponents.map((player, idx) => {
        const seat = getSeatConfig(idx, opponents.length);
        const isCurrentTurn = player.isTurn;
        const reaction = activeReactions[player.username];

        return (
          <div
            key={player.id || player.username || idx}
            style={{
              position: "absolute",
              left: seat.left,
              top: seat.top,
              transform: seat.transform,
            }}
            className="flex flex-col items-center pointer-events-auto transition-all duration-300"
          >
            {/* Floating Reaction Speech Bubble */}
            {reaction && Date.now() - reaction.timestamp < 4500 && (
              <div className="speech-bubble absolute -top-11 z-30 px-3 py-1 text-xs font-black text-white animate-bounce whitespace-nowrap">
                {reaction.emoji}
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* Current Turn Glowing Ring Badge */}
              {isCurrentTurn && (
                <div
                  className={`flex flex-col items-center justify-center rounded-full border-2 p-1.5 ${seat.ringClass} bg-black/85 shadow-2xl`}
                >
                  <span className="text-[7px] font-black uppercase tracking-tight text-zinc-300">CURRENT</span>
                  <span className="text-[8px] font-black uppercase text-yellow-300">TURN</span>
                </div>
              )}

              {/* Cyber Hexagon Pod with Avatar */}
              <div
                className={`relative rounded-2xl p-1 transition-transform duration-200 ${
                  isCurrentTurn ? "scale-110" : ""
                }`}
                style={{
                  background: `linear-gradient(135deg, ${seat.color} 0%, rgba(15,23,42,0.95) 100%)`,
                  boxShadow: isCurrentTurn ? `0 0 32px ${seat.color}` : `0 4px 15px rgba(0,0,0,0.6)`,
                }}
              >
                <CyberAvatar
                  name={player.username}
                  avatarColor={player.avatarColor || seat.color}
                  index={idx}
                  size="md"
                />
                <span
                  className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-zinc-950 ${
                    player.connected ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-zinc-500"
                  }`}
                />
              </div>

              {/* Countdown Timer Dial */}
              {isCurrentTurn && (
                <div className="flex flex-col items-center justify-center rounded-full border-2 border-emerald-400 bg-black/85 p-1.5 shadow-[0_0_18px_rgba(52,211,153,0.8)]">
                  <span className="text-[7px] font-black uppercase text-zinc-400">TIME LEFT</span>
                  <span className="text-[10px] font-black text-emerald-300">{turnTimer}s</span>
                </div>
              )}
            </div>

            {/* Name & Cards Badge */}
            <div className="mt-2 flex items-center gap-1.5 rounded-full border border-white/15 bg-[#090d18]/95 px-3 py-0.5 text-center shadow-xl">
              <span className="max-w-20 truncate text-xs font-black text-white">{player.username}</span>
              <span className="rounded-full bg-yellow-400/20 px-1.5 text-[10px] font-black text-yellow-300 border border-yellow-400/30">
                {player.cardCount}
              </span>
            </div>
          </div>
        );
      })}

      {opponents.length === 0 && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "21%",
            transform: "translate(-50%, -50%)",
          }}
          className="pointer-events-auto"
        >
          <div className="rounded-2xl border border-dashed border-white/20 bg-black/85 px-6 py-4 text-center backdrop-blur-md shadow-2xl select-none">
            <p className="text-sm font-bold text-zinc-200">Waiting for opponents to take seats...</p>
            <p className="mt-1 text-xs text-zinc-400">Share table code with friends</p>
          </div>
        </div>
      )}
    </div>
  );
}
