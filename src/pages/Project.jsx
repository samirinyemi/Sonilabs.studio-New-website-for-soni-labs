import { useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import { prefersReducedMotion } from '../utils/motion'

const BASE = import.meta.env.BASE_URL

// Per-project asset filenames. Each ready project lives in
// public/<slug>/ and uses these slug-friendly filenames so the layout
// can be re-used across projects without the JSX caring about which
// project it's rendering.
const ASSET_FILES = {
  cover:  'cover.webp',
  coverV: 'cover.mp4',
  image1: 'image1.webp',
  image7: 'image7.webp',
  image8: 'image8.webp',
  image9: 'image9.webp',
  hero1:  'hero1.webp',
  hero2:  'hero2.webp',
  p1:     '1.webp',
  p2:     '2.webp',
  p3:     '3.webp',
  p4:     '4.webp',
  p5:     '5.webp',
  p6:     '6.webp',
  brand1: 'brand1.mp4',
  brand2: 'brand2.mp4',
  brand3: 'brand3.mp4',
  video1: 'video1.mp4',
  video2: 'video2.mp4',
  video3: 'video3.mp4',
  video4: 'video4.mp4',
  video5: 'video5.mp4',
  logo:   'logo.mp4',
}

// Build the asset path map for a project. `available` lists the asset
// keys that actually exist in public/<slug>/; missing keys resolve to
// `null`, which Media renders as the neutral "Project image" placeholder.
// `overrides` lets a project use a different filename for a given key
// (e.g. AMA's `logo` is a PNG, not an MP4 like Julian Mercier's).
// Pass `'all'` for projects whose folder is fully populated.
function buildAssets(slug, available = 'all', overrides = {}) {
  const out = {}
  const keys = Object.keys(ASSET_FILES)
  const has = (k) => available === 'all' || available.includes(k)
  keys.forEach((k) => {
    const filename = overrides[k] || ASSET_FILES[k]
    out[k] = has(k) ? `${BASE}${slug}/${filename}` : null
  })
  return out
}

const projects = {
  'julian-mercier': {
    category: 'CONCEPT · 2025',
    name: 'Julian Mercier Architectural Practise',
    nameLines: ['Julian Mercier', 'Architectural Practise'],
    services: ['Brand Strategy', 'Visual Identity', 'Brand Guidelines', 'Website'],
    assets: buildAssets('julian-mercier'),
    paragraphs: {
      introPractice: 'Julian Mercier is a concept brand identity and website design for a small Mediterranean architect-developer practice. The studio designs and builds the same homes it sells. Stone is stone, oak is oak, plaster is plaster.',
      introBrief: 'Most architectural studios speak in the visual language of luxury: generic serifs, drone footage, copy about “elevated living.” It’s a tone that flattens everyone into the same shape. The brief was to build a first identity for Julian Mercier that wouldn’t fall into that script: a mark, a system, and a site that read as straight as the buildings would.',
    },
    nextSlug: 'australia-medical-association-victoria',
    caseStudyReady: true,
    cardHeight: 'h-[45vh] md:h-[43vh]',
    cardAspect: 'aspect-[4/3]',
  },
  'australia-medical-association-victoria': {
    category: 'BRAND · 2026',
    name: 'Australia Medical Association Victoria',
    nameLines: ['Australia Medical', 'Association Victoria'],
    services: ['Product discovery', 'Strategy', 'Design system', 'Web platform', 'Websites', 'Admin system'],
    servicesColumns: 2,
    collaboration: 'Via Roadhouse, Australia',
    assets: buildAssets(
      'australia-medical-association-victoria',
      ['cover', 'coverV', 'image1', 'image7', 'image8', 'image9', 'hero2',
       'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'video1', 'video2', 'logo'],
      { logo: 'logo.webp' }
    ),
    // Per-asset container aspects. Each one matches the source file's
    // native dimensions so object-cover doesn't crop the image. Slots not
    // listed here fall back to the default aspect baked into the JSX.
    aspects: {
      cover:  'aspect-[3/2]',     // cover.png 2218×1490
      coverV: 'aspect-[17/10]',   // cover.mp4 3668×2160
      image1: 'aspect-[7/5]',     // image1.png 2073×1490
      image7: 'aspect-[6/5]',     // image7.png 1755×1490
      image8: 'aspect-[8/7]',     // image8.png 1705×1490 (was Image 14, moved here)
      image9: 'aspect-[16/9]',    // image9.png 2649×1490 (Image 13 — moved down here)
      hero2:  'aspect-[17/11]',   // hero2.png 3456×2234 (View Member Workplaces — moved up here)
      p1:     'aspect-[5/4]',     // 1.png 1842×1490
      p2:     'aspect-[7/5]',     // 2.png 2120×1490
      p3:     'aspect-[8/7]',     // 3.png 1700×1490
      p4:     'aspect-[17/11]',   // 4.png 2306×1490
      p5:     'aspect-[7/6]',     // 5.png 1748×1490
      p6:     'aspect-[4/3]',     // 6.png 1987×1490
      video1: 'aspect-[16/9]',    // video1.mp4 3840×2160
      video2: 'aspect-[17/11]',   // video2.mp4 3342×2160
      logo:   'aspect-square',    // logo.png 1477×1490 ~ 1:1
    },
    paragraphs: {
      introPractice: 'Australia Medical Association Victoria champions a united medical community, advancing a healthcare system in Victoria that empowers doctors and enriches patient care.',
      introBrief: 'A medical association sits at the intersection of policy, education, and practitioner support — and its digital surfaces have to read as authoritative without feeling stiff. The work spans a multi-site web platform, a member-facing portal, and the internal admin system staff use day-to-day. One system, one tone, one place every audience knows where to look.',
    },
    pageBg: 'bg-[#F3F3F3]',
    nextSlug: 'time-bmx',
    caseStudyReady: true,
    cardHeight: 'h-[45vh] md:h-[43vh]',
    cardAspect: 'aspect-[17/10]',
  },
  'time-bmx': {
    category: 'BRAND · 2025',
    name: 'Time BMX',
    nameLines: ['Time', 'BMX'],
    services: ['Design system', 'Mobile app', 'Web app'],
    collaboration: 'Via Roadhouse, Australia',
    assets: buildAssets(
      'time-bmx',
      ['cover', 'coverV', 'image1', 'image7', 'image8', 'image9', 'hero1', 'hero2',
       'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'video1', 'logo'],
      { logo: 'logo.webp', hero1: 'hero1.webp' }
    ),
    aspects: {
      cover:  'aspect-[13/9]',    // cover.png 2165×1490
      coverV: 'aspect-[4/3]',     // cover.mp4 2880×2160
      image1: 'aspect-[7/5]',     // image1.png 2077×1490
      hero2:  'aspect-[13/9]',    // hero2.png 2166×1490
      hero1:  'aspect-[13/9]',    // hero1.png 2166×1490
      video1: 'aspect-[4/3]',     // video1.mp4 2880×2160
      logo:   'aspect-square',    // logo.png 1480×1490 ~ 1:1
      p1:     'aspect-square',    // 1.png 1480×1490
      p2:     'aspect-square',    // 2.png 1480×1490
      p3:     'aspect-square',    // 3.png 1480×1490
      p4:     'aspect-square',    // 4.png 1480×1490
      p5:     'aspect-square',    // 5.png 1480×1490
      p6:     'aspect-square',    // 6.png 1480×1490
      image9: 'aspect-[13/9]',    // image9.png 2165×1490
      image7: 'aspect-[5/4]',     // image7.png 1841×1490
      image8: 'aspect-[4/3]',     // image8.png 1971×1490
    },
    paragraphs: {
      introPractice: 'BMX culture has always been about pushing boundaries, building connections, and sharing stories. There has been a gap in digital tools tailored to the unique needs for the global community. TimeBMX is bridging that gap for all bmx riders.',
      introBrief: 'Everything BMX: redefining the BMX experience, connecting all riders all over this world in one platform.',
    },
    stats: [
      { value: '4,600+', label: 'Skate Parks' },
      { value: '950+',   label: 'BMX Tracks' },
      { value: '600+',   label: 'Pump Tracks' },
      { value: '60+',    label: 'Countries' },
    ],
    // Time BMX rule: every solo Media slot occupies the full container
    // width (no 8/12 inset for image1, no col-start-2 for coverV, etc.).
    // Pairs already span the full row edge-to-edge by default.
    solosFullWidth: true,
    nextSlug: 'mecash',
    caseStudyReady: true,
    cardHeight: 'h-[33vh] md:h-[35vh]',
    cardAspect: 'aspect-[4/3]',
  },
  'mecash': {
    category: 'PRODUCT · 2025',
    name: 'meCash',
    nameLines: ['meCash'],
    services: ['Discovery', 'Strategy', 'Mobile app', 'Web app', 'Websites'],
    servicesColumns: 2,
    // No collaboration pill — meCash was an independent direct engagement.
    layout: 'mecash',
    // 11 image slots in public/mecash/. Slot 1 loads cover.png; slots 2–11
    // load 2.png through 11.png. Aspects match each file's native
    // dimensions so containers fill edge-to-edge with no crop.
    assets: {
      // `cover` is what the "More work" card on other detail pages reads
      // when picking a thumbnail; it also makes meCash discoverable to any
      // future code that expects the standard cover key.
      cover: `${BASE}mecash/cover.webp`,
      '1':  `${BASE}mecash/cover.webp`,
      '2':  `${BASE}mecash/2.webp`,
      '3':  `${BASE}mecash/3.webp`,
      '4':  `${BASE}mecash/4.webp`,
      '5':  `${BASE}mecash/5.webp`,
      '6':  `${BASE}mecash/6.webp`,
      '7':  `${BASE}mecash/8.webp`,
      '8':  `${BASE}mecash/7.webp`,
      '9':  `${BASE}mecash/9.webp`,
      '10': `${BASE}mecash/10.webp`,
      '11': `${BASE}mecash/11.webp`,
    },
    aspects: {
      '1':  'aspect-[2072/1490]',   // cover.png 2072×1490
      '2':  'aspect-[2384/1490]',   // 2.png 2384×1490
      '3':  'aspect-[1469/1490]',   // 3.png 1469×1490 (~ square, slightly portrait)
      '4':  'aspect-[1469/1490]',   // 4.png 1469×1490
      '5':  'aspect-[1468/1490]',   // 5.png 1468×1490
      '6':  'aspect-[1468/1490]',   // 6.png 1468×1490
      '7':  'aspect-[2586/1490]',   // slot 7 now loads 8.png 2586×1490
      '8':  'aspect-[2428/1490]',   // slot 8 now loads 7.png 2428×1490
      '9':  'aspect-[2434/1490]',   // 9.png 2434×1490
      '10': 'aspect-[2636/1490]',   // 10.png 2636×1490
      '11': 'aspect-[2247/1490]',   // 11.png 2247×1490
    },
    paragraphs: {
      introPractice: 'Redesigning trust across borders: making cross-border money transfers effortless, transparent, and human. meCash is a cross-border money transfer platform helping users in Africa send and receive funds to and from over 16 countries, including the US, UK, and China. As the Sole Designer, I redesigned the full experience across mobile and web, focusing on trust, transparency, and ease of use.',
      introBrief: 'We worked on the early design phase of the product, including core user flows, UI, and foundational design decisions. The product has since evolved, but the original design patterns, app UI and flows are still in use today.',
    },
    nextSlug: 'julian-mercier',
    caseStudyReady: true,
    cardAspect: 'aspect-[2072/1490]',
    cardHeight: 'h-[25vh] md:h-[44vh]',
  },
}

// Word/char split for manifesto text — keeps words together on wrap and
// gives every char its own span for the scroll-driven gray→black sweep.
function manifestoWords(text, keyPrefix) {
  const words = text.split(' ')
  const out = []
  words.forEach((word, i) => {
    if (i > 0) out.push(' ')
    out.push(
      <span key={`${keyPrefix}-w${i}`} className="inline-block">
        {Array.from(word).map((char, j) => (
          <span key={j} className="proj-manifesto-char">{char}</span>
        ))}
      </span>
    )
  })
  return out
}

// Renders an <img> or <video> based on file extension. Videos pause when
// off-screen via IntersectionObserver so a long page with many videos
// stays light on CPU.
function Media({ src, alt, aspect = 'aspect-[16/9]', className = '', objectClassName = 'object-cover' }) {
  const elRef = useRef(null)
  const isVideo = /\.(mp4|webm)$/i.test(src || '')
  // Sensible default alt — for a portfolio page where the page heading
  // already names the project, generic "Project image" is preferable to
  // an empty alt (which marks an image as decorative and skips it).
  // Videos are aria-hidden so they don't need alt.
  const a11yAlt = alt ?? 'Project image'

  useEffect(() => {
    if (!isVideo) return
    const el = elRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const p = el.play()
          if (p && typeof p.catch === 'function') p.catch(() => {})
        } else {
          el.pause()
        }
      },
      { threshold: 0.1, rootMargin: '150px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isVideo])

  return (
    <div className={`relative w-full ${aspect} bg-card-soft overflow-hidden ${className}`}>
      {isVideo ? (
        <video
          ref={elRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full ${objectClassName}`}
        />
      ) : src ? (
        <img
          src={src}
          alt={a11yAlt}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full ${objectClassName}`}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] uppercase tracking-[0.2em] text-gray-400">
          Project image
        </span>
      )}
    </div>
  )
}

// Animated stat number — counts up from 0 to the target the first time
// the element scrolls into view. The target is parsed out of the value
// string so the suffix ("+", "%", "K", etc.) is preserved verbatim. With
// reduced motion enabled, the final value is rendered immediately.
function StatNumber({ value }) {
  const ref = useRef(null)
  const match = value.match(/^([\d,]+)(.*)$/)
  const target = match ? parseInt(match[1].replace(/,/g, ''), 10) : null
  const suffix = match ? match[2] : ''
  const initial = match ? `0${suffix}` : value

  useEffect(() => {
    const el = ref.current
    if (!el || target === null) return
    if (prefersReducedMotion()) {
      el.textContent = value
      return
    }
    let played = false
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || played) return
      played = true
      const counter = { n: 0 }
      gsap.to(counter, {
        n: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = Math.round(counter.n).toLocaleString() + suffix
        },
        onComplete: () => {
          el.textContent = value
        },
      })
      io.unobserve(el)
    }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [target, suffix, value])

  return <span ref={ref} aria-label={value}>{initial}</span>
}

function MetaBlock({ label, children }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-gray-500 mb-2">{label}</p>
      <div className="text-base-dark text-base leading-snug">{children}</div>
    </div>
  )
}

