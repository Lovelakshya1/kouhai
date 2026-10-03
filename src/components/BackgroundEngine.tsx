import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import _palette from "../colorPalette.json";
const palette = _palette as Record<string, string>;

const SEQUENCE = [6, 7, 9, 8, 4, 5, 3, 1, 2, 11, 10, 13, 12];
const colorStops = SEQUENCE.map((_, i) => i / (SEQUENCE.length - 1));
const colorValues = SEQUENCE.map(num => palette[num.toString()]);

function checkIsTouch() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
}

export default function BackgroundEngine() {
  const { scrollYProgress } = useScroll();
  const [isTouch, setIsTouch] = useState(checkIsTouch);

  useEffect(() => {
    setIsTouch(checkIsTouch());
  }, []);

  // Desktop (mouse wheel): Smooth momentum spring
  // Mobile (touch): Silky, responsive spring tuned for direct finger glide without lag or rubber-banding
  const desktopSpring = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 22,
    mass: 0.35,
    restDelta: 0.0001,
  });

  const mobileSpring = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 14,
    mass: 0.18,
    restDelta: 0.0001,
  });

  const activeProgress = isTouch ? mobileSpring : desktopSpring;

  const accentColor = useTransform(scrollYProgress, colorStops, colorValues);

  useEffect(() => {
    const unsubscribe = accentColor.on("change", (latestColor) => {
      document.documentElement.style.setProperty("--primary-accent", latestColor);
    });
    document.documentElement.style.setProperty("--primary-accent", accentColor.get());
    return unsubscribe;
  }, [accentColor]);

  return (
    <div
      className="fixed top-0 left-0 w-full -z-10 bg-black pointer-events-none overflow-hidden"
      style={{
        height: "100vh",
        minHeight: "100lvh",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
      }}
    >
      {SEQUENCE.map((imgNum, index) => {
        const total = SEQUENCE.length;

        // Keyframe boundaries for buttery crossfades
        const t0 = (index - 0.5) / total;
        const t1 = (index + 0.15) / total;
        const t2 = (index + 0.85) / total;
        const t3 = (index + 1.5) / total;

        let inputRange: number[] = [];
        let opacityRange: number[] = [];
        let blurRange: number[] = [];

        // 14px atmospheric blur on mobile (fast & dreamy), 24px on desktop
        const maxBlur = isTouch ? 14 : 24;

        if (index === 0) {
          inputRange = [0, t2, t3];
          opacityRange = [1, 1, 0];
          blurRange = [0, 0, isTouch ? 10 : 18];
        } else if (index === total - 1) {
          inputRange = [t0, t1, 1];
          opacityRange = [0, 1, 1];
          blurRange = [maxBlur, 0, 0];
        } else {
          inputRange = [t0, t1, t2, t3];
          opacityRange = [0, 1, 1, 0];
          blurRange = [maxBlur, 0, 0, maxBlur];
        }

        const opacity = useTransform(activeProgress, inputRange, opacityRange);
        const rawBlur = useTransform(activeProgress, inputRange, blurRange);
        const filter = useTransform(rawBlur, (v) => `blur(${v}px)`);

        return (
          <motion.div
            key={imgNum}
            style={{
              opacity,
              filter,
              WebkitTransform: "translateZ(0)",
              transform: "translateZ(0)",
              height: "100vh",
              minHeight: "100lvh",
              willChange: "opacity, filter",
            }}
            className="absolute top-0 left-0 w-full overflow-hidden"
          >
            <picture className="w-full h-full block">
              <source
                media="(max-width: 767px)"
                srcSet={`/assets/${imgNum}_MOBILE.webp`}
              />
              <img
                src={`/assets/${imgNum}_DESKTOP.webp`}
                alt=""
                className="w-full h-full object-cover select-none pointer-events-none"
                decoding="async"
                draggable={false}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </picture>
          </motion.div>
        );
      })}
      <div className="absolute inset-0 bg-black/40 z-10" />
    </div>
  );
}
