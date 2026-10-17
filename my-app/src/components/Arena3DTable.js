"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import CyberAvatar from "./CyberAvatar";
import UnoCard from "./UnoCard";

// 3D Table Mesh with Clean Unified Group Scale for Seamless Oval Alignment
function TableMesh({ activeColorHex }) {
  const innerRingRef = useRef();

  useFrame((state, delta) => {
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += delta * 0.12;
    }
  });

  return (
    <group position={[0, -0.1, 0]}>
      {/* Unified Oval Group - Perfectly scales cylinder and neon torus together */}
      <group scale={[1.38, 1, 0.92]}>
        {/* 1. Outer 3D Table Base & Dark Titanium Bevel */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[5.55, 5.15, 0.65, 64]} />
          <meshStandardMaterial
            color="#070a13"
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        {/* 2. Primary Radiant Neon Rim Ring */}
        <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.46, 0.08, 24, 100]} />
          <meshStandardMaterial
            color={activeColorHex}
            emissive={activeColorHex}
            emissiveIntensity={3.4}
            roughness={0.05}
          />
        </mesh>

        {/* 3. Deep Velvet Carbon Table Felt */}
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[5.38, 5.38, 0.06, 64]} />
          <meshStandardMaterial
            color="#0b1325"
            roughness={0.88}
            metalness={0.1}
          />
        </mesh>

        {/* 4. Rotating Inner Neon Energy Circuit */}
        <mesh ref={innerRingRef} position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4.2, 0.035, 16, 90]} />
          <meshStandardMaterial
            color={activeColorHex}
            emissive={activeColorHex}
            emissiveIntensity={1.8}
            transparent
            opacity={0.65}
          />
        </mesh>
      </group>

      {/* 5. Center Active Color Ambient Light Pool */}
      <pointLight
        position={[0, 1.8, 0]}
        color={activeColorHex}
        intensity={5.5}
        distance={12}
        decay={2}
      />
    </group>
  );
}

// 3D Stadium Floor Grid & 4 Laser Light Tracks (Mockup 1)
function ArenaStadiumLasers() {
  return (
    <group position={[0, -2.2, 0]}>
      {/* 3D Cyber Floor Grid */}
      <gridHelper args={[48, 48, "#1e293b", "#090d16"]} position={[0, -0.01, 0]} />

      {/* Red Laser Ray to Left (Mira) */}
      <mesh position={[-10, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 14, 16]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.75} />
      </mesh>

      {/* Blue Laser Ray to Top-Left (Elara) */}
      <mesh position={[-8, 0.05, -8]} rotation={[0, -Math.PI / 4, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 16, 16]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.75} />
      </mesh>

      {/* Green Laser Ray to Top-Center (Kai) */}
      <mesh position={[0, 0.05, -11]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 14, 16]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.8} />
      </mesh>

      {/* Yellow Laser Ray to Right (Leo) */}
      <mesh position={[10, 0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 14, 16]} />
        <meshBasicMaterial color="#facc15" transparent opacity={0.75} />
      </mesh>
    </group>
  );
}

