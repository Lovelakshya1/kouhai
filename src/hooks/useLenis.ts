import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Initialises a Lenis smooth-scroll instance.
 * Lenis intercepts wheel/touch events and replays them with
 * lerp-based inertia, so the whole page feels like it's floating.
 *
 * Framer Motion's useScroll reads from the real DOM scrollTop,
 * which Lenis updates on every frame — so BackgroundEngine and
 * SyncedTextOverlay both get the smoothed value automatically.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      // How long the inertia "coast" feels — higher = more floaty
      duration: 1.6,
      // Expo-out easing: starts fast, trails off gently
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Prevent horizontal scroll interference
      orientation: "vertical",
      gestureOrientation: "vertical",
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}
