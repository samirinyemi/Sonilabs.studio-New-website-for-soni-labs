import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

export default function Manifesto() {
  const ref = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('.manifesto-eyebrow', {
      y: 20, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.manifesto-eyebrow', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.manifesto-line', {
      y: 40, opacity: 0, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '.manifesto-line', start: 'top 85%', toggleActions: 'play none none reverse' },
      delay: 0.1,
    })
  }, { scope: ref })

  return (
    <section
      ref={ref}
      className="w-full py-28 md:py-40 px-6 md:px-10 bg-base-pure border-t border-b border-base-border"
    >
      <div className="max-w-5xl mx-auto text-center">
        <p className="manifesto-eyebrow font-mono text-xs uppercase tracking-[0.2em] text-muted mb-8 md:mb-10">
          // How we work
        </p>
        <p className="manifesto-line font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-base-dark leading-[1.1]">
          Senior taste. Modern tooling. Shipped on time.
        </p>
      </div>
    </section>
  )
}
