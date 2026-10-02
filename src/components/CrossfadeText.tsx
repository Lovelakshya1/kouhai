"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CrossfadeTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

export function CrossfadeText({ words, interval = 3000, className }: CrossfadeTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words, interval]);

  // Find the longest word to lock the container width and prevent layout shifts
  const longestWord = [...words].sort((a, b) => b.length - a.length)[0] || "";

  return (
    <span className={cn("relative inline-flex items-center justify-center overflow-visible", className)}>
      {/* Invisible spacer to lock the width and height so it NEVER shifts */}
      <span className="invisible opacity-0 whitespace-nowrap">
        {longestWord}
      </span>
      
      {/* The crossfading elements absolutely positioned on top */}
      <AnimatePresence>
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: "blur(10px)", y: 5 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          exit={{ opacity: 0, filter: "blur(10px)", y: -5 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
