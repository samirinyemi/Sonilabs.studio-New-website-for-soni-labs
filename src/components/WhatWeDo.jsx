import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'

// "Everything under one roof" — section header + flat list of disciplines.
// Extracted from the old Capabilities component so the home page can render
// just this piece without the surrounding "How we do it" rows.
const whatWeDo = [
  'Web design',
  'Brand strategy',
  'Brand identity',
  'Logo & visual systems',
  'Product design (UI/UX)',
  'Design systems',
  'No-code development',
  'AI-assisted development',
  'Motion & micro-interactions',
]

export default function WhatWeDo() {
  const container = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('.wwd-item', {
      y: 20, opacity: 0, duration: 0.6, stagger: 0.04, ease: 'power3.out',
      scrollTrigger: { trigger: '.wwd-list', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
  }, { scope: container })

  return (
    <section ref={container} id="capabilities" className="w-full py-20 md:py-28 px-4 md:px-6 bg-base-pure">
      <div className="max-w-[1600px] mx-auto">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6">// What we do</p>
          <ul className="wwd-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 border-t border-base-border pt-6">
            {whatWeDo.map((item, i) => (
              <li
                key={item}
                className="wwd-item flex items-center gap-3 py-2 text-base md:text-lg text-base-dark"
              >
                <span className="font-mono text-xs text-accent-red shrink-0 w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
