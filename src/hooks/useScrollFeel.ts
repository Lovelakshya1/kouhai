import { useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

/**
 * Velocity-driven physical spring feel for scrolling.
 * Provides a buttery, organic spring response on mobile:
 * - bgScale: subtle depth zoom (1.0 -> 1.032) during swipe velocity, softly settling back.
 * - textFloat: subtle inertial drag on text (critically damped, NO weird skew or jitter).
 */
export function useScrollFeel() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  // Smooth out velocity with responsive, critically-damped spring physics
  const smoothVelocity = useSpring(velocity, {
    stiffness: 120,
    damping: 18,
    mass: 0.25,
  });

  // Background subtle breath/depth zoom: 1.0 -> 1.032
  const bgScale = useTransform(
    smoothVelocity,
    [-3500, 0, 3500],
    [1.032, 1.0, 1.032],
    { clamp: true }
  );

  // Text inertial drag: gently trails scroll direction (-8px to +8px), then floats back softly.
  const textLagTarget = useTransform(
    smoothVelocity,
    [-3000, 0, 3000],
    [8, 0, -8],
    { clamp: true }
  );

  const textFloat = useSpring(textLagTarget, {
    stiffness: 140,
    damping: 18, // critically damped (no underdamped bounciness/jelly)
    mass: 0.25,
  });

  return { bgScale, textFloat };
}
