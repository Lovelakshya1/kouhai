import { useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

/**
 * Velocity-driven "feel" for scrolling. It never touches the real scroll
 * (native momentum stays), it only reacts to how fast you are scrolling:
 * a springy zoom on the background and a tiny skew on the text.
 */
export function useScrollFeel() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 260, damping: 40, mass: 0.6 });
  const scale = useTransform(smooth, [-3500, 0, 3500], [1.035, 1, 1.035], { clamp: true });
  const skewY = useTransform(smooth, [-3500, 0, 3500], [-2.2, 0, 2.2], { clamp: true });
  // Text trails the scroll a little, then springs back (underdamped = bouncy).
  const lagTarget = useTransform(smooth, [-3000, 0, 3000], [26, 0, -26], { clamp: true });
  const lift = useSpring(lagTarget, { stiffness: 190, damping: 13, mass: 0.7 });
  return { scale, skewY, lift };
}
