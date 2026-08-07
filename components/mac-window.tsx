// Browser-chrome frame borrowed from the scorecard-funnel landing.
//
// Why it exists: a bare screenshot on a dark page reads as decoration. The
// same screenshot inside a window frame reads as *the product*, which is what
// the spec's highest-priority asset slot is for ("Must show the actual score
// display exactly as the live product renders it. Not a mockup.").
//
// Presentational and server-rendered: no state, no client boundary.

export function MacWindow({
  title,
  children,
  className = "",
}: {
  /** Shown in the chrome bar's address pill. Omit for a bare frame. */
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mac-window ${className}`}>
      <div className="mac-bar">
        <span className="flex gap-1.5" aria-hidden>
          <span className="mac-dot" />
          <span className="mac-dot" />
          <span className="mac-dot" />
        </span>
        {title && (
          <span
            className="ml-1 hidden truncate rounded-full bg-bg/60 px-3 py-1 text-[11px] tracking-wide text-faint sm:inline-block"
            aria-hidden
          >
            {title}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
