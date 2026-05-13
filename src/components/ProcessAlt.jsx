import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

const steps = [
  {
    num: '01',
    week: 'Week 1',
    title: 'Discovery',
    body: 'Brand strategy session, market scan, audience definition, site map and content plan. We define what success looks like before any visuals start.',
  },
  {
    num: '02',
    week: 'Week 2',
    title: 'Direction',
    body: 'Visual concepts, logo explorations, type and colour directions. You pick one direction, we lock it. No surprises later.',
  },
  {
    num: '03',
    week: 'Week 3',
    title: 'System build',
    body: 'Final logo, type system, colour system, brand guidelines, and web design across the selected pages. Identity and site grow together.',
  },
  {
    num: '04',
    week: 'Week 4',
    title: 'Build & launch',
    body: 'No-code build in Framer, Webflow, or Wix Studio, accelerated by AI-assisted development. CMS, analytics, SEO basics, QA on staging, then we deploy and hand you the keys.',
  },
]

export default function ProcessAlt() {
  const container = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('.pa-header', {
      y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.pa-header', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.pa-row', {
      y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.pa-grid', start: 'top 80%', toggleActions: 'play none none reverse' },
    })
  }, { scope: container })

  return (
    <section ref={container} id="process" className="w-full py-20 md:py-24 px-4 md:px-6 bg-base-pure">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="pa-header text-center mb-12 md:mb-20">
          <p className="font-mono text-accent-red text-sm font-bold uppercase tracking-widest mb-4">// Brand + Website process</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark max-w-2xl mx-auto">From first call to launch in 4 weeks.</h2>
          <p className="text-subtle text-base md:text-lg max-w-xl mx-auto mt-6 leading-relaxed">
            How our flagship service moves from brief to live site. Other engagements follow a similar shape. See each service for its specific timeline.
          </p>
        </div>

        {/* Numbered timeline */}
        <div className="pa-grid border-t border-base-border">
          {steps.map((step) => (
            <div
              key={step.num}
              className="pa-row grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-3 py-10 md:py-14 border-b border-base-border"
            >
              <div className="col-span-12 md:col-span-2">
                <span className="font-mono text-4xl md:text-5xl font-normal text-base-dark leading-none">
                  {step.num}
                </span>
              </div>
              <div className="col-span-12 md:col-span-4">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-red mb-2">
                  {step.week}
                </p>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-base-dark leading-tight">
                  {step.title}
                </h3>
              </div>
              <div className="col-span-12 md:col-span-6">
                <p className="text-subtle text-base md:text-lg leading-relaxed">
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
