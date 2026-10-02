"use client";
import { useEffect, useRef, useState } from "react";
import { MotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { motion } from "framer-motion";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { CrossfadeText } from "./CrossfadeText";
import { ExternalLink } from "lucide-react";

// ─── Sequence & Scroll Math ─────────────────────────────────────────────────
const SEQUENCE = [6, 7, 9, 8, 4, 5, 3, 1, 2, 11, 10, 13, 12];
const TOTAL = SEQUENCE.length; // 13

// Each image occupies 1/TOTAL of scrollYProgress.
// The "stable" window (fully sharp, no crossfade blur) is roughly [i+0.15, i+0.85] / TOTAL.
// Text appears inside [i+0.28, i+0.72] / TOTAL — well clear of the blur transitions.
function textWindow(index: number) {
  const fadeInStart  = (index + 0.22) / TOTAL;
  const fadeInEnd    = (index + 0.35) / TOTAL;
  const fadeOutStart = (index + 0.65) / TOTAL;
  const fadeOutEnd   = (index + 0.78) / TOTAL;
  return { fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd };
}

// ─── Age Calculator ──────────────────────────────────────────────────────────
function getAge() {
  const today = new Date();
  const birth = new Date("2007-10-27");
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  ) age--;
  return age;
}

// ─── Link Style ──────────────────────────────────────────────────────────────
const LINK =
  "inline-flex items-center gap-2 mt-6 text-[0.65rem] uppercase tracking-[0.25em] " +
  "text-white/50 hover:text-[var(--primary-accent)] transition-colors duration-300 " +
  "border-b border-white/20 hover:border-[var(--primary-accent)] pb-0.5";

// ─── Individual synced section ───────────────────────────────────────────────
interface SyncedSectionProps {
  index: number;
  scrollYProgress: MotionValue<number>;
  align?: "left" | "right" | "center";
  children: (isVisible: boolean) => React.ReactNode;
}

