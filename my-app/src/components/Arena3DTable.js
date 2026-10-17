"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Cache generated textures
const textureCache = new Map();

// Generate authentic UNO card texture
function getUnoCardTexture(card, isBack = false) {
  if (typeof document === "undefined") return null;

  const color = card?.color === "wild" && card?.chosenColor ? card.chosenColor : card?.color || "wild";
  const value = String(card?.value || "?");
  const cacheKey = isBack ? "back" : `${color}_${value}`;

  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  if (isBack) {
    // Matte dark card back with silver-white border
    ctx.fillStyle = "#070b14";
    ctx.beginPath();
    ctx.roundRect(8, 8, w - 16, h - 16, 36);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.roundRect(14, 14, w - 28, h - 28, 30);
    ctx.stroke();

    // Center Red-Orange Oval
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.42);
    const grad = ctx.createLinearGradient(-190, 0, 190, 0);
    grad.addColorStop(0, "#dc2626");
    grad.addColorStop(0.5, "#ef4444");
    grad.addColorStop(1, "#f59e0b");
    ctx.fillStyle = grad;
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.ellipse(0, 0, 195, 125, 0, 0, Math.PI * 2);
    ctx.fill();

    // Yellow UNO Bold Text with 3D shadow
    ctx.fillStyle = "#facc15";
    ctx.font = 'italic 900 130px "Arial Black", Impact, sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.95)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 7;
    ctx.fillText("UNO", 0, 8);
    ctx.restore();
  } else {
    const colorPalettes = {
      red: { base: "#dc2626", text: "#dc2626", grad: ["#f43f5e", "#dc2626", "#991b1b"] },
      yellow: { base: "#eab308", text: "#b45309", grad: ["#fde047", "#eab308", "#a16207"] },
      green: { base: "#16a34a", text: "#15803d", grad: ["#34d399", "#16a34a", "#065f46"] },
      blue: { base: "#2563eb", text: "#1d4ed8", grad: ["#38bdf8", "#2563eb", "#1e40af"] },
      wild: { base: "#0f172a", text: "#9333ea", grad: ["#0f172a", "#1e293b", "#090d16"] },
    };

    const pal = colorPalettes[color] || colorPalettes.wild;

    // Card Background
    if (color === "wild" || card?.color === "wild") {
      ctx.fillStyle = "#090d16";
      ctx.beginPath();
      ctx.roundRect(8, 8, w - 16, h - 16, 36);
      ctx.fill();

      // 4 quadrant colors
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(14, 14, w - 28, h - 28, 30);
      ctx.clip();
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(0, 0, w / 2, h / 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(w / 2, 0, w / 2, h / 2);
      ctx.fillStyle = "#eab308";
      ctx.fillRect(0, h / 2, w / 2, h / 2);
      ctx.fillStyle = "#16a34a";
      ctx.fillRect(w / 2, h / 2, w / 2, h / 2);
      ctx.restore();
    } else {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, pal.grad[0]);
      grad.addColorStop(0.5, pal.grad[1]);
      grad.addColorStop(1, pal.grad[2]);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(8, 8, w - 16, h - 16, 36);
      ctx.fill();
    }

    // Outer White Border
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.roundRect(14, 14, w - 28, h - 28, 30);
    ctx.stroke();

    // Center White Oval
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.42);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.4)";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(0, 0, 195, 130, 0, 0, Math.PI * 2);
    ctx.fill();

    // Center symbol or number
    let display = value;
    if (value === "skip") display = "⊘";
    else if (value === "reverse") display = "⇄";
    else if (value === "+2") display = "+2";
    else if (value === "wild") display = "WILD";
    else if (value === "+4") display = "+4";

    ctx.fillStyle = pal.text;
    ctx.font = `italic 900 ${display.length > 2 ? "110px" : "190px"} "Arial Black", Impact, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.2)";
    ctx.shadowBlur = 4;
    ctx.fillText(display, 0, 8);
    ctx.restore();

    // Corner Pips (top-left & bottom-right)
    ctx.fillStyle = "#ffffff";
    ctx.font = `italic 900 62px "Arial Black", Impact, sans-serif`;
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 4;
    ctx.textAlign = "center";

    // Top-left
    ctx.fillText(display === "WILD" ? "★" : display, 68, 88);

    // Bottom-right inverted
    ctx.save();
    ctx.translate(w - 68, h - 88);
    ctx.rotate(Math.PI);
    ctx.fillText(display === "WILD" ? "★" : display, 0, 0);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  textureCache.set(cacheKey, texture);
  return texture;
}

// Generate soft radial blur glow texture for light pools
function getRadialGlowTexture(colorHex) {
  if (typeof document === "undefined") return null;
  const key = `glow_${colorHex}`;
  if (textureCache.has(key)) return textureCache.get(key);

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 125);
  grad.addColorStop(0, colorHex);
  grad.addColorStop(0.35, colorHex);
  grad.addColorStop(0.7, colorHex + "66");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  textureCache.set(key, texture);
  return texture;
}

// Soft contact drop shadow texture
function getContactShadowTexture() {
  if (typeof document === "undefined") return null;
  if (textureCache.has("contact_shadow")) return textureCache.get("contact_shadow");

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
  grad.addColorStop(0, "rgba(0, 0, 0, 0.75)");
  grad.addColorStop(0.5, "rgba(0, 0, 0, 0.45)");
  grad.addColorStop(0.85, "rgba(0, 0, 0, 0.15)");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  textureCache.set("contact_shadow", texture);
  return texture;
}

// Procedural Canvas Texture for High-Tech Arena Table Felt
function getTableFeltTexture(activeColorHex) {
  if (typeof document === "undefined") return null;
  const key = `felt_${activeColorHex}`;
  if (textureCache.has(key)) return textureCache.get(key);

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  const cx = 512;
  const cy = 512;

  // 1. Rich Velvet Carbon Felt Radial Gradient
  const bgGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 510);
  bgGrad.addColorStop(0, "#12203d");
  bgGrad.addColorStop(0.35, "#0b162c");
  bgGrad.addColorStop(0.75, "#060d1b");
  bgGrad.addColorStop(1, "#03060c");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Subtle Cyber Tech Grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  const step = 32;
  for (let x = 0; x < 1024; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1024);
    ctx.stroke();
  }
  for (let y = 0; y < 1024; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // 3. Concentric Digital Arena Circuit Rings
  ctx.save();
  ctx.translate(cx, cy);

  // Outer dashed ring
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([12, 14]);
  ctx.beginPath();
  ctx.arc(0, 0, 485, 0, Math.PI * 2);
  ctx.stroke();

  // Secondary glowing ring in active color
  ctx.strokeStyle = activeColorHex || "#22c55e";
  ctx.globalAlpha = 0.55;
  ctx.lineWidth = 4;
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.arc(0, 0, 440, 0, Math.PI * 2);
  ctx.stroke();

  // Radar degree tick marks
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 72; i++) {
    const angle = (i * Math.PI) / 36;
    const r1 = i % 6 === 0 ? 420 : 430;
    const r2 = 438;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * r1, Math.sin(angle) * r1);
    ctx.lineTo(Math.cos(angle) * r2, Math.sin(angle) * r2);
    ctx.stroke();
  }

  // Inner pulsing circuit track
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = activeColorHex || "#22c55e";
  ctx.lineWidth = 2.5;
  ctx.setLineDash([16, 10]);
  ctx.beginPath();
  ctx.arc(0, 0, 330, 0, Math.PI * 2);
  ctx.stroke();

  // 4. Center Card Play Surface Placement Guides
  ctx.setLineDash([]);
  ctx.globalAlpha = 0.65;
  ctx.strokeStyle = activeColorHex || "#22c55e";
  ctx.lineWidth = 2.5;
  // Discard area outline
  ctx.strokeRect(-185, -115, 145, 230);

  // Deck area outline
  ctx.strokeStyle = "#38bdf8";
  ctx.strokeRect(40, -115, 145, 230);

  // Subtle Watermark & Tech Crosshairs
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = "#ffffff";
  ctx.font = '900 24px "Arial Black", Impact, sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("UNO ARENA TABLE", 0, -150);
  ctx.fillText("DIGITAL MATCH SURFACE", 0, 175);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  textureCache.set(key, texture);
  return texture;
}

// Procedural Canvas Texture for High-Contrast Stacked Physical Card Deck Sides
function getDeckSidesTexture() {
  if (typeof document === "undefined") return null;
  if (textureCache.has("deck_sides_stacked_v3")) {
    return textureCache.get("deck_sides_stacked_v3");
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  // 1. Base cardstock paper background
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, w, h);

  // 2. Draw ~54 distinct, tangible cardstock layers (~19px per card)
  const numCards = 54;
  const cardH = h / numCards;

  const cardTones = [
    "#ffffff",
    "#f8fafc",
    "#f1f5f9",
    "#ffffff",
    "#e2e8f0",
    "#fcfcfc",
  ];

  for (let i = 0; i < numCards; i++) {
    const y = i * cardH;
    const baseTone = cardTones[i % cardTones.length];

    // Card paper gradient across its thickness (crisp top specular highlight, slight lower shade)
    const cardGrad = ctx.createLinearGradient(0, y, 0, y + cardH);
    cardGrad.addColorStop(0, "#ffffff");
    cardGrad.addColorStop(0.18, "#ffffff");
    cardGrad.addColorStop(0.35, baseTone);
    cardGrad.addColorStop(0.75, baseTone);
    cardGrad.addColorStop(1, "#cbd5e1");
    ctx.fillStyle = cardGrad;
    ctx.fillRect(0, y, w, cardH);

    // Subtle paper grain noise
    ctx.fillStyle = i % 2 === 0 ? "rgba(0, 0, 0, 0.025)" : "rgba(255, 255, 255, 0.035)";
    ctx.fillRect(0, y, w, cardH);

    // Crisp high-contrast shadow crease slit between cards
    ctx.fillStyle = "rgba(15, 23, 42, 0.96)";
    ctx.fillRect(0, y + cardH - 2.8, w, 2.8);

    // Secondary softer contact shadow line above crease
    ctx.fillStyle = "rgba(30, 41, 59, 0.45)";
    ctx.fillRect(0, y + cardH - 4.2, w, 1.4);

    // Top paper edge specular highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillRect(0, y, w, 1.8);

    // Occasional subtle hint of card face color bleed at the edge
    if (i % 5 === 0) {
      ctx.fillStyle = "rgba(15, 23, 42, 0.5)";
      ctx.fillRect(0, y, w, 1.2);
    }
  }

  // 3. Ambient Occlusion Gradient near table felt (bottom 16%)
  const tableShadow = ctx.createLinearGradient(0, h * 0.84, 0, h);
  tableShadow.addColorStop(0, "rgba(15, 23, 42, 0)");
  tableShadow.addColorStop(1, "rgba(7, 10, 19, 0.8)");
  ctx.fillStyle = tableShadow;
  ctx.fillRect(0, h * 0.84, w, h * 0.16);

  // 4. Subtle cyber rim glow (top & bottom ambient arena sheen)
  const cyberSheen = ctx.createLinearGradient(0, 0, 0, h);
  cyberSheen.addColorStop(0, "rgba(56, 189, 248, 0.14)");
  cyberSheen.addColorStop(0.1, "transparent");
  cyberSheen.addColorStop(0.9, "transparent");
  cyberSheen.addColorStop(1, "rgba(56, 189, 248, 0.08)");
  ctx.fillStyle = cyberSheen;
  ctx.fillRect(0, 0, w, h);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  textureCache.set("deck_sides_stacked_v3", texture);
  return texture;
}

// 3D Rounded Extrusion Geometry Generator matching authentic UNO card curvature
function createRoundedDeckGeometry(width = 1.46, length = 2.22, radius = 0.12, depth = 0.22) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -length / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + length - radius);
  shape.quadraticCurveTo(x + width, y + length, x + width - radius, y + length);
  shape.lineTo(x + radius, y + length);
  shape.quadraticCurveTo(x, y + length, x, y + length - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 16,
  });

  const pos = geom.attributes.position;
  const uv = geom.attributes.uv;

  // 1. Group 0 (top and bottom faces): normalize UVs to [0, 1]
  if (geom.groups[0]) {
    for (let i = 0; i < geom.groups[0].count; i++) {
      uv.setXY(i, (pos.getX(i) + width / 2) / width, (pos.getY(i) + length / 2) / length);
    }
  }

  // 2. Group 1 (side walls): continuous perimeter unwrapping along U, normalized Z along V
  if (geom.groups[1]) {
    const start = geom.groups[1].start;
    const count = geom.groups[1].count;
    let dist = 0;
    for (let i = start; i < start + count; i += 6) {
      const ax = pos.getX(i), ay = pos.getY(i);
      const bx = pos.getX(i + 1), by = pos.getY(i + 1);
      const segLen = Math.hypot(bx - ax, by - ay);
      const u0 = dist;
      const u1 = dist + segLen;
      dist += segLen;

      const z0 = THREE.MathUtils.clamp(pos.getZ(i) / depth, 0, 1);
      const z1 = THREE.MathUtils.clamp(pos.getZ(i + 1) / depth, 0, 1);
      const z2 = THREE.MathUtils.clamp(pos.getZ(i + 2) / depth, 0, 1);
      const z3 = THREE.MathUtils.clamp(pos.getZ(i + 3) / depth, 0, 1);
      const z4 = THREE.MathUtils.clamp(pos.getZ(i + 4) / depth, 0, 1);
      const z5 = THREE.MathUtils.clamp(pos.getZ(i + 5) / depth, 0, 1);

      uv.setXY(i, u0, z0);
      uv.setXY(i + 1, u1, z1);
      uv.setXY(i + 2, u0, z2);
      uv.setXY(i + 3, u1, z3);
      uv.setXY(i + 4, u1, z4);
      uv.setXY(i + 5, u0, z5);
    }

    const totalPerimeter = dist > 0 ? dist : 1;
    for (let i = start; i < start + count; i++) {
      uv.setX(i, (uv.getX(i) / totalPerimeter) * 4);
    }
  }

  geom.computeVertexNormals();
  return geom;
}

let _sharedCardGeom = null;
function getSharedCardGeometry() {
  if (typeof window === "undefined") return null;
  if (!_sharedCardGeom) {
    _sharedCardGeom = createRoundedDeckGeometry(1.46, 2.22, 0.12, 0.008);
  }
  return _sharedCardGeom;
}

let _sharedDeckBaseGeom = null;
function getSharedDeckBaseGeometry(depth = 0.22) {
  if (typeof window === "undefined") return null;
  if (!_sharedDeckBaseGeom) {
    _sharedDeckBaseGeom = createRoundedDeckGeometry(1.46, 2.22, 0.12, depth);
  }
  return _sharedDeckBaseGeom;
}

// Single 3D Physical Card lying FLAT on the table with realistic contact shadow
function Card3DFlat({ card, position, rotationY = 0, isBack = false, scale = 1 }) {
  const texture = useMemo(() => getUnoCardTexture(card, isBack), [card, isBack]);
  const shadowTexture = useMemo(() => getContactShadowTexture(), []);
  const cardGeom = useMemo(() => getSharedCardGeometry(), []);

  const materials = useMemo(() => {
    return [
      new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.28,
        metalness: 0.06,
      }),
      new THREE.MeshStandardMaterial({
        color: "#f8fafc",
        roughness: 0.35,
      }),
    ];
  }, [texture]);

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, rotationY]} scale={scale}>
      {/* Soft Contact Drop Shadow onto table felt */}
      {shadowTexture && (
        <mesh position={[0.04, -0.04, -0.005]}>
          <planeGeometry args={[1.7, 2.45]} />
          <meshBasicMaterial map={shadowTexture} transparent opacity={0.65} />
        </mesh>
      )}

      {/* Card with Smooth Rounded Corners and White Cardstock Edge */}
      {cardGeom && (
        <mesh geometry={cardGeom} material={materials} />
      )}
    </group>
  );
}

// 3D Round Arena Table with Bevel Rim & Glowing Neon Edge (Mockup 1)
function Table3DMesh({ activeColorHex }) {
  const innerRingRef = useRef();
  const feltTexture = useMemo(() => getTableFeltTexture(activeColorHex), [activeColorHex]);

  useFrame((state, delta) => {
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group position={[0, -0.1, 0]}>
      {/* Unified Oval Table Group */}
      <group scale={[1.28, 1, 0.94]}>
        {/* 1. Heavy Outer 3D Table Base & Dark Titanium Bevel Bumper */}
        <mesh position={[0, -0.22, 0]}>
          <cylinderGeometry args={[5.52, 5.1, 0.65, 64]} />
          <meshStandardMaterial
            color="#070a13"
            roughness={0.2}
            metalness={0.92}
          />
        </mesh>

        {/* 2. Outer Padded Bumper Rim */}
        <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.38, 0.18, 24, 100]} />
          <meshStandardMaterial
            color="#0c101a"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>

        {/* 3. Primary Glowing Neon Rim Ring */}
        <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.22, 0.065, 24, 100]} />
          <meshStandardMaterial
            color={activeColorHex}
            emissive={activeColorHex}
            emissiveIntensity={3.8}
            roughness={0.05}
          />
        </mesh>

        {/* 4. Soft Radiant Outer Bloom Halo Ring */}
        <mesh position={[0, 0.15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.24, 0.18, 16, 90]} />
          <meshBasicMaterial
            color={activeColorHex}
            transparent
            opacity={0.28}
          />
        </mesh>

        {/* 5. High-Tech Circular Felt Surface with Procedural Texture */}
        <mesh position={[0, 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[5.2, 64]} />
          {feltTexture ? (
            <meshStandardMaterial
              map={feltTexture}
              roughness={0.55}
              metalness={0.08}
            />
          ) : (
            <meshStandardMaterial
              color="#0b162c"
              roughness={0.7}
              metalness={0.08}
            />
          )}
        </mesh>

        {/* 6. Rotating Inner Neon Energy Circuit */}
        <mesh ref={innerRingRef} position={[0, 0.145, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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

      {/* 7. Center Table Ambient Glow Pool in active color */}
      <pointLight
        position={[0, 1.8, 0]}
        color={activeColorHex}
        intensity={6.5}
        distance={12}
        decay={2}
      />
    </group>
  );
}

// 3D Stadium Environment: Cyber Floor Grid & Floating Arena Embers (Clean, unobscured table)
function StadiumEnvironment() {
  const particlesRef = useRef();

  // Floating Cyber Arena Dust Particles
  const particlePositions = useMemo(() => {
    const coords = new Float32Array(140 * 3);
    for (let i = 0; i < 140; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 28;
      coords[i * 3 + 1] = Math.random() * 8 - 1;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 24 - 4;
    }
    return coords;
  }, []);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += delta * 0.25;
        if (positions[i] > 8) positions[i] = -1;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* 3D Cyber Floor Grid */}
      <gridHelper args={[54, 54, "#1e293b", "#060912"]} position={[0, -1.9, 0]} />

      {/* Floating Arena Dust Embers */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color="#38bdf8"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Generate high-contrast canvas texture for 3D table badges
function getCardPillBadgeTexture(text, count, isDeck = false, canDraw = false) {
  if (typeof document === "undefined") return null;
  const key = `badge_${text}_${count}_${isDeck}_${canDraw}`;
  if (textureCache.has(key)) return textureCache.get(key);

  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 112;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  // Background pill
  ctx.fillStyle = isDeck && canDraw ? "rgba(8, 47, 73, 0.95)" : "rgba(3, 7, 18, 0.92)";
  ctx.beginPath();
  ctx.roundRect(6, 6, w - 12, h - 12, 50);
  ctx.fill();

  // Border
  ctx.strokeStyle = isDeck ? (canDraw ? "#38bdf8" : "rgba(56, 189, 248, 0.5)") : "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(6, 6, w - 12, h - 12, 50);
  ctx.stroke();

  // Text
  ctx.font = '900 36px "Arial Black", Impact, sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (isDeck) {
    ctx.fillStyle = canDraw ? "#38bdf8" : "#7dd3fc";
  } else {
    ctx.fillStyle = "#ffffff";
  }
  ctx.fillText(`${text}: ${count}`, w / 2, h / 2 + 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  textureCache.set(key, texture);
  return texture;
}

function CardPillBadge3D({ text, count, isDeck, canDraw, onClick }) {
  const texture = useMemo(
    () => getCardPillBadgeTexture(text, count, isDeck, canDraw),
    [text, count, isDeck, canDraw]
  );

  return (
    <mesh
      position={[0, 0.02, 1.48]}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
    >
      <planeGeometry args={[1.55, 0.45]} />
      {texture && <meshBasicMaterial map={texture} transparent />}
    </mesh>
  );
}

// Realistic 3D Stacked Draw Deck with Smooth Rounded Geometry, Procedural Paper Edges, and Interactive Top Card
function RealisticDrawDeck3D({ deckCount, canDraw, onDraw, activeColorHex }) {
  const [hoverDeck, setHoverDeck] = useState(false);
  const topCardRef = useRef();
  const topShadowRef = useRef();

  const deckTexture = useMemo(() => getUnoCardTexture(null, true), []);
  const deckSidesTexture = useMemo(() => getDeckSidesTexture(), []);
  const shadowTexture = useMemo(() => getContactShadowTexture(), []);

  // Shared rounded geometries
  const baseDepth = 0.22; // ~75 cards thickness
  const deckBaseGeom = useMemo(() => getSharedDeckBaseGeometry(baseDepth), [baseDepth]);
  const singleCardGeom = useMemo(() => getSharedCardGeometry(), []);

  // Materials for base deck block (top face: card back, sides: stacked paper cardstock edges)
  const baseMaterials = useMemo(() => {
    return [
      new THREE.MeshStandardMaterial({
        map: deckTexture,
        roughness: 0.3,
        metalness: 0.05,
      }),
      new THREE.MeshStandardMaterial({
        map: deckSidesTexture,
        roughness: 0.65,
        metalness: 0.04,
      }),
    ];
  }, [deckTexture, deckSidesTexture]);

  // Materials for intermediate cards (card back + white cardstock edge)
  const intermediateMaterials = useMemo(() => {
    return [
      new THREE.MeshStandardMaterial({
        map: deckTexture,
        roughness: 0.28,
        metalness: 0.05,
      }),
      new THREE.MeshStandardMaterial({
        color: "#f8fafc",
        roughness: 0.4,
      }),
    ];
  }, [deckTexture]);

  // Materials for the top interactive card (supports hover glow when canDraw)
  const topCardMaterials = useMemo(() => {
    return [
      new THREE.MeshStandardMaterial({
        map: deckTexture,
        roughness: 0.25,
        metalness: 0.06,
        emissive: canDraw ? (hoverDeck ? "#0284c7" : "#0369a1") : "#000000",
        emissiveIntensity: canDraw ? (hoverDeck ? 0.45 : 0.15) : 0,
      }),
      new THREE.MeshStandardMaterial({
        color: "#f8fafc",
        roughness: 0.35,
        emissive: canDraw ? (hoverDeck ? "#38bdf8" : "#0284c7") : "#000000",
        emissiveIntensity: canDraw ? (hoverDeck ? 0.6 : 0.2) : 0,
      }),
    ];
  }, [deckTexture, canDraw, hoverDeck]);

  // Dynamic lifting and hover animation for top card
  useFrame((state, delta) => {
    if (topCardRef.current) {
      const isHovered = hoverDeck && canDraw;
      // When hovered to draw: top card smoothly floats up and tilts towards player
      const targetY = isHovered ? 0.35 : 0.258;
      const targetRotX = isHovered ? -Math.PI / 2 - 0.06 : -Math.PI / 2;
      const targetRotZ = isHovered ? 0.06 : 0.038;

      topCardRef.current.position.y = THREE.MathUtils.damp(
        topCardRef.current.position.y,
        targetY,
        12,
        delta
      );
      topCardRef.current.rotation.x = THREE.MathUtils.damp(
        topCardRef.current.rotation.x,
        targetRotX,
        12,
        delta
      );
      topCardRef.current.rotation.z = THREE.MathUtils.damp(
        topCardRef.current.rotation.z,
        targetRotZ,
        12,
        delta
      );
    }

    if (topShadowRef.current) {
      const isHovered = hoverDeck && canDraw;
      const targetOpacity = isHovered ? 0.55 : 0.0;
      const targetScale = isHovered ? 1.05 : 0.95;
      topShadowRef.current.material.opacity = THREE.MathUtils.damp(
        topShadowRef.current.material.opacity,
        targetOpacity,
        12,
        delta
      );
      topShadowRef.current.scale.setScalar(
        THREE.MathUtils.damp(topShadowRef.current.scale.x, targetScale, 12, delta)
      );
    }
  });

  return (
    <group position={[1.25, 0, 0]}>
      {/* 1. Large Soft Contact Shadow beneath entire deck on the felt */}
      {shadowTexture && (
        <mesh position={[0.06, 0.005, -0.06]} rotation={[-Math.PI / 2, 0, 0.04]}>
          <planeGeometry args={[1.75, 2.55]} />
          <meshBasicMaterial map={shadowTexture} transparent opacity={0.7} />
        </mesh>
      )}

      {/* 2. Main Stacked Deck Base Mesh with Rounded Corners and ~86 Paper Edges */}
      {deckBaseGeom && (
        <mesh
          geometry={deckBaseGeom}
          material={baseMaterials}
          position={[0, 0, 0]}
          rotation={[-Math.PI / 2, 0, 0.04]}
          onPointerOver={() => canDraw && setHoverDeck(true)}
          onPointerOut={() => setHoverDeck(false)}
          onClick={canDraw ? onDraw : undefined}
          cursor={canDraw ? "pointer" : "default"}
        />
      )}

      {/* 3. Intermediate Physical Cards Stacked on Top with Realistic Micro-Offsets */}
      {singleCardGeom && (
        <>
          {/* Card Layer -4 */}
          <mesh
            geometry={singleCardGeom}
            material={intermediateMaterials}
            position={[0.012, 0.222, -0.008]}
            rotation={[-Math.PI / 2, 0, 0.022]}
          />

          {/* Card Layer -3 */}
          <mesh
            geometry={singleCardGeom}
            material={intermediateMaterials}
            position={[-0.010, 0.231, 0.010]}
            rotation={[-Math.PI / 2, 0, -0.018]}
          />

          {/* Card Layer -2 */}
          <mesh
            geometry={singleCardGeom}
            material={intermediateMaterials}
            position={[0.008, 0.240, -0.006]}
            rotation={[-Math.PI / 2, 0, 0.046]}
          />

          {/* Card Layer -1 */}
          <mesh
            geometry={singleCardGeom}
            material={intermediateMaterials}
            position={[-0.006, 0.249, 0.005]}
            rotation={[-Math.PI / 2, 0, 0.012]}
          />
        </>
      )}

      {/* 4. Contact Shadow between Top Card and Deck (visible when top card lifts) */}
      {shadowTexture && (
        <mesh
          ref={topShadowRef}
          position={[0.02, 0.257, -0.02]}
          rotation={[-Math.PI / 2, 0, 0.038]}
        >
          <planeGeometry args={[1.5, 2.26]} />
          <meshBasicMaterial map={shadowTexture} transparent opacity={0.0} />
        </mesh>
      )}

      {/* 5. Top Interactive Card (Lifts smoothly on hover, triggers onDraw on click) */}
      {singleCardGeom && (
        <mesh
          ref={topCardRef}
          geometry={singleCardGeom}
          material={topCardMaterials}
          position={[0, 0.258, 0]}
          rotation={[-Math.PI / 2, 0, 0.038]}
          onPointerOver={() => canDraw && setHoverDeck(true)}
          onPointerOut={() => setHoverDeck(false)}
          onClick={canDraw ? onDraw : undefined}
          cursor={canDraw ? "pointer" : "default"}
        />
      )}

      {/* 6. Subtle Cyber Deck Aura Glow Pool when playable */}
      {canDraw && (
        <pointLight
          position={[0, 0.45, 0]}
          color="#38bdf8"
          intensity={hoverDeck ? 4.5 : 2.0}
          distance={3.5}
          decay={2}
        />
      )}

      {/* 7. Pure 3D Deck Count Badge lying flat on felt */}
      <CardPillBadge3D
        text="Deck"
        count={deckCount}
        isDeck={true}
        canDraw={canDraw}
        onClick={canDraw ? onDraw : undefined}
      />
    </group>
  );
}

// Center 3D Table Cards: Discard Pile (Fanned Flat Stack) + 3D Realistic Draw Deck
function CenterTableCards3D({
  topCard,
  discardCount,
  deckCount,
  activeColorHex,
  canDraw,
  onDraw,
}) {
  const glowTexture = useMemo(() => getRadialGlowTexture(activeColorHex), [activeColorHex]);

  return (
    <group position={[0, 0.15, 0]}>
      {/* 1. DISCARD PILE (Realistic Casual Fanned Stack resting FLAT on the felt) */}
      <group position={[-1.25, 0, 0]}>
        {/* Soft Circular Radial Neon Glow Pool on the Felt */}
        {glowTexture && (
          <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.4, 3.4]} />
            <meshBasicMaterial map={glowTexture} transparent opacity={0.4} />
          </mesh>
        )}

        {/* Underlying Fanned Card 1 (Red 8 tilted left -18°) */}
        <Card3DFlat
          card={{ color: "red", value: "8" }}
          position={[-0.06, 0.012, 0.03]}
          rotationY={-0.31}
        />

        {/* Underlying Fanned Card 2 (Yellow Reverse tilted left -7°) */}
        <Card3DFlat
          card={{ color: "yellow", value: "reverse" }}
          position={[0.04, 0.022, -0.04]}
          rotationY={-0.12}
        />

        {/* Underlying Fanned Card 3 (Blue Skip tilted right +14°) */}
        <Card3DFlat
          card={{ color: "blue", value: "skip" }}
          position={[-0.02, 0.032, -0.02]}
          rotationY={0.24}
        />

        {/* Top Active Card lying on top of the pile */}
        {topCard && (
          <Card3DFlat
            card={topCard}
            position={[0, 0.048, 0]}
            rotationY={0.04}
          />
        )}

        {/* Neon Active Color Point Light pool */}
        <pointLight
          position={[0, 0.55, 0]}
          color={activeColorHex}
          intensity={6.0}
          distance={4.5}
          decay={2}
        />

        {/* Pure 3D Discard Count Badge lying flat on felt */}
        <CardPillBadge3D text="Discard" count={discardCount} />
      </group>

      {/* 2. 3D DRAW DECK (Realistic Physical Multi-Card Stack with Paper Edges) */}
      <RealisticDrawDeck3D
        deckCount={deckCount}
        canDraw={canDraw}
        onDraw={onDraw}
        activeColorHex={activeColorHex}
      />
    </group>
  );
}

// Root 3D Arena Component (Pure 3D Canvas - Zero Drei <Html> roots)
export default function Arena3DTable({
  room,
  user,
  me,
  opponents = [],
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
      <div className="flex size-full items-center justify-center text-zinc-400">
        <div className="size-10 animate-spin rounded-full border-4 border-yellow-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 select-none overflow-hidden">
      <Canvas
        camera={{ position: [0, 4.9, 6.3], fov: 46 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Atmospheric Esports Arena Lighting */}
        <ambientLight intensity={0.65} />
        <directionalLight position={[0, 10, 8]} intensity={1.8} />
        <directionalLight position={[0, -4, -10]} intensity={0.7} color="#38bdf8" />

        {/* 3D Arena Stadium Floor Grid & Floating Embers */}
        <StadiumEnvironment />

        {/* 3D Round / Oval Digital Felt Table */}
        <Table3DMesh activeColorHex={activeColorHex} />

        {/* 3D Center Cards lying FLAT on the table felt */}
        <CenterTableCards3D
          topCard={room?.topCard}
          discardCount={room?.discardCount || 0}
          deckCount={room?.deckCount || 0}
          activeColorHex={activeColorHex}
          canDraw={me?.isTurn && room?.status === "playing"}
          onDraw={onDrawCard}
        />
      </Canvas>
    </div>
  );
}
