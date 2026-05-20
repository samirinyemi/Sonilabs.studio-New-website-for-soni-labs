import { Link } from 'react-router-dom'

const ADS = [
  {
    slug: 'carousel',
    title: 'Carousel (10 slides)',
    role: 'How — packages, proof, CTA',
    platforms: 'LinkedIn · Instagram Feed',
    dims: '1080×1080',
    status: 'Built',
  },
  {
    slug: 'quotes',
    title: 'Founder POV (5 quote cards)',
    role: 'Authority — Samuel’s voice as a series',
    platforms: 'LinkedIn · IG Feed · X',
    dims: '1080×1080',
    status: 'Copy ready · design pending',
  },
  {
    slug: 'motion',
    title: 'Motion graphics (15s)',
    role: 'What — vendor chaos → one roof',
    platforms: 'IG Reels · LinkedIn · X',
    dims: '1080×1920 + 1080×1080',
    status: 'Storyboard ready · build pending',
  },
  {
    slug: 'end-card',
    title: 'Talking-head end card',
    role: 'Who — Samuel on camera',
    platforms: 'IG Reels · LinkedIn · X',
    dims: '1080×1920 + 1080×1080',
    status: 'Script ready · end-card pending',
  },
]

export default function Ads() {
  return (
    <div className="min-h-screen bg-canvas py-20 px-8">
      <div className="max-w-[920px] mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">
          // Ads · cold acquisition campaign
        </p>
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-base-dark leading-[1.05]">
          Built under one roof.
          <br />
          Four ads · one wedge.
        </h1>
        <p className="text-subtle mt-6 text-lg max-w-[640px] leading-relaxed">
          Each ad below renders at exact export dimensions in the dev browser
          so you can screenshot at 1:1 or capture via DevTools. Copy for all
          four lives in{' '}
          <code className="font-mono text-base-dark/80 px-1.5 py-0.5 rounded bg-base-dark/5">
            marketing/ads/
          </code>
          .
        </p>

        <ul className="mt-14 flex flex-col gap-3">
          {ADS.map((ad) => {
            const built = ad.status.startsWith('Built')
            return (
              <li key={ad.slug}>
                {built ? (
                  <Link
                    to={`/ads/${ad.slug}`}
                    className="group flex items-center justify-between gap-6 p-6 rounded-xl border border-base-border bg-base-pure hover:border-base-dark/40 transition-colors"
                  >
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-1.5">
                        {ad.platforms} · {ad.dims}
                      </p>
                      <p className="font-display font-bold text-2xl text-base-dark leading-tight">
                        {ad.title}
                      </p>
                      <p className="text-subtle mt-1.5">{ad.role}</p>
                    </div>
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-base-dark/60 group-hover:text-base-dark whitespace-nowrap">
                      Open →
                    </span>
                  </Link>
                ) : (
                  <div className="flex items-center justify-between gap-6 p-6 rounded-xl border border-base-border bg-base-pure/60 opacity-80">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-1.5">
                        {ad.platforms} · {ad.dims}
                      </p>
                      <p className="font-display font-bold text-2xl text-base-dark leading-tight">
                        {ad.title}
                      </p>
                      <p className="text-subtle mt-1.5">{ad.role}</p>
                    </div>
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted whitespace-nowrap">
                      {ad.status.replace('Built · ', '')}
                    </span>
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        <div className="mt-16 p-6 rounded-xl bg-base-dark text-base-pure">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 mb-3">
            // Export workflow
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-white/90 leading-relaxed">
            <li>Open the ad page on a monitor ≥1100px wide.</li>
            <li>
              Right-click the framed box in DevTools → Capture node screenshot
              (Chrome) for pixel-perfect 1080×1080 PNGs.
            </li>
            <li>
              Or use macOS{' '}
              <code className="font-mono bg-white/10 px-1.5 py-0.5 rounded">
                Cmd+Shift+4
              </code>{' '}
              and snap the visible box.
            </li>
            <li>
              Save into{' '}
              <code className="font-mono bg-white/10 px-1.5 py-0.5 rounded">
                marketing/ads/exports/
              </code>{' '}
              with the naming convention from the carousel doc.
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
