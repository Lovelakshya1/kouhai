// Pure scroll spacers — controls the pacing of the background images.
// On mobile, 160vh per section gives comfortable finger scroll pacing without exhausting swipes.
// On desktop, 250vh gives that luxurious, slow cinematic mouse-wheel pacing.

export default function ScrollSections() {
  return (
    <div className="relative w-full">
      {/* 12 sections — 160vh on mobile, 250vh on desktop */}
      {Array.from({ length: 12 }).map((_, i) => (
        <section key={i} className="min-h-[160vh] md:min-h-[250vh]" />
      ))}
      {/* Outro breathing room */}
      <section className="min-h-[100vh] md:min-h-[150vh]" />
    </div>
  );
}
