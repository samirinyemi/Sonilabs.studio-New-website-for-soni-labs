import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function ProcessAlt() {
  const container = useRef(null)

  useGSAP(() => {
    gsap.from('.pa-header', {
      y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.pa-header', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.pa-card', {
      y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.pa-grid', start: 'top 80%', toggleActions: 'play none none reverse' },
    })
  }, { scope: container })

  return (
    <section ref={container} className="w-full py-20 md:py-40 px-4 md:px-6 bg-base-light border-y border-base-border bg-dots">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="pa-header text-center mb-12 md:mb-20">
          <h2 className="font-mono text-accent-orange text-sm font-bold uppercase tracking-widest mb-4">// Process</h2>
          <h3 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark max-w-2xl mx-auto">From first call to live site in 2–4 weeks.</h3>
        </div>

        {/* Bento grid — 3 columns */}
        <div className="pa-grid grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* ── Column 1 — Discovery (spans 2 rows) ── */}
          <div className="pa-card bg-white rounded-[12px] border border-base-border p-6 md:p-10 flex flex-col justify-between md:row-span-2">
            <div className="font-mono text-6xl leading-none font-normal text-base-dark">01</div>
            <div>
              <h4 className="font-display text-2xl font-bold text-base-dark mb-2">Discovery</h4>
              <p className="font-mono text-xs text-accent-orange uppercase tracking-wider mb-4">2–3 Days</p>
              <p className="text-gray-600 text-sm leading-relaxed">Understand business goals, audience, and success metrics. Map out site architecture and requirements before a single pixel is drawn.</p>
            </div>
          </div>

          {/* ── Column 2 — Design ── */}
          <div className="pa-card bg-base-dark rounded-[12px] p-6 md:p-10 flex flex-col justify-between min-h-[280px] md:min-h-[360px] text-white">
            <div className="font-mono text-6xl leading-none font-normal text-white">02</div>
            <div>
              <h4 className="font-display text-2xl font-bold text-white mb-2">Design</h4>
              <p className="font-mono text-xs text-accent-orange uppercase tracking-wider mb-4">3–5 Days</p>
              <p className="text-gray-400 text-sm leading-relaxed">Visual concepts grounded in your brand. High-fidelity mockups of key pages — we iterate until you approve the direction before a line of code is written.</p>
            </div>
          </div>

          {/* ── Column 3 — Build ── */}
          <div className="pa-card bg-base-dark rounded-[12px] overflow-hidden relative min-h-[280px] md:min-h-[360px] flex flex-col">
            <div className="absolute inset-0 bg-dots-dark opacity-30"></div>
            <div className="relative z-10 p-6 md:p-10 flex flex-col justify-between h-full">
              <div className="font-mono text-6xl leading-none font-normal text-white">03</div>
              <div>
                <h4 className="font-display text-2xl font-bold text-white mb-2">Build</h4>
                <p className="font-mono text-xs text-accent-orange uppercase tracking-wider mb-4">5–10 Days</p>
                <p className="text-gray-400 text-sm leading-relaxed">Design becomes a live site in Framer, Webflow, or Wix Studio. You get a staging link to review the fully responsive site before it goes live.</p>
              </div>
            </div>
          </div>

          {/* ── Row 2 — Launch & Automate (columns 2-3) ── */}
          <div className="pa-card bg-white rounded-[12px] border border-base-border p-6 md:p-10 flex flex-col justify-between min-h-[280px] md:col-span-2">
            <div className="font-mono text-6xl leading-none font-normal text-base-dark">04</div>
            <div>
              <h4 className="font-display text-2xl font-bold text-base-dark mb-2">Launch</h4>
              <p className="font-mono text-xs text-accent-orange uppercase tracking-wider mb-4">2–3 Days</p>
              <p className="text-gray-600 text-sm leading-relaxed">Final polish, deploy, SEO basics, forms set up. Handover and training so you can manage your own site — then we hand you the keys.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
