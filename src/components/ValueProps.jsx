import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ValueProps() {
  const container = useRef(null)

  useGSAP(() => {
    // Heading reveal
    gsap.from('.vp-heading', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.vp-heading',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })

    // Body text
    gsap.from('.vp-body', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.vp-body',
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    })

    // Cards stagger
    gsap.from('.vp-card', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.vp-cards',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })
  }, { scope: container })

  return (
    <section ref={container} className="w-full py-20 md:py-40 px-4 md:px-6 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-dots opacity-40"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Two-column text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-16">
          <div>
            <h2 className="vp-heading font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-base-dark leading-tight">Your website should bring you clients, not just look good.</h2>
          </div>
          <div className="flex items-center">
            <p className="vp-body text-gray-600 text-lg leading-relaxed">Most businesses hire a designer for the visuals, then a separate developer to build it. That means multiple handoffs, miscommunication, inflated costs, and timelines that stretch for months. Soni Labs is different — one person handles your design and development together, so your website is built exactly as designed, without anything getting lost in translation.</p>
          </div>
        </div>

        {/* Three cards */}
        <div className="vp-cards grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="vp-card bg-base-light p-8 rounded-[12px] border border-base-border flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-accent-orange/10 text-accent-orange flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-base-dark mb-3">One Studio, Zero Handoffs</h3>
            <p className="text-gray-600 text-sm leading-relaxed flex-grow">Design, development, and automation from one person. No miscommunication between separate teams.</p>
          </div>

          {/* Card 2 */}
          <div className="vp-card bg-base-light p-8 rounded-[12px] border border-base-border flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-accent-lime/20 text-base-dark flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.387-1 1.732V11h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1" />
                <path d="M12 19v2" />
                <path d="M9 17h6" />
                <path d="M10 11V5.732A2 2 0 0 1 9 4a2 2 0 0 1 2-2" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-base-dark mb-3">Designed and built by the same person</h3>
            <p className="text-gray-600 text-sm leading-relaxed flex-grow">The designer is the developer. Design intent is preserved all the way through to the final build — no translation required.</p>
          </div>

          {/* Card 3 */}
          <div className="vp-card bg-base-light p-8 rounded-[12px] border border-base-border flex flex-col">
            <div className="w-14 h-14 rounded-2xl bg-base-dark text-white flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-base-dark mb-3">Looks premium, works even harder</h3>
            <p className="text-gray-600 text-sm leading-relaxed flex-grow">A trained design eye means your site looks sharp and earns trust — while smart structure and clear messaging do the heavy lifting.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
