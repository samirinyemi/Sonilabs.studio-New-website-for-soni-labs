import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../utils/motion'

// Each engagement type has its own cadence. The home page renders only the
// Brand + Website timeline (via <ProcessAlt />); the dedicated /process page
// shows all three so visitors comparing engagement options can see the full
// rhythm of each.
const processes = [
  {
    eyebrow: '// Brand + Website',
    title: 'From first call to launch in 4 weeks.',
    body: 'How our flagship service moves from brief to live site.',
    steps: [
      { num: '01', week: 'Week 1', title: 'Discovery',      body: 'Brand strategy session, market scan, audience definition, site map and content plan. We define what success looks like before any visuals start.' },
      { num: '02', week: 'Week 2', title: 'Direction',      body: 'Visual concepts, logo explorations, type and colour directions. You pick one direction, we lock it. No surprises later.' },
      { num: '03', week: 'Week 3', title: 'System build',   body: 'Final logo, type system, colour system, brand guidelines, and web design across the selected pages. Identity and site grow together.' },
      { num: '04', week: 'Week 4', title: 'Build & launch', body: 'No-code build in Framer, Webflow, or Wix Studio, accelerated by AI-assisted development. CMS, analytics, SEO basics, QA on staging, then we deploy and hand you the keys.' },
    ],
  },
  {
    eyebrow: '// Product Design',
    title: 'UI/UX in 4–6 weeks. Polished and ready for handoff.',
    body: 'For startups shaping a digital product, designed for your engineering team to build.',
    steps: [
      { num: '01', week: 'Weeks 1–2', title: 'Discovery',          body: 'Product audit, user flow mapping, information architecture, and scope lock. We agree on the surfaces we\'re shipping before anything is drawn.' },
      { num: '02', week: 'Weeks 3–5', title: 'Design',             body: 'End-to-end UI/UX across the chosen surfaces, plus a working design system and an interactive prototype your team can test internally.' },
      { num: '03', week: 'Week 6',    title: 'Polish & handoff',   body: 'Design QA, engineering documentation, component-level annotations, and a walkthrough with your build team. We stay reachable through implementation.' },
    ],
  },
  {
    eyebrow: '// Design Partner',
    title: 'A typical month with the studio embedded in your team.',
    body: 'Ongoing engagement. Sprint planning to retro, every month.',
    steps: [
      { num: '01', week: 'Week 1', title: 'Sprint planning',  body: 'Priority lock against your roadmap. First deliverables shipped by end of week so the rhythm starts immediately.' },
      { num: '02', week: 'Week 2', title: 'Active design',     body: 'Daily iteration inside your tools (Figma, Slack, your standups). The studio works as part of the team, not a vendor.' },
      { num: '03', week: 'Week 3', title: 'Ship and refine',   body: 'Whatever ships next that month: features, pages, assets, brand expressions. Continuous review with your product and engineering leads.' },
      { num: '04', week: 'Week 4', title: 'Strategy review',   body: 'Retro on the month. Wins, lessons, what\'s carrying into next month\'s priorities. Roadmap refresh together.' },
    ],
  },
]

function ProcessSection({ process }) {
  return (
    <section className="proc-block w-full py-20 md:py-28 px-4 md:px-6 bg-white border-t border-base-border">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header */}
        <div className="proj-reveal proc-section-header text-center mb-12 md:mb-20">
          <p className="font-mono text-accent-red text-sm font-bold uppercase tracking-widest mb-4">
            {process.eyebrow}
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-base-dark max-w-2xl mx-auto leading-tight">
            {process.title}
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto mt-6 leading-relaxed">
            {process.body}
          </p>
        </div>

        {/* Numbered timeline */}
        <div className="proc-rows border-t border-base-border">
          {process.steps.map((step) => (
            <div
              key={step.num}
              className="proj-reveal proc-row grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-3 py-10 md:py-14 border-b border-base-border"
            >
              <div className="col-span-12 md:col-span-2">
                <span className="font-mono text-4xl md:text-5xl font-normal text-base-dark leading-none">
                  {step.num}
                </span>
              </div>
              <div className="col-span-12 md:col-span-3">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-2">
                  {step.week}
                </p>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-base-dark leading-tight">
                  {step.title}
                </h3>
              </div>
              <div className="col-span-12 md:col-span-7">
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ApproachPage() {
  const containerRef = useRef(null)

  // Reveal-on-scroll via IntersectionObserver — bypasses GSAP/ScrollTrigger
  // so reveals aren't thrown off by Lenis smooth-scroll or the route fade-in.
  // Elements already in the viewport at page-land reveal immediately.
  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const els = root.querySelectorAll('.proj-reveal')
    if (!els.length) return
    if (prefersReducedMotion()) {
      els.forEach((el) => el.classList.add('proj-revealed'))
      return
    }
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
  }, [])

  return (
    <div ref={containerRef}>
      <h1 className="sr-only">Approach — Soni Labs Studio</h1>

      {/* Hero image — Processes.png. Container aspect (40:11) matches the
          source's native 1200×330 so the image fills the frame without
          cropping or letterboxing. */}
      <section className="w-full pt-2 md:pt-4 pb-0 px-4 md:px-6">
        <div className="proj-reveal max-w-[1600px] mx-auto">
          <div className="relative w-full aspect-[40/11] overflow-hidden bg-base-dark">
            <img
              src={`${import.meta.env.BASE_URL}Processes.png`}
              alt="Soni Labs process diagram"
              loading="eager"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Page hero copy */}
      <section className="w-full pt-12 md:pt-16 pb-16 md:pb-24 px-4 md:px-6 bg-white">
        <div className="proj-reveal proc-page-hero max-w-[1600px] mx-auto">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">// Approach</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.05] text-base-dark mb-8 md:mb-10">
            Three engagements.
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl">
            Each engagement follows its own process, tuned to what&rsquo;s being built and how the team works. Here&rsquo;s how Brand + Website, Product Design, and Design Partner each move from brief to final product.
          </p>
        </div>
      </section>

      {processes.map((p, i) => (
        <ProcessSection key={i} process={p} />
      ))}
    </div>
  )
}
