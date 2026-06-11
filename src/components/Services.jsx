import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

const CALENDLY_URL = 'https://calendly.com/madebysoni/30min'

// ── Popover (used for "What's included") ───────────────────────────────
// Renders via React portal into document.body so it can layer above any
// stacking context. Position is computed from the trigger's bounding rect
// at open time and on resize. Horizontally clamped to viewport.
function CardPopover({ triggerLabel, triggerIcon, children, variant }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const popoverRef = useRef(null)

  const updatePosition = () => {
    if (!triggerRef.current) return
    const triggerRect = triggerRef.current.getBoundingClientRect()
    const margin = 16
    const popoverWidth = popoverRef.current?.offsetWidth ?? 0
    const minLeft = margin
    const maxLeft = window.innerWidth - popoverWidth - margin
    const clampedLeft = Math.max(minLeft, Math.min(triggerRect.left, maxLeft))
    setCoords({
      top: triggerRect.bottom + window.scrollY + 12,
      left: clampedLeft + window.scrollX,
    })
  }

  useEffect(() => {
    if (!open) return
    updatePosition()

    const handleClick = (e) => {
      const inTrigger = triggerRef.current && triggerRef.current.contains(e.target)
      const inPopover = popoverRef.current && popoverRef.current.contains(e.target)
      if (!inTrigger && !inPopover) setOpen(false)
    }
    // Esc closes; Tab cycles focus inside the popover so keyboard users
    // can read its contents without escaping back to the underlying page.
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (e.key !== 'Tab') return
      const popover = popoverRef.current
      if (!popover) return
      const focusables = popover.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')
      // Whether or not the popover has interactive descendants, keep Tab
      // looping by anchoring focus to the trigger button (always reachable).
      const cycle = [triggerRef.current, ...focusables].filter(Boolean)
      if (cycle.length <= 1) return
      const first = cycle[0]
      const last = cycle[cycle.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    const handleResize = () => updatePosition()

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    window.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('resize', handleResize)
    }
  }, [open])

  useEffect(() => {
    if (popoverRef.current) {
      gsap.set(popoverRef.current, { opacity: 0, y: -6, scale: 0.97, pointerEvents: 'none' })
    }
  }, [])

  useEffect(() => {
    if (!popoverRef.current) return
    if (open) {
      gsap.to(popoverRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power2.out', pointerEvents: 'auto' })
    } else {
      gsap.to(popoverRef.current, { opacity: 0, y: -6, scale: 0.97, duration: 0.16, ease: 'power2.in', pointerEvents: 'none' })
    }
  }, [open])

  const triggerColors = {
    dark:  'border-white/20 text-white hover:border-accent-red hover:text-accent-red',
    light: 'border-base-border text-base-dark hover:border-accent-red hover:text-accent-red',
  }[variant]

  const popoverSurface = variant === 'dark'
    ? 'bg-base-pure border-white text-base-dark'
    : 'bg-base-dark border-base-dark text-gray-100'

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-mono uppercase tracking-wider transition-colors ${triggerColors}`}
      >
        {triggerIcon}
        {triggerLabel}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {createPortal(
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={triggerLabel}
          className={`absolute z-[60] w-80 sm:w-[26rem] max-w-[calc(100vw-2.5rem)] max-h-[70vh] overflow-y-auto p-6 rounded-[12px] border ${popoverSurface}`}
          style={{ opacity: 0, top: `${coords.top}px`, left: `${coords.left}px` }}
        >
          {children}
        </div>,
        document.body
      )}
    </>
  )
}

// ── Trigger icons ───────────────────────────────────────────────────────
const InfoIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

// ── Popover content blocks ──────────────────────────────────────────────
// `columns` controls list layout: 1 = single column (default, used by
// flagship Branding + Websites and by the home-page popovers); 2 = balanced
// two-column flow at md+ breakpoints. Two-column shortens vertical card
// height when items are short — applied to Branding, Websites, Product
// Design, and Design Partner on the /packages page. break-inside-avoid
// keeps each item intact across the column break.
function IncludesContent({ items, variant, columns = 1 }) {
  const labelColor = variant === 'dark' ? 'text-muted' : 'text-gray-400'
  const ulClass = columns === 2
    ? 'space-y-3 md:columns-2 md:gap-x-10'
    : 'space-y-3'
  const liClass = columns === 2
    ? 'flex items-start gap-3 text-sm leading-relaxed break-inside-avoid'
    : 'flex items-start gap-3 text-sm leading-relaxed'
  return (
    <>
      <p className={`font-mono text-xs uppercase tracking-wider mb-4 ${labelColor}`}>Includes</p>
      <ul className={ulClass}>
        {items.map((item) => (
          <li key={item} className={liClass}>
            <svg className="text-accent-red w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </>
  )
}


// ── "See the full process →" link — sits at the bottom of every card on
// /packages now that per-card process timelines live on /approach. The
// slug deep-links into the matching <section id="…"> on Approach.jsx.
// Uses react-router <Link> rather than <a> so navigation stays
// client-side — otherwise the route loader flashes briefly between
// /packages and /approach. text-accent-red works across all themes: the
// flagship-card override in index.css handles theme inversion on the
// dark surface; bg-card-soft and bg-base-pure surfaces show it cleanly
// by default.
function SeeFullProcessLink({ slug }) {
  return (
    <Link
      to={`/approach#${slug}`}
      className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red inline-flex items-center gap-2 hover:opacity-80 transition-opacity group"
    >
      See the full process
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12" height="12" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="transition-transform group-hover:translate-x-1"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </Link>
  )
}

