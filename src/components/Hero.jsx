import { useState, useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Hero() {
  const words = ['clients.', 'customers.', 'leads.']
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const wordIndexRef = useRef(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const currentWord = words[wordIndexRef.current]
    let timeout

    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1))
        }, 100)
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 5000)
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1))
        }, 60)
      } else {
        wordIndexRef.current = (wordIndexRef.current + 1) % words.length
        setIsDeleting(false)
      }
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting])

  // Line-by-line reveal animation
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // Badge
    tl.fromTo('.hero-badge',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      0.2
    )

    // Heading lines — staggered mask reveal
    tl.fromTo('.hero-line',
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.8, stagger: 0.15 },
      0.5
    )

    // Subtext
    tl.fromTo('.hero-subtext',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      1.1
    )

    // Buttons
    tl.fromTo('.hero-buttons',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      1.3
    )

    // Scroll indicator
    tl.fromTo('.hero-scroll',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      1.6
    )

    // Decorative elements
    tl.fromTo('.hero-line-h, .hero-line-v',
      { scaleX: 0, scaleY: 0 },
      { scaleX: 1, scaleY: 1, duration: 1, stagger: 0.1, ease: 'power2.out' },
      0.8
    )
    tl.fromTo('.hero-dot',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(2)' },
      1.2
    )
    tl.fromTo('.hero-label',
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08 },
      1.4
    )
  }, { scope: heroRef })

  return (
    <section ref={heroRef} className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-6 overflow-hidden bg-dots">
      {/* Decorative lines, dots & labels — aligned to the 20px dot grid */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        {/* Horizontal lines — top, center, bottom */}
        <div className="hero-line-h absolute left-0 w-full h-[1px] bg-accent-orange/40 origin-left" style={{ top: 'calc(round(down, 25%, 20px) - 60px)' }}></div>
        <div className="hero-line-h absolute left-0 w-full h-[1px] bg-accent-orange/40 origin-left" style={{ top: 'calc(round(down, 75%, 20px) + 60px)' }}></div>
        {/* Left vertical line — full height, through left dot */}
        <div className="hero-line-v absolute top-0 h-full w-[1px] bg-accent-orange/40 origin-top" style={{ left: 'calc(round(down, 15%, 20px))' }}></div>
        {/* Right vertical line — full height, through right dot */}
        <div className="hero-line-v absolute top-0 h-full w-[1px] bg-accent-orange/40 origin-top" style={{ left: 'calc(round(down, 85%, 20px))' }}></div>
        {/* Connection dots — at intersections of horizontal & side vertical lines */}
        {/* Top horizontal × left & right */}
        <div className="hero-dot absolute w-3 h-3 rounded-full bg-accent-orange" style={{ top: 'calc(round(down, 25%, 20px) - 60px)', left: 'calc(round(down, 15%, 20px))' }}></div>
        <div className="hero-dot absolute w-3 h-3 rounded-full bg-accent-orange" style={{ top: 'calc(round(down, 25%, 20px) - 60px)', left: 'calc(round(down, 85%, 20px))' }}></div>
        {/* Bottom horizontal × left & right */}
        <div className="hero-dot absolute w-3 h-3 rounded-full bg-accent-orange" style={{ top: 'calc(round(down, 75%, 20px) + 60px)', left: 'calc(round(down, 15%, 20px))' }}></div>
        <div className="hero-dot absolute w-3 h-3 rounded-full bg-accent-orange" style={{ top: 'calc(round(down, 75%, 20px) + 60px)', left: 'calc(round(down, 85%, 20px))' }}></div>
        {/* Labels */}
        <span className="hero-label absolute font-mono text-[10px] text-gray-400/70 bg-white px-2" style={{ top: 'calc(round(down, 37%, 20px) - 30px)', left: 'calc(round(down, 13%, 20px))' }}>Design</span>
        <span className="hero-label absolute font-mono text-[10px] text-gray-400/70 bg-white px-2" style={{ top: 'calc(round(down, 37%, 20px) - 30px)', left: 'calc(round(down, 85%, 20px) + 10px)' }}>Code</span>
        <span className="hero-label absolute font-mono text-[10px] text-gray-400/70 bg-white px-2" style={{ top: 'calc(round(down, 63%, 20px) + 30px)', left: 'calc(round(down, 10%, 20px))' }}>Automate</span>
        <span className="hero-label absolute font-mono text-[10px] text-gray-400/70 bg-white px-2" style={{ top: 'calc(round(down, 63%, 20px) + 30px)', left: 'calc(round(down, 85%, 20px) + 10px)' }}>Convert</span>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center -mt-8">
        <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 rounded-full border border-base-border bg-white mb-8 shadow-sm" style={{ opacity: 0 }}>
          <span className="w-2 h-2 rounded-full bg-accent-orange animate-pulse"></span>
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-gray-600">Built with your team, not handed off to them</span>
        </div>

        <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl tracking-tighter leading-[1.05] text-base-dark mb-8 uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
          <span className="overflow-hidden block">
            <span className="hero-line block" style={{ opacity: 0 }}>Design & build websites </span>
          </span>
          <span className="overflow-hidden block">
            <span className="hero-line block" style={{ opacity: 0 }}>/ SaaS products that </span>
          </span>
          <span className="overflow-hidden block">
            <span className="hero-line block" style={{ opacity: 0 }}>bring you <br className="md:hidden" /><span className="text-accent-orange inline-block min-w-[1ch]">{displayText || '\u00A0'}</span></span>
          </span>
        </h1>

        <p className="hero-subtext text-lg md:text-xl text-gray-600 max-w-2xl mb-10 font-medium leading-relaxed" style={{ opacity: 0 }}>
          Premium design, AI-powered development, and lead generation automation from one specialized studio.
        </p>

        <div className="hero-buttons flex flex-col sm:flex-row items-center gap-4" style={{ opacity: 0 }}>
          <a href="#contact" className="w-full sm:w-auto px-8 py-4 bg-accent-orange text-white rounded-full font-medium text-lg hover:bg-[#e64a00] transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,84,0,0.3)] flex items-center justify-center gap-2">
            Start a Project
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
          <a href="#services" className="w-full sm:w-auto px-8 py-4 bg-white text-base-dark border border-base-border rounded-full font-medium text-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
            See Services
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-24 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400" style={{ opacity: 0 }}>
        <span className="font-mono text-xs uppercase tracking-widest">Scroll</span>
      </div>
    </section>
  )
}
