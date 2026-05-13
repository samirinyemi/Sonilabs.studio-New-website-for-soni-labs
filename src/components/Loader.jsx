import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

// Fullscreen first-load overlay. Sequence:
//   1. Counter animates 000.0 → 100.0 over ~3s (top-right corner)
//   2. Wordmark SONI LABS fades + slides in early
//   3. Ten showcase images pop in one after the other, each rotated a
//      few degrees, stacked at the centre like a hand of cards
//   4. Brief pause when the counter hits 100
//   5. Parallax swipe-up exit — every layer slides up at a different
//      end-y, so they read as moving at different speeds. The hero
//      underneath starts animating the moment the exit begins
//      (onComplete fires at exit start, not at full unmount), so the
//      loader peels away to reveal an already-moving page.
//
// Loader manages its own lifecycle: it stays mounted through its exit
// animation, then removes itself from the DOM by returning null.

// 18 landscape showcase images pulled from public/showcase-media/.
// All landscape orientation so the stack reads consistently. `wMul`
// tweaks the width per item so the cards feel hand-placed rather
// than uniform.
const IMAGES = [
  'Slate — One card. Every currency. Zero friction..webp',
  'Aura — This Card is Soul.webp',
  'Heritage.webp',
  'Silentship.webp',
  'Atlas AI — One API for every AI model.webp',
  'D5 — Velour (13).webp',
  'D3 — Maren Studio · Voss portfolio.webp',
  'D9 — Axis Talent Agency.webp',
  'A-News — Train. Recover. Repeat..webp',
  'D11 — Bloom Roastery · Studio.webp',
  'Edge of Light.webp',
  'D6 — Meridian Atelier · Perfume essay.webp',
  'D2 — Fold Atelier.webp',
  'Pulse — Sound Meets Soul.webp',
  'haus — The Rebirth of Real Estate.webp',
  'Kairo Maye — Sports Editorial.webp',
  'D10 — Nia Obi · Web Designer · Art Director.webp',
  'Nova — Generate Stunning AI Images.webp',
]

// Per-item rotation in degrees. Mixed signs + magnitudes give the
// "stack of cards" feel rather than a uniform fan.
const ROTATIONS = [0, -10, 6, -4, 12, -8, 3, -11, 7, -2, 9, -6, 4, -9, -3, 8, -7, 5]

// Per-item width multiplier — drives variation in card size so the
// stack reads as casually piled, not uniformly stacked.
const W_MULS = [1.00, 0.90, 1.10, 0.85, 1.05, 0.95, 1.00, 0.92, 1.08, 0.95, 1.00, 0.88, 1.05, 0.93, 0.97, 1.03, 0.93, 1.07]

const COUNT_DUR = 3.0      // sec — count 0 → 100
const IMG_START = 0.5      // sec — first item pops in 0.5s after start
const IMG_STAGGER = 0.14   // sec — gap between item pops (tight enough to fit 18 items inside counter window)
const IMG_DUR = 0.40       // sec — per-item pop duration
const PAUSE = 0.3          // sec — beat after counter hits 100
const EXIT_DUR = 1.2       // sec — parallax swipe-up duration
// Total: 0.5 + 17*0.14 + 0.40 = ~3.28s for the stack, COUNT_DUR=3.0s, EXIT at 3.3s

