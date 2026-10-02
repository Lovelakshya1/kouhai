import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Only preload the hero image — the one shown at scrollYProgress = 0
const HERO_IMAGE = "/assets/6_DESKTOP.webp";
const HERO_MOBILE = "/assets/6_MOBILE.webp";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const src = window.innerWidth < 768 ? HERO_MOBILE : HERO_IMAGE;
    const img = new Image();
    img.src = src;

    const done = () => {
      // Small intentional delay so the fade feels cinematic, not abrupt
      setTimeout(() => setReady(true), 400);
    };

    if (img.complete) {
      done();
    } else {
      img.onload = done;
      img.onerror = done; // fail silently — still show the page
    }

    // Safety net: show the page after 4s max regardless
    const timeout = setTimeout(() => setReady(true), 4000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (ready) {
      // Give the exit animation time to finish before calling onComplete
      const t = setTimeout(onComplete, 900);
      return () => clearTimeout(t);
    }
  }, [ready, onComplete]);

  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Pulsing name */}
          <motion.p
            className="font-serif text-white/30 text-lg tracking-[0.35em] lowercase"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            kouhai
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
