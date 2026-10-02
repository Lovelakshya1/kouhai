import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Initialises Lenis smooth-scroll ONLY on precision pointer devices (mouse / trackpad).
 *
 * On mobile/touch devices, we deliberately bypass Lenis to preserve the phone's
 * native hardware-accelerated momentum touch scrolling. This eliminates all touch
 * latency and rubber-band stutter on phones.
 */
export function useLenis() {
  useEffect(() => {
    // Detect mobile touch devices
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;

    // Use native 60/120Hz hardware scrolling on phones
    if (isTouch) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
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