// ── DARK CARD — Branding + Websites (flagship, single canonical scope) ─────
// Previous Essential/Enterprise toggle was dropped: with Branding and
// Websites now offered as standalone packages, this card is the bundled
// 6-week engagement. The lighter version is a conversation, not a UI.
function BrandWebsiteCard({ expanded = false }) {
  const includes = [
    'Founder positioning workshop (full-day strategy intensive)',
    'Brand strategy + verbal identity',
    'Logo, type, and colour systems',
    'Brand guidelines document',
    'Custom illustration suite (3–5 bespoke marks or icons)',
    'Motion design system for the brand',
    'Web design for up to 25 pages',
    'No-code build in Framer, Webflow, or Wix Studio',
    'Copywriting and content structure',
    'CMS, analytics, SEO basics, deployment',
    '3 rounds of revisions',
    '2-week post-launch support',
  ]
  const timeline = 'Typically 4–6 weeks'

  // Pitch block — used in both expanded and collapsed renders.
  const Pitch = (
    <>
      <div className="mb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10 inline-block">Project &middot; Flagship</span>
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">03</span>
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">Branding + Websites</h3>

      <p className="text-gray-300 text-base md:text-lg mb-3 leading-relaxed">
        Launch a brand and marketing site that earn investor and customer trust on first contact.
      </p>

      <p className="text-muted text-sm mb-3 leading-relaxed">
        Brand design &middot; Web design &middot; No-code development
      </p>

      <p className="text-muted text-sm mb-6 leading-relaxed">
        Latest: <a href="/work/julian-mercier" className="underline underline-offset-4 decoration-gray-700 hover:decoration-accent-red hover:text-white transition-colors">Julian Mercier</a> &middot; concept brand identity + Framer build
      </p>

      <div className="border-l-0 border-t border-white/10 pt-5 mb-6">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">// What you walk away with</p>
        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
          A brand and live website that hold up to investor scrutiny, plus a system your team can extend on its own, without coming back to us.
        </p>
      </div>
    </>
  )

  const TimelineBlock = (
    <div>
      <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">Timeline</p>
      <p className="text-2xl font-medium">{timeline}</p>
    </div>
  )

  const BookCallButton = ({ accent = false } = {}) => (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`cta-press inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-base-pure rounded-full font-medium text-sm hover:bg-base-light w-fit ${accent ? 'text-accent-red' : 'text-base-dark'}`}
    >
      Book a call
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </a>
  )

  // ── Expanded layout (packages page) ──────────────────────────────────
  if (expanded) {
    return (
      <div className="svc-card flagship-card bg-base-dark text-base-pure pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
        {/* Pitch (left) + Includes (right) — side-by-side at md+ so the
            flagship doesn't stack two tall blocks vertically. The card
            already spans 2 outer grid columns at xl, so there's room for
            two readable internal columns. Footer strip stays full-width
            below, holding the anchor link + timeline + CTA together. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <div>{Pitch}</div>
          <div>
            <IncludesContent items={includes} variant="dark" />
          </div>
        </div>

        {/* Footer strip — timeline on one side, CTA on the other, with the
            "See the full process →" link sitting above as a quiet anchor
            into /approach. Prices were stripped; conversation is the
            negotiation entry point. */}
        <div className="border-t border-white/10 pt-8 md:pt-10 mt-8 md:mt-10 flex flex-col gap-6">
          <SeeFullProcessLink slug="brand-website" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="flex-1">{TimelineBlock}</div>
            <BookCallButton />
          </div>
        </div>
      </div>
    )
  }

  // ── Collapsed layout (homepage) ──────────────────────────────────────
  return (
    <div className="svc-card flagship-card bg-base-dark text-base-pure pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left: pitch */}
        <div className="lg:col-span-7">
          {Pitch}
          <CardPopover triggerLabel="What's included" triggerIcon={InfoIcon} variant="dark">
            <IncludesContent items={includes} variant="dark" />
          </CardPopover>
        </div>

        {/* Right: timeline + CTA */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8 lg:border-l lg:border-white/10 lg:pl-12">
          {TimelineBlock}
          <BookCallButton />
        </div>
      </div>

      {/* Bottom: link to /approach for the full process timeline */}
      <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-white/10">
        <SeeFullProcessLink slug="brand-website" />
      </div>
    </div>
  )
}

