import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import KineticLouvers from './KineticLouvers'
import { prefersReducedMotion } from '../utils/motion'

const pillars = [
  {
    num: '01',
    title: 'You stand out.',
    body: 'A trained design eye that doesn’t ship template-grade SaaS work. Your brand, site, or product looks deliberate, not like a default off the shelf.',
  },
  {
    num: '02',
    title: 'You launch faster.',
    body: 'One studio for brand, design, and build, paired with an AI-accelerated production pipeline. No vendor coordination, no handoffs, no waiting for the next agency to start.',
  },
  {
    num: '03',
    title: 'You build trust early.',
    body: 'Polished design signals seriousness. Investors, customers, and hires all read the cover before they read the book.',
  },
  {
    num: '04',
    title: 'Your team gets time back.',
    body: 'We work inside your tools and your rhythm: Slack, Figma, your standup. Less rebriefing, fewer review cycles, more shipping.',
  },
]

export default function Hero() {
  const heroRef = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(['.hero-eyebrow', '.hero-line', '.hero-manifesto', '.hero-buttons', '.hero-pillar', '.hero-divider'], {
        opacity: 1, y: 0,
      })
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo('.hero-eyebrow',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45 },
      0.1
    )
    tl.fromTo('.hero-line',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.7, stagger: 0.08 },
      0.25
    )
    tl.fromTo('.hero-manifesto',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      0.7
    )
    tl.fromTo('.hero-buttons',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      0.9
    )
    tl.fromTo('.hero-pillar',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.07 },
      1.1
    )
    tl.fromTo('.hero-divider',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      1.4
    )
  }, { scope: heroRef })

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen bg-base-pure px-6 md:px-10 pt-24 md:pt-32 pb-16 md:pb-20 flex flex-col"
    >
      <div className="max-w-[1600px] w-full mx-auto flex flex-col grow">
        <div className="grid grid-cols-12 gap-x-8 gap-y-10 lg:gap-x-12">
          {/* Left: pitch */}
          <div className="col-span-12 flex flex-col">
            <div
              className="hero-eyebrow inline-flex items-center gap-2 mb-8 md:mb-12 self-start"
              style={{ opacity: 0 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-red" aria-hidden="true"></span>
              <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted">
                A design studio, under one roof
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[1.02] text-base-dark mb-8 md:mb-10">
              <span className="overflow-hidden block">
                <span className="hero-line block" style={{ opacity: 0 }}>Brands, products,</span>
              </span>
              <span className="overflow-hidden block">
                <span className="hero-line block" style={{ opacity: 0 }}>and websites - built</span>
              </span>
              <span className="overflow-hidden block">
                <span className="hero-line block" style={{ opacity: 0 }}>under one roof.</span>
              </span>
            </h1>

            <p
              className="hero-manifesto text-lg md:text-xl text-subtle max-w-2xl leading-relaxed mb-10 md:mb-12"
              style={{ opacity: 0 }}
            >
              For founders, startups, and product teams. Senior strategy and<br className="hidden md:inline" /> design from one studio, no fragmented handoffs.
            </p>

            <div
              className="hero-buttons flex flex-row items-stretch gap-3 sm:gap-4"
              style={{ opacity: 0 }}
            >
              <a
                href="https://calendly.com/madebysoni/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-press flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3 sm:py-3.5 bg-base-dark text-base-pure rounded-full font-medium text-sm sm:text-base hover:bg-base-dark-soft"
              >
                <span className="sm:hidden">Book a call</span>
                <span className="hidden sm:inline">Book a strategy call</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
              <a
                href="#work"
                className="cta-press flex-1 sm:flex-initial inline-flex items-center justify-center px-4 sm:px-7 py-3 sm:py-3.5 bg-transparent text-base-dark border border-base-dark/20 rounded-full font-medium text-sm sm:text-base hover:bg-base-dark/5"
              >
                See our work
              </a>
            </div>
          </div>

        </div>

        {/* Pillars band */}
        <div className="mt-16 sm:mt-20 md:mt-36 lg:mt-44">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {pillars.map((p) => (
              <div
                key={p.num}
                className="hero-pillar pt-5 border-t border-base-border flex flex-col"
                style={{ opacity: 0 }}
              >
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3">{p.num}</span>
                <h2 className="font-display text-xl md:text-2xl font-bold text-base-dark leading-tight mb-3">
                  {p.title}
                </h2>
                <p className="text-subtle text-sm md:text-base leading-relaxed">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Kinetic louvers — full-bleed escape from section padding */}
      <div className="hero-divider -mx-6 md:-mx-10 mt-12 md:mt-16" style={{ opacity: 0 }}>
        <KineticLouvers />
      </div>
    </section>
  )
}
