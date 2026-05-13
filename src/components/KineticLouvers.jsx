import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

// Responsive bar count — one bar per ~8px of viewport width, clamped.
// 375px ≈ 50 (min), 1280px ≈ 160, 1920px ≈ 240, 2560px+ ≈ 260 (max).
const BAR_DENSITY = 8        // px per bar — tighter = denser louvers, but more compositing cost
const MIN_BARS = 50          // floor for narrow phones
const MAX_BARS = 260         // ceiling for ultrawide displays

const getNumBars = () => {
  if (typeof window === 'undefined') return 200
  const w = window.innerWidth
  return Math.min(MAX_BARS, Math.max(MIN_BARS, Math.round(w / BAR_DENSITY)))
}

const RADIUS = 150           // px — proximity radius for the cursor wave
const BAR_WIDTH = 2          // px — base bar width
const BASE_HEIGHT = 50       // px — base bar height
const BASE_OPACITY = 0.2
const PEAK_SCALE = 2
const PEAK_OPACITY = 1
const PEAK_ROTATE_Y = 60     // degrees

// Click ripple
const RIPPLE_SCALE = 2.6     // peak scaleY at the wavefront
const RIPPLE_ROTATE_Y = 90   // peak rotateY at the wavefront
const RIPPLE_SPEED = 1200    // px / sec — how fast the ripple travels outward
const RIPPLE_PEAK_DUR = 0.2  // sec — time to reach peak
const RIPPLE_RETURN_DUR = 0.5 // sec — time to settle back

// First-load entry sweep — each bar peaks as the wavefront passes,
// then settles to its resting state. Stagger between bars creates the
// left-to-right travelling wave; each bar runs the same two-keyframe
// peak→settle sequence on its turn.
const ENTRY_DELAY = 1.35       // sec — default delay (synced with old Hero); overridable via prop
const ENTRY_PEAK_DUR = 0.22    // sec — rise into peak per bar
const ENTRY_SETTLE_DUR = 0.40  // sec — drop from peak to resting per bar
const ENTRY_STAGGER = 0.006    // sec — gap between bar starts (~1.2s sweep at 200 bars)

// Session-wide flag — persists across mounts of the KineticLouvers
// component within the same page session. Once the entry sweep has
// played once, subsequent mounts (e.g. user navigates away from /
// and back to it) snap straight to the resting state. A per-instance
// useRef would reset on each remount, replaying the entry every time.
let didFirstEntry = false