// ── PRODUCT DESIGN — bg #F3F3F3 ────────────────────────────────────────
function ProductDesignCard({ expanded = false }) {
  const includes = [
    'Product discovery + UX strategy',
    'End-to-end UI/UX across web and mobile',
    'Design system and component library',
    'Interactive prototypes and interaction specs',
    'Design QA and engineering handoff',
  ]

  const Pitch = (
    <>
      <div className="mb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-subtle bg-base-pure px-3 py-1 rounded-full inline-block">Project &middot; UI / UX</span>
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">04</span>
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 text-base-dark">Product Design</h3>

      <p className="text-subtle text-base md:text-lg mb-3 leading-relaxed">
        A focused engagement to design one product surface (dashboard, web app, or mobile UI) with locked scope and engineering-ready handoff. Scoped per engagement.
      </p>

      <p className="text-muted text-sm mb-3 leading-relaxed">
        Product design &middot; design system &middot; engineering handoff
      </p>

      <p className="text-muted text-sm mb-6 leading-relaxed">
        Latest: <a href="/work/mecash" className="underline underline-offset-4 decoration-gray-300 hover:decoration-accent-red hover:text-base-dark transition-colors">meCash</a> &middot; cross-border fintech, mobile + web (16+ countries)
      </p>

      <div className="border-t border-base-dark/10 pt-5 mb-6">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">// What you walk away with</p>
        <p className="text-subtle text-sm md:text-base leading-relaxed">
          A production-ready product surface, a design system that prevents drift as you scale, and a handoff package your engineers can build against without guessing at intent.
        </p>
      </div>
    </>
  )

  const TimelineBlock = (
    <div>
      <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Timeline</p>
      <p className="text-2xl font-medium text-base-dark">By scope</p>
    </div>
  )

  const BookCallButton = (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="cta-press inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-base-dark text-base-pure rounded-full font-medium text-sm hover:bg-base-dark-soft w-fit"
    >
      Book a call
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </a>
  )

  // ── Expanded layout (packages page) ──────────────────────────────────
  if (expanded) {
    return (
      <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden flex flex-col h-full">
        {Pitch}

        <div className="mb-10 md:mb-14">
          <IncludesContent items={includes} variant="light" columns={2} />
        </div>

        {/* Footer strip pinned to the bottom (mt-auto) — link to /approach
            sits above the timeline + CTA row. */}
        <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-auto flex flex-col gap-6">
          <SeeFullProcessLink slug="product-design" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="flex-1">{TimelineBlock}</div>
            {BookCallButton}
          </div>
        </div>
      </div>
    )
  }

  // ── Collapsed layout (homepage) ──────────────────────────────────────
  return (
    <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
      <div>
        {Pitch}
        <CardPopover triggerLabel="What's included" triggerIcon={InfoIcon} variant="light">
          <IncludesContent items={includes} variant="light" />
        </CardPopover>
      </div>

      <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-8 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="flex-1">{TimelineBlock}</div>
        {BookCallButton}
      </div>

      <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-base-dark/10">
        <SeeFullProcessLink slug="product-design" />
      </div>
    </div>
  )
}

