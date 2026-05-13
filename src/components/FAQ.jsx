import { useState, useRef, useCallback, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Helmet } from 'react-helmet-async'
import { useSanityData } from '../hooks/useSanityData'
import { prefersReducedMotion } from '../utils/motion'

const fallbackFaqData = [
  {
    question: 'Which package is right for me?',
    answer: 'If you’re starting from scratch or rebranding, start with Brand + Website. If you already have a brand and need a digital product designed (UI/UX for your engineering team to build), that’s Product Design. If you have ongoing design needs and don’t want to hire full-time, the Design Partner retainer covers everything across brand, web, and product.',
  },
  {
    question: 'What platforms do you build on?',
    answer: 'Marketing sites: Framer, Webflow, or Wix Studio, depending on your CMS and team setup. For digital products, we design the UI/UX and hand off to your engineering team. We can work inside your existing stack and tooling.',
  },
  {
    question: 'What does the Design Partner retainer include month to month?',
    answer: 'A dedicated senior designer working as part of your team. Typically 30–40 hours of design output per week across product features, marketing pages, and brand assets. We use your tools, join your standups, and operate on your roadmap.',
  },
  {
    question: 'Can you work with my existing brand guidelines?',
    answer: 'Yes. If you already have a brand system, we work inside it. If your guidelines are thin, we extend them as we go.',
  },
  {
    question: 'How do payments work?',
    answer: 'Project work: 50% to start, 50% on delivery. Retainers: invoiced monthly in advance. We work in USD or NGN.',
  },
  {
    question: 'Do you offer revisions?',
    answer: 'Two rounds are built into project work. Retainer clients work iteratively, so revisions happen continuously rather than in formal rounds.',
  },
  {
    question: 'How do we get started?',
    answer: 'Book a strategy call. We’ll diagnose what you need (no pitch, no pressure) and either propose a package or recommend a different path.',
  },
]

const FAQ_QUERY = `*[_type == "faq"] | order(order asc) { question, answer }`

export default function FAQ() {
  // First question is open by default — matches the layout in the spec.
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef(null)
  const contentRefs = useRef([])
  const iconRefs = useRef([])
  const isAnimating = useRef(false)
  const { data: faqData } = useSanityData(FAQ_QUERY, fallbackFaqData)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('.faq-container', {
      y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.faq-container', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
  }, { scope: sectionRef })

  // Open the first item's panel on mount so it matches the default
  // active state (without this the height stays 0 from the inline style).
  useEffect(() => {
    if (activeIndex == null) return
    const el = contentRefs.current[activeIndex]
    const icon = iconRefs.current[activeIndex]
    if (el) gsap.set(el, { height: 'auto', opacity: 1 })
    if (icon) gsap.set(icon, { rotation: 180 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = useCallback((i) => {
    if (isAnimating.current) return
    isAnimating.current = true

    const contentEl = contentRefs.current[i]
    const iconEl = iconRefs.current[i]
    const isOpening = activeIndex !== i

    if (isOpening) {
      // Close the previously open item first.
      if (activeIndex !== null) {
        const prevContent = contentRefs.current[activeIndex]
        const prevIcon = iconRefs.current[activeIndex]
        gsap.to(prevContent, { height: 0, opacity: 0, duration: 0.4, ease: 'power3.inOut' })
        gsap.to(prevIcon, { rotation: 0, duration: 0.3, ease: 'power2.inOut' })
      }

      gsap.set(contentEl, { height: 'auto', opacity: 1 })
      const fullHeight = contentEl.scrollHeight
      gsap.fromTo(contentEl,
        { height: 0, opacity: 0 },
        {
          height: fullHeight, opacity: 1, duration: 0.5, ease: 'power3.out',
          onComplete: () => {
            gsap.set(contentEl, { height: 'auto' })
            isAnimating.current = false
          },
        }
      )
      gsap.to(iconEl, { rotation: 180, duration: 0.4, ease: 'power2.out' })
      setActiveIndex(i)
    } else {
      gsap.to(contentEl, {
        height: 0, opacity: 0, duration: 0.4, ease: 'power3.inOut',
        onComplete: () => { isAnimating.current = false },
      })
      gsap.to(iconEl, { rotation: 0, duration: 0.3, ease: 'power2.inOut' })
      setActiveIndex(null)
    }
  }, [activeIndex])

  // FAQPage schema lets Google show these as a rich snippet directly
  // in search results — high-value SEO addition for studio sites.
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <section ref={sectionRef} id="faq" className="w-full py-20 md:py-32 px-4 md:px-6 bg-base-pure">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      <div className="faq-container max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
        {/* Left column — title + subtitle */}
        <div className="md:col-span-6">
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark leading-tight mb-5">
            FAQs
          </h2>
          <p className="text-muted text-base leading-relaxed max-w-xs">
            Quick answers about our process, timelines, and how we typically work with new clients.
          </p>
        </div>

        {/* Right column — list of questions. Half-width to match the
            Design Partner card on the pricing layout. */}
        <div className="md:col-span-6">
          <ul className="border-t border-base-border">
            {faqData.map((item, i) => (
              <li key={i} className="border-b border-base-border">
                <h3 className="m-0">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={activeIndex === i}
                    aria-controls={`faq-answer-${i}`}
                    className="w-full flex items-center justify-between gap-6 py-5 md:py-6 text-left text-base-dark hover:text-base-dark/80 transition-colors"
                  >
                    <span className="font-display text-base md:text-lg font-medium leading-snug">
                      {item.question}
                    </span>
                    <span
                      ref={(el) => (iconRefs.current[i] = el)}
                      className="shrink-0 inline-flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>
                </h3>
                <div
                  ref={(el) => (contentRefs.current[i] = el)}
                  id={`faq-answer-${i}`}
                  role="region"
                  className="overflow-hidden"
                  style={{ height: 0, opacity: 0 }}
                >
                  <p className="text-subtle text-sm md:text-base leading-relaxed pb-6 max-w-2xl">
                    {item.answer}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