export default function KineticLouvers({ entryDelay = ENTRY_DELAY }) {
  const containerRef = useRef(null)
  const barsRef = useRef([])
  const [numBars, setNumBars] = useState(getNumBars)

  useEffect(() => {
    let rafId
    const handle = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const next = getNumBars()
        setNumBars((prev) => (prev === next ? prev : next))
      })
    }
    window.addEventListener('resize', handle)
    return () => {
      window.removeEventListener('resize', handle)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  useGSAP(() => {
    const container = containerRef.current
    // Old refs may persist when numBars shrinks; truncate before reading.
    barsRef.current = barsRef.current.slice(0, numBars)
    const bars = barsRef.current.filter(Boolean)

    // Reduced-motion: render bars in their resting state and skip every
    // animation, mousemove handler, click ripple, and entry sweep.
    if (prefersReducedMotion()) {
      gsap.set(bars, { scaleY: 1, opacity: BASE_OPACITY, rotateY: 0 })
      return
    }

    // quickTo factory per bar per animated property — much cheaper than
    // gsap.to() for high-frequency mousemove updates.
    const fns = bars.map((bar) => ({
      scaleY: gsap.quickTo(bar, 'scaleY', { duration: 0.3, ease: 'power2.out' }),
      opacity: gsap.quickTo(bar, 'opacity', { duration: 0.3, ease: 'power2.out' }),
      rotateY: gsap.quickTo(bar, 'rotateY', { duration: 0.3, ease: 'power2.out' }),
    }))

    // Cache bar X centers; recompute on resize.
    const computeBarPositions = () => {
      const w = container.offsetWidth
      const gap = (w - BAR_WIDTH * numBars) / (numBars - 1)
      return Array.from(
        { length: numBars },
        (_, i) => i * (BAR_WIDTH + gap) + BAR_WIDTH / 2
      )
    }
    let barPositions = computeBarPositions()

    // While the entry sweep or click ripple is running, ignore mousemove
    // so the choreographed animation can finish without quickTo
    // overwriting it mid-flight.
    let lockUntil = 0

    // First-load entry sweep — bars start collapsed and cascade in from
    // the left edge. Each bar rises into its PEAK state (scaled + rotated
    // + full opacity) as the wavefront reaches it, then settles into the
    // resting BASE state. The stagger between bars creates the visible
    // travelling wave. Skip on resize-driven re-runs so a window drag
    // doesn't replay the intro.
    //
    // didFirstEntry is flipped INSIDE onComplete, not synchronously up
    // here — otherwise in React StrictMode the first effect run flips
    // it true and the gsap context cleanup kills the scheduled animation
    // before it plays, so the re-mounted effect skips it entirely.
    if (!didFirstEntry) {
      gsap.set(bars, { scaleY: 0, opacity: 0, rotateY: 0 })
      gsap.to(bars, {
        keyframes: [
          {
            scaleY: PEAK_SCALE,
            opacity: PEAK_OPACITY,
            rotateY: PEAK_ROTATE_Y,
            duration: ENTRY_PEAK_DUR,
            ease: 'power2.out',
          },
          {
            scaleY: 1,
            opacity: BASE_OPACITY,
            rotateY: 0,
            duration: ENTRY_SETTLE_DUR,
            ease: 'power2.out',
          },
        ],
        stagger: ENTRY_STAGGER,
        delay: entryDelay,
        onComplete: () => { didFirstEntry = true },
      })
      lockUntil = performance.now() +
        (entryDelay + (numBars - 1) * ENTRY_STAGGER + ENTRY_PEAK_DUR + ENTRY_SETTLE_DUR) * 1000
    } else {
      gsap.set(bars, { scaleY: 1, opacity: BASE_OPACITY, rotateY: 0 })
    }

    const handleResize = () => {
      barPositions = computeBarPositions()
    }
    window.addEventListener('resize', handleResize)

    // rAF-coalesce mousemove so we do at most one wave update per paint.
    let pendingX = null
    let moveRafId = 0
    const flushMove = () => {
      moveRafId = 0
      if (pendingX === null) return
      const cursorX = pendingX
      pendingX = null
      for (let i = 0; i < numBars; i++) {
        const distance = Math.abs(cursorX - barPositions[i])
        const factor = distance < RADIUS ? 1 - distance / RADIUS : 0
        fns[i].scaleY(1 + factor * (PEAK_SCALE - 1))
        fns[i].opacity(BASE_OPACITY + factor * (PEAK_OPACITY - BASE_OPACITY))
        fns[i].rotateY(factor * PEAK_ROTATE_Y)
      }
    }

    const handleMove = (e) => {
      if (performance.now() < lockUntil) return
      const rect = container.getBoundingClientRect()
      pendingX = e.clientX - rect.left
      if (!moveRafId) moveRafId = requestAnimationFrame(flushMove)
    }

    const handleLeave = () => {
      pendingX = null
      if (moveRafId) {
        cancelAnimationFrame(moveRafId)
        moveRafId = 0
      }
      if (performance.now() < lockUntil) return
      for (let i = 0; i < numBars; i++) {
        fns[i].scaleY(1)
        fns[i].opacity(BASE_OPACITY)
        fns[i].rotateY(0)
      }
    }

    // Click ripple — the wave radiates outward from the click point.
    // Each bar fires a peak/return tween whose start is delayed by
    // distance / RIPPLE_SPEED, producing the visible wavefront.
    //
    // Gated by lockUntil so a second click during an active ripple is
    // ignored (instead of stacking). This avoids using `overwrite: true`
    // on the per-bar tweens, which would otherwise kill the persistent
    // quickTo instances that drive the hover wave — once those are
    // killed, hover stops working until a full remount.
    const handleClick = (e) => {
      if (performance.now() < lockUntil) return

      const rect = container.getBoundingClientRect()
      const clickX = e.clientX - rect.left

      let maxDistance = 0
      for (let i = 0; i < numBars; i++) {
        const d = Math.abs(clickX - barPositions[i])
        if (d > maxDistance) maxDistance = d
      }
      const maxDelay = maxDistance / RIPPLE_SPEED
      const totalWave = (maxDelay + RIPPLE_PEAK_DUR + RIPPLE_RETURN_DUR) * 1000
      lockUntil = performance.now() + totalWave

      for (let i = 0; i < numBars; i++) {
        const distance = Math.abs(clickX - barPositions[i])
        const delay = distance / RIPPLE_SPEED

        gsap.to(bars[i], {
          keyframes: [
            {
              scaleY: RIPPLE_SCALE,
              opacity: PEAK_OPACITY,
              rotateY: RIPPLE_ROTATE_Y,
              duration: RIPPLE_PEAK_DUR,
              ease: 'power2.out',
            },
            {
              scaleY: 1,
              opacity: BASE_OPACITY,
              rotateY: 0,
              duration: RIPPLE_RETURN_DUR,
              ease: 'power2.out',
            },
          ],
          delay,
        })
      }
    }

    container.addEventListener('mousemove', handleMove)
    container.addEventListener('mouseleave', handleLeave)
    container.addEventListener('click', handleClick)

    return () => {
      if (moveRafId) cancelAnimationFrame(moveRafId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMove)
      container.removeEventListener('mouseleave', handleLeave)
      container.removeEventListener('click', handleClick)
    }
  }, { dependencies: [numBars] })

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-between items-center cursor-pointer"
      style={{ height: '110px', perspective: '1000px' }}
      aria-hidden="true"
    >
      {Array.from({ length: numBars }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (barsRef.current[i] = el)}
          className="kinetic-bar bg-base-dark/40 shrink-0"
          style={{
            width: `${BAR_WIDTH}px`,
            height: `${BASE_HEIGHT}px`,
            opacity: 0,
            transformOrigin: 'center',
          }}
        />
      ))}
    </div>
  )
}