// ── DESIGN PARTNER — bg #F3F3F3 (same as Product Design) ───────────────
function DesignPartnerCard({ expanded = false }) {
  const includes = [
    'A dedicated senior designer embedded in your team',
    'Weekly delivery: features, marketing pages, brand assets',
    'Full studio capability set (brand, web, product)',
    'Slack-first communication, your tools, your rituals',
    'Standups up to twice a week',
    'Weekly strategy review',
  ]

  const Pitch = (
    <>
      <div className="mb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-subtle bg-base-pure px-3 py-1 rounded-full inline-block">Project &middot; Partnership</span>
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">02</span>
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 text-base-dark">Design Partner</h3>

      <p className="text-subtle text-base md:text-lg mb-3 leading-relaxed">
        Ongoing capacity, not a project. A senior designer embedded in your team, designing brand, product, and marketing work week after week.
      </p>

      <p className="text-muted text-sm mb-3 leading-relaxed">
        Embedded design &middot; senior seat, no hiring overhead
      </p>

      <p className="text-muted text-sm mb-6 leading-relaxed">
        Trusted by: <a href="/work/australia-medical-association-victoria" className="underline underline-offset-4 decoration-gray-300 hover:decoration-accent-red hover:text-base-dark transition-colors">AMA Victoria</a>, <a href="/work/time-bmx" className="underline underline-offset-4 decoration-gray-300 hover:decoration-accent-red hover:text-base-dark transition-colors">Time BMX</a> &middot; via Roadhouse (Australia)
      </p>

      <div className="border-t border-base-dark/10 pt-5 mb-6">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">// What you walk away with</p>
        <p className="text-subtle text-sm md:text-base leading-relaxed">
          Senior design output shipping on your roadmap, brand consistency across every touchpoint, and strategic input on the decisions that shape how the company is seen.
        </p>
      </div>
    </>
  )

  const TimelineBlock = (
    <div>
      <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Timeline</p>
      <p className="text-2xl font-medium text-base-dark">Ongoing</p>
    </div>
  )

  const BookCallButton = (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="cta-press inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-base-dark text-base-pure rounded-full font-medium text-sm hover:bg-base-dark-soft w-fit"
    >
      Book a call
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </a>
  )

  // ── Expanded layout (packages page) ──────────────────────────────────
  if (expanded) {
    return (
      <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden flex flex-col h-full">
        {Pitch}

        <div className="mb-10 md:mb-14">
          <IncludesContent items={includes} variant="light" columns={2} />
        </div>

        {/* Commitment strip pinned to the bottom (mt-auto) — anchor link to
            /approach above the commitment + CTA row. */}
        <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-auto flex flex-col gap-6">
          <SeeFullProcessLink slug="design-partner" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="flex-1">{TimelineBlock}</div>
            {BookCallButton}
          </div>
        </div>
      </div>
    )
  }

  // ── Collapsed layout (homepage) ──────────────────────────────────────
  return (
    <div className="svc-card bg-base-pure border border-base-dark pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
      <div>
        {Pitch}
        <CardPopover triggerLabel="What's included" triggerIcon={InfoIcon} variant="light">
          <IncludesContent items={includes} variant="light" />
        </CardPopover>
      </div>

      <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-8 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="flex-1">{TimelineBlock}</div>
        {BookCallButton}
      </div>

      <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-base-dark/10">
        <SeeFullProcessLink slug="design-partner" />
      </div>
    </div>
  )
}

