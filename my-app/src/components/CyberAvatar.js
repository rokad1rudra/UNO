"use client";

// High-detail, vibrant Cyberpunk Esports Avatars matching Mockup #1
const avatarPresets = {
  // Kai / Green Tech Specialist
  kai: (
    <svg viewBox="0 0 100 100" className="size-full">
      <defs>
        <linearGradient id="kaiBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="100%" stopColor="#022c22" />
        </linearGradient>
        <linearGradient id="kaiHair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#kaiBg)" />
      {/* Cyber Grid ring */}
      <circle cx="50" cy="50" r="42" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" fill="none" />
      {/* Shoulders */}
      <path d="M 16 95 L 34 70 L 66 70 L 84 95 Z" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
      <path d="M 38 72 L 50 82 L 62 72 Z" fill="#047857" />
      {/* Neck */}
      <rect x="44" y="60" width="12" height="14" fill="#fcd34d" />
      {/* Face */}
      <path d="M 35 38 C 35 26 65 26 65 38 L 64 56 C 64 66 58 70 50 70 C 42 70 36 66 36 56 Z" fill="#fde68a" />
      {/* Spiky Tech Hair */}
      <path d="M 32 36 C 32 20 45 14 50 14 C 55 14 68 20 68 36 C 64 30 58 30 50 30 C 42 30 36 30 32 36 Z" fill="url(#kaiHair)" />
      <path d="M 42 14 L 46 8 L 52 14 L 58 8 L 60 16 Z" fill="#34d399" />
      {/* Glowing Neon Visor */}
      <rect x="38" y="44" width="24" height="7" rx="3.5" fill="#10b981" filter="drop-shadow(0 0 5px #10b981)" />
      <line x1="40" y1="47.5" x2="60" y2="47.5" stroke="#ffffff" strokeWidth="1.5" />
      {/* Cyber Earset */}
      <rect x="31" y="42" width="4" height="12" rx="2" fill="#34d399" />
      <rect x="65" y="42" width="4" height="12" rx="2" fill="#34d399" />
    </svg>
  ),

  // Elara / Cyan-Blue Netrunner
  elara: (
    <svg viewBox="0 0 100 100" className="size-full">
      <defs>
        <linearGradient id="elaraBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0c4a6e" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>
        <linearGradient id="elaraHair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#elaraBg)" />
      <circle cx="50" cy="50" r="42" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" fill="none" />
      {/* Shoulders */}
      <path d="M 16 95 L 34 72 L 66 72 L 84 95 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      <path d="M 38 74 L 50 84 L 62 74 Z" fill="#0284c7" />
      {/* Neck */}
      <rect x="44" y="60" width="12" height="14" fill="#fed7aa" />
      {/* Face */}
      <path d="M 36 38 C 36 28 64 28 64 38 L 63 56 C 63 65 57 70 50 70 C 43 70 37 65 37 56 Z" fill="#ffedd5" />
      {/* Blue Bob Hair with glowing bangs */}
      <path d="M 31 38 C 31 20 44 16 50 16 C 66 16 69 22 69 40 L 67 58 C 64 54 62 46 62 42 C 62 34 58 28 50 28 C 42 28 38 34 38 42 C 38 46 36 54 33 58 Z" fill="url(#elaraHair)" />
      {/* Cyber Eyes & Scouter */}
      <circle cx="44" cy="46" r="2.5" fill="#0284c7" />
      <circle cx="56" cy="46" r="2.5" fill="#0284c7" />
      <circle cx="56" cy="46" r="5" stroke="#38bdf8" strokeWidth="1" fill="none" filter="drop-shadow(0 0 3px #38bdf8)" />
      {/* Headset Ring */}
      <rect x="29" y="40" width="5" height="14" rx="2.5" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
      <rect x="66" y="40" width="5" height="14" rx="2.5" fill="#38bdf8" filter="drop-shadow(0 0 4px #38bdf8)" />
    </svg>
  ),

  // Mira / Crimson Blade Duelist
  mira: (
    <svg viewBox="0 0 100 100" className="size-full">
      <defs>
        <linearGradient id="miraBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#881337" />
          <stop offset="100%" stopColor="#4c0519" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#miraBg)" />
      <circle cx="50" cy="50" r="42" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" fill="none" />
      {/* Armor */}
      <path d="M 16 95 L 34 72 L 66 72 L 84 95 Z" fill="#180a0e" stroke="#ef4444" strokeWidth="1.5" />
      <path d="M 38 74 L 50 84 L 62 74 Z" fill="#991b1b" />
      {/* Neck */}
      <rect x="44" y="60" width="12" height="14" fill="#fde68a" />
      {/* Face */}
      <path d="M 36 38 C 36 28 64 28 64 38 L 63 56 C 63 65 57 70 50 70 C 43 70 37 65 37 56 Z" fill="#ffedd5" />
      {/* Sleek Dark Hair */}
      <path d="M 32 36 C 33 20 46 16 50 16 C 64 16 68 22 68 38 L 66 58 L 62 46 C 60 36 56 28 50 28 C 44 28 40 36 38 46 L 34 58 Z" fill="#0f172a" />
      {/* Red Eye Cyber Visor */}
      <line x1="38" y1="46" x2="62" y2="46" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" filter="drop-shadow(0 0 4px #ef4444)" />
      <circle cx="44" cy="46" r="2.5" fill="#ffffff" />
      <circle cx="56" cy="46" r="2.5" fill="#ffffff" />
      {/* Cyber Tattoo on Cheek */}
      <path d="M 40 52 L 44 56 L 41 60" stroke="#ef4444" strokeWidth="1.2" fill="none" />
    </svg>
  ),

  // Leo / Gold Arena Champion
  leo: (
    <svg viewBox="0 0 100 100" className="size-full">
      <defs>
        <linearGradient id="leoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        <linearGradient id="leoHair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#leoBg)" />
      <circle cx="50" cy="50" r="42" stroke="#facc15" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" fill="none" />
      {/* Shoulder Armor */}
      <path d="M 16 95 L 34 70 L 66 70 L 84 95 Z" fill="#1c1917" stroke="#facc15" strokeWidth="1.5" />
      <path d="M 38 72 L 50 82 L 62 72 Z" fill="#a16207" />
      {/* Neck */}
      <rect x="44" y="60" width="12" height="14" fill="#fed7aa" />
      {/* Face */}
      <path d="M 36 38 C 36 26 64 26 64 38 L 63 56 C 63 65 57 70 50 70 C 43 70 37 65 37 56 Z" fill="#ffedd5" />
      {/* Spiky Gold Hair */}
      <path d="M 32 34 C 36 18 52 14 60 20 C 66 26 66 34 64 36 L 60 30 C 55 28 45 28 38 32 Z" fill="url(#leoHair)" />
      <path d="M 44 14 L 50 6 L 56 14 L 62 8 L 64 16 Z" fill="#facc15" />
      {/* Gold Cyber Monocle / Scouter */}
      <circle cx="44" cy="46" r="4.5" fill="none" stroke="#facc15" strokeWidth="1.8" filter="drop-shadow(0 0 4px #facc15)" />
      <line x1="40" y1="46" x2="32" y2="44" stroke="#facc15" strokeWidth="1.5" />
      <circle cx="44" cy="46" r="2" fill="#facc15" />
      <circle cx="56" cy="46" r="2.5" fill="#78350f" />
    </svg>
  ),
};

export default function CyberAvatar({ name = "", avatarColor = "#22c55e", index = 0, size = "md" }) {
  const normalized = name.toLowerCase();
  let key = "kai";

  if (normalized.includes("mira") || avatarColor === "#ef4444" || index % 4 === 1) {
    key = "mira";
  } else if (normalized.includes("elara") || avatarColor === "#3b82f6" || avatarColor === "#38bdf8" || index % 4 === 2) {
    key = "elara";
  } else if (normalized.includes("leo") || avatarColor === "#facc15" || index % 4 === 3) {
    key = "leo";
  } else {
    key = "kai";
  }

  const sizeClasses = {
    sm: "size-10",
    md: "size-14 sm:size-16",
    lg: "size-20 sm:size-24",
  }[size] || "size-14 sm:size-16";

  return (
    <div className={`relative overflow-hidden rounded-2xl ${sizeClasses} shadow-lg ring-1 ring-white/10`}>
      {avatarPresets[key] || avatarPresets.kai}
    </div>
  );
}
