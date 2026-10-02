"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Ease curve for sinuous organic float
const FLOAT_EASE = [0.45, 0, 0.55, 1] as const;

export function DustParticles() {
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      startY: number; // 0–120 so some start below viewport
      size: number;
      duration: number;
      delay: number;
      xAmplitude: number; // px of sway
      xFrequency: number; // how many direction changes during drift
    }[]
  >([]);

  useEffect(() => {
    const p = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      startY: Math.random() * 120,
      size: Math.random() * 2.8 + 0.4,   // 0.4 – 3.2 px
      duration: Math.random() * 8 + 6,   // 6 – 14 s  ← much faster
      delay: -(Math.random() * 14),       // random phase
      xAmplitude: Math.random() * 55 + 15, // 15 – 70 px sway
      xFrequency: Math.floor(Math.random() * 3) + 2, // 2–4 direction changes
    }));
    setParticles(p);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      {particles.map((p) => {
        // Build a sinuous X keyframe path based on amplitude & frequency
        const xPath = Array.from({ length: p.xFrequency * 2 + 1 }).map((_, i) => {
          const sign = i % 2 === 0 ? 1 : -1;
          const scale = 0.6 + 0.4 * (i / (p.xFrequency * 2)); // grows slightly as it rises
          return `${sign * p.xAmplitude * scale}px`;
        });

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.startY}%`,
              backgroundColor: "var(--primary-accent)",
              // Double glow ring so they're bright and reactive
              boxShadow: [
                "0 0 4px 1px var(--primary-accent)",
                "0 0 12px 2px var(--primary-accent)",
              ].join(", "),
              transition: "background-color 0.4s ease, box-shadow 0.4s ease",
            }}
            animate={{
              x: xPath,
              y: ["0%", "-30%", "-60%", "-100%"],
              opacity: [0, 0.7, 0.9, 0.7, 0],
              scale: [0.6, 1, 1.2, 0.8, 0.4],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
              x: { ease: FLOAT_EASE, duration: p.duration, repeat: Infinity, delay: p.delay },
              scale: { ease: "easeInOut", duration: p.duration, repeat: Infinity, delay: p.delay },
              opacity: { duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" },
            }}
          />
        );
      })}
    </div>
  );
}