// ── DESIGN AUDIT — bg-card-soft ────────────────────────────────────────
// Lighter-touch entry point: a 2-week paid review of an existing brand,
// product, or website. Previously embedded as a footer block inside the
// Design Partner card; promoted to its own card so it reads as a real
// bookable engagement rather than a retainer afterthought.
function DesignAuditCard({ expanded = false }) {
  const Pitch = (
    <>
      <div className="mb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-subtle bg-base-pure px-3 py-1 rounded-full inline-block">Diagnostic &middot; 2 weeks</span>
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">06</span>
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 text-base-dark">Design Audit</h3>

      <p className="text-subtle text-base md:text-lg mb-3 leading-relaxed">
        A paid review of your existing brand, product, or website. Written diagnosis with prioritized fixes you can apply yourself or hand to another studio.
      </p>

      <p className="text-muted text-sm mb-6 leading-relaxed">
        Diagnostic &middot; prioritized recommendations
      </p>

      <div className="border-t border-base-dark/10 pt-5 mb-6">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">// What you walk away with</p>
        <p className="text-subtle text-sm md:text-base leading-relaxed">
          A written diagnosis covering what&rsquo;s working and what isn&rsquo;t, with prioritized fixes ranked by impact. Credit applied if you book a full engagement within 30 days.
        </p>
      </div>
    </>
  )

  const TimelineBlock = (
    <div>
      <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Timeline</p>
      <p className="text-2xl font-medium text-base-dark">2 weeks</p>
    </div>
  )

  const BookCallButton = (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="cta-press inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-base-dark text-base-pure rounded-full font-medium text-sm hover:bg-base-dark-soft w-fit"
    >
      Book the audit
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </a>
  )

  if (expanded) {
    // Spans 2 outer grid columns at xl, so the inner layout uses a 2-col
    // grid: pitch + walk-away on the left, Timeline + CTA right-aligned
    // on the right. Keeps line measure readable and uses the horizontal
    // space rather than leaving a huge empty band.
    return (
      <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          <div className="lg:col-span-8">
            {Pitch}
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6 lg:items-end lg:justify-end lg:border-l lg:border-base-dark/10 lg:pl-12 pt-6 lg:pt-0 border-t lg:border-t-0 border-base-dark/10">
            {TimelineBlock}
            {BookCallButton}
          </div>
        </div>
      </div>
    )
  }

  // Collapsed (homepage) — same structure since there's no large
  // includes list to hide behind a popover.
  return (
    <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
      {Pitch}

      <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-8 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="flex-1">{TimelineBlock}</div>
        {BookCallButton}
      </div>
    </div>
  )
}

