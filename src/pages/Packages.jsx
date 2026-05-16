import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ServicesSection from '../components/Services'
import { prefersReducedMotion } from '../utils/motion'
import { isSlowOrMeteredConnection } from '../utils/network'
import { VideoSources } from '../utils/videoSources'
import SEO from '../components/SEO'

const whatWeDo = [
  'Web design',
  'Brand strategy',
  'Brand identity',
  'Logo & visual systems',
  'Product design (UI/UX)',
  'Design systems',
  'No-code development',
  'Motion & micro-interactions',
]

export default function PackagesPage() {
  const containerRef = useRef(null)
  const autoplay = !isSlowOrMeteredConnection()

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set(['.sp-intro', '.sp-wd-header', '.sp-item'], { opacity: 1, y: 0 })
      return
    }
    // Hero copy → "What we do" — single timeline since both are above the
    // fold on initial load and should reveal as one cohesive sequence.
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.sp-intro',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.1
    )
    tl.fromTo('.sp-wd-header',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7 },
      0.3
    )
    tl.fromTo('.sp-item',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.05 },
      0.5
    )
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <SEO
        title="Packages"
        path="/packages"
        description="Five ways to work with Soni Labs: Websites, Branding, Brand + Website, Product Design, and the Design Partner retainer. Timelines, scope, and what's included — book a call to discuss."
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Websites',
            provider: { '@type': 'Organization', name: 'Soni Labs', url: 'https://sonilabs.studio' },
            description: 'Production marketing site built on an existing brand. No-code execution in Framer, Webflow, or Wix Studio. Typically 2–3 weeks.',
            serviceType: 'Web design',
            areaServed: 'Worldwide',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Branding',
            provider: { '@type': 'Organization', name: 'Soni Labs', url: 'https://sonilabs.studio' },
            description: 'Identity-only engagement: brand strategy, logo, type, colour, and a guidelines document. Typically 2 weeks.',
            serviceType: 'Brand design',
            areaServed: 'Worldwide',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Brand + Website',
            provider: { '@type': 'Organization', name: 'Soni Labs', url: 'https://sonilabs.studio' },
            description: 'Brand identity + production website for founders launching or rebranding. Typically 4–6 weeks.',
            serviceType: 'Brand and web design',
            areaServed: 'Worldwide',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Product Design (UI/UX)',
            provider: { '@type': 'Organization', name: 'Soni Labs', url: 'https://sonilabs.studio' },
            description: 'UI/UX design for startups scaling a digital product. Hand-off to your engineering team. Typically 5 weeks.',
            serviceType: 'Product design',
            areaServed: 'Worldwide',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Design Partner (retainer)',
            provider: { '@type': 'Organization', name: 'Soni Labs', url: 'https://sonilabs.studio' },
            description: 'A dedicated senior designer embedded in your team across brand, web, and product. 3-month minimum.',
            serviceType: 'Design partnership',
            areaServed: 'Worldwide',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Design Audit',
            provider: { '@type': 'Organization', name: 'Soni Labs', url: 'https://sonilabs.studio' },
            description: 'A 2-week paid review of an existing brand, product, or website. Written diagnosis and prioritized recommendations.',
            serviceType: 'Design consulting',
            areaServed: 'Worldwide',
          },
        ]}
      />
      {/* ── Page hero with brand guideline video — native aspect 3654×2160 ─ */}
      <section className="w-full pt-2 md:pt-4 pb-0 px-4 md:px-6">
        <h1 className="sr-only">Packages — Soni Labs Studio</h1>
        <div className="max-w-[1600px] mx-auto">
          <div className="relative w-full aspect-[3654/2160] overflow-hidden bg-base-dark">
            <video
              autoPlay={autoplay}
              muted
              loop
              playsInline
              controls={!autoplay}
              preload="metadata"
              aria-hidden={autoplay ? 'true' : undefined}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <VideoSources src={`${import.meta.env.BASE_URL}brand%20Guidline.mp4`} />
            </video>
          </div>
        </div>
      </section>

      {/* ── Page intro paragraph — sets the tone for the page above the
          "What we do" capability strip. No section header / no eyebrow:
          it reads as a calm opening line, not a section. */}
      <section className="w-full pt-10 md:pt-14 pb-2 md:pb-4 px-4 md:px-6 bg-base-pure">
        <div className="max-w-[1600px] mx-auto">
          <p
            className="sp-intro text-subtle text-lg md:text-xl leading-relaxed max-w-3xl"
            style={{ opacity: 0 }}
          >
            Soni Labs designs and builds the surfaces that decide whether someone takes you seriously — brand, product, and websites, made under one roof. Pick the engagement that matches what you&rsquo;re shipping. The price follows the conversation, not the page.
          </p>
        </div>
      </section>

      {/* ── What we do — part of the hero load (no scroll trigger) ────── */}
      <section className="w-full pt-10 md:pt-14 pb-12 md:pb-20 px-4 md:px-6 bg-base-pure">
        <div className="max-w-[1600px] mx-auto">
          <div
            className="sp-wd-header mb-12 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6"
            style={{ opacity: 0 }}
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">// What we do</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark leading-tight">
                Every discipline, under one roof.
              </h2>
            </div>
            <p className="text-subtle text-base md:text-lg max-w-md leading-relaxed">
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

      {/* ── Packages — five engagements, no inline process timelines.
          Each card carries a "See the full process →" link into /approach
          where the week-by-week cadence lives. */}
      <ServicesSection expanded />
    </div>
  )
}