function BackButton() {
  const navigate = useNavigate()
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }
  return (
    <button
      type="button"
      onClick={handleBack}
      className="cta-press inline-flex items-center gap-2 h-10 px-4 bg-white rounded-full border border-base-border font-mono text-[10px] uppercase tracking-[0.15em] text-base-dark hover:bg-base-light"
    >
      <ChevronLeft size={14} strokeWidth={1.75} />
      <span>Back</span>
    </button>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const project = projects[slug]
  const containerRef = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) {
      gsap.set('.proj-manifesto-char', { color: '#000000' })
      return
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('.proj-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.1)
    tl.fromTo('.proj-meta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 }, 0.3)

    // (Reveal animations are handled by IntersectionObserver in a
    // separate useEffect below — more reliable than ScrollTrigger when
    // combined with Lenis smooth scroll + the route fade-in.)

    // Parallax-Y — slow vertical drift as the section passes the viewport.
    // (No scaling on scroll — scale would push images beyond the page
    // padding, breaking alignment with the rest of the column.)
    gsap.utils.toArray('.proj-parallax-y').forEach((el) => {
      gsap.fromTo(el, { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })

    // Manifesto char sweep — gray → black, scroll-linked. Starts as soon
    // as the text crosses the viewport edge (top 90%) and finishes well
    // before it reaches the top, so the user sees the sweep happen while
    // reading rather than just before scrolling past.
    gsap.utils.toArray('.proj-manifesto-text').forEach((block) => {
      const chars = block.querySelectorAll('.proj-manifesto-char')
      if (chars.length === 0) return
      gsap.to(chars, {
        color: '#000000', ease: 'none', duration: 0.05, stagger: 0.05,
        scrollTrigger: { trigger: block, start: 'top 70%', end: 'bottom 55%', scrub: true },
      })
    })

    // Recalculate parallax/manifesto trigger positions after the route
    // transition settles. App.jsx animates the page wrapper with y:24 → 0
    // over ~600ms; if ScrollTrigger reads positions while that transform
    // is active, every trigger ends up offset by 24px.
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 700)
    return () => window.clearTimeout(refreshId)
  }, { scope: containerRef })

  // Reveal-on-scroll via IntersectionObserver — bypasses ScrollTrigger so
  // it isn't affected by Lenis or the route transition. Adds the
  // `.proj-revealed` class to each block as it crosses the viewport edge;
  // CSS handles the actual fade-up transition (see index.css).
  useEffect(() => {
    if (!project?.caseStudyReady) return
    if (prefersReducedMotion()) {
      const els = containerRef.current?.querySelectorAll('.proj-reveal')
      els?.forEach((el) => el.classList.add('proj-revealed'))
      return
    }
    const root = containerRef.current
    if (!root) return
    const els = root.querySelectorAll('.proj-reveal')
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('proj-revealed')
            io.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -2% 0px', threshold: 0 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [project, slug])

  // Unknown slug — bounce to the showcase.
  if (!project) {
    return (
      <div className="min-h-[80vh] px-4 md:px-6 py-20 md:py-32 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">// Not found</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark mb-6">
          We couldn&rsquo;t find that project.
        </h1>
        <Link
          to="/showcase"
          className="cta-press inline-flex items-center gap-2 px-6 py-3 bg-base-dark text-white rounded-full font-medium text-sm hover:bg-base-dark-soft"
        >
          See the Showcase
          <ArrowRight size={16} strokeWidth={2} />
        </Link>
      </div>
    )
  }

  // Project exists but case study isn't written yet.
  if (!project.caseStudyReady) {
    return (
      <div ref={containerRef} className="min-h-[80vh] px-4 md:px-6 py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-10 md:mb-14">
            <BackButton />
          </div>
          <h1 className="proj-title font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-base-dark mb-12">
            {project.name}
          </h1>
          <div className="flex flex-col items-start gap-6 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">// Case study in progress</p>
            <p className="text-gray-600 text-lg leading-relaxed">
              We&rsquo;re still writing this one. The visual work lives on the Showcase; the full case study (problem, what shipped, outcome) will live here when it&rsquo;s ready.
            </p>
            <Link
              to="/showcase"
              className="cta-press inline-flex items-center gap-2 px-6 py-3 bg-base-dark text-white rounded-full font-medium text-sm hover:bg-base-dark-soft"
            >
              See the Showcase
              <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`w-full overflow-x-hidden ${project.pageBg || 'bg-white'}`}>
      {/* ── Top bar — back button only ───────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 pt-8 md:pt-10">
        <BackButton />
      </div>

      {/* ── Intro: Title + Deliverables ─────────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-12 md:pb-16">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
          <h1 className="proj-title font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-base-dark leading-[0.95]">
            {project.nameLines ? (
              project.nameLines.map((line, i) => (
                <span key={i} className={`block ${i > 0 ? 'pl-12 md:pl-20' : ''}`}>
                  {line}
                </span>
              ))
            ) : (
              project.name
            )}
          </h1>
          <div className="proj-meta flex flex-col gap-4">
            <MetaBlock label="Deliverables">
              {project.servicesColumns === 2 ? (
                // Split into two side-by-side columns. First half (rounded up)
                // goes left, the rest goes right — so 5 items render as 3+2.
                (() => {
                  const half = Math.ceil(project.services.length / 2)
                  return (
                    <div className="flex gap-x-8 md:gap-x-12">
                      <ul className="space-y-1">
                        {project.services.slice(0, half).map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                      <ul className="space-y-1">
                        {project.services.slice(half).map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )
                })()
              ) : (
                <ul className="space-y-1">
                  {project.services.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
            </MetaBlock>
            {project.collaboration && (
              <span className="self-start font-mono text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-base-dark bg-base-light px-3 py-1 rounded-full">
                {project.collaboration}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────
          meCash custom layout — 11 image slots interleaved with the two
          manifesto paragraphs. Layout: 1 full · 2 full · 3+4 pair · 5+6
          pair · 7 full · 8 full · 9 full · 10 full · 11 full.
          ───────────────────────────────────────────────────────────── */}
      {project.layout === 'mecash' && (
        <>
          {/* 1 — full-width hero (cover) */}
          <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
            <div className="proj-reveal">
              <Media src={project.assets?.['1']} aspect={project.aspects?.['1'] || 'aspect-[16/9]'} />
            </div>
          </section>

          {/* Manifesto 1 */}
          <section className="w-full px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-[1600px] mx-auto">
              <p className="proj-manifesto-text font-display font-bold text-4xl md:text-5xl tracking-tighter leading-[1.15] text-gray-300">
                {manifestoWords(project.paragraphs.introPractice, 'ip')}
              </p>
            </div>
          </section>

          {/* 2 — full-width */}
          <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
            <div className="proj-reveal">
              <Media src={project.assets?.['2']} aspect={project.aspects?.['2'] || 'aspect-[16/9]'} />
            </div>
          </section>

          {/* 3 + 4 — equal pair, edge-to-edge */}
          <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
              <div className="proj-reveal"><Media src={project.assets?.['3']} aspect={project.aspects?.['3'] || 'aspect-[4/3]'} /></div>
              <div className="proj-reveal"><Media src={project.assets?.['4']} aspect={project.aspects?.['4'] || 'aspect-[4/3]'} /></div>
            </div>
          </section>

          {/* Manifesto 2 */}
          <section className="w-full px-4 md:px-6 py-12 md:py-20">
            <div className="max-w-[1600px] mx-auto">
              <p className="proj-manifesto-text font-display font-bold text-4xl md:text-5xl tracking-tighter leading-[1.15] text-gray-300">
                {manifestoWords(project.paragraphs.introBrief, 'ib')}
              </p>
            </div>
          </section>

          {/* 5 + 6 — equal pair, edge-to-edge */}
          <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
              <div className="proj-reveal"><Media src={project.assets?.['5']} aspect={project.aspects?.['5'] || 'aspect-[4/3]'} /></div>
              <div className="proj-reveal"><Media src={project.assets?.['6']} aspect={project.aspects?.['6'] || 'aspect-[4/3]'} /></div>
            </div>
          </section>

          {/* 7 — full-width */}
          <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
            <div className="proj-reveal">
              <Media src={project.assets?.['7']} aspect={project.aspects?.['7'] || 'aspect-[16/9]'} />
            </div>
          </section>

          {/* 8 — full-width */}
          <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
            <div className="proj-reveal">
              <Media src={project.assets?.['8']} aspect={project.aspects?.['8'] || 'aspect-[16/9]'} />
            </div>
          </section>

          {/* 9 — full-width */}
          <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
            <div className="proj-reveal">
              <Media src={project.assets?.['9']} aspect={project.aspects?.['9'] || 'aspect-[16/9]'} />
            </div>
          </section>

          {/* 10 — full-width */}
          <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
            <div className="proj-reveal">
              <Media src={project.assets?.['10']} aspect={project.aspects?.['10'] || 'aspect-[16/9]'} />
            </div>
          </section>

          {/* 11 — full-width */}
          <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
            <div className="proj-reveal">
              <Media src={project.assets?.['11']} aspect={project.aspects?.['11'] || 'aspect-[16/9]'} />
            </div>
          </section>
        </>
      )}

      {/* The default shared layout below is skipped for projects with a
          custom layout flag (e.g. meCash). */}
      {!project.layout && <>

      {/* ── 1. Hero cover — page-padded, scroll-zoom parallax. Container
          aspect (17/10) is shorter than the source's 4/3 so object-cover
          trims ~100px off the top and ~100px off the bottom, keeping the
          image vertically centered. ───────────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
        <div className="proj-reveal">
          <div className="proj-parallax-y">
            <Media src={project.assets.cover} alt={project.name} aspect={project.aspects?.cover || 'aspect-[17/10]'} />
          </div>
        </div>
      </section>

      {/* ── Manifesto 1 ─────────────────────────────────────────────── */}
      <section className="w-full px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-[1600px] mx-auto">
          <p className="proj-manifesto-text font-display font-bold text-4xl md:text-5xl tracking-tighter leading-[1.15] text-gray-300">
            {manifestoWords(project.paragraphs.introPractice, 'ip')}
          </p>
        </div>
      </section>

      {/* ── 2. Solo image1 — full-width when project sets
          `solosFullWidth`, otherwise inset to the right column. ──── */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
        {project.solosFullWidth ? (
          <div className="proj-reveal">
            <Media src={project.assets.image1} aspect={project.aspects?.image1 || 'aspect-[4/3]'} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="proj-reveal lg:col-span-8 lg:col-end-13">
              <Media src={project.assets.image1} aspect={project.aspects?.image1 || 'aspect-[4/3]'} />
            </div>
          </div>
        )}
      </section>

      {/* ── 3. Wide hero — hero2 (16:9), parallax-Y drift ────────────── */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
        <div className="proj-reveal">
          <div className="proj-parallax-y">
            <Media src={project.assets.hero2} aspect={project.aspects?.hero2 || 'aspect-[16/9]'} />
          </div>
        </div>
      </section>

      {/* ── 4. 8/12 video1 + 4/12 logo (square loop). Top-aligned so the
          shorter square sits flush with the top of the wider video. ── */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="proj-reveal lg:col-span-8">
            <Media src={project.assets.video1} aspect={project.aspects?.video1 || 'aspect-[13/9]'} />
          </div>
          <div className="proj-reveal lg:col-span-4">
            <Media
              src={project.assets.logo}
              aspect={project.aspects?.logo || 'aspect-square'}
              objectClassName="object-contain"
              className="bg-base-light"
            />
          </div>
        </div>
      </section>

      {/* ── 4b. Cover video — full-width solo, second video on page ─── */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
        <div className="proj-reveal">
          <Media src={project.assets.coverV} aspect={project.aspects?.coverV || 'aspect-[4/3]'} />
        </div>
      </section>

      {/* ── Manifesto 2 ─────────────────────────────────────────────── */}
      <section className="w-full px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-[1600px] mx-auto">
          <p className="proj-manifesto-text font-display font-bold text-4xl md:text-5xl tracking-tighter leading-[1.15] text-gray-300">
            {manifestoWords(project.paragraphs.introBrief, 'ib')}
          </p>
        </div>
      </section>

      {/* ── Stats — optional. Renders when the project supplies a `stats`
          array of { value, label } items. Up to 4 items per row on
          desktop, stacks to 2-up on mobile. Big mono value, small
          uppercase label, sits on a thin top border for separation. ── */}
      {project.stats && project.stats.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
          <div className="proj-reveal grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 border-t border-base-border pt-10 md:pt-14">
            {project.stats.map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <span className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-base-dark leading-none">
                  <StatNumber value={stat.value} />
                </span>
                <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-gray-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── video4 + video5 (equal pair) — right after Manifesto 2.
          Section is skipped entirely when neither video is supplied. ── */}
      {(project.assets.video4 || project.assets.video5) && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            <div className="proj-reveal"><Media src={project.assets.video4} aspect={project.aspects?.video4 || 'aspect-[13/9]'} /></div>
            <div className="proj-reveal"><Media src={project.assets.video5} aspect={project.aspects?.video5 || 'aspect-[13/9]'} /></div>
          </div>
        </section>
      )}

      {/* ── 6. Brand video 1 — page-padded solo, scroll-zoom parallax ── */}
      {project.assets.brand1 && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
          <div className="proj-reveal">
            <div className="proj-parallax-y">
              <Media src={project.assets.brand1} aspect={project.aspects?.brand1 || 'aspect-[17/10]'} />
            </div>
          </div>
        </section>
      )}

      {/* ── 7. Brand 2 + Brand 3 — equal pair, edge-to-edge ─────────── */}
      {(project.assets.brand2 || project.assets.brand3) && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            <div className="proj-reveal">
              <Media src={project.assets.brand2} aspect={project.aspects?.brand2 || 'aspect-[17/10]'} />
            </div>
            <div className="proj-reveal">
              <Media src={project.assets.brand3} aspect={project.aspects?.brand3 || 'aspect-[17/10]'} />
            </div>
          </div>
        </section>
      )}

      {/* ── 8. Wide alt hero — hero1 (9:5), parallax-Y drift. Skipped when
          the project doesn't supply a hero1 asset. ─────────────────── */}
      {project.assets.hero1 && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
          <div className="proj-reveal">
            <div className="proj-parallax-y">
              <Media src={project.assets.hero1} aspect={project.aspects?.hero1 || 'aspect-[9/5]'} />
            </div>
          </div>
        </section>
      )}

      {/* ── 9. Brand book pages — three equal pairs, edge-to-edge ───── */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
        <div className="space-y-6 md:space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            <div className="proj-reveal"><Media src={project.assets.p1} aspect={project.aspects?.p1 || 'aspect-[13/9]'} /></div>
            <div className="proj-reveal"><Media src={project.assets.p2} aspect={project.aspects?.p2 || 'aspect-[13/9]'} /></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            <div className="proj-reveal"><Media src={project.assets.p3} aspect={project.aspects?.p3 || 'aspect-[13/9]'} /></div>
            <div className="proj-reveal"><Media src={project.assets.p4} aspect={project.aspects?.p4 || 'aspect-[13/9]'} /></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            <div className="proj-reveal"><Media src={project.assets.p5} aspect={project.aspects?.p5 || 'aspect-[13/9]'} /></div>
            <div className="proj-reveal"><Media src={project.assets.p6} aspect={project.aspects?.p6 || 'aspect-[13/9]'} /></div>
          </div>
        </div>
      </section>

      {/* ── image9 — full-width solo. Skipped when the project doesn't
          supply an image9 asset (e.g. AMA, after Image 14 was moved
          down to the last-image slot). ─────────────────────────────── */}
      {project.assets.image9 && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
          <div className="proj-reveal">
            <Media src={project.assets.image9} aspect={project.aspects?.image9 || 'aspect-[17/10]'} />
          </div>
        </section>
      )}

      {/* ── 10. Video pair — video2 + video3. If only one is supplied,
          render it as a full-width solo so a singleton doesn't sit
          orphaned next to an empty placeholder. ─────────────────────── */}
      {project.assets.video2 && project.assets.video3 ? (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
            <div className="proj-reveal"><Media src={project.assets.video2} aspect={project.aspects?.video2 || 'aspect-[13/9]'} /></div>
            <div className="proj-reveal"><Media src={project.assets.video3} aspect={project.aspects?.video3 || 'aspect-[13/9]'} /></div>
          </div>
        </section>
      ) : (project.assets.video2 || project.assets.video3) && (
        <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
          <div className="proj-reveal">
            <Media src={project.assets.video2 || project.assets.video3} aspect={project.aspects?.video2 || project.aspects?.video3 || 'aspect-[13/9]'} />
          </div>
        </section>
      )}

      {/* ── image7 + image8 (equal pair) ─────────────────────────────── */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-6 mb-20 md:mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          <div className="proj-reveal">
            <Media src={project.assets.image7} aspect={project.aspects?.image7 || 'aspect-[17/10]'} />
          </div>
          <div className="proj-reveal">
            <Media src={project.assets.image8} aspect={project.aspects?.image8 || 'aspect-[17/10]'} />
          </div>
        </div>
      </section>

      </>}{/* end of default shared layout */}

      {/* ── More work — every project except the one being viewed.
          Coming-soon projects (caseStudyReady=false) render as a
          non-interactive div so clicking them does nothing; a hover
          overlay shows the "Coming soon, very soon" message. ───────── */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-6 pb-20 md:pb-32 border-t border-base-border pt-16 md:pt-20">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-10 md:mb-14">// More work</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {Object.entries(projects)
            .filter(([projectSlug]) => projectSlug !== slug)
            .map(([projectSlug, p]) => {
              const comingSoon = !p.caseStudyReady
              const Inner = (
                <>
                  <div className={`relative w-full ${p.cardAspect || p.cardHeight} bg-card-soft overflow-hidden transition-colors duration-300 group-hover:bg-base-light`}>
                    {p.assets?.coverV ? (
                      <video
                        src={p.assets.coverV}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : p.assets?.cover ? (
                      <img
                        src={p.assets.cover}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.2em] text-gray-400">
                        {comingSoon ? 'Coming soon' : 'Project image'}
                      </span>
                    )}
                    {comingSoon && (
                      <div className="absolute inset-0 flex items-center justify-center bg-base-dark/0 opacity-0 transition-all duration-300 ease-out group-hover:bg-base-dark/55 group-hover:opacity-100">
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">
                          Coming soon, very soon
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-gray-500 leading-snug">
                    {p.services.slice(0, 3).join(' · ')}
                  </span>
                  <h3 className="font-display text-2xl font-bold text-base-dark leading-tight">
                    {p.name}
                  </h3>
                </>
              )
              return comingSoon ? (
                <div key={projectSlug} className="group flex flex-col gap-4 cursor-default">
                  {Inner}
                </div>
              ) : (
                <Link key={projectSlug} to={`/work/${projectSlug}`} className="group flex flex-col gap-4">
                  {Inner}
                </Link>
              )
            })}
        </div>
      </section>

    </div>
  )
}
