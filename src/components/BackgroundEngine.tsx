import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import _palette from "../colorPalette.json";
const palette = _palette as Record<string, string>;

const SEQUENCE = [6, 7, 9, 8, 4, 5, 3, 1, 2, 11, 10, 13, 12];
const colorStops = SEQUENCE.map((_, i) => i / (SEQUENCE.length - 1));
const colorValues = SEQUENCE.map(num => palette[num.toString()]);

export default function BackgroundEngine() {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);

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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-black pointer-events-none">
      {SEQUENCE.map((imgNum, index) => {
        const total = SEQUENCE.length;
        
        // Ensure images stay fully visible longer (t1 to t2 window is much wider)
        // This guarantees text components hit exactly in the middle of a stable image, never during a crossfade.
        const t0 = (index - 0.5) / total;
        const t1 = (index + 0.15) / total; 
        const t2 = (index + 0.85) / total; 
        const t3 = (index + 1.5) / total;
        
        let inputRange = [];
        let opacityRange = [];
        let blurRange = [];

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
        
        const opacity = useTransform(scrollYProgress, inputRange, opacityRange);
        const rawBlur = useTransform(scrollYProgress, inputRange, blurRange);
        const filter = useTransform(rawBlur, (val) => `blur(${val}px)`);

        return (
          <motion.div
            key={imgNum}
            style={{ opacity, filter }}
            className="absolute inset-0 w-full h-full"
          >
            <img 
               src={`/assets/${imgNum}_${isMobile ? 'MOBILE' : 'DESKTOP'}.webp`} 
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