// 3D Center Cards on the Table Felt
function CenterCards3D({
  topCard,
  discardCount,
  deckCount,
  activeColorHex,
  canDraw,
  onDraw,
}) {
  return (
    <group position={[0, 0.35, 0]}>
      {/* Discard Pile (Left of Center) */}
      <group position={[-1.4, 0, 0]}>
        <Html center distanceFactor={13}>
          <div className="relative flex flex-col items-center select-none pointer-events-auto">
            {/* 3 Underlying 3D Fanned Cards (Mockup 1) */}
            <div className="relative flex items-center justify-center">
              <div className="pointer-events-none absolute -rotate-[22deg] -translate-x-4 translate-y-1 opacity-70">
                <UnoCard card={{ color: "red", value: "8" }} small />
              </div>
              <div className="pointer-events-none absolute -rotate-[10deg] -translate-x-2 opacity-80">
                <UnoCard card={{ color: "yellow", value: "reverse" }} small />
              </div>
              <div className="pointer-events-none absolute rotate-[14deg] translate-x-4 translate-y-1 opacity-70">
                <UnoCard card={{ color: "blue", value: "skip" }} small />
              </div>

              {/* Active Top Card with radiant glowing halo */}
              <div
                className="relative z-10 transition-transform duration-200 hover:scale-105"
                style={{
                  filter: `drop-shadow(0 0 28px ${activeColorHex})`,
                }}
              >
                {topCard ? (
                  <UnoCard card={topCard} highlightColor={activeColorHex} />
                ) : (
                  <div className="h-28 w-20 sm:h-36 sm:w-24 rounded-2xl border-2 border-dashed border-white/20 grid place-items-center text-xs text-zinc-400 font-bold bg-black/60">
                    Empty
                  </div>
                )}
              </div>
            </div>

            <span className="mt-3 rounded-full border border-white/15 bg-black/90 px-3 py-0.5 text-xs font-black text-zinc-200 shadow-xl">
              Discard: <strong className="text-white">{discardCount}</strong>
            </span>
          </div>
        </Html>
      </group>

      {/* 3D Draw Deck (Right of Center) */}
      <group position={[1.4, 0, 0]}>
        <Html center distanceFactor={13}>
          <div
            onClick={canDraw ? onDraw : undefined}
            className={`cursor-pointer transition-transform duration-200 select-none ${
              canDraw ? "hover:scale-105 active:scale-95" : "opacity-80"
            }`}
          >
            <div className="draw-deck-3d rounded-2xl">
              <UnoCard back />
            </div>
            <div className="mt-3 flex justify-center">
              <span className="rounded-full border border-sky-400/50 bg-black/90 px-3 py-0.5 text-xs font-black text-sky-300 shadow-xl">
                Deck: <strong className="text-yellow-300">{deckCount}</strong>
              </span>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}

// Opponent Pods anchored in 3D Space along the table rim matching Mockup #1
function OpponentPods3D({ opponents, activePlayer, turnTimer, activeReactions }) {
  const seatPositions3D = [
    { pos: [-5.8, 0.4, 0.0], label: "Mira", color: "#ef4444", turnClass: "turn-ring-red" },
    { pos: [-3.2, 0.8, -2.8], label: "Elara", color: "#38bdf8", turnClass: "turn-ring-blue" },
    { pos: [0.0, 1.1, -3.4], label: "Kai", color: "#22c55e", turnClass: "turn-ring-green" },
    { pos: [5.6, 0.4, 0.0], label: "Leo", color: "#facc15", turnClass: "turn-ring-yellow" },
  ];

  return (
    <group>
      {opponents.map((player, idx) => {
        const seat = seatPositions3D[idx % seatPositions3D.length];
        const isCurrentTurn = player.isTurn;
        const reaction = activeReactions[player.username];

        return (
          <group key={player.id} position={seat.pos}>
            <Html center distanceFactor={14}>
              <div className="relative flex flex-col items-center select-none pointer-events-auto">
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
                      className={`flex flex-col items-center justify-center rounded-full border-2 p-1.5 ${seat.turnClass} bg-black/80 shadow-2xl`}
                    >
                      <span className="text-[7px] font-black uppercase tracking-tight text-zinc-300">CURRENT</span>
                      <span className="text-[8px] font-black uppercase text-yellow-300">TURN</span>
                    </div>
                  )}

                  {/* Cyber Hexagon Pod with Hero Avatar */}
                  <div
                    className={`relative rounded-2xl p-1 transition-transform duration-200 ${
                      isCurrentTurn ? "scale-110" : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, ${seat.color} 0%, rgba(15,23,42,0.9) 100%)`,
                      boxShadow: isCurrentTurn ? `0 0 28px ${seat.color}` : `0 4px 15px rgba(0,0,0,0.6)`,
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
            </Html>
          </group>
        );
      })}

      {opponents.length === 0 && (
        <group position={[0, 1.1, -3.2]}>
          <Html center distanceFactor={14}>
            <div className="rounded-2xl border border-dashed border-white/20 bg-black/85 px-6 py-4 text-center backdrop-blur-md shadow-2xl">
              <p className="text-sm font-bold text-zinc-200">Waiting for opponents to take seats...</p>
              <p className="mt-1 text-xs text-zinc-400">Invite friends or join public table</p>
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}

// Root 3D Arena Component
export default function Arena3DTable({
  room,
  user,
  me,
  opponents,
  activePlayer,
  activeColor,
  activeColorHex,
  turnTimer,
  activeReactions,
  onDrawCard,
  onPlayCard,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[560px] sm:h-[660px] w-full items-center justify-center text-zinc-400">
        <div className="size-10 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-[560px] sm:h-[660px] w-full select-none overflow-hidden rounded-3xl">
      <Canvas
        camera={{ position: [0, 6.6, 7.6], fov: 46 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Atmospheric Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 8]} intensity={1.5} />
        <directionalLight position={[0, -4, -10]} intensity={0.5} color="#38bdf8" />

        {/* 3D Arena Stadium Environment & Lasers */}
        <ArenaStadiumLasers />

        {/* 3D Round / Oval Digital Felt Table */}
        <TableMesh activeColorHex={activeColorHex} />

        {/* 3D Center Cards (Fanned Discard Stack + Draw Deck) */}
        <CenterCards3D
          topCard={room?.topCard}
          discardCount={room?.discardCount || 0}
          deckCount={room?.deckCount || 0}
          activeColorHex={activeColorHex}
          canDraw={me?.isTurn && room?.status === "playing"}
          onDraw={onDrawCard}
        />

        {/* 3D Seated Opponents with Hexagon Pods & Turn Rings */}
        <OpponentPods3D
          opponents={opponents}
          activePlayer={activePlayer}
          turnTimer={turnTimer}
          activeReactions={activeReactions}
        />
      </Canvas>
    </div>
  );
}
