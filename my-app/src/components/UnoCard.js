const labels = {
  skip: "SKIP",
  reverse: "REV",
  "+2": "+2",
  wild: "WILD",
  "+4": "+4",
};

export default function UnoCard({ card, onClick, disabled = false, small = false, back = false }) {
  if (back) {
    return (
      <div className={`${small ? "h-20 w-14 sm:h-24 sm:w-16" : "h-24 w-16 sm:h-32 sm:w-24"} uno-card grid place-items-center rounded-lg bg-zinc-900`}>
        <div className="rounded-full border-4 border-red-500 px-2 py-1 text-sm font-black text-yellow-300">UNO</div>
      </div>
    );
  }

  const color = card?.color === "wild" && card?.chosenColor ? card.chosenColor : card?.color || "wild";
  const value = labels[card?.value] || card?.value || "?";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${small ? "h-20 w-14 text-base sm:h-24 sm:w-16 sm:text-lg" : "h-24 w-16 text-lg sm:h-32 sm:w-24 sm:text-2xl"} uno-card card-${color} group relative shrink-0 rounded-lg p-2 font-black uppercase disabled:cursor-not-allowed disabled:opacity-60 hover:-translate-y-1 sm:hover:-translate-y-2`}
    >
      <span className="absolute left-2 top-1 text-sm">{value}</span>
      <span className="grid h-full place-items-center rounded-full bg-white/20 px-2 text-center">{value}</span>
      <span className="absolute bottom-1 right-2 rotate-180 text-sm">{value}</span>
    </button>
  );
}
