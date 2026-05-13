import { useRef, useState, useEffect, useLayoutEffect, useId } from 'react'
import { createPortal } from 'react-dom'
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

// ── Inline accordion (full-width row at the bottom of each card) ───────
// Sits inside the card's content padding — the divider, click target, and
// expanded content all align with the rest of the card's content.
//
// While hovered with a mouse, the native cursor is hidden and a small
// "Show" / "Hide" label follows the pointer. Touch devices skip this and
// fall back to the default pointer cursor.
function CardAccordion({ triggerLabel, openLabel, triggerIcon, children, variant }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const contentRef = useRef(null)
  const labelRef = useRef(null)
  const isAnimating = useRef(false)
  // Stable id ties the trigger to the panel via aria-controls / id so
  // assistive tech can navigate between them.
  const panelId = useId()

  // Track mouse position only while hovered. Updates the label's transform
  // imperatively (no re-render). The trailing translate(-50%, -50%) centers
  // the label on the cursor position so it feels like the label *is* the
  // cursor rather than something tagging along beside it.
  useEffect(() => {
    if (!hovered) return
    const handle = (e) => {
      if (!labelRef.current) return
      labelRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [hovered])

  const toggle = () => {
    if (isAnimating.current) return
    const el = contentRef.current
    if (!el) return
    isAnimating.current = true

    if (!open) {
      gsap.set(el, { height: 'auto', opacity: 1 })
      const fullHeight = el.scrollHeight
      gsap.fromTo(el,
        { height: 0, opacity: 0 },
        {
          height: fullHeight, opacity: 1,
          duration: 0.5, ease: 'power3.out',
          onComplete: () => {
            gsap.set(el, { height: 'auto' })
            isAnimating.current = false
          },
        }
      )
    } else {
      gsap.to(el, {
        height: 0, opacity: 0,
        duration: 0.4, ease: 'power3.inOut',
        onComplete: () => {
          // Keep height: 0 explicitly. clearProps would remove the inline
          // height, snapping the element back to its natural content height
          // and re-occupying layout space — the bug we hit when toggling
          // closed used to look like "the accordion can't be closed."
          // Fresh scrollHeight is still re-measured on next open because
          // the open branch sets height to 'auto' before reading it.
          isAnimating.current = false
        },
      })
    }
    setOpen(!open)
  }

  const styles = {
    dark:  {
      border:     'border-white/10',
      text:       'text-white',
      labelBg:    'bg-base-pure',
      labelText:  'text-base-dark',
    },
    light: {
      border:     'border-base-dark/10',
      text:       'text-base-dark',
      labelBg:    'bg-base-dark',
      labelText:  'text-white',
    },
  }[variant]

  return (
    <div className={`border-t ${styles.border}`}>
      <button
        type="button"
        onClick={toggle}
        onPointerEnter={(e) => {
          if (e.pointerType === 'touch') return
          // Snap the label to the entry point before fading in so it never
          // appears in a stale position from the previous hover.
          if (labelRef.current) {
            labelRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`
          }
          setHovered(true)
        }}
        onPointerLeave={() => setHovered(false)}
        aria-expanded={open}
        aria-controls={panelId}
        className={`w-full flex items-center justify-between py-5 md:py-6 text-left ${styles.text}`}
      >
        <span className="flex items-center gap-3">
          <span className="opacity-60">{triggerIcon}</span>
          <span className="font-mono text-xs uppercase tracking-wider">
            {open ? (openLabel ?? 'Hide process') : triggerLabel}
          </span>
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Cursor-following label — portal so it floats above all stacking contexts */}
      {createPortal(
        <div
          ref={labelRef}
          aria-hidden="true"
          className={`fixed top-0 left-0 pointer-events-none z-[100] px-4 py-2 rounded-full ${styles.labelBg} ${styles.labelText} text-[11px] font-mono uppercase tracking-wider whitespace-nowrap transition-opacity duration-150 ${hovered ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: 'translate3d(-9999px, -9999px, 0)' }}
        >
          {open ? 'Hide' : 'Show'}
        </div>,
        document.body
      )}

      <div
        ref={contentRef}
        id={panelId}
        role="region"
        aria-label={triggerLabel}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="pb-6 md:pb-8">{children}</div>
      </div>
    </div>
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
const ClockIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

// ── Popover content blocks ──────────────────────────────────────────────
function IncludesContent({ items, variant }) {
  const labelColor = variant === 'dark' ? 'text-muted' : 'text-gray-400'
  return (
    <>
      <p className={`font-mono text-xs uppercase tracking-wider mb-4 ${labelColor}`}>Includes</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
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

// Two surfaces for ProcessContent:
//  - 'card-dark' / 'card-light' — content sits on the card's own bg (accordion)
//  - 'dark' / 'light' — content sits on an inverted surface (popover, legacy)
function ProcessContent({ rows, title, variant, noDividers = false }) {
  const styles = {
    'card-dark':  { labelColor: 'text-white/50',   textColor: 'text-gray-300', borderColor: 'border-white/10' },
    'card-light': { labelColor: 'text-muted',   textColor: 'text-subtle', borderColor: 'border-base-border' },
    dark:         { labelColor: 'text-muted',   textColor: 'text-subtle', borderColor: 'border-base-border' },
    light:        { labelColor: 'text-gray-400',   textColor: 'text-gray-300', borderColor: 'border-white/10' },
  }
  const s = styles[variant] ?? styles['card-light']
  // When dividers are off (expanded pricing-page layout), the phase label
  // sits inline next to the description — same tight rhythm as the
  // includes-list check + item. With dividers on (homepage accordion),
  // the original 120px column keeps the week labels in a clean stack.
  const liClass = noDividers
    ? 'flex items-baseline gap-3 leading-relaxed'
    : `grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-1 sm:gap-6 pb-3 border-b ${s.borderColor} last:border-b-0 last:pb-0`

  return (
    <>
      <p className={`font-mono text-xs uppercase tracking-wider mb-4 ${s.labelColor}`}>{title}</p>
      <ul className={noDividers ? 'space-y-4' : 'space-y-3'}>
        {rows.map(([phase, what]) => (
          <li key={phase} className={liClass}>
            <span className={`font-mono text-[11px] uppercase tracking-wider text-accent-red ${noDividers ? 'shrink-0' : ''}`}>
              {phase.split('\n').map((line, i, arr) => (
                <span key={i} className={i < arr.length - 1 ? 'block' : 'inline'}>{line}</span>
              ))}
            </span>
            <span className={`text-sm leading-relaxed ${s.textColor}`}>{what}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

// ── DARK CARD — Brand + Website (Essential / Enterprise toggle) ────────
function BrandWebsiteCard({ expanded = false }) {
  const [tier, setTier] = useState('essential')
  const priceRef = useRef(null)
  const priceValueRef = useRef(5000)

  // Sliding pill background for the tier toggle. The highlight is an
  // absolutely-positioned span; its x and width animate to match the
  // active button on every tier change.
  const essentialBtnRef = useRef(null)
  const enterpriseBtnRef = useRef(null)
  const highlightRef = useRef(null)
  const isFirstToggleRender = useRef(true)

  useLayoutEffect(() => {
    const target = tier === 'essential' ? essentialBtnRef.current : enterpriseBtnRef.current
    const highlight = highlightRef.current
    if (!target || !highlight) return

    const params = { x: target.offsetLeft, width: target.offsetWidth }

    if (isFirstToggleRender.current || prefersReducedMotion()) {
      isFirstToggleRender.current = false
      gsap.set(highlight, params)
      return
    }
    gsap.to(highlight, { ...params, duration: 0.4, ease: 'power3.out' })
  }, [tier])

  useEffect(() => {
    const target = tier === 'essential' ? 5000 : 8000
    const node = priceRef.current
    if (!node) return

    if (prefersReducedMotion()) {
      priceValueRef.current = target
      node.textContent = `$${target.toLocaleString()}`
      return
    }

    const obj = { val: priceValueRef.current }
    const tween = gsap.to(obj, {
      val: target,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        const v = Math.round(obj.val)
        priceValueRef.current = v
        node.textContent = `$${v.toLocaleString()}`
      },
    })
    return () => tween.kill()
  }, [tier])

  const tiers = {
    essential: {
      timeline: '4 weeks',
      includes: [
        'Brand strategy + verbal identity',
        'Logo, type, and colour systems',
        'Brand guidelines document',
        'Web design for up to 10 pages',
        'No-code build in Framer or Wix Studio',
        'Copywriting and content structure',
        'CMS, analytics, SEO basics, deployment',
        '2 rounds of revisions',
        '1-week post-launch support',
      ],
      process: [
        ['Week 1', 'Discovery: strategy, audience, site map, content plan.'],
        ['Week 2', 'Direction: visual concepts, logo, type and colour. Locked.'],
        ['Week 3', 'System build: final identity and web design.'],
        ['Week 4', 'Build & launch: Framer / Webflow / Wix Studio, CMS, SEO, go live.'],
      ],
    },
    enterprise: {
      timeline: '6 weeks',
      includes: [
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
      ],
      process: [
        ['Week 1',     'Positioning workshop + discovery: strategy, audience, site map, content plan across 25 pages.'],
        ['Week 2',     'Direction: visual concepts, logo, type and colour. Locked.'],
        ['Weeks\n3–4', 'System build: final identity, illustration suite, motion system, and full web design.'],
        ['Week 5',     'Build: Framer / Webflow / Wix Studio, CMS, custom interactions, motion accents.'],
        ['Week 6',     'Launch: QA, deployment, 2-week post-launch support.'],
      ],
    },
  }

  const current = tiers[tier]
  const process = current.process

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

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">01</span>
      <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">Brand + Website</h3>

      <p className="text-gray-300 text-base md:text-lg mb-3 leading-relaxed">
        Launch a brand and marketing site that earn investor and customer trust on first contact. Live in 4 weeks.
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

  // Tier toggle — used by both layouts.
  const TierToggle = (
    <div role="tablist" aria-label="Engagement tier" className="relative inline-flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-full">
      <span
        ref={highlightRef}
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-0 rounded-full bg-base-pure pointer-events-none"
        style={{ width: 0, willChange: 'transform, width' }}
      />
      <button
        ref={essentialBtnRef}
        type="button"
        role="tab"
        aria-selected={tier === 'essential'}
        onClick={() => setTier('essential')}
        className={`relative z-10 px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider transition-colors duration-300 ${tier === 'essential' ? 'text-base-dark' : 'text-gray-400 hover:text-white'}`}
      >
        Essential
      </button>
      <button
        ref={enterpriseBtnRef}
        type="button"
        role="tab"
        aria-selected={tier === 'enterprise'}
        onClick={() => setTier('enterprise')}
        className={`relative z-10 px-4 py-1.5 rounded-full font-mono text-[11px] uppercase tracking-wider transition-colors duration-300 ${tier === 'enterprise' ? 'text-base-dark' : 'text-gray-400 hover:text-white'}`}
      >
        Enterprise
      </button>
    </div>
  )

  const PriceBlock = (
    <div>
      <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">Starting from</p>
      <p ref={priceRef} className="text-3xl font-medium tabular-nums">$5,000</p>
    </div>
  )

  const TimelineBlock = (
    <div>
      <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">Timeline</p>
      <p className="text-2xl font-medium">{current.timeline}</p>
    </div>
  )

  const BookCallButton = (
    <a
      href={CALENDLY_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="cta-press inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-base-pure text-base-dark rounded-full font-medium text-sm hover:bg-base-light w-fit"
    >
      Book a call
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </a>
  )

  // ── Expanded layout (pricing page) ───────────────────────────────────
  if (expanded) {
    return (
      <div className="svc-card flagship-card bg-base-dark text-base-pure pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
        {Pitch}

        {/* Includes (left) + Process (right) — side-by-side, equal columns.
            Each component is wrapped in its own <div> because they return
            fragments; without the wrappers their internal label and list
            elements would flow into separate grid cells. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
          <div>
            <IncludesContent items={current.includes} variant="dark" />
          </div>
          <div>
            <ProcessContent rows={process} title="Brand + Website process" variant="card-dark" noDividers />
          </div>
        </div>

        {/* Price strip — full-width horizontal row beneath the includes/process */}
        <div className="border-t border-white/10 pt-8 md:pt-10 mt-10 md:mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12 flex-1">
            {TierToggle}
            {PriceBlock}
            {TimelineBlock}
          </div>
          {BookCallButton}
        </div>
      </div>
    )
  }

  // ── Collapsed layout (homepage) ──────────────────────────────────────
  return (
    <div className="svc-card bg-base-dark text-base-pure pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        {/* Left: pitch */}
        <div className="lg:col-span-7">
          {Pitch}
          <CardPopover key={tier} triggerLabel="What's included" triggerIcon={InfoIcon} variant="dark">
            <IncludesContent items={current.includes} variant="dark" />
          </CardPopover>
        </div>

        {/* Right: tier toggle + price + CTA */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-8 lg:border-l lg:border-white/10 lg:pl-12">
          <div className="space-y-6">
            {TierToggle}
            {PriceBlock}
            {TimelineBlock}
          </div>
          {BookCallButton}
        </div>
      </div>

      {/* Bottom: process accordion */}
      <div className="mt-8 md:mt-10">
        <CardAccordion triggerLabel="See the process" triggerIcon={ClockIcon} variant="dark">
          <ProcessContent rows={process} title="Brand + Website process" variant="card-dark" />
        </CardAccordion>
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
  const process = [
    ['Weeks\n1–2', 'Discovery: product audit, user flows, IA, scope locked.'],
    ['Weeks\n3–4', 'Design: end-to-end UI/UX, design system, prototype.'],
    ['Week\n5',    'Polish & handoff: design QA, engineering documentation, walkthrough.'],
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

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">02</span>
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

  const PriceBlock = (
    <div>
      <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Starting from</p>
      <p className="text-3xl font-medium text-base-dark">$7,000</p>
    </div>
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

  // ── Expanded layout (pricing page) ───────────────────────────────────
  if (expanded) {
    return (
      <div className="svc-card bg-card-soft pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden flex flex-col h-full">
        {Pitch}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mb-10 md:mb-14">
          <div>
            <IncludesContent items={includes} variant="light" />
          </div>
          <div>
            <ProcessContent rows={process} title="Product Design process" variant="card-light" noDividers />
          </div>
        </div>

        {/* Price strip pinned to the bottom (mt-auto). When this card sits
            beside Design Partner in a 2-column grid, the outer grid's
            stretch alignment + h-full + mt-auto put both strips at the
            same vertical position. */}
        <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12 flex-1">
            {PriceBlock}
            {TimelineBlock}
          </div>
          {BookCallButton}
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

      {/* Price strip — full-width horizontal row beneath the pitch. Same
          shape as the pricing page so both surfaces read consistently. */}
      <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-8 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12 flex-1">
          {PriceBlock}
          {TimelineBlock}
        </div>
        {BookCallButton}
      </div>

      <div className="mt-8 md:mt-10">
        <CardAccordion triggerLabel="See the process" triggerIcon={ClockIcon} variant="light">
          <ProcessContent rows={process} title="Product Design process" variant="card-light" />
        </CardAccordion>
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
  const process = [
    ['Week 1', 'Sprint planning, priority lock, first deliverables shipped.'],
    ['Week 2', 'Active design and iteration in your tools and standups.'],
    ['Week 3', 'Ship and refine: features, pages, assets, whatever ships next.'],
    ['Week 4', 'Strategy review, next-month roadmap, retro.'],
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

      <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-3 block">03</span>
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

  const PriceBlock = (
    <div>
      <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">Monthly rate</p>
      <p className="text-3xl font-medium text-base-dark">$5,000<span className="text-muted">/mo</span></p>
      <p className="text-xs text-muted mt-2 leading-snug">3+ month commitment: $4,500/mo</p>
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
            Paid review of your brand, product, or website. Written diagnosis + prioritized fixes. <span className="text-base-dark">$500 credit applied</span> if you book a full engagement within 30 days.
          </p>
        </div>
        <div className="flex items-end gap-5 shrink-0">
          <div>
            <p className="text-xs text-muted font-mono uppercase tracking-wider mb-1">One-time</p>
            <p className="text-2xl font-medium text-base-dark leading-none">$500</p>
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

  // ── Expanded layout (pricing page) ───────────────────────────────────
  if (expanded) {
    return (
      <div className="svc-card bg-base-pure border border-base-dark pt-6 sm:pt-8 md:pt-12 pb-4 sm:pb-5 md:pb-6 px-6 sm:px-8 md:px-12 rounded-[12px] overflow-hidden flex flex-col h-full">
        {Pitch}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mb-10 md:mb-14">
          <div>
            <IncludesContent items={includes} variant="light" />
          </div>
          <div>
            <ProcessContent rows={process} title="A typical month" variant="card-light" noDividers />
          </div>
        </div>

        {/* Price strip pinned to the bottom (mt-auto) so its divider line
            aligns with the equivalent strip in Product Design when the two
            cards sit side-by-side in the 2-column outer grid. */}
        <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="flex-1">
            {PriceBlock}
          </div>
          {BookCallButton}
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

      {/* Price strip — full-width horizontal row beneath the pitch. Same
          shape as the pricing page so both surfaces read consistently. */}
      <div className="border-t border-base-dark/10 pt-8 md:pt-10 mt-8 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <div className="flex-1">
          {PriceBlock}
        </div>
        {BookCallButton}
      </div>

      {AuditBlock}

      <div className="mt-8 md:mt-10">
        <CardAccordion triggerLabel="A typical month" openLabel="Hide month" triggerIcon={ClockIcon} variant="light">
          <ProcessContent rows={process} title="A typical month" variant="card-light" />
        </CardAccordion>
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
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">// Pricing &amp; Engagements</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark leading-tight">
              Three ways to work together.
            </h2>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mt-4">
              Two project engagements &middot; one monthly retainer.
            </p>
          </div>
          <p className="text-subtle text-base md:text-lg max-w-md leading-relaxed">
            Pick the engagement that matches where you are: launching, scaling a product, or shipping continuously with a partner embedded in your team.
          </p>
        </div>

        {/* Card 1 (flagship Brand + Website) spans both columns at xl;
            Cards 2 + 3 sit side-by-side below it. items-start lets each
            card rest at its natural height so accordion toggles don't
            tug the sibling card up or down. Pricing page (expanded)
            uses default grid stretch so the inline price strips align. */}
        <div className={`svc-grid grid grid-cols-1 xl:grid-cols-2 gap-6 ${expanded ? '' : 'items-start'}`}>
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
