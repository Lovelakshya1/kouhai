"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
  useAccent?: boolean;
  isVisible: boolean;
}

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.6,
  useAccent = false,
  isVisible,
}: TextGenerateEffectProps) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    if (!scope.current) return;
    if (isVisible) {
      animate(
        "span",
        { opacity: 1, filter: filter ? "blur(0px)" : "none", y: 0 },
        { duration, delay: stagger(0.12), ease: [0.22, 1, 0.36, 1] }
      );
    } else {
      animate(
        "span",
        { opacity: 0, filter: filter ? "blur(12px)" : "none", y: 12 },
        { duration: 0 }
      );
    }
  }, [isVisible, animate, duration, filter]);

  // AE Deep Glow — three concentric passes for titles,
  // subtle black shadow for body text
  const glowStyle: React.CSSProperties = useAccent
    ? {
        color: "color-mix(in srgb, var(--primary-accent) 55%, white)",
        textShadow: [
          "0 0 10px var(--primary-accent)",
          "0 0 28px var(--primary-accent)",
          "0 0 60px color-mix(in srgb, var(--primary-accent) 45%, transparent)",
          "0 2px 14px rgba(0,0,0,0.8)",
        ].join(", "),
        transition: "color 0.6s ease, text-shadow 0.6s ease",
      }
    : { textShadow: "0 2px 24px rgba(0,0,0,1), 0 1px 6px rgba(0,0,0,1)" };

  return (
    <motion.div ref={scope} className={cn("", className)}>
      {wordsArray.map((word, idx) => (
        <motion.span
          key={word + idx}
          className="inline-block mr-[0.28em] opacity-0"
          style={{ ...glowStyle, translateY: 12 } as React.CSSProperties}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};
