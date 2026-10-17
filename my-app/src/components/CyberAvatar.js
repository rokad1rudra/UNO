"use client";

// High-detail, vibrant Cyberpunk Esports Avatars matching Mockup #1
const avatarPresets = {
  // 1. Kai / Green Tech Specialist
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
      <circle cx="50" cy="50" r="42" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" fill="none" />
      <path d="M 16 95 L 34 70 L 66 70 L 84 95 Z" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
      <path d="M 38 72 L 50 82 L 62 72 Z" fill="#047857" />
      <rect x="44" y="60" width="12" height="14" fill="#fcd34d" />
      <path d="M 35 38 C 35 26 65 26 65 38 L 64 56 C 64 66 58 70 50 70 C 42 70 36 66 36 56 Z" fill="#fde68a" />
      <path d="M 32 36 C 32 20 45 14 50 14 C 55 14 68 20 68 36 C 64 30 58 30 50 30 C 42 30 36 30 32 36 Z" fill="url(#kaiHair)" />
      <path d="M 42 14 L 46 8 L 52 14 L 58 8 L 60 16 Z" fill="#34d399" />
      <rect x="38" y="44" width="24" height="7" rx="3.5" fill="#10b981" />
      <line x1="40" y1="47.5" x2="60" y2="47.5" stroke="#ffffff" strokeWidth="1.5" />
      <rect x="31" y="42" width="4" height="12" rx="2" fill="#34d399" />
      <rect x="65" y="42" width="4" height="12" rx="2" fill="#34d399" />
    </svg>
  ),

  // 2. Elara / Cyan-Blue Netrunner
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
      <path d="M 16 95 L 34 72 L 66 72 L 84 95 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      <path d="M 38 74 L 50 84 L 62 74 Z" fill="#0284c7" />
      <rect x="44" y="60" width="12" height="14" fill="#fed7aa" />
      <path d="M 36 38 C 36 28 64 28 64 38 L 63 56 C 63 65 57 70 50 70 C 43 70 37 65 37 56 Z" fill="#ffedd5" />
      <path d="M 31 38 C 31 20 44 16 50 16 C 66 16 69 22 69 40 L 67 58 C 64 54 62 46 62 42 C 62 34 58 28 50 28 C 42 28 38 34 38 42 C 38 46 36 54 33 58 Z" fill="url(#elaraHair)" />
      <circle cx="44" cy="46" r="2.5" fill="#0284c7" />
      <circle cx="56" cy="46" r="2.5" fill="#0284c7" />
      <circle cx="56" cy="46" r="5" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
      <rect x="29" y="40" width="5" height="14" rx="2.5" fill="#38bdf8" />
      <rect x="66" y="40" width="5" height="14" rx="2.5" fill="#38bdf8" />
    </svg>
  ),

  // 3. Mira / Crimson Blade Duelist
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
      <path d="M 16 95 L 34 72 L 66 72 L 84 95 Z" fill="#180a0e" stroke="#ef4444" strokeWidth="1.5" />
      <path d="M 38 74 L 50 84 L 62 74 Z" fill="#991b1b" />
      <rect x="44" y="60" width="12" height="14" fill="#fde68a" />
      <path d="M 36 38 C 36 28 64 28 64 38 L 63 56 C 63 65 57 70 50 70 C 43 70 37 65 37 56 Z" fill="#ffedd5" />
      <path d="M 32 36 C 33 20 46 16 50 16 C 64 16 68 22 68 38 L 66 58 L 62 46 C 60 36 56 28 50 28 C 44 28 40 36 38 46 L 34 58 Z" fill="#0f172a" />
      <line x1="38" y1="46" x2="62" y2="46" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="44" cy="46" r="2.5" fill="#ffffff" />
      <circle cx="56" cy="46" r="2.5" fill="#ffffff" />
      <path d="M 40 52 L 44 56 L 41 60" stroke="#ef4444" strokeWidth="1.2" fill="none" />
    </svg>
  ),

  // 4. Leo / Gold Arena Champion
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
      <path d="M 16 95 L 34 70 L 66 70 L 84 95 Z" fill="#1c1917" stroke="#facc15" strokeWidth="1.5" />
      <path d="M 38 72 L 50 82 L 62 72 Z" fill="#a16207" />
      <rect x="44" y="60" width="12" height="14" fill="#fed7aa" />
      <path d="M 36 38 C 36 26 64 26 64 38 L 63 56 C 63 65 57 70 50 70 C 43 70 37 65 37 56 Z" fill="#ffedd5" />
      <path d="M 32 34 C 36 18 52 14 60 20 C 66 26 66 34 64 36 L 60 30 C 55 28 45 28 38 32 Z" fill="url(#leoHair)" />
      <path d="M 44 14 L 50 6 L 56 14 L 62 8 L 64 16 Z" fill="#facc15" />
      <circle cx="44" cy="46" r="4.5" fill="none" stroke="#facc15" strokeWidth="1.8" />
      <line x1="40" y1="46" x2="32" y2="44" stroke="#facc15" strokeWidth="1.5" />
      <circle cx="44" cy="46" r="2" fill="#facc15" />
      <circle cx="56" cy="46" r="2.5" fill="#78350f" />
    </svg>
  ),

  // 5. Valkyrie / Neon Violet Battle Specialist
  valkyrie: (
    <svg viewBox="0 0 100 100" className="size-full">
      <defs>
        <linearGradient id="valkBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="valkHair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7e22ce" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#valkBg)" />
      <circle cx="50" cy="50" r="42" stroke="#a855f7" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" fill="none" />
      <path d="M 16 95 L 34 72 L 66 72 L 84 95 Z" fill="#1e1b4b" stroke="#a855f7" strokeWidth="1.5" />
      <path d="M 38 74 L 50 84 L 62 74 Z" fill="#6b21a8" />
      <rect x="44" y="60" width="12" height="14" fill="#fbcfe8" />
      <path d="M 36 38 C 36 26 64 26 64 38 L 63 56 C 63 65 57 70 50 70 C 43 70 37 65 37 56 Z" fill="#fdf2f8" />
      {/* Side-swept violet hair */}
      <path d="M 28 36 C 28 18 45 14 55 14 C 68 14 72 24 72 38 L 68 54 C 65 44 60 36 50 32 C 42 28 34 32 30 42 Z" fill="url(#valkHair)" />
      <path d="M 24 38 L 30 52 L 35 44 Z" fill="#c084fc" />
      {/* Sleek violet cyber visor */}
      <polygon points="36,44 64,44 62,51 38,51" fill="#a855f7" />
      <line x1="39" y1="47.5" x2="61" y2="47.5" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="33" cy="46" r="3" fill="#c084fc" />
      <circle cx="67" cy="46" r="3" fill="#c084fc" />
    </svg>
  ),

  // 6. Ghost / Dark Stealth Phantom
  ghost: (
    <svg viewBox="0 0 100 100" className="size-full">
      <defs>
        <linearGradient id="ghostBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#18181b" />
          <stop offset="100%" stopColor="#09090b" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#ghostBg)" />
      <circle cx="50" cy="50" r="42" stroke="#ea580c" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" fill="none" />
      {/* Dark Tactical Cowl */}
      <path d="M 16 95 L 32 68 L 68 68 L 84 95 Z" fill="#09090b" stroke="#3f3f46" strokeWidth="1.5" />
      <path d="M 40 70 L 50 82 L 60 70 Z" fill="#27272a" />
      {/* Shadow Hood */}
      <path d="M 26 50 C 26 22 40 14 50 14 C 60 14 74 22 74 50 C 74 68 66 72 50 72 C 34 72 26 68 26 50 Z" fill="#18181b" stroke="#52525b" strokeWidth="1" />
      {/* Dark mask inner face */}
      <path d="M 36 40 C 36 32 64 32 64 40 L 62 58 C 62 65 56 68 50 68 C 44 68 38 65 38 58 Z" fill="#09090b" />
      {/* Glowing Dual Orange Optics */}
      <polygon points="40,45 46,43 47,48 41,50" fill="#f97316" />
      <polygon points="60,45 54,43 53,48 59,50" fill="#f97316" />
      <circle cx="43.5" cy="46" r="1.5" fill="#fff7ed" />
      <circle cx="56.5" cy="46" r="1.5" fill="#fff7ed" />
      {/* Mask Air Filter Lines */}
      <line x1="45" y1="56" x2="55" y2="56" stroke="#ea580c" strokeWidth="1.5" />
      <line x1="47" y1="60" x2="53" y2="60" stroke="#ea580c" strokeWidth="1.5" />
    </svg>
  ),

  // 7. Nova / Sunset Aviator Specialist
  nova: (
    <svg viewBox="0 0 100 100" className="size-full">
      <defs>
        <linearGradient id="novaBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c2d12" />
          <stop offset="100%" stopColor="#431407" />
        </linearGradient>
        <linearGradient id="novaHair" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#novaBg)" />
      <circle cx="50" cy="50" r="42" stroke="#f97316" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" fill="none" />
      <path d="M 16 95 L 34 72 L 66 72 L 84 95 Z" fill="#1c1917" stroke="#ea580c" strokeWidth="1.5" />
      <path d="M 38 74 L 50 84 L 62 74 Z" fill="#c2410c" />
      <rect x="44" y="60" width="12" height="14" fill="#fcd34d" />
      <path d="M 36 38 C 36 28 64 28 64 38 L 63 56 C 63 65 57 70 50 70 C 43 70 37 65 37 56 Z" fill="#ffedd5" />
      {/* Spiky Sunset Hair */}
      <path d="M 30 36 C 30 18 45 12 50 12 C 55 12 70 18 70 36 C 66 28 58 24 50 24 C 42 24 34 28 30 36 Z" fill="url(#novaHair)" />
      <polygon points="34,16 42,6 46,14" fill="#fdba74" />
      <polygon points="48,12 54,4 58,12" fill="#fdba74" />
      {/* Aviator Cyber Goggles on Forehead */}
      <rect x="36" y="26" width="12" height="8" rx="3" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
      <rect x="52" y="26" width="12" height="8" rx="3" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
      <line x1="48" y1="30" x2="52" y2="30" stroke="#78350f" strokeWidth="1.5" />
      {/* Eyes & Smirk */}
      <circle cx="44" cy="46" r="2.5" fill="#431407" />
      <circle cx="56" cy="46" r="2.5" fill="#431407" />
      <path d="M 46 56 Q 50 60 54 56" stroke="#431407" strokeWidth="1.5" fill="none" />
    </svg>
  ),

  // 8. Apex / Chrome Android Sentinel
  apex: (
    <svg viewBox="0 0 100 100" className="size-full">
      <defs>
        <linearGradient id="apexBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="chromePlate" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#apexBg)" />
      <circle cx="50" cy="50" r="42" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" fill="none" />
      {/* Chassis Armor */}
      <path d="M 16 95 L 34 70 L 66 70 L 84 95 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
      <polygon points="42,70 50,82 58,70" fill="#0284c7" />
      {/* Android Neck Joint */}
      <rect x="44" y="60" width="12" height="14" fill="#334155" />
      <line x1="44" y1="64" x2="56" y2="64" stroke="#38bdf8" strokeWidth="1" />
      <line x1="44" y1="68" x2="56" y2="68" stroke="#38bdf8" strokeWidth="1" />
      {/* Chrome Plated Head */}
      <path d="M 35 36 C 35 22 65 22 65 36 L 63 56 C 63 66 58 70 50 70 C 42 70 37 66 37 56 Z" fill="url(#chromePlate)" />
      {/* Forehead Hologram Diamond */}
      <polygon points="50,24 54,30 50,36 46,30" fill="#38bdf8" />
      {/* Cyan Scanning Visor Strip */}
      <rect x="37" y="44" width="26" height="5" rx="2.5" fill="#0284c7" />
      <circle cx="46" cy="46.5" r="2" fill="#38bdf8" />
      <circle cx="54" cy="46.5" r="2" fill="#38bdf8" />
      {/* Audio Recievers */}
      <rect x="32" y="40" width="4" height="14" rx="2" fill="#64748b" />
      <rect x="64" y="40" width="4" height="14" rx="2" fill="#64748b" />
    </svg>
  ),
};

const avatarKeys = ["kai", "elara", "mira", "leo", "valkyrie", "ghost", "nova", "apex"];

// Deterministically pick a unique avatar per player
function getAvatarKey(name = "", index = 0) {
  const normalized = String(name || "").toLowerCase().trim();
  if (normalized.includes("kai")) return "kai";
  if (normalized.includes("elara")) return "elara";
  if (normalized.includes("mira")) return "mira";
  if (normalized.includes("leo")) return "leo";
  if (normalized.includes("valk")) return "valkyrie";
  if (normalized.includes("ghost")) return "ghost";
  if (normalized.includes("nova")) return "nova";
  if (normalized.includes("apex")) return "apex";

  // Deterministic string hash
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) & 0xffffffff;
  }
  const pick = Math.abs(hash + (index || 0) * 3) % avatarKeys.length;
  return avatarKeys[pick];
}

export default function CyberAvatar({ name = "", avatarColor = "", index = 0, size = "md" }) {
  const key = getAvatarKey(name, index);

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