export default function Loader({ onComplete }) {
  const rootRef = useRef(null)
  const counterRef = useRef(null)
  // 'running' = visible, animating. 'done' = fully off-screen, unmount.
  const [phase, setPhase] = useState('running')

  useGSAP(() => {
    if (prefersReducedMotion()) {
      // No animation — fire callback immediately, mark done so the
      // overlay unmounts and the page is visible.
      onComplete?.()
      setPhase('done')
      return
    }

    // Initial states for the animated bits
    gsap.set('.loader-img', {
      scale: 0,
      opacity: 0,
      rotate: (i) => ROTATIONS[i],
    })
    gsap.set('.loader-wordmark', { opacity: 0, y: 24 })
    gsap.set('.loader-counter', { opacity: 0, y: 12 })

    const tl = gsap.timeline()

    // Counter — animate a JS number, write into the DOM each frame.
    const num = { val: 0 }
    tl.to(num, {
      val: 100,
      duration: COUNT_DUR,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (!counterRef.current) return
        const v = num.val
        const int = Math.floor(v).toString().padStart(3, '0')
        const dec = Math.floor((v * 10) % 10)
        counterRef.current.textContent = `${int}.${dec}`
      },
    }, 0)

    // Counter container fades in quickly at the very start
    tl.to('.loader-counter', { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, 0)

    // Wordmark fades + slides in just after the counter starts
    tl.to('.loader-wordmark', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.15)

    // Asset stack — pops in one after the other. power3.out gives a
    // confident, decelerating landing (no overshoot/bounce, which the
    // brand explicitly avoids).
    tl.to('.loader-img', {
      scale: 1,
      opacity: 1,
      duration: IMG_DUR,
      ease: 'power3.out',
      stagger: IMG_STAGGER,
    }, IMG_START)

    // Parallax exit — every layer slides up at a different rate.
    // Position after the count + brief pause.
    tl.add('exit', COUNT_DUR + PAUSE)

    tl.to('.loader-bg',       { yPercent: -100, duration: EXIT_DUR, ease: 'power3.in' }, 'exit')
    tl.to('.loader-counter',  { yPercent: -800, duration: EXIT_DUR, ease: 'power3.in' }, 'exit')
    tl.to('.loader-wordmark', { yPercent: -250, duration: EXIT_DUR, ease: 'power3.in' }, 'exit')
    tl.to('.loader-images',   { yPercent: -180, duration: EXIT_DUR, ease: 'power3.in' }, 'exit')

    // Fire onComplete at the END of the exit, so the hero only starts
    // animating after the loader is fully off-screen. Previously this
    // fired at exit-start which meant the hero's first elements (H1
    // curtain reveal) finished before the loader was even fully gone.
    tl.call(() => { onComplete?.() }, null, 'exit+=' + EXIT_DUR)

    // Mark done so the loader unmounts itself.
    tl.call(() => { setPhase('done') }, null, 'exit+=' + EXIT_DUR)
  }, { scope: rootRef })

  if (phase === 'done') return null

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] overflow-hidden pointer-events-none"
    >
      {/* Solid dark background — its own layer so it can slide up
          uniformly during the parallax exit. */}
      {/* Hardcoded dark bg — the Loader stays the same regardless of
          the current theme. Wordmark is nested inside as a child so it
          gets clipped by the bg's frame when the parallax exit slides
          the bg up off the screen — otherwise the wordmark, being a
          sibling that moves at its own slower rate, lingers in place
          after the bg has already exited. */}
      <div className="loader-bg absolute inset-0 bg-[#0A0A0A] overflow-hidden">
        {/* SONI LABS wordmark — bottom centre, large display type. */}
        <div className="loader-wordmark absolute inset-x-0 bottom-10 md:bottom-16 flex justify-center px-6">
          <span className="font-display font-bold text-white text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tighter leading-none">
            SONI LABS
          </span>
        </div>
      </div>

      {/* Counter — top right, mono font, tabular nums so digits don't jiggle. */}
      <div
        className="loader-counter absolute top-6 right-6 md:top-10 md:right-10 font-mono text-white text-3xl md:text-5xl tabular-nums tracking-tight"
      >
        <span ref={counterRef}>000.0</span>
      </div>

      {/* Image stack — 18 landscape showcase images absolutely
          centred, individual rotations applied via GSAP, varying
          per-item widths so the stack reads as casually piled. Higher
          index = later card = on top. No corner-radius; the cards
          present as flat snapshots. */}
      <div className="loader-images absolute inset-0 flex items-center justify-center">
        {IMAGES.map((file, i) => {
          const mul = W_MULS[i] ?? 1
          return (
            <img
              key={file}
              src={`/showcase-media/${encodeURIComponent(file)}`}
              alt=""
              decoding="async"
              className="loader-img absolute will-change-transform"
              style={{
                zIndex: i,
                // Mobile uses vw, desktop is capped via maxWidth — wMul
                // scales both so the variation reads at any screen size.
                width: `${35 * mul}vw`,
                maxWidth: `${22 * mul}rem`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
