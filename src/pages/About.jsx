import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'
import { isSlowOrMeteredConnection } from '../utils/network'
import { VideoSources } from '../utils/videoSources'
import SEO from '../components/SEO'

const CALENDLY_URL = 'https://calendly.com/madebysoni/30min'
const FOUNDER_BASE = `${import.meta.env.BASE_URL}Founders%20images/`
// Splits a string into per-word inline-block spans (so words don't break
// mid-character on line wrap), with each character wrapped in its own
// `manifesto-char` span for the scroll-driven gray→black color reveal.
function manifestoWords(text, keyPrefix) {
  const words = text.split(' ')
  const out = []
  words.forEach((word, i) => {
    if (i > 0) out.push(' ')
    out.push(
      <span key={`${keyPrefix}-w${i}`} className="inline-block">
        {Array.from(word).map((char, j) => (
          <span key={j} className="manifesto-char">{char}</span>
        ))}
      </span>
    )
  })
  return out
}

// Two portraits + the workspace shot used in the merged Led by section.
const founderImg1 = `${FOUNDER_BASE}C3881T01.webp`
const founderImg5 = `${FOUNDER_BASE}kOG0G5Dxv85PTLpWc47mipLUFxI.webp`
const workspaceImg = `${FOUNDER_BASE}Workspace.webp`

const principles = [
  {
    num: '01',
    title: 'Senior on every project.',
    body: 'Samuel leads every engagement directly. No handoff to juniors after the kickoff call.',
  },
  {
    num: '02',
    title: 'Brand, web, product. One studio.',
    body: 'Strategy through launch, all under one roof. No vendor coordination, no fragmented handoffs.',
  },
  {
    num: '03',
    title: 'Embedded in your team.',
    body: 'Slack-first, your tools, your standup, your roadmap. We work in your rhythm.',
  },
  {
    num: '04',
    title: 'Modern tooling, classic craft.',
    body: 'AI-assisted production keeps timelines tight without compromising the work.',
  },
]

const clients = [
  {
    num: '01',
    title: 'Founders scaling beyond their first customers',
    body: 'You have product–market fit signal and a small team. Now you need brand and product surfaces that hold up to investor and enterprise scrutiny.',
  },
  {
    num: '02',
    title: 'Startups preparing for serious growth',
    body: "Funding's lined up or close. The next quarter has to look (and feel) like a company that ships, not a deck that promises.",
  },
  {
    num: '03',
    title: 'Businesses repositioning for better clients',
    body: 'You\'ve outgrown the first audience. The brand language, pricing page, and product story need to catch up to where the company is going.',
  },
  {
    num: '04',
    title: 'Product teams fixing drop-off and low conversions',
    body: 'A specific surface (sign-up, checkout, key flow) is leaking users. We diagnose, redesign, and ship the fix end-to-end.',
  },
]

const founderStats = [
  { eyebrow: 'Experience', figure: '14+',    description: 'Years of creative practice in the industry' },
  { eyebrow: 'Countries',  figure: '6',      description: 'Collaborations with global brands' },
  { eyebrow: 'Valuation',  figure: '$850M+', description: "Combined clients' valuation" },
]

// Track-record logos. Five projects came through Samuel's prior agency
// engagement at Roadhouse; meCash was an independent direct engagement.
// Files live in /public/Client LOGO/ — note the trailing dot in meCash..png.
// `size` is per-logo because some source files have built-in padding that
// makes them look smaller in the tile — we boost those.
const CLIENT_BASE = `${import.meta.env.BASE_URL}Client%20LOGO/`
const clientLogos = [
  { name: 'AMAVIC',        file: 'AMAVIC.webp',    via: 'via Roadhouse', size: 'max-h-12 md:max-h-14' },
  { name: 'APS Roadhouse', file: 'APS.webp',       via: 'via Roadhouse', size: 'max-h-10 md:max-h-12' },
  { name: 'AF',            file: 'AF.webp',        via: 'via Roadhouse', size: 'max-h-16 md:max-h-20' },
  { name: 'NEX Farm',      file: 'NEX Farm.webp',  via: 'via Roadhouse', size: 'max-h-10 md:max-h-12' },
  { name: 'Time BMX',      file: 'Time BMX.webp',  via: 'via Roadhouse', size: 'max-h-14 md:max-h-16' },
  { name: 'meCash',        file: 'meCash..webp',   via: 'Independent',   size: 'max-h-10 md:max-h-12' },
]

