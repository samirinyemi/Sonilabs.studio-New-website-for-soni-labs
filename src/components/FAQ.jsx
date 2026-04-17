import { useState, useRef, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useSanityData } from '../hooks/useSanityData'

const fallbackFaqData = [
  { question: 'How do payments work?', answer: '50% upfront before work begins, 50% on delivery. We accept international transfers via Wise or direct bank transfer.' },
  { question: "What's the typical timeline?", answer: 'Most projects go from first call to live site in 2–4 weeks depending on scope.' },
  { question: 'Do you work with international clients?', answer: 'Yes, most clients are based in the US, Australia, UK, and Europe. We work fully remote and async-friendly.' },
  { question: 'What if I need changes after launch?', answer: 'Every project includes one round of revisions. Additional changes can be scoped separately or covered under a retainer.' },
  { question: 'What tech stack do you use?', answer: 'Figma for design. Framer, Webflow, or Wix Studio for development. AI-assisted development for faster delivery.' },
  { question: 'Can you help with ongoing design work?', answer: 'Yes, the Embedded Design Partner retainer is built for exactly that.' },
]

const FAQ_QUERY = `*[_type == "faq"] | order(order asc) { question, answer }`

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null)
  const sectionRef = useRef(null)
  const contentRefs = useRef([])
  const iconRefs = useRef([])
  const isAnimating = useRef(false)
  const { data: faqData } = useSanityData(FAQ_QUERY, fallbackFaqData)

  useGSAP(() => {
    gsap.from('.faq-container', {
      y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.faq-container', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
  }, { scope: sectionRef })

  const toggle = useCallback((i) => {
    if (isAnimating.current) return
    isAnimating.current = true

    const contentEl = contentRefs.current[i]
    const iconEl = iconRefs.current[i]
    const isOpening = activeIndex !== i

    if (isOpening) {
      // Close currently open item first
      if (activeIndex !== null) {
        const prevContent = contentRefs.current[activeIndex]
        const prevIcon = iconRefs.current[activeIndex]

        gsap.to(prevContent, {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'power3.inOut',
        })
        gsap.to(prevIcon, {
          rotation: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        })
      }

      // Open the new item
      // Set height to auto to measure, then animate from 0
      gsap.set(contentEl, { height: 'auto', opacity: 1 })
      const fullHeight = contentEl.scrollHeight
      gsap.fromTo(contentEl,
        { height: 0, opacity: 0 },
        {
          height: fullHeight,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          onComplete: () => {
            gsap.set(contentEl, { height: 'auto' })
            isAnimating.current = false
          },
        }
      )
      gsap.to(iconEl, {
        rotation: 180,
        duration: 0.4,
        ease: 'back.out(1.7)',
      })

      setActiveIndex(i)
    } else {
      // Close the current item
      gsap.to(contentEl, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.inOut',
        onComplete: () => {
          isAnimating.current = false
        },
      })
      gsap.to(iconEl, {
        rotation: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      })

      setActiveIndex(null)
    }
  }, [activeIndex])

  return (
    <section ref={sectionRef} id="faq" className="w-full py-20 md:py-40 px-4 md:px-6 bg-[#FAFAFA] border-t border-base-border">
      <div className="faq-container max-w-7xl mx-auto border border-base-border rounded-[12px] overflow-hidden">
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-8 border-b border-base-border flex flex-col justify-center bg-[#FAFAFA]">
            <p className="font-mono text-sm font-bold uppercase tracking-widest text-base-dark mb-2">
              <span className="text-accent-orange mr-2">&#9642;</span>Most Common Questions
            </p>
            <p className="text-gray-500 text-sm font-mono lowercase">No worries, here you can find all the answers</p>
          </div>

          {/* Accordion */}
          <div className="flex flex-col w-full bg-[#FAFAFA]">
            {faqData.map((item, i) => (
              <div key={i} className={`${i < faqData.length - 1 ? 'border-b border-base-border' : ''} w-full`}>
                <button
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-[#E0E0E0] transition-colors duration-200 focus:outline-none"
                  onClick={() => toggle(i)}
                  aria-expanded={activeIndex === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="font-mono text-sm font-medium text-base-dark w-11/12">{item.question}</span>
                  <div
                    ref={(el) => (iconRefs.current[i] = el)}
                    className="w-8 h-8 bg-accent-orange text-white flex items-center justify-center rounded-sm shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" className="faq-plus-vertical" style={{ transformOrigin: 'center', opacity: activeIndex === i ? 0 : 1 }} />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </button>
                <div
                  ref={(el) => (contentRefs.current[i] = el)}
                  id={`faq-answer-${i}`}
                  role="region"
                  className="overflow-hidden px-6 text-sm text-gray-600 font-sans max-w-3xl"
                  style={{ height: 0, opacity: 0 }}
                >
                  <p className="pb-6">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
