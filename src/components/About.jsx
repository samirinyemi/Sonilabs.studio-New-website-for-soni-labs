import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

export default function About() {
  const container = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('.about-eyebrow', {
      y: 30, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-eyebrow', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.about-headline', {
      y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-headline', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.about-para', {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-paras', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.about-founder', {
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-founder', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
  }, { scope: container })

  return (
    <section ref={container} id="about" className="w-full py-20 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12 md:mb-16">
          <p className="about-eyebrow font-mono text-xs uppercase tracking-[0.2em] text-gray-500 mb-6">// The studio</p>
          <h2 className="about-headline font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark leading-tight max-w-3xl">
            A studio. Not a single freelancer.
          </h2>
        </div>

        <div className="about-paras grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7 space-y-6">
            <p className="about-para text-gray-700 text-lg leading-relaxed">
              Soni Labs is a design studio led by Samuel Irinyemi, working with a small bench of trusted collaborators across brand, motion, and engineering. We work with founders and product teams who care about how things feel, not just how they look.
            </p>
            <p className="about-para text-gray-700 text-lg leading-relaxed">
              We&rsquo;re based in Lagos and work with clients across the US, UK, Europe, and Australia. Senior taste, modern tooling, and a relationship that lasts beyond the launch.
            </p>
          </div>

          <div className="about-founder lg:col-span-5">
            <div className="bg-white rounded-[12px] border border-base-border p-6 md:p-8 flex items-center gap-4 md:gap-5">
              <div className="w-16 h-16 rounded-full bg-base-dark flex items-center justify-center text-white font-display font-bold text-2xl shrink-0">S</div>
              <div>
                <p className="font-display font-bold text-lg text-base-dark">Samuel Irinyemi</p>
                <p className="font-mono text-xs uppercase tracking-wider text-gray-500 mt-1">Founder &middot; Soni Labs</p>
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">Designing brand systems, products, and websites for over a decade.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