function SyncedSection({ index, scrollYProgress, align = "left", children }: SyncedSectionProps) {
  const { fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd } = textWindow(index);
  const [isVisible, setIsVisible] = useState(index === 0);

  const opacity = useTransform(
    scrollYProgress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // Small blur on the whole section container reinforces the cinematic fade
  const sectionBlur = useTransform(opacity, [0, 0.3, 1], [6, 2, 0]);
  const sectionFilter = useTransform(sectionBlur, (v) => `blur(${v}px)`);

  useMotionValueEvent(opacity, "change", (latest) => {
    setIsVisible(latest > 0.08);
  });

  const alignClass =
    align === "right" ? "items-end text-right" :
    align === "center" ? "items-center text-center" :
    "items-start text-left";

  return (
    <motion.div
      className={`fixed inset-0 z-20 flex flex-col justify-center px-6 md:px-24 ${alignClass} pointer-events-none`}
      style={{ opacity, filter: sectionFilter }}
    >
      <div className="pointer-events-auto">
        {children(isVisible)}
      </div>
    </motion.div>
  );
}

// ─── Main Overlay ────────────────────────────────────────────────────────────
export default function SyncedTextOverlay() {
  const { scrollYProgress } = useScroll();

  // Typography tokens (editorial, not AI-slop)
  const display = "font-serif font-medium tracking-[-0.02em] leading-none";
  const label   = "font-sans font-normal text-[0.6rem] md:text-[0.65rem] uppercase tracking-[0.3em] text-white/40 mb-4";
  const body    = "font-sans font-light text-base md:text-lg leading-[1.8] text-white/70";

  return (
    <>
      {/* ── 0: HERO (Image 6) ─────────────────────────────────────────────── */}
      <SyncedSection index={0} scrollYProgress={scrollYProgress} align="center">
        {(v) => (
          <div className="flex flex-col items-center gap-6 max-w-3xl mx-auto">
            {/* Massive display name */}
            <div
              className={`${display} text-[clamp(4rem,12vw,9rem)] text-white`}
              style={{ textShadow: "0 0 80px rgba(0,0,0,0.8)" }}
            >
              <CrossfadeText words={["luv", "Kouhai"]} interval={5000} className="text-white" />
            </div>

            {/* Crossfading role label */}
            <div className={label}>
              <CrossfadeText
                words={["AI Orchestrator", "AI Developer", "AI-Directed Product Engineer"]}
                interval={3000}
                className="text-[var(--primary-accent)] tracking-[0.3em] transition-colors duration-500"
              />
            </div>

            {/* Quote — word-by-word, quiet */}
            <div className="mt-16 max-w-sm">
              <TextGenerateEffect
                words="Everybody's got something they carry out to the balcony"
                isVisible={v}
                useAccent={false}
                duration={0.8}
                className={`font-serif italic text-[1.1rem] md:text-[1.25rem] text-white/50 leading-relaxed`}
              />
            </div>
          </div>
        )}
      </SyncedSection>

      {/* ── 1: PAUSE (Image 7) — intentionally empty ──────────────────────── */}

      {/* ── 2: ABOUT (Image 9) ────────────────────────────────────────────── */}
      <SyncedSection index={2} scrollYProgress={scrollYProgress} align="left">
        {(v) => (
          <div className="max-w-xl">
            <p className={label}>About</p>
            <TextGenerateEffect
              words="INFJ. 4w5."
              isVisible={v}
              useAccent={true}
              duration={0.7}
              className={`${display} text-[clamp(3rem,7vw,5.5rem)] mb-6`}
            />
            <TextGenerateEffect
              words={`${getAge()} years old. Not an engineer — an AI Orchestrator, a Directed Product Engineer. This isn't about code. It's about artistic vision.`}
              isVisible={v}
              useAccent={false}
              duration={0.5}
              className={body}
            />
          </div>
        )}
      </SyncedSection>

      {/* ── 3: PAUSE (Image 8) — intentionally empty ──────────────────────── */}

      {/* ── 4: HIMMY ANIME (Image 4) ──────────────────────────────────────── */}
      <SyncedSection index={4} scrollYProgress={scrollYProgress} align="right">
        {(v) => (
          <div className="max-w-lg">
            <p className={label}>Project 01</p>
            <TextGenerateEffect
              words="Himmyanime"
              isVisible={v}
              useAccent={true}
              duration={0.7}
              className={`${display} text-[clamp(3rem,7vw,6rem)] mb-4`}
            />
            <TextGenerateEffect
              words="The curated visual experience."
              isVisible={v}
              useAccent={false}
              duration={0.5}
              className={body}
            />
            <a href="https://himmyanime.qzz.io" target="_blank" rel="noreferrer" className={LINK}>
              View Project <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </SyncedSection>

      {/* ── 5: HIMMY ANIME APP (Image 5) ──────────────────────────────────── */}
      <SyncedSection index={5} scrollYProgress={scrollYProgress} align="left">
        {(v) => (
          <div className="max-w-lg">
            <p className={label}>Project 02</p>
            <TextGenerateEffect
              words="Himmyanime App"
              isVisible={v}
              useAccent={true}
              duration={0.7}
              className={`${display} text-[clamp(3rem,7vw,6rem)] mb-4`}
            />
            <TextGenerateEffect
              words="The portable counterpart."
              isVisible={v}
              useAccent={false}
              duration={0.5}
              className={body}
            />
            <a href="https://github.com/Lovelakshya1/himmy-releases.git" target="_blank" rel="noreferrer" className={LINK}>
              View Source <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </SyncedSection>

      {/* ── 6: PAUSE (Image 3) — intentionally empty ──────────────────────── */}

      {/* ── 7: HIMMY MANGA (Image 1) ──────────────────────────────────────── */}
      <SyncedSection index={7} scrollYProgress={scrollYProgress} align="right">
        {(v) => (
          <div className="max-w-lg">
            <p className={label}>Project 03</p>
            <TextGenerateEffect
              words="Himmy Manga"
              isVisible={v}
              useAccent={true}
              duration={0.7}
              className={`${display} text-[clamp(3rem,7vw,6rem)] mb-4`}
            />
            <TextGenerateEffect
              words="The raw ink and panels."
              isVisible={v}
              useAccent={false}
              duration={0.5}
              className={body}
            />
            <a href="https://himmy-manga.vercel.app/" target="_blank" rel="noreferrer" className={LINK}>
              Read Now <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </SyncedSection>

      {/* ── 8: HIMMY TV (Image 2) ─────────────────────────────────────────── */}
      <SyncedSection index={8} scrollYProgress={scrollYProgress} align="left">
        {(v) => (
          <div className="max-w-lg">
            <p className={label}>Project 04</p>
            <TextGenerateEffect
              words="Himmy TV"
              isVisible={v}
              useAccent={true}
              duration={0.7}
              className={`${display} text-[clamp(3rem,7vw,6rem)] mb-4`}
            />
            <TextGenerateEffect
              words="The late-night broadcast."
              isVisible={v}
              useAccent={false}
              duration={0.5}
              className={body}
            />
            <a href="https://himmy-tv.vercel.app/" target="_blank" rel="noreferrer" className={LINK}>
              Tune In <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </SyncedSection>

      {/* ── 9: PAUSE (Image 11) — intentionally empty ─────────────────────── */}

      {/* ── 10: HIMMY MUSIC (Image 10) ────────────────────────────────────── */}
      <SyncedSection index={10} scrollYProgress={scrollYProgress} align="right">
        {(v) => (
          <div className="max-w-lg">
            <p className={label}>Project 05</p>
            <TextGenerateEffect
              words="Himmy Music"
              isVisible={v}
              useAccent={true}
              duration={0.7}
              className={`${display} text-[clamp(3rem,7vw,6rem)] mb-4`}
            />
            <TextGenerateEffect
              words="The soundtrack to the balcony."
              isVisible={v}
              useAccent={false}
              duration={0.5}
              className={body}
            />
            <a href="https://github.com/Lovelakshya1/HIMMY-MUSIC.git" target="_blank" rel="noreferrer" className={LINK}>
              View Source <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </SyncedSection>

      {/* ── 11: OXCY MUSIC (Image 13) ─────────────────────────────────────── */}
      <SyncedSection index={11} scrollYProgress={scrollYProgress} align="left">
        {(v) => (
          <div className="max-w-lg">
            <p className={label}>Project 06</p>
            <TextGenerateEffect
              words="Oxcy Music"
              isVisible={v}
              useAccent={true}
              duration={0.7}
              className={`${display} text-[clamp(3rem,7vw,6rem)] mb-4`}
            />
            <TextGenerateEffect
              words="The alternative frequency."
              isVisible={v}
              useAccent={false}
              duration={0.5}
              className={body}
            />
            <a href="https://oxcy-music.vercel.app/" target="_blank" rel="noreferrer" className={LINK}>
              Listen Now <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </SyncedSection>

      {/* ── 12: OUTRO (Image 12) — intentionally empty ────────────────────── */}
    </>
  );
}