export default function AboutPage() {
  const containerRef = useRef(null)
  const autoplay = !isSlowOrMeteredConnection()

  useGSAP(() => {
    if (prefersReducedMotion()) {
      // Reduced motion: snap each char to its final colour via the
      // same --p variable the scroll animation drives. CSS color-mix()
      // turns this into the per-theme final colour (black / white /
      // brand red).
      gsap.set('.manifesto-char', { '--p': 1 })
      return
    }

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.ap-eyebrow', { y: 20, opacity: 0 },     { y: 0, opacity: 1, duration: 0.5 }, 0.1)
    tl.fromTo('.ap-line',    { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.85, stagger: 0.08 }, 0.2)

    // Brand guideline video — fades up from 80px below as it scrolls into view.
    gsap.from('.ap-hero-video', {
      y: 80, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.ap-hero-video', start: 'top 90%', toggleActions: 'play none none reverse' },
    })

    // Manifesto — scroll-linked character colour sweep. Drives the CSS
    // variable --p from 0 → 1 per char. CSS color-mix() interpolates
    // between the theme's initial and final colours, so the sweep is
    // fully theme-aware (gray → black in light, gray → white in dark,
    // light-red → red in red theme). scrub: true binds the playhead
    // to scroll progress so it reverses on scroll-up.
    const manifestoChars = gsap.utils.toArray('.manifesto-char')
    if (manifestoChars.length > 0) {
      gsap.fromTo(manifestoChars,
        { '--p': 0 },
        {
          '--p': 1,
          ease: 'none',
          duration: 0.05,
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.manifesto-text',
            start: 'top 75%',
            end: 'bottom 30%',
            scrub: true,
          },
        }
      )
    }

    gsap.from('.ap-section-h', {
      y: 30, opacity: 0, duration: 0.7,
      scrollTrigger: { trigger: '.ap-section-h', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.ap-principle', {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.08,
      scrollTrigger: { trigger: '.ap-principles', start: 'top 80%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.ap-client', {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.1,
      scrollTrigger: { trigger: '.ap-clients', start: 'top 80%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.ap-founder-img', {
      y: 40, opacity: 0, duration: 0.9,
      scrollTrigger: { trigger: '.ap-founder-img', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.ap-bio', {
      y: 30, opacity: 0, duration: 0.8,
      scrollTrigger: { trigger: '.ap-bio', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.ap-stat', {
      y: 20, opacity: 0, duration: 0.6, stagger: 0.08,
      scrollTrigger: { trigger: '.ap-stats', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.ap-client-tile', {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.08,
      scrollTrigger: { trigger: '.ap-clients-grid', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.ap-cta', {
      y: 30, opacity: 0, duration: 0.7,
      scrollTrigger: { trigger: '.ap-cta', start: 'top 90%', toggleActions: 'play none none reverse' },
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <SEO
        title="About the studio"
        path="/about"
        description="Soni Labs is a senior design studio led by Samuel Irinyemi, based in Lagos and working with founders and product teams worldwide on brand, product, and web."
      />
      <h1 className="sr-only">About — Soni Labs Studio</h1>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="w-full pt-12 md:pt-20 pb-16 md:pb-24 px-4 md:px-6 bg-base-pure">
        <div className="max-w-[1600px] mx-auto">
          <p className="ap-eyebrow font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6" style={{ opacity: 0 }}>
            // The studio
          </p>

          <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[1.05] text-base-dark">
            <span className="overflow-hidden block">
              <span className="ap-line block pl-12 md:pl-20" style={{ opacity: 0 }}>Soni labs studio<span className="inline-block text-[0.4em] translate-y-[-0.9em] ml-[0.1em]">®</span></span>
            </span>
            <span className="overflow-hidden block">
              <span className="ap-line block" style={{ opacity: 0 }}>Backed by 14 years of</span>
            </span>
            <span className="overflow-hidden block">
              <span className="ap-line block" style={{ opacity: 0 }}>design practice</span>
            </span>
          </h2>
        </div>
      </section>

      {/* ── Brand guideline video — content-width, native aspect (3654×2160) ── */}
      <section className="w-full px-4 md:px-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="ap-hero-video relative w-full aspect-[3654/2160] overflow-hidden bg-base-dark">
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
              <VideoSources src={`${import.meta.env.BASE_URL}SONI%20Guildline%20animate.mp4`} />
            </video>
          </div>
        </div>
      </section>

      {/* ── Manifesto — scroll-driven char-by-char gray→black color reveal ── */}
      <section className="w-full px-4 md:px-6 py-20 md:py-32 bg-base-pure">
        <div className="max-w-[1600px] mx-auto">
          <p className="manifesto-text font-display font-bold text-4xl md:text-5xl tracking-tighter leading-[1.15] text-gray-300">
            {manifestoWords('Soni Labs is a design and digital experience studio led by ', 'pre')}
            <a
              href="https://www.instagram.com/samirinyemi/"
              target="_blank"
              rel="noopener noreferrer"
              className="manifesto-link italic no-underline"
            >
              {manifestoWords('Samuel Irinyemi', 'link')}
            </a>
            {manifestoWords(', a multidisciplinary designer with 14+ years working across brand, web, and product. Built for founders, startups, and product teams who care about clarity, positioning, and long-term relevance.', 'post')}
          </p>
        </div>
      </section>

      {/* ── Founder (bio + stats + markets) — placed right after hero ─── */}
      <section className="w-full py-20 md:py-32 px-4 md:px-6 bg-base-pure">
        <div className="max-w-[1600px] mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-8 md:mb-10">// Led by</p>

          {/* Name + role */}
          <div className="ap-bio mb-10 md:mb-14">
            <p className="font-display text-2xl md:text-3xl font-bold text-base-dark leading-tight mb-2">
              Samuel Irinyemi
            </p>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              Founder &middot; Soni Labs
            </p>
          </div>

          {/* Bio — merged founder + studio narrative, two columns */}
          <div className="ap-bio grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-6 mb-12 md:mb-16 text-subtle text-base md:text-lg leading-relaxed">
            <div className="space-y-5">
              <p>
                Samuel Irinyemi is a multidisciplinary designer with over 14 years of combined experience across brand, web, and digital product design. Across his career, he&rsquo;s worked with companies based in six countries, contributing to organisations whose combined valuations exceed $850&nbsp;million&nbsp;USD.
              </p>
            </div>
            <div className="space-y-5">
              <p>
                Soni Labs is the next chapter of that practice. A studio applying that experience directly to founders, startups, and product teams who care about clarity, positioning, and long-term relevance.
              </p>
              <p>
                The work lives in the lab. A workspace built around craft. Strategy, design, and decisions all happen in the same room. No pipeline, no producers, no layers between you and the people making the work.
              </p>
            </div>
          </div>

          {/* Two founder portraits, side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-16 md:mb-24">
            <div className="ap-founder-img aspect-square overflow-hidden bg-base-dark">
              <img
                src={founderImg1}
                alt="Samuel Irinyemi, founder of Soni Labs"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 25%' }}
              />
            </div>
            <div className="ap-founder-img aspect-square overflow-hidden bg-base-dark">
              <img
                src={founderImg5}
                alt="Samuel Irinyemi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Track record — brands the founder has shipped work for. Most
              came through Samuel's prior engagement at Roadhouse; meCash
              was direct. The "via X" caption is always visible so the
              attribution doesn't depend on hover. */}
          <div className="mb-16 md:mb-24">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6">// Track record</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-base-dark leading-tight mb-3">
              Brands Samuel has shipped work for.
            </h3>
            <p className="text-subtle text-base md:text-lg leading-relaxed mb-10 md:mb-12 max-w-2xl">
              Across six countries, through prior studio engagements and independent work.
            </p>
            <ul className="ap-clients-grid grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {clientLogos.map((c) => (
                <li
                  key={c.name}
                  className="ap-client-tile relative aspect-[3/2] flex items-center justify-center bg-card-soft transition-colors duration-200 hover:bg-base-light"
                >
                  <img
                    src={`${CLIENT_BASE}${encodeURIComponent(c.file)}`}
                    alt={c.name}
                    loading="lazy"
                    decoding="async"
                    className={`${c.size} max-w-[60%] object-contain`}
                  />
                  <span className="absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-muted">
                    {c.via}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Full-width workspace image — native aspect (3480×1836) */}
          <div className="ap-founder-img relative w-full aspect-[3480/1836] overflow-hidden bg-base-dark mb-16 md:mb-24">
            <img
              src={workspaceImg}
              alt="The Soni Labs workspace"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Stats — Samuel's track record, not Soni Labs's */}
          <div className="ap-stats grid grid-cols-1 sm:grid-cols-3 gap-y-10 gap-x-8 mb-16 md:mb-24 pt-10 md:pt-12 border-t border-base-border">
            {founderStats.map((s) => (
              <div key={s.eyebrow} className="ap-stat flex flex-col gap-3">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {s.eyebrow}
                </span>
                <span className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-base-dark leading-none tracking-tight">
                  {s.figure}
                </span>
                <span className="text-subtle text-sm md:text-base leading-snug">
                  {s.description}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Principles ────────────────────────────────────────────────── */}
      <section className="w-full py-20 md:py-32 px-4 md:px-6 bg-base-pure border-t border-base-border">
        <div className="max-w-[1600px] mx-auto">
          <div className="ap-section-h mb-12 md:mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">// How we work</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark leading-tight max-w-3xl">
              Four principles. No exceptions.
            </h2>
          </div>

          <div className="ap-principles grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12 md:gap-y-14">
            {principles.map((p) => (
              <div key={p.num} className="ap-principle pt-5 border-t border-base-border">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">{p.num}</span>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-base-dark leading-tight mb-3">
                  {p.title}
                </h3>
                <p className="text-subtle text-base md:text-lg leading-relaxed max-w-md">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who we work with ──────────────────────────────────────────── */}
      <section className="w-full py-20 md:py-32 px-4 md:px-6 bg-base-pure">
        <div className="max-w-[1600px] mx-auto">
          <div className="ap-section-h mb-12 md:mb-16">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">// Who we work with</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark leading-tight max-w-3xl">
              Four kinds of teams, one studio.
            </h2>
          </div>

          <div className="ap-clients border-t border-base-border">
            {clients.map((c) => (
              <div
                key={c.num}
                className="ap-client grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-3 py-10 md:py-14 border-b border-base-border"
              >
                <div className="col-span-12 md:col-span-2">
                  <span className="font-mono text-4xl md:text-5xl font-normal text-base-dark leading-none">
                    {c.num}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-base-dark leading-tight">
                    {c.title}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <p className="text-subtle text-base md:text-lg leading-relaxed">
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────── */}
      <section className="w-full py-20 md:py-32 px-4 md:px-6 bg-base-pure">
        <div className="ap-cta max-w-4xl mx-auto text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6">// Let&rsquo;s talk</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-base-dark mb-8">
            Tell us where you&rsquo;re headed.
          </h2>
          <p className="text-subtle text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            A 30-minute strategy call. We&rsquo;ll diagnose what you need, suggest a path, and decide together if we&rsquo;re a fit.
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-press inline-flex items-center gap-3 px-10 py-5 bg-base-dark text-base-pure rounded-full font-medium text-lg hover:bg-base-dark-soft"
          >
            Book a call
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  )
}
