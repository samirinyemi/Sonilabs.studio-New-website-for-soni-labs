/**
 * AdFrame — renders an ad slide at exact pixel dimensions so it can be
 * screenshotted at 1:1 for export. Used by every /ads/* page.
 *
 * The frame itself has zero internal padding; lay out content with px-/py-
 * utilities inside `children` so each slide gets its own typographic system.
 */
export default function AdFrame({
  width = 1080,
  height = 1080,
  label,
  className = '',
  children,
}) {
  return (
    <div className="ad-frame-wrap inline-flex flex-col items-start gap-3">
      {label && (
        <div className="flex items-center gap-3 px-1">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            {label}
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted/60">
            {width}×{height}
          </span>
        </div>
      )}
      <div
        className={`relative overflow-hidden bg-base-pure shadow-[0_1px_0_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)] ${className}`}
        style={{ width, height }}
      >
        {children}
      </div>
    </div>
  )
}
