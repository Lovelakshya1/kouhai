"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const FLOAT_EASE = [0.45, 0, 0.55, 1] as const;

export function DustParticles() {
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      startY: number;
      size: number;
      duration: number;
      delay: number;
      xAmplitude: number;
      xFrequency: number;
    }[]
  >([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobile =
      window.innerWidth < 768 ||
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;
    setIsMobile(mobile);

    // 24 particles on mobile (lightweight, zero GPU lag), 60 on desktop
    const count = mobile ? 24 : 60;
    const p = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      startY: Math.random() * 120,
      size: Math.random() * (mobile ? 2.2 : 2.8) + 0.4,
      duration: Math.random() * 8 + 6,
      delay: -(Math.random() * 14),
      xAmplitude: Math.random() * (mobile ? 30 : 55) + 12,
      xFrequency: Math.floor(Math.random() * 3) + 2,
    }));
    setParticles(p);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-[100vh] min-h-[100lvh] pointer-events-none z-10 overflow-hidden"
      style={{ WebkitTransform: "translateZ(0)", transform: "translateZ(0)" }}
    >
      {particles.map((p) => {
        const xPath = Array.from({ length: p.xFrequency * 2 + 1 }).map((_, i) => {
          const sign = i % 2 === 0 ? 1 : -1;
          const scale = 0.6 + 0.4 * (i / (p.xFrequency * 2));
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
              boxShadow: isMobile
                ? "0 0 6px 1px var(--primary-accent)"
                : "0 0 4px 1px var(--primary-accent), 0 0 12px 2px var(--primary-accent)",
              transition: "background-color 0.4s ease, box-shadow 0.4s ease",
              WebkitTransform: "translateZ(0)",
              transform: "translateZ(0)",
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
