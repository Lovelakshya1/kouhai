// Pure scroll spacers — controls ONLY the pacing of background images.
// ALL text lives in SyncedTextOverlay.tsx (fixed, scroll-driven).

const SECTION_HEIGHT = "250vh";

export default function ScrollSections() {
  return (
    <div className="relative w-full">
      {/* 13 sections × 250vh each = the total scroll depth */}
      {Array.from({ length: 12 }).map((_, i) => (
        <section key={i} style={{ minHeight: SECTION_HEIGHT }} />
      ))}
      {/* Outro breathing room */}
      <section style={{ minHeight: "150vh" }} />
    </div>
  );
}
