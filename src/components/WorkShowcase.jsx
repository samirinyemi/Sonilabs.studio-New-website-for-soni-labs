import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function WorkShowcase() {
  const container = useRef(null)

  useGSAP(() => {
    gsap.from('.ws-header', {
      y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.ws-header', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.ws-project', {
      y: 100, opacity: 0, duration: 1, stagger: 0.25, ease: 'power3.out',
      scrollTrigger: { trigger: '.ws-projects', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
  }, { scope: container })

  return (
    <section ref={container} id="work" className="w-full py-20 md:py-40 px-4 md:px-6 bg-base-light border-t border-base-border">
      <div className="max-w-7xl mx-auto">
        <div className="ws-header mb-12 md:mb-20">
          <h2 className="font-mono text-accent-orange text-sm font-bold uppercase tracking-widest mb-4">// Portfolio</h2>
          <h3 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark">Selected Work</h3>
        </div>

        <div className="ws-projects flex flex-col gap-20">

          {/* Project 0 — Browser Mockup */}
          <div className="ws-project group cursor-pointer">
            <div className="bg-white rounded-[12px] border border-base-border overflow-hidden p-4 flex flex-col">
              {/* Browser chrome */}
              <div className="h-8 w-full border-b border-base-border flex items-center px-4 gap-2 mb-4 bg-white rounded-t-[6px]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
              </div>

              {/* Bento grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                {/* Video placeholder */}
                <div className="md:col-span-2 bg-gray-200 rounded-[6px] relative overflow-hidden flex items-center justify-center" style={{ aspectRatio: '4 / 3' }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-200/30 to-gray-300/30"></div>
                  <div className="relative z-10 w-14 h-14 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-base-dark ml-1">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>

                {/* Right column */}
                <div className="flex flex-col gap-4">
                  {/* Image placeholder */}
                  <div className="bg-gray-200 rounded-[6px] relative overflow-hidden flex-1 min-h-[140px]">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-200/50 to-gray-300/50"></div>
                  </div>

                  {/* Text placeholder */}
                  <div className="bg-white rounded-[6px] border border-base-border p-5 flex flex-col justify-center min-h-[70px]">
                    <div className="w-3/4 h-3 bg-gray-200 rounded-full mb-3"></div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mb-2"></div>
                    <div className="w-full h-2 bg-gray-100 rounded-full mb-2"></div>
                    <div className="w-2/3 h-2 bg-gray-100 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project 1 — Bento Grid / Lime SaaS Style */}
          <div className="ws-project group cursor-pointer">
            <div className="bg-white rounded-[12px] border border-base-border overflow-hidden p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {/* Left column — stacked cards */}
                <div className="flex flex-col gap-4 md:gap-5">
                  <div className="bg-gray-200 rounded-[6px] flex-[2] overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-200/50 to-gray-300/50"></div>
                  </div>

                  <div className="bg-accent-orange rounded-[6px] p-4 py-6 flex flex-col justify-center relative overflow-hidden">
                    <h4 className="font-display text-lg font-bold text-white mb-1">Fixed monthly rate</h4>
                    <p className="text-white/70 text-xs leading-relaxed">No surprises, enjoy a consistent, fixed price every month.</p>
                  </div>
                </div>

                {/* Right — Video placeholder spanning 2 cols */}
                <div className="md:col-span-2 bg-gray-200 rounded-[6px] overflow-hidden relative" style={{ aspectRatio: '4 / 3' }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-300/30 to-gray-400/30 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-base-dark ml-1">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project 2 — Dot Matrix / Halftone / Bold Typography */}
          <div className="ws-project group cursor-pointer">
            <div className="bg-white rounded-[12px] border border-base-border overflow-hidden p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 rounded-[6px] overflow-hidden">
                {/* Card Left */}
                <div className="bg-base-light rounded-[6px] flex flex-col justify-between min-h-[530px] overflow-hidden">
                  <div className="p-4 md:p-6 flex-shrink-0">
                    <h4 className="font-display text-lg font-bold text-base-dark mb-2">Our Vision</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">Turning today's ambitions into tomorrow's realities through innovation, vision, and technology.</p>
                  </div>
                  <div className="bg-gray-200 rounded-[6px] flex-1 min-h-[200px] relative mx-2 mb-2">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-200/50 to-gray-300/50 rounded-[6px]"></div>
                  </div>
                </div>

                {/* Card Right — Video Placeholder */}
                <div className="md:col-span-2 bg-gray-300 rounded-[6px] flex items-center justify-center relative overflow-hidden" style={{ aspectRatio: '4 / 3' }}>
                  <div className="absolute inset-0 bg-gradient-to-b from-gray-200/50 to-gray-400/50"></div>
                  <div className="relative z-10 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-base-dark ml-1">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project 3 — Video Placeholder */}
          <div className="ws-project group cursor-pointer">
            <div className="bg-white rounded-[12px] border border-base-border overflow-hidden p-4">
              <div className="bg-gray-200 rounded-[6px] overflow-hidden relative" style={{ aspectRatio: '16 / 9' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-gray-300/30 to-gray-400/30 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-base-dark ml-1">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-accent-orange rounded-[6px] p-6 py-10 flex flex-col justify-center relative overflow-hidden mt-4">
                <h4 className="font-display text-lg font-bold text-white mb-1">Project showcase</h4>
                <p className="text-white/70 text-xs leading-relaxed">A complete website build from concept to launch, featuring custom design, development, and AI automation.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