// ── WEBSITES — bg-card-soft ─────────────────────────────────────────────
// Single-discipline engagement for clients who already have a brand and
// just need a production marketing site. Same visual family as Product
// Design (bg-card-soft) so the four non-flagship cards read as one cluster.
function WebsitesAloneCard({ expanded = false }) {
  const includes = [
    'Site map + content plan',
    'Page design',
    'No-code build in Framer, Webflow, or Wix Studio',
    'CMS setup',
    'Analytics + SEO basics',
    'Deployment',
    '1 round of revisions',
    '1-week post-launch support',
  ]

  const Pitch = (
    <>
      <div className="mb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-subtle bg-base-pure px-3 py-1 rounded-full inline-block">Project &middot; Website</span>
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">01</span>
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 text-base-dark">Websites</h3>

      <p className="text-subtle text-base md:text-lg mb-3 leading-relaxed">
        A production marketing site built on top of an existing brand. No-code execution, deployed and handed over.
      </p>

      <p className="text-muted text-sm mb-6 leading-relaxed">
        Web design &middot; No-code development &middot; CMS
      </p>

      <div className="border-t border-base-dark/10 pt-5 mb-6">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">// What you walk away with</p>
        <p className="text-subtle text-sm md:text-base leading-relaxed">
          A live marketing site you can update on your own, with analytics and SEO basics already in place. No follow-up engagement needed to ship the first version.
        </p>
      </div>
    </>
  )

  const TimelineBlock = (
    <div>
      <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Timeline</p>
      <p className="text-2xl font-medium text-base-dark">Typically 2–3 weeks</p>
    </div>
  )

  const BookCallButton = (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="cta-press inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-base-dark text-base-pure rounded-full font-medium text-sm hover:bg-base-dark-soft w-fit"
    >
      Book a call
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </a>
  )

  if (expanded) {
    return (
      <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden flex flex-col h-full">
        {Pitch}

        <div className="mb-10 md:mb-14">
          <IncludesContent items={includes} variant="light" columns={2} />
        </div>

        <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-auto flex flex-col gap-6">
          <SeeFullProcessLink slug="websites" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="flex-1">{TimelineBlock}</div>
            {BookCallButton}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
      <div>
        {Pitch}
        <CardPopover triggerLabel="What's included" triggerIcon={InfoIcon} variant="light">
          <IncludesContent items={includes} variant="light" />
        </CardPopover>
      </div>

      <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-8 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="flex-1">{TimelineBlock}</div>
        {BookCallButton}
      </div>

      <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-base-dark/10">
        <SeeFullProcessLink slug="websites" />
      </div>
    </div>
  )
}

// ── BRANDING — bg-card-soft ─────────────────────────────────────────────
// Identity-only engagement: strategy, logo, type, colour, and a
// guidelines document. Sibling to Websites in the "single-discipline"
// cluster, same visual surface.
function BrandingAloneCard({ expanded = false }) {
  const includes = [
    'Brand strategy + verbal identity',
    'Logo design',
    'Type system',
    'Colour system',
    'Brand guidelines document',
    'Asset pack (logo lockups, favicon, social avatars)',
    '2 rounds of revisions',
  ]

  const Pitch = (
    <>
      <div className="mb-6">
        <span className="font-mono text-xs uppercase tracking-wider text-subtle bg-base-pure px-3 py-1 rounded-full inline-block">Project &middot; Brand</span>
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">02</span>
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 text-base-dark">Branding</h3>

      <p className="text-subtle text-base md:text-lg mb-3 leading-relaxed">
        A complete identity system (strategy, logo, type, and colour) built to scale across every surface your business uses.
      </p>

      <p className="text-muted text-sm mb-6 leading-relaxed">
        Brand strategy &middot; Logo &middot; Type &middot; Colour &middot; Guidelines
      </p>

      <div className="border-t border-base-dark/10 pt-5 mb-6">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">// What you walk away with</p>
        <p className="text-subtle text-sm md:text-base leading-relaxed">
          A brand system your team can apply to anything (decks, website, social, packaging) without coming back to us every time the brand shows up somewhere new.
        </p>
      </div>
    </>
  )

  const TimelineBlock = (
    <div>
      <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Timeline</p>
      <p className="text-2xl font-medium text-base-dark">Typically 2–3 weeks</p>
    </div>
  )

  const BookCallButton = (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="cta-press inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-base-dark text-base-pure rounded-full font-medium text-sm hover:bg-base-dark-soft w-fit"
    >
      Book a call
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </a>
  )

  if (expanded) {
    return (
      <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden flex flex-col h-full">
        {Pitch}

        <div className="mb-10 md:mb-14">
          <IncludesContent items={includes} variant="light" columns={2} />
        </div>

        <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-auto flex flex-col gap-6">
          <SeeFullProcessLink slug="branding" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="flex-1">{TimelineBlock}</div>
            {BookCallButton}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-10 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
      <div>
        {Pitch}
        <CardPopover triggerLabel="What's included" triggerIcon={InfoIcon} variant="light">
          <IncludesContent items={includes} variant="light" />
        </CardPopover>
      </div>

      <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-8 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="flex-1">{TimelineBlock}</div>
        {BookCallButton}
      </div>

      <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-base-dark/10">
        <SeeFullProcessLink slug="branding" />
      </div>
    </div>
  )
}

export default function Services({ expanded = false }) {
  const container = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('.svc-header', {
      y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.svc-header', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.svc-card', {
      y: 80, opacity: 0, duration: 0.9, stagger: 0.18, ease: 'power3.out',
      scrollTrigger: { trigger: '.svc-grid', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
  }, { scope: container })

  return (
    <section
      ref={container}
      id="services"
      className="w-full py-16 md:py-20 px-4 md:px-6 bg-base-pure"
    >
      <div className="max-w-[1600px] w-full mx-auto">
        <div className="svc-header mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">// Packages</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark leading-tight">
              Two ways to work together.
            </h2>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mt-4">
              A launch-ready project &middot; an ongoing design partnership.
            </p>
          </div>
          <p className="text-subtle text-base md:text-lg max-w-md leading-relaxed">
            Pick the engagement that matches where you are: a launch-ready brand and site delivered as one project, or an ongoing senior design partner embedded in your team.
          </p>
        </div>

        {/* Render order: two cards side-by-side at xl. Branding + Websites
            on the left, Design Partner on the right. items-start on the
            homepage lets each card rest at its natural height so accordion
            toggles don't tug siblings; /packages (expanded) uses default
            stretch so the timeline strips line up.

            WebsitesAloneCard, BrandingAloneCard, ProductDesignCard, and
            DesignAuditCard function definitions remain in this file but
            are no longer rendered — kept for potential restoration if
            the offering expands again later.

            Each card is wrapped in a div with a slug id so the home-page
            teaser links can deep-link to a specific card via /packages#slug.
            scroll-mt-24 offsets the scroll target so the sticky top nav
            doesn't clip the card edge on jump. */}
        <div className={`svc-grid grid grid-cols-1 xl:grid-cols-2 gap-6 ${expanded ? '' : 'items-start'}`}>
          <div id="brand-website" className="scroll-mt-24">
            <BrandWebsiteCard expanded={expanded} />
          </div>
          <div id="design-partner" className="scroll-mt-24">
            <DesignPartnerCard expanded={expanded} />
          </div>
        </div>

      </div>
    </section>
  )
}
