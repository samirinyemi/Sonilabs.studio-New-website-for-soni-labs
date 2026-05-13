import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

const CALENDLY_URL = 'https://calendly.com/madebysoni/30min'

export default function Contact() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('.contact-eyebrow', {
      y: 30, opacity: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-card', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.contact-headline', {
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-card', start: 'top 85%', toggleActions: 'play none none reverse' },
      delay: 0.1,
    })
    gsap.from('.contact-body', {
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-card', start: 'top 85%', toggleActions: 'play none none reverse' },
      delay: 0.2,
    })
    gsap.from('.contact-cta', {
      y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-card', start: 'top 85%', toggleActions: 'play none none reverse' },
      delay: 0.3,
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="contact" className="w-full bg-base-pure pt-16 md:pt-20 pb-16 md:pb-24 px-4 md:px-6">
      <div className="contact-card max-w-4xl mx-auto text-center py-16 md:py-24">
        <p className="contact-eyebrow font-mono text-xs uppercase tracking-[0.2em] text-muted mb-8">// Get in touch</p>

        <h2 className="contact-headline font-display text-5xl md:text-6xl lg:text-7xl font-bold text-base-dark tracking-tighter leading-[1.05] mb-8">
          Let&rsquo;s build what&rsquo;s next.
        </h2>

        <p className="contact-body text-subtle text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
          A 30-minute strategy call. We&rsquo;ll diagnose what you need, suggest a path, and decide together if we&rsquo;re a fit. No pitch, no pressure.
        </p>

        <div className="contact-cta flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-press inline-flex items-center gap-3 px-10 py-5 bg-base-dark text-base-pure rounded-full font-medium text-lg hover:bg-base-dark-soft"
          >
            Book a call
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a
            href="mailto:hello@madebysoni.com"
            className="cta-press inline-flex items-center gap-3 px-10 py-5 bg-transparent text-base-dark border border-base-dark/20 rounded-full font-medium text-lg hover:bg-base-dark/5"
          >
            Or email instead
          </a>
        </div>
      </div>
    </section>
  )
}
