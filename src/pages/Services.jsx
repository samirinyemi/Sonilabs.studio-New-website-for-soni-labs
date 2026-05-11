import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ServicesSection from '../components/Services'
import { prefersReducedMotion } from '../utils/motion'
import { isSlowOrMeteredConnection } from '../utils/network'

const whatWeDo = [
  'Web design',
  'Brand strategy',
  'Brand identity',
  'Logo & visual systems',
  'Product design (UI/UX)',
  'Design systems',
  'No-code development',
  'AI-assisted development',
  'Motion & micro-interactions',
]

const howWeDoIt = [
  {
    num: '01',
    title: 'Brand',
    body: 'Identity, strategy, logo, type, and colour. Built as a system that scales across every surface, not a deck that gets shelved.',
  },
  {
    num: '02',
    title: 'Web',
    body: 'Marketing sites with no-code execution in Framer, Webflow, or Wix Studio. CMS, analytics, SEO basics, deployed and handed over.',
  },
  {
    num: '03',
    title: 'Product',
    body: 'UI/UX for digital products your engineering team will build. End-to-end flows, design systems, interactive prototypes, and engineering handoff.',
  },
  {
    num: '04',
    title: 'AI-assisted production',
    body: 'Modern tooling that compresses timelines without compromising taste. An accelerator across every engagement, not a separate service line.',
  },
]

export default function ServicesPage() {
  const containerRef = useRef(null)
  const autoplay = !isSlowOrMeteredConnection()

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(['.sp-wd-header', '.sp-item', '.sp-header-h', '.sp-row'], { opacity: 1, y: 0 })
      return
    }
    // Hero + "What we do" — single timeline since both are above the fold
    // on initial load and should reveal as one cohesive sequence. The hero
    // overlay text was removed; only the "What we do" header and items
    // animate on mount now.
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.sp-wd-header',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.2
    )
    tl.fromTo('.sp-item',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.05 },
      0.4
    )

    // How we do it — header + timeline rows (stays on scroll, below the fold)
    gsap.from('.sp-header-h', {
      y: 30, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.sp-header-h', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.sp-row', {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.sp-rows', start: 'top 80%', toggleActions: 'play none none reverse' },
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      {/* ── Page hero with brand guideline video — native aspect 3654×2160 ─ */}
      <section className="w-full pt-2 md:pt-4 pb-0 px-4 md:px-6">
        <h1 className="sr-only">Pricing &amp; Engagements — Soni Labs Studio</h1>
        <div className="max-w-[1600px] mx-auto">
          <div className="relative w-full aspect-[3654/2160] overflow-hidden bg-base-dark">
            <video
              src={`${import.meta.env.BASE_URL}brand%20Guidline.mp4`}
              autoPlay={autoplay}
              muted
              loop
              playsInline
              controls={!autoplay}
              preload="metadata"
              aria-hidden={autoplay ? 'true' : undefined}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── What we do — part of the hero load (no scroll trigger) ────── */}
      <section className="w-full pt-10 md:pt-14 pb-12 md:pb-20 px-4 md:px-6 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="sp-wd-header mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
            style={{ opacity: 0 }}
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">// What we do</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark leading-tight">
                Every discipline, under one roof.
              </h2>
            </div>
            <p className="text-gray-600 text-base md:text-lg max-w-md leading-relaxed">
              A complete bench of practices, applied selectively to whatever your engagement actually needs.
            </p>
          </div>

          <ul className="sp-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 border-t border-base-border pt-6">
            {whatWeDo.map((item, i) => (
              <li
                key={item}
                className="sp-item flex items-center gap-3 py-2 text-base md:text-lg text-base-dark"
                style={{ opacity: 0 }}
              >
                <span className="font-mono text-xs text-accent-red shrink-0 w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Pricing & Engagements — packaged engagements (expanded view
          shows includes + process inline on this dedicated page). ───── */}
      <ServicesSection expanded />

      {/* ── How we do it ──────────────────────────────────────────────── */}
      <section className="w-full py-20 md:py-32 px-4 md:px-6 bg-white">
        <div className="max-w-[1600px] mx-auto">
          <div className="sp-header-h mb-12 md:mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">// How we do it</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark leading-tight max-w-3xl">
              Four practices, applied to whatever your engagement needs.
            </h2>
          </div>

          <div className="sp-rows border-t border-base-border">
            {howWeDoIt.map((d) => (
              <div
                key={d.num}
                className="sp-row grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-3 py-10 md:py-14 border-b border-base-border"
              >
                <div className="col-span-12 md:col-span-2">
                  <span className="font-mono text-4xl md:text-5xl font-normal text-base-dark leading-none">
                    {d.num}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <h4 className="font-display text-2xl md:text-3xl font-bold text-base-dark leading-tight">
                    {d.title}
                  </h4>
                </div>
                <div className="col-span-12 md:col-span-7">
                  <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                    {d.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
