"use client";

const textColors = {
  red: "text-[#dc2626]",
  yellow: "text-[#d97706]",
  green: "text-[#16a34a]",
  blue: "text-[#2563eb]",
  wild: "text-[#9333ea]",
};

export default function UnoCard({
  card,
  onClick,
  disabled = false,
  small = false,
  back = false,
  tilt = 0,
  playable = false,
  highlightColor,
}) {
  // Card Back for Draw Deck or Face Down
  if (back) {
    return (
      <div
        style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}
        className={`${
          small ? "h-20 w-14 sm:h-24 sm:w-16" : "h-28 w-20 sm:h-36 sm:w-24"
        } relative select-none rounded-2xl border-2 border-white/80 bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-1.5 shadow-[0_10px_25px_rgba(0,0,0,0.7)] transition-all`}
      >
        <div className="absolute inset-1 rounded-xl border border-white/10" />
        {/* Glowing Red-Amber Oval */}
        <div className="flex size-full -rotate-[22deg] items-center justify-center rounded-[50%] bg-gradient-to-r from-red-600 via-red-500 to-amber-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]">
          <span className="text-base font-black italic tracking-tighter text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] sm:text-xl">
            UNO
          </span>
        </div>
      </div>
    );
  }

  const color = card?.color === "wild" && card?.chosenColor ? card.chosenColor : card?.color || "wild";
  const rawValue = String(card?.value || "?");

  // Symbols & Display values
  let displayValue = rawValue;
  let pipValue = rawValue;

  if (rawValue === "skip") {
    displayValue = "⊘";
    pipValue = "⊘";
  } else if (rawValue === "reverse") {
    displayValue = "⇄";
    pipValue = "⇄";
  } else if (rawValue === "+2") {
    displayValue = "+2";
    pipValue = "+2";
  } else if (rawValue === "wild") {
    displayValue = "WILD";
    pipValue = "★";
  } else if (rawValue === "+4") {
    displayValue = "+4";
    pipValue = "+4";
  }

  const textColorClass = textColors[color] || "text-zinc-950";

  // Card Background Gradients
  const bgClasses = {
    red: "bg-gradient-to-br from-[#f43f5e] via-[#e11d48] to-[#be123c]",
    yellow: "bg-gradient-to-br from-[#fbbf24] via-[#f59e0b] to-[#d97706]",
    green: "bg-gradient-to-br from-[#34d399] via-[#10b981] to-[#047857]",
    blue: "bg-gradient-to-br from-[#38bdf8] via-[#2563eb] to-[#1d4ed8]",
    wild: "bg-[#090d16] bg-[radial-gradient(circle_at_25%_25%,#ef4444_0_30%,transparent_32%),radial-gradient(circle_at_75%_25%,#3b82f6_0_30%,transparent_32%),radial-gradient(circle_at_25%_75%,#22c55e_0_30%,transparent_32%),radial-gradient(circle_at_75%_75%,#facc15_0_30%,transparent_32%)]",
  }[color] || "bg-gradient-to-br from-zinc-700 to-zinc-900";

  const isWild = color === "wild" || card?.color === "wild";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      style={{
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        ...(highlightColor ? { filter: `drop-shadow(0 0 18px ${highlightColor})` } : {}),
      }}
      className={`${
        small ? "h-20 w-14 text-sm sm:h-24 sm:w-16" : "h-28 w-20 sm:h-36 sm:w-24"
      } ${bgClasses} relative select-none rounded-2xl border-2 border-white/95 p-1 font-black shadow-[0_12px_28px_rgba(0,0,0,0.65)] transition-all duration-200 ${
        playable
          ? "ring-4 ring-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.8)] -translate-y-2 animate-pulse"
          : ""
      } ${
        disabled
          ? "cursor-not-allowed opacity-65 grayscale-[30%]"
          : "hover:-translate-y-4 hover:scale-105 hover:shadow-[0_20px_35px_rgba(0,0,0,0.8)] active:scale-95"
      }`}
    >
      {/* Top-Left Pip */}
      <div className="absolute left-1.5 top-1 flex flex-col items-center leading-none text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
        <span className="text-[11px] sm:text-xs font-black">{pipValue}</span>
      </div>

      {/* Center White Ellipse */}
      <div className="flex size-full items-center justify-center p-1 sm:p-1.5">
        <div className="flex h-[64%] w-[78%] -rotate-[24deg] items-center justify-center rounded-[50%] bg-white shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_3px_rgba(0,0,0,0.1)]">
          {isWild ? (
            <div className="flex flex-col items-center justify-center leading-none">
              <span className="bg-gradient-to-r from-red-600 via-amber-500 via-emerald-600 to-blue-600 bg-clip-text text-transparent text-sm sm:text-base font-black italic tracking-tighter">
                {displayValue}
              </span>
            </div>
          ) : (
            <span
              className={`${textColorClass} ${
                displayValue.length > 2 ? "text-xs sm:text-sm" : "text-2xl sm:text-3xl"
              } font-black italic tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]`}
            >
              {displayValue}
            </span>
          )}
        </div>
      </div>

      {/* Bottom-Right Inverted Pip */}
      <div className="absolute bottom-1 right-1.5 flex rotate-180 flex-col items-center leading-none text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
        <span className="text-[11px] sm:text-xs font-black">{pipValue}</span>
      </div>
    </button>
  );
}
