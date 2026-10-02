import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import _palette from "../colorPalette.json";
const palette = _palette as Record<string, string>;

const SEQUENCE = [6, 7, 9, 8, 4, 5, 3, 1, 2, 11, 10, 13, 12];
const colorStops = SEQUENCE.map((_, i) => i / (SEQUENCE.length - 1));
const colorValues = SEQUENCE.map(num => palette[num.toString()]);

export default function BackgroundEngine() {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

  // Spring-damped scroll value drives the image crossfades.
  // This adds a secondary layer of inertia ON TOP of Lenis, so image
  // transitions trail the physical scroll position rather than snapping.
  // stiffness + damping tuned for a silky but responsive feel.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 22,
    mass: 0.4,
    restDelta: 0.0001,
  });

  // Color accent still reads from the raw (Lenis-smoothed) value
  // so the particle/text colors stay in sync with the scene.
  const accentColor = useTransform(scrollYProgress, colorStops, colorValues);

  useEffect(() => {
    const unsubscribe = accentColor.on("change", (latestColor) => {
      document.documentElement.style.setProperty("--primary-accent", latestColor);
    });
    document.documentElement.style.setProperty("--primary-accent", accentColor.get());
    return unsubscribe;
  }, [accentColor]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-black pointer-events-none">
      {SEQUENCE.map((imgNum, index) => {
        const total = SEQUENCE.length;

        const t0 = (index - 0.5) / total;
        const t1 = (index + 0.15) / total;
        const t2 = (index + 0.85) / total;
        const t3 = (index + 1.5) / total;

        let inputRange: number[] = [];
        let opacityRange: number[] = [];
        let blurRange: number[] = [];

        if (index === 0) {
          inputRange = [0, t2, t3];
          opacityRange = [1, 1, 0];
          blurRange = [0, 0, 20];
        } else if (index === total - 1) {
          inputRange = [t0, t1, 1];
          opacityRange = [0, 1, 1];
          blurRange = [30, 0, 0];
        } else {
          inputRange = [t0, t1, t2, t3];
          opacityRange = [0, 1, 1, 0];
          blurRange = [30, 0, 0, 30];
        }

        // Images use the spring-damped value → buttery crossfades
        const opacity  = useTransform(smoothProgress, inputRange, opacityRange);
        const rawBlur  = useTransform(smoothProgress, inputRange, blurRange);
        const filter   = useTransform(rawBlur, (v) => `blur(${v}px)`);

        return (
          <motion.div
            key={imgNum}
            style={{ opacity, filter }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={`/assets/${imgNum}_${isMobile ? "MOBILE" : "DESKTOP"}.webp`}
              alt=""
              className="w-full h-full object-cover"
            />
          </motion.div>
        );
      })}
      <div className="absolute inset-0 bg-black/40 z-10" />
    </div>
  );
}
