import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function GlassPanel({ children, className = "", delay = 0 }: GlassPanelProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={`backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}
