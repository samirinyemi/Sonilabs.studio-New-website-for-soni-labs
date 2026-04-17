import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function About() {
  const container = useRef(null)

  useGSAP(() => {
    gsap.from('.about-header', {
      y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-header', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.about-discipline', {
      y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-disciplines', start: 'top 80%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.about-quote', {
      y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-quote', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
  }, { scope: container })

  return (
    <section ref={container} id="about" className="w-full py-20 md:py-40 px-4 md:px-6 bg-base-light relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-dots opacity-30"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="about-header mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
          <div>
            <h2 className="font-mono text-accent-orange text-sm font-bold uppercase tracking-widest mb-4">// The Studio</h2>
            <h3 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark leading-tight">
              One person.<br />Three disciplines.<br />Zero handoffs.
            </h3>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed lg:text-right">
            I'm Samuel, a product designer who builds. I use AI tools like Claude Code to design and ship production-ready sites in weeks, not months.
          </p>
        </div>

        {/* Three disciplines */}
        <div className="about-disciplines bg-white rounded-[12px] p-8 md:p-12 border border-base-border mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="about-discipline flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-accent-orange/10 text-accent-orange flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19l7-7 3 3-7 7-3-3z" />
                  <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                  <path d="M2 2l7.586 7.586" />
                  <circle cx="11" cy="11" r="2" />
                </svg>
              </div>
              <h4 className="font-display text-xl font-bold text-base-dark mb-2">Brand &amp; Product Design</h4>
              <p className="text-gray-600 text-sm leading-relaxed">UI/UX, visual systems, and brand identity — crafted to communicate before you say a word.</p>
            </div>

            <div className="about-discipline flex flex-col items-center text-center p-6 border-y md:border-y-0 md:border-x border-base-border">
              <div className="w-16 h-16 rounded-2xl bg-accent-lime/20 text-base-dark flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <h4 className="font-display text-xl font-bold text-base-dark mb-2">Web Development</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Framer, Webflow, Wix Studio — shipped in weeks, not months.</p>
            </div>

            <div className="about-discipline flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-base-dark text-white flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h4 className="font-display text-xl font-bold text-base-dark mb-2">Ongoing Design Partnership</h4>
              <p className="text-gray-600 text-sm leading-relaxed">Retainer-based support for growing teams — design continuity without the in-house overhead.</p>
            </div>
          </div>
        </div>

        {/* Quote */}
        <div className="about-quote bg-accent-orange rounded-[12px] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[100px]"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-1 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1.5.5 1.5 1.5L5 16c0 1.5.5 2 2 2h0" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.5c0 1.5-.5 2.5-2 3.5" />
              </svg>
            </div>
            <div className="lg:col-span-8">
              <p className="text-xl md:text-2xl font-display font-bold text-white leading-snug">
                "Good design isn't decoration. It's how your business earns trust before you say a word."
              </p>
            </div>
            <div className="lg:col-span-3 flex items-center gap-4 lg:justify-end">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">S</div>
              <div>
                <p className="font-bold text-white">Samuel</p>
                <p className="text-sm text-white/60 font-mono uppercase">Founder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
