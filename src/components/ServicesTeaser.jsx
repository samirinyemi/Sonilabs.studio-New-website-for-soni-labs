import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

// Stripped-down packages section for the home page. The full engagement
// breakdown (cards, accordions, audit, etc.) lives on the dedicated
// /packages page; this teaser surfaces just enough to spark interest
// and route visitors there.
export default function ServicesTeaser() {
  const containerRef = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(['.svt-header', '.svt-tier', '.svt-cta'], { opacity: 1, y: 0 })
      return
    }
    gsap.from('.svt-header', {
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.svt-header', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.svt-tier', {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.svt-tiers', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.svt-cta', {
      y: 20, opacity: 0, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: '.svt-cta', start: 'top 92%', toggleActions: 'play none none reverse' },
    })
  }, { scope: containerRef })

  // Five packages in render order. Prices are intentionally not shown —
  // the conversation is the negotiation entry point; the cadence column
  // is the only concrete fact each row needs.
  const tiers = [
    {
      num: '01',
      name: 'Websites',
      tag: 'Project · Website',
      cadence: '2–3 weeks',
      slug: 'websites',
    },
    {
      num: '02',
      name: 'Branding',
      tag: 'Project · Brand',
      cadence: '~2 weeks',
      slug: 'branding',
    },
    {
      num: '03',
      name: 'Brand + Website',
      tag: 'Project · Flagship',
      cadence: '4–6 weeks',
      slug: 'brand-website',
    },
    {
      num: '04',
      name: 'Product Design',
      tag: 'Project · UI / UX',
      cadence: '5 weeks',
      slug: 'product-design',
    },
    {
      num: '05',
      name: 'Design Partner',
      tag: 'Monthly retainer',
      cadence: '3-month min',
      slug: 'design-partner',
    },
  ]

  return (
    <section
      ref={containerRef}
      id="services"
      className="w-full py-20 md:py-28 px-4 md:px-6 bg-base-pure"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="svt-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">// Packages</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-base-dark leading-tight max-w-xl">
              Five ways to work together.
            </h2>
          </div>
          <p className="text-subtle text-base md:text-lg max-w-md leading-relaxed">
            Pick the engagement that matches where you are: a single discipline, the full bundle, a focused product surface, or an ongoing partner embedded in your team.
          </p>
        </div>

        {/* ── Tier strip — each tier as a slim row with name + price ──── */}
        <ul className="svt-tiers border-t border-base-border">
          {tiers.map((tier) => (
            <li key={tier.num} className="svt-tier border-b border-base-border group">
              <Link
                to={`/packages#${tier.slug}`}
                className="block py-6 md:py-8 flex flex-col sm:flex-row sm:items-baseline gap-4 sm:gap-8 hover:bg-base-light/40 transition-colors -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-md"
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red shrink-0 w-8">
                  {tier.num}
                </span>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6">
                  <span className="font-display text-2xl md:text-3xl font-bold text-base-dark leading-tight">
                    {tier.name}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    {tier.tag}
                  </span>
                </div>
                <div className="flex items-baseline gap-4 sm:gap-6 shrink-0">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
                    {tier.cadence}
                  </span>
                  <svg
                    aria-hidden="true"
                    className="hidden sm:block w-4 h-4 text-gray-400 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-base-dark"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* ── Footer CTA — leads to the full breakdown ─────────────────── */}
        <div className="svt-cta mt-10 md:mt-14 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <p className="text-subtle text-base md:text-lg leading-relaxed max-w-2xl">
            What's included, the process week-by-week, and the lighter-touch 2-week design audit. All on the full packages page.
          </p>
          <Link
            to="/packages"
            className="cta-press inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-base-dark text-base-pure rounded-full font-medium text-sm sm:text-base hover:bg-base-dark-soft w-fit shrink-0"
          >
            See all packages
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
