import BackgroundEngine from "./components/BackgroundEngine";
import ScrollSections from "./components/ScrollSections";
import SyncedTextOverlay from "./components/SyncedTextOverlay";
import { ProgressiveBlur } from "./components/ui/progressive-blur";
import { DustParticles } from "./components/DustParticles";
import { CrossfadeText } from "./components/CrossfadeText";
import { Send } from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

export default function App() {
  return (
    <main className="relative w-full font-sans overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* Layer 0: background images */}
      <BackgroundEngine />

      {/* Layer 1: dust particles */}
      <DustParticles />

      {/* Layer 2: scroll-synced text (fixed, driven by scrollYProgress — never in a crossfade) */}
      <SyncedTextOverlay />

      {/* Layer 3: scroll spacers (control pacing, no text) */}
      <ScrollSections />

      {/* Layer 4: progressive blur + footer pinned at the bottom */}
      <ProgressiveBlur height="130px" position="bottom" className="fixed bottom-0 z-40 pointer-events-none" />

      <footer className="fixed bottom-0 w-full z-50 pb-5 flex flex-col items-center gap-2.5 text-white/40 pointer-events-auto">
        {/* Name crossfade */}
        <CrossfadeText
          words={["Kouhai", "luv"]}
          interval={4500}
          className="font-serif lowercase text-sm tracking-[0.15em] text-[var(--primary-accent)] transition-colors duration-500"
        />

        {/* Links row */}
        <div className="flex items-center gap-6 text-[0.6rem] uppercase tracking-[0.22em]">
          <a
            href="https://github.com/Lovelakshya1"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-[var(--primary-accent)] transition-colors duration-300"
          >
            <GithubIcon className="w-3 h-3" />
            <span>Lovelakshya1</span>
          </a>

          <span className="opacity-20">·</span>

          <a
            href="https://t.me/lovelakshya"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-[var(--primary-accent)] transition-colors duration-300"
          >
            <Send className="w-3 h-3" />
            <span>@lovelakshya</span>
          </a>
        </div>

        {/* Copyright notice */}
        <p className="text-[0.5rem] uppercase tracking-[0.25em] opacity-30">
          All rights reserved to MAPPA / Tatsuki Fujimoto
        </p>
      </footer>
    </main>
  );
}
