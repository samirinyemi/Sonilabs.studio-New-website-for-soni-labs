// Render the two <source> children for a <video>:
// mobile (default, lighter) gets used at viewport widths ≤767px,
// HD gets used at iPad portrait (768px) and up.
// Pair with `public/foo.mp4` + `public/foo-hd.mp4` on disk.
export function VideoSources({ src }) {
  if (!src) return null
  const hdSrc = src.replace(/\.(mp4|webm)$/i, '-hd.$1')
  return (
    <>
      <source media="(max-width: 767px)" src={src} type="video/mp4" />
      <source src={hdSrc} type="video/mp4" />
    </>
  )
}
