// App-window chrome. Its entire job is to say "this is a real screen you will
// receive" before a single word gets read.
//
// Distinct from components/mac-window.tsx, which frames raster CAPTURES: this
// one frames content rendered live from our own tokens, so it uses the softer
// --border-soft edge and the lift-on-hover that suits an interactive artifact.
//
// Pure CSS and token-driven, so it costs nothing and cannot drift from the
// palette. A server component: it is in the first byte of HTML, never gated
// behind hydration.

export function DeviceFrame({
  /** Rendered in the title chip. Keep it file-like, it reads as an artifact. */
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`device-frame overflow-hidden rounded-xl bg-card ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-line bg-bg/50 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#e0635e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#d9a13b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#4fa763]" />
        </span>
        {/* Nudged left by the traffic-light cluster's width so the label sits
            optically centred rather than mathematically centred.

            `min-w-0` is load-bearing: `truncate` implies `white-space: nowrap`,
            and a nowrap flex item reports its FULL string width as min-content,
            which widens every ancestor including the grid track this frame
            sits in. Without it the title cannot ellipsize and instead pushes
            the layout wider than the phone. */}
        <span className="mx-auto min-w-0 -translate-x-4 truncate rounded-md border border-line/60 bg-bg/60 px-3 py-0.5 text-[10px] uppercase tracking-[0.18em] text-faint">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
