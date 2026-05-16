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
// flagship Brand + Website and by the home-page popovers); 2 = balanced
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

// ── DARK CARD — Brand + Website (flagship, single canonical scope) ─────
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
  const timeline = '6 weeks'

  // Pitch block — used in both expanded and collapsed renders.
  const Pitch = (
    <>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">Project &middot; Flagship</span>
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">03</span>
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">Brand + Website</h3>

      <p className="text-gray-300 text-base md:text-lg mb-3 leading-relaxed">
        Launch a brand and marketing site that earn investor and customer trust on first contact. Live in 6 weeks.
      </p>

      <p className="text-muted text-sm mb-3 leading-relaxed">
        Brand design &middot; Web design &middot; No-code development
      </p>

      <p className="text-muted text-sm mb-6 leading-relaxed">
        Latest: <a href="/work/julian-mercier" className="underline underline-offset-4 decoration-gray-700 hover:decoration-accent-red hover:text-white transition-colors">Julian Mercier</a> &middot; concept brand identity + Framer build
      </p>

      <div className="border-l-0 border-t border-white/10 pt-5 mb-8">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">// What you walk away with</p>
        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
          A brand and live website that hold up to investor scrutiny — plus a system your team can extend on its own, without coming back to us.
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
      <div className="svc-card flagship-card bg-base-dark text-base-pure pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
        {Pitch}

        {/* Includes — single column now that the process column moved to
            /approach. Card max-width keeps the line measure comfortable. */}
        <div className="max-w-2xl">
          <IncludesContent items={includes} variant="dark" />
        </div>

        {/* Footer strip — timeline on one side, CTA on the other, with the
            "See the full process →" link sitting above as a quiet anchor
            into /approach. Prices were stripped; conversation is the
            negotiation entry point. */}
        <div className="border-t border-white/10 pt-8 md:pt-10 mt-10 md:mt-12 flex flex-col gap-6">
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
    <div className="svc-card flagship-card bg-base-dark text-base-pure pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
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
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-base-pure border border-base-dark/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-base-dark">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-subtle bg-base-pure px-3 py-1 rounded-full">Project &middot; UI / UX</span>
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">04</span>
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 text-base-dark">Product Design</h3>

      <p className="text-subtle text-base md:text-lg mb-3 leading-relaxed">
        A focused engagement to design one product surface — dashboard, web app, or mobile UI — with locked scope and engineering-ready handoff. 5 weeks.
      </p>

      <p className="text-muted text-sm mb-3 leading-relaxed">
        Product design &middot; design system &middot; engineering handoff
      </p>

      <p className="text-muted text-sm mb-6 leading-relaxed">
        Latest: <a href="/work/mecash" className="underline underline-offset-4 decoration-gray-300 hover:decoration-accent-red hover:text-base-dark transition-colors">meCash</a> &middot; cross-border fintech, mobile + web (16+ countries)
      </p>

      <div className="border-t border-base-dark/10 pt-5 mb-8">
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
      <p className="text-2xl font-medium text-base-dark">5 weeks</p>
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
      <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden flex flex-col h-full">
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
    <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
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
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-base-pure border border-base-dark/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-base-dark">
            <path d="M12 20v-6M6 20V10M18 20V4" />
          </svg>
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-accent-red bg-accent-red/10 px-3 py-1 rounded-full">Monthly retainer</span>
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">05</span>
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 text-base-dark">Design Partner</h3>

      <p className="text-subtle text-base md:text-lg mb-3 leading-relaxed">
        Ongoing capacity, not a project. A senior designer embedded in your team — designing brand, product, and marketing work week after week.
      </p>

      <p className="text-muted text-sm mb-3 leading-relaxed">
        Monthly retainer &middot; senior design seat, no hiring overhead
      </p>

      <p className="text-muted text-sm mb-6 leading-relaxed">
        Trusted by: <a href="/work/australia-medical-association-victoria" className="underline underline-offset-4 decoration-gray-300 hover:decoration-accent-red hover:text-base-dark transition-colors">AMA Victoria</a>, <a href="/work/time-bmx" className="underline underline-offset-4 decoration-gray-300 hover:decoration-accent-red hover:text-base-dark transition-colors">Time BMX</a> &middot; via Roadhouse (Australia)
      </p>

      <div className="border-t border-base-dark/10 pt-5 mb-8">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">// What you walk away with</p>
        <p className="text-subtle text-sm md:text-base leading-relaxed">
          Senior design output shipping on your roadmap, brand consistency across every touchpoint, and strategic input on the decisions that shape how the company is seen.
        </p>
      </div>
    </>
  )

  // Equivalent of TimelineBlock on the project cards. Retainers don't
  // have a fixed duration, so we show the minimum commitment instead.
  const CommitmentBlock = (
    <div>
      <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Commitment</p>
      <p className="text-2xl font-medium text-base-dark">3-month minimum</p>
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

  // Lower-friction entry for visitors who aren't ready for a 3-month
  // retainer. Sits inside Design Partner specifically because that's the
  // engagement with the biggest commitment ask. Visually quieter than
  // the main price strip — no card chrome, just a dotted-divider header
  // and an inline price + ghost button.
  const AuditBlock = (
    <div className="border-t border-dashed border-base-dark/20 pt-6 md:pt-8 mt-8 md:mt-10">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-3">// Not ready for a retainer?</p>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="flex-1 max-w-xl">
          <p className="font-display text-lg md:text-xl font-bold text-base-dark mb-2 leading-tight">
            Start with a 2-week design audit.
          </p>
          <p className="text-subtle text-sm leading-relaxed">
            Paid review of your brand, product, or website. Written diagnosis + prioritized fixes. Credit applied if you book a full engagement within 30 days.
          </p>
        </div>
        <div className="flex items-end gap-5 shrink-0">
          <div>
            <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Timeline</p>
            <p className="text-2xl font-medium text-base-dark leading-none">2 weeks</p>
          </div>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-press inline-flex items-center gap-2 px-5 py-2.5 border border-base-dark text-base-dark rounded-full font-medium text-sm hover:bg-base-dark hover:text-base-pure transition-colors w-fit"
          >
            Book the audit
          </a>
        </div>
      </div>
    </div>
  )

  // ── Expanded layout (packages page) ──────────────────────────────────
  if (expanded) {
    return (
      <div className="svc-card bg-base-pure border border-base-dark pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden flex flex-col h-full">
        {Pitch}

        <div className="mb-10 md:mb-14">
          <IncludesContent items={includes} variant="light" columns={2} />
        </div>

        {/* Commitment strip pinned to the bottom (mt-auto) — anchor link to
            /approach above the commitment + CTA row. */}
        <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-auto flex flex-col gap-6">
          <SeeFullProcessLink slug="design-partner" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="flex-1">{CommitmentBlock}</div>
            {BookCallButton}
          </div>
        </div>

        {AuditBlock}
      </div>
    )
  }

  // ── Collapsed layout (homepage) ──────────────────────────────────────
  return (
    <div className="svc-card bg-base-pure border border-base-dark pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
      <div>
        {Pitch}
        <CardPopover triggerLabel="What's included" triggerIcon={InfoIcon} variant="light">
          <IncludesContent items={includes} variant="light" />
        </CardPopover>
      </div>

      <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-8 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="flex-1">{CommitmentBlock}</div>
        {BookCallButton}
      </div>

      {AuditBlock}

      <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-base-dark/10">
        <SeeFullProcessLink slug="design-partner" />
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
    'Page design (up to 8 pages)',
    'No-code build in Framer, Webflow, or Wix Studio',
    'CMS setup',
    'Analytics + SEO basics',
    'Deployment',
    '1 round of revisions',
    '1-week post-launch support',
  ]

  const Pitch = (
    <>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-base-pure border border-base-dark/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-base-dark">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-subtle bg-base-pure px-3 py-1 rounded-full">Project &middot; Website</span>
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">01</span>
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 text-base-dark">Websites</h3>

      <p className="text-subtle text-base md:text-lg mb-3 leading-relaxed">
        A production marketing site built on top of an existing brand. No-code execution, deployed and handed over. Live in 2–3 weeks.
      </p>

      <p className="text-muted text-sm mb-6 leading-relaxed">
        Web design &middot; No-code development &middot; CMS
      </p>

      <div className="border-t border-base-dark/10 pt-5 mb-8">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">// What you walk away with</p>
        <p className="text-subtle text-sm md:text-base leading-relaxed">
          A live marketing site you can update on your own, with analytics and SEO basics already in place — no follow-up engagement needed to ship the first version.
        </p>
      </div>
    </>
  )

  const TimelineBlock = (
    <div>
      <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Timeline</p>
      <p className="text-2xl font-medium text-base-dark">2–3 weeks</p>
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
      <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden flex flex-col h-full">
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
    <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
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
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-base-pure border border-base-dark/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-base-dark">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <span className="font-mono text-xs uppercase tracking-wider text-subtle bg-base-pure px-3 py-1 rounded-full">Project &middot; Brand</span>
      </div>

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">02</span>
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 text-base-dark">Branding</h3>

      <p className="text-subtle text-base md:text-lg mb-3 leading-relaxed">
        A complete identity system — strategy, logo, type, and colour — built to scale across every surface your business uses. Live in ~2 weeks.
      </p>

      <p className="text-muted text-sm mb-6 leading-relaxed">
        Brand strategy &middot; Logo &middot; Type &middot; Colour &middot; Guidelines
      </p>

      <div className="border-t border-base-dark/10 pt-5 mb-8">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted mb-2">// What you walk away with</p>
        <p className="text-subtle text-sm md:text-base leading-relaxed">
          A brand system your team can apply to anything — decks, website, social, packaging — without coming back to us every time the brand shows up somewhere new.
        </p>
      </div>
    </>
  )

  const TimelineBlock = (
    <div>
      <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Timeline</p>
      <p className="text-2xl font-medium text-base-dark">~2 weeks</p>
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
      <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden flex flex-col h-full">
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
    <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
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
              Five ways to work together.
            </h2>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mt-4">
              Four project engagements &middot; one monthly retainer.
            </p>
          </div>
          <p className="text-subtle text-base md:text-lg max-w-md leading-relaxed">
            Pick the engagement that matches where you are: a single discipline, the full bundle, a focused product surface, or an ongoing partner embedded in your team.
          </p>
        </div>

        {/* Render order: Websites + Branding side-by-side (row 1), flagship
            Brand + Website spans both columns (row 2), then Product Design +
            Design Partner side-by-side (row 3). items-start on the homepage
            lets each card rest at its natural height so accordion toggles
            don't tug siblings. /packages (expanded) uses default stretch so
            the inline timeline strips line up across cards. */}
        <div className={`svc-grid grid grid-cols-1 xl:grid-cols-2 gap-6 ${expanded ? '' : 'items-start'}`}>
          <WebsitesAloneCard expanded={expanded} />
          <BrandingAloneCard expanded={expanded} />
          <div className="xl:col-span-2">
            <BrandWebsiteCard expanded={expanded} />
          </div>
          <ProductDesignCard expanded={expanded} />
          <DesignPartnerCard expanded={expanded} />
        </div>

      </div>
    </section>
  )
}
