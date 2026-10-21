"use client";

import React, { useState } from "react";
import Link from "next/link";

const designs = [
  {
    id: "design1",
    num: "1",
    title: "Design 1: Esports Stadium & Laser Energy Vortex",
    badge: "🔥 High Energy & Volumetric FX",
    description: "Spectacular dark arena atmosphere with 4 volumetric UNO-color laser beams (Red, Cyan Blue, Yellow, Green) cutting across the stadium, a central golden energy vortex with floating 3D cards bursting out, a pulsing neon-red Quick Match heartbeat button, and glassmorphic Create / Join Room panels.",
    img: "/mockups/design1_stadium.jpg",
    tags: ["Volumetric Laser Beams", "Swirling Card Vortex", "Esports Stadium Crowd", "Neon Red Quick Match"],
  },
  {
    id: "design2",
    num: "2",
    title: "Design 2: Cyber Orbit Portal & Holographic Digital Table",
    badge: "⚡ Cyberpunk Digital FX",
    description: "Futuristic circular neon arena table with multi-color floor rings, holographic lightning core with orbiting glowing UNO cards, and floating electric frosted glass HUD panels with an illuminated room keypad.",
    img: "/mockups/design2_cyber.jpg",
    tags: ["Holographic Neon Rings", "Lightning Core Orbit", "Cyber Cityscape Fog", "Hologram Keypad HUD"],
  },
  {
    id: "design3",
    num: "3",
    title: "Design 3: Clean Minimalist Centered Fan",
    badge: "🎯 Minimalist & Direct",
    description: "Ultra-clean dark slate hero with a symmetric fanned hand of 4 cards, glowing Play Now CTA, and inline room code joiner.",
    img: "/mockups/design3_minimal.jpg",
    tags: ["Centered Card Fan", "Minimal Dark Slate", "Simple Dual CTA"],
  },
  {
    id: "design4",
    num: "4",
    title: "Design 4: Split Modern Hero & 3D Card Stack",
    badge: "✨ Modern Conversion Split",
    description: "Bold editorial typography on the left with dedicated Quick Match and Create Room buttons, paired with a 3D glossy card stack on the right.",
    img: "/mockups/design4_split.jpg",
    tags: ["Split Layout", "3D Glossy Card Stack", "Dedicated Mode Cards"],
  },
];

export default function DesignsPage() {
  const [selected, setSelected] = useState("design1");
  const [zoomImg, setZoomImg] = useState(null);

  return (
    <div className="min-h-screen bg-[#07090e] text-white p-6 md:p-12 font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold tracking-wider uppercase mb-2">
            🎨 Visual Design Mockups
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Choose Front Page UI Concept
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Click on any mockup to zoom in, compare effects, and choose your favorite.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 text-sm font-semibold transition"
          >
            ← View Current Front Page
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition"
          >
            Go to Dashboard →
          </Link>
        </div>
      </div>

      {/* Grid of Designs */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {designs.map((d) => {
          const isSelected = selected === d.id;
          return (
            <div
              key={d.id}
              onClick={() => setSelected(d.id)}
              className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "border-red-500 shadow-2xl shadow-red-500/20 bg-neutral-900/90"
                  : "border-white/10 hover:border-white/30 bg-neutral-900/40"
              }`}
            >
              {/* Image Container */}
              <div
                className="relative aspect-video w-full overflow-hidden bg-black/60 cursor-zoom-in"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomImg(d.img);
                }}
              >
                <img
                  src={d.img}
                  alt={d.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-300">
                  {d.badge}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/15 text-xs font-semibold text-white/90 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>🔍 Click to Fullscreen</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                    {d.title}
                  </h2>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs transition ${
                      isSelected
                        ? "border-red-500 bg-red-500 text-white"
                        : "border-white/30 text-white/50"
                    }`}
                  >
                    #{d.num}
                  </span>
                </div>

                <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                  {d.description}
                </p>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {d.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Selection Footer */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">
                    OPTION {d.num}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(d.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                      isSelected
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/40"
                        : "bg-white/10 hover:bg-white/20 text-neutral-300"
                    }`}
                  >
                    {isSelected ? `★ Option ${d.num} Selected` : `Choose Option ${d.num}`}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Action Banner */}
      <div className="max-w-7xl mx-auto mt-10 p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-900 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-red-400 uppercase tracking-wider">
            Ready to Build
          </div>
          <div className="text-lg font-extrabold text-white">
            {designs.find((d) => d.id === selected)?.title}
          </div>
          <div className="text-xs text-neutral-400">
            Tell me in chat: &quot;Build Option 1&quot; or &quot;Build Option 2&quot; and I will code it immediately!
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 rounded-xl bg-red-600 font-extrabold text-sm text-white shadow-xl shadow-red-600/30">
            Option {designs.find((d) => d.id === selected)?.num} Selected
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {zoomImg && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomImg(null)}
        >
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => setZoomImg(null)}
              className="absolute -top-12 right-0 text-white/80 hover:text-white text-sm font-bold px-3 py-1 rounded-lg bg-white/10 border border-white/20"
            >
              ✕ Close Zoom
            </button>
            <img
              src={zoomImg}
              alt="Zoomed UI mockup"
              className="w-full h-auto rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
}
