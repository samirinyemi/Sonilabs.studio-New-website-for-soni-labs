import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import KineticLouvers from './KineticLouvers'
import { VideoSources } from '../utils/videoSources'
import { prefersReducedMotion } from '../utils/motion'
import { useLoaderDone } from '../contexts/LoaderContext'

// Module-level flag — flips to true on the first HeroV2 mount in the
// current browser session and stays there. Used to decide whether to
// wait out the first-load Loader or start the hero animations
// immediately (on subsequent client-side navigations back to home,
// the Loader no longer exists). Resets only on hard refresh.
let didFirstHeroMount = false

// Loader's total run time. Hero waits this long on first mount so the
// entrance animations run AFTER the loader's parallax exit completes.
// Must match Loader.jsx's COUNT_DUR + PAUSE + EXIT_DUR (~4.5s).
const LOADER_DURATION = 4.5

// HeroV2 — experiment slot for iterating on the hero. The original Hero
// component is preserved verbatim; flip USE_V2_HERO in src/pages/Home.jsx
// to switch back at any time.
//
// Current iteration:
//   1. Headline row — H1 on the left (wide column), subhead + CTAs
//      stacked on the right (narrower column), bottom-aligned so the
//      CTA row sits flush with the bottom of the headline.
//   2. Showreel — embedded in the hero. Cropped via an aspect ratio
//      shorter than the video's native 16:9 so only the top portion is
//      visible; the rest is intentionally clipped (teaser feel). Mobile
//      shows the full clip because a sliver of a wide-aspect crop reads
//      awkwardly at phone widths.
//   3. KineticLouvers — the decorative "stylistic line" — moved up
//      from below the pillars to sit between the showreel and the
//      pillars.
//   4. Pillars band — the four value props, unchanged.
const pillars = [
  {
    num: '01',
    title: 'You stand out.',
    body: 'A trained design eye that doesn’t ship template-grade SaaS work. Your brand, site, or product looks deliberate, not like a default off the shelf.',
  },
  {
    num: '02',
    title: 'You launch faster.',
    body: 'One studio for brand, design, and build. No vendor coordination, no handoffs, no waiting for the next agency to start.',
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

export default function HeroV2() {
  const heroRef = useRef(null)
  // Capture the first-mount status at the start of this render, then
  // mark the flag so subsequent renders/mounts know to skip the wait.
  const isFirstMount = !didFirstHeroMount
  // Whether the Loader overlay is still running. On hard refresh of /,
  // this is false until the Loader finishes (~4.5s). On hard refresh of
  // any other route, the Loader runs immediately on that route and is
  // already done by the time the user navigates back to / — so loaderDone
  // is true on HeroV2's "first" mount, and the entrance should start
  // right away rather than waiting for a loader that's no longer there.
  const loaderDone = useLoaderDone()
  // Delay applied to the entrance timeline. Only wait when the Loader is
  // genuinely still on screen.
  const heroDelay = loaderDone ? 0 : LOADER_DURATION
  const louversEntryDelay = isFirstMount && !loaderDone ? LOADER_DURATION + 0.5 : 0.5

  useGSAP(() => {
    if (prefersReducedMotion()) {
      // Reduced-motion path: snap everything to visible, slide the
      // blind tiles fully off-frame so the video shows immediately.
      gsap.set(
        ['.hv2-eyebrow', '.hv2-line', '.hv2-sub-line', '.hv2-cta', '.hv2-reel', '.hv2-pillar'],
        { opacity: 1, y: 0 }
      )
      gsap.set('.hv2-tile', { yPercent: 120 })
      // KineticLouvers handles its own reduced-motion (resting state).
      return
    }

    // Subsequent visits (user navigated to another page and came back
    // to home): skip the staggered entrance and snap everything to
    // its final state. The full 2.5s entrance is for the first-load
    // reveal under the Loader; replaying it on every nav-back makes
    // the page feel like it's "loading" again for a few seconds.
    if (!isFirstMount) {
      gsap.set(
        ['.hv2-eyebrow', '.hv2-line', '.hv2-sub-line', '.hv2-cta', '.hv2-reel', '.hv2-pillar'],
        { opacity: 1, y: 0 }
      )
      gsap.set('.hv2-tile', { yPercent: 120 })
      return
    }

    // First mount in this session: wait for the Loader to finish its
    // parallax exit before starting hero animations. Flag is mutated in
    // the effect so render stays pure.
    didFirstHeroMount = true

    const tl = gsap.timeline({ delay: heroDelay, defaults: { ease: 'power3.out' } })

    // Eyebrow
    tl.fromTo('.hv2-eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, 0.05)

    // H1 — curtain reveal, line by line (each line in its own mask)
    tl.fromTo('.hv2-line',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.7, stagger: 0.08 },
      0.20
    )

    // Subhead — curtain reveal, line by line, same language as H1
    tl.fromTo('.hv2-sub-line',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.55, stagger: 0.09 },
      0.55
    )

    // CTAs — each one starts after the previous, not together
    tl.fromTo('.hv2-cta',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.12 },
      1.05
    )

    // Showreel container — fades in early so the white "empty" block
    // appears while the H1 is still finishing, before the tiles slide
    // away.
    tl.fromTo('.hv2-reel',
      { opacity: 0 },
      { opacity: 1, duration: 0.35 },
      0.40
    )

    // (Louvers handles its own entrance via the entryDelay prop —
    // each bar cascades in with a peak→settle keyframe so the wave
    // moves left to right with the peak state at the front. No
    // parent-level animation needed here.)

    // Blinds reveal — 8 white column tiles slide DOWN off the bottom
    // of the frame, one by one (left-to-right), exposing the video
    // from the top downward. Stagger > 50% of duration so each column
    // reads as clearly sequential, not a wave.
    tl.fromTo('.hv2-tile',
      { yPercent: 0 },
      {
        yPercent: 120,
        duration: 0.5,
        ease: 'power3.inOut',
        stagger: 0.13,
      },
      0.55
    )

    // Pillars — last to enter
    tl.fromTo('.hv2-pillar',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
      1.95
    )
  }, { scope: heroRef })

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-base-pure pt-24 md:pt-32 pb-16 md:pb-20"
    >
      {/* Top content — constrained to the page's max width. Horizontal
          padding lives on the inner container, not the section, so the
          louvers below can break out to the viewport edges. */}
      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
        {/* Eyebrow */}
        <div className="hv2-eyebrow inline-flex items-center gap-2 mb-8 md:mb-12" style={{ opacity: 0 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-red" aria-hidden="true"></span>
          <span className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted">
            A design studio, under one roof
          </span>
        </div>

        {/* Headline row — H1 left, subhead + CTAs right, bottom-aligned. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 lg:gap-x-12 gap-y-8 items-end">
          <h1 className="lg:col-span-8 font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[1.02] text-base-dark">
            <span className="overflow-hidden block">
              <span className="hv2-line block" style={{ opacity: 0 }}>Brands, products,</span>
            </span>
            <span className="overflow-hidden block">
              <span className="hv2-line block" style={{ opacity: 0 }}>and websites. Built</span>
            </span>
            <span className="overflow-hidden block">
              <span className="hv2-line block" style={{ opacity: 0 }}>under one roof.</span>
            </span>
          </h1>

          <div className="lg:col-span-4 flex flex-col gap-6 lg:items-end lg:text-right">
            {/* Subhead — three lines, each curtain-reveals on its own
                with the same animation language as the H1 above. */}
            <p className="text-base md:text-lg text-subtle leading-relaxed max-w-md lg:max-w-sm">
              {[
                'For founders, startups, and product teams.',
                'Senior strategy and design from one studio,',
                'no fragmented handoffs.',
              ].map((line, i) => (
                <span key={i} className="overflow-hidden block">
                  <span className="hv2-sub-line block" style={{ opacity: 0 }}>{line}</span>
                </span>
              ))}
            </p>

            <div className="flex flex-row items-stretch gap-3 sm:gap-4">
              <a
                href="https://calendly.com/madebysoni/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="hv2-cta cta-press flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3 sm:py-3.5 bg-base-dark text-base-pure rounded-full font-medium text-sm sm:text-base hover:bg-base-dark-soft whitespace-nowrap"
                style={{ opacity: 0 }}
              >
                <span className="sm:hidden">Book a call</span>
                <span className="hidden sm:inline">Book a strategy call</span>
              </a>
              <a
                href="https://www.figma.com/proto/G2xrMflXEVuDWjMLTEXMPF/Samuel-Irinyemi-Portfolio?page-id=0%3A1&node-id=419-14312&p=f&t=8g3FAs6YuhKaSvfE-0&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=35%3A25506"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View Samuel Irinyemi's Figma portfolio prototype"
                className="hv2-cta cta-press flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-7 py-3 sm:py-3.5 bg-transparent text-base-dark border border-base-dark/20 rounded-full font-medium text-sm sm:text-base hover:bg-base-dark/5 whitespace-nowrap"
                style={{ opacity: 0 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M8 24a4 4 0 0 0 4-4v-4H8a4 4 0 1 0 0 8z" fill="#0ACF83"/>
                  <path d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" fill="#A259FF"/>
                  <path d="M4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" fill="#F24E1E"/>
                  <path d="M12 0h4a4 4 0 0 1 0 8h-4z" fill="#FF7262"/>
                  <path d="M20 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" fill="#1ABCFE"/>
                </svg>
                Figma
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* KineticLouvers — the decorative "stylistic line", rendered as
          a sibling of the constrained containers so it spans the full
          viewport edge-to-edge regardless of the max-w-[1600px] cap on
          the other content. The internal bars cascade in with a
          peak→settle wave (left to right). entryDelay syncs the wave
          start with the rest of the hero timeline. */}
      <div className="mt-12 md:mt-16">
        <KineticLouvers entryDelay={louversEntryDelay} />
      </div>

      {/* Bottom content — back inside a constrained container so the
          showreel and pillars respect the page max width. */}
      <div className="max-w-[1600px] w-full mx-auto px-6 md:px-10">
        {/* Showreel — full native 16:9. With the headline row + louvers
            above it, the bottom portion of the video extends below the
            viewport fold, which is the intended effect (scroll to reveal
            more). The grid of 40 dark tiles overlays the video and fades
            out tile-by-tile (random order, tight stagger) to create a
            mosaic / signal-locking reveal. Reduced-motion users get the
            tiles hidden up-front and see the video immediately. */}
        <div
          className="hv2-reel relative w-full aspect-video overflow-hidden bg-base-dark mt-8 md:mt-12"
          style={{ opacity: 0 }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <VideoSources src={`${import.meta.env.BASE_URL}showreel.mp4`} />
          </video>

          {/* Blinds overlay — 8 vertical column tiles, white so the
              showreel area reads as empty page space at rest. Each tile
              slides DOWN off the frame, one by one (left-to-right), to
              reveal the video underneath column by column.
              pointer-events-none so the tiles don't intercept clicks. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-8 pointer-events-none"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="hv2-tile bg-base-pure" />
            ))}
          </div>
        </div>

        {/* Pillars band — unchanged from original Hero. */}
        <div className="mt-12 md:mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {pillars.map((p) => (
              <div
                key={p.num}
                className="hv2-pillar pt-5 border-t border-base-border flex flex-col"
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
    </section>
  )
}
