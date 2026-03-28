import { useState, useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isFloating, setIsFloating] = useState(false)
  const topNavRef = useRef(null)
  const floatingNavRef = useRef(null)
  const menuPanelRef = useRef(null)
  const menuItemsRef = useRef([])
  const hamburgerTopRef = useRef(null)
  const hamburgerMidRef = useRef(null)
  const hamburgerBotRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const mobileMenuItemsRef = useRef([])

  // Navbar entrance animation on load
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo('.nav-logo',
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6 },
      0.1
    )
    tl.fromTo('.nav-link',
      { y: -15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
      0.3
    )
    tl.fromTo('.nav-cta',
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6 },
      0.5
    )
  }, { scope: topNavRef })

  // ScrollTrigger: detect when to switch to floating nav
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: 'main',
      start: 'top -100vh',
      onEnter: () => setIsFloating(true),
      onLeaveBack: () => {
        setIsFloating(false)
        setMenuOpen(false)
        setMobileMenuOpen(false)
      },
    })
  })

  // Animate floating nav in/out
  useEffect(() => {
    if (!floatingNavRef.current) return

    if (isFloating) {
      gsap.fromTo(floatingNavRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      )
    } else {
      gsap.to(floatingNavRef.current,
        { y: 100, opacity: 0, duration: 0.3, ease: 'power3.in' }
      )
    }
  }, [isFloating])

  // Animate hamburger → X and menu panel expanding upward
  useEffect(() => {
    const top = hamburgerTopRef.current
    const mid = hamburgerMidRef.current
    const bot = hamburgerBotRef.current
    const panel = menuPanelRef.current
    const items = menuItemsRef.current.filter(Boolean)

    if (!top || !mid || !bot || !panel) return

    if (menuOpen) {
      // Hamburger → X
      gsap.to(top, { y: 5.5, rotation: 45, duration: 0.3, ease: 'power2.inOut' })
      gsap.to(mid, { opacity: 0, scaleX: 0, duration: 0.2, ease: 'power2.in' })
      gsap.to(bot, { y: -5.5, rotation: -45, duration: 0.3, ease: 'power2.inOut' })

      // Panel expands upward
      gsap.set(panel, { display: 'flex' })
      gsap.fromTo(panel,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
      )

      // Stagger menu items in
      gsap.fromTo(items,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.07, ease: 'power3.out', delay: 0.15 }
      )
    } else {
      // X → Hamburger
      gsap.to(top, { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' })
      gsap.to(mid, { opacity: 1, scaleX: 1, duration: 0.2, ease: 'power2.out', delay: 0.1 })
      gsap.to(bot, { y: 0, rotation: 0, duration: 0.3, ease: 'power2.inOut' })

      // Panel collapses downward
      gsap.to(panel, {
        scaleY: 0, opacity: 0, duration: 0.3, ease: 'power3.in',
        onComplete: () => gsap.set(panel, { display: 'none' })
      })
    }
  }, [menuOpen])

  // Close floating menu on click outside
  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e) => {
      if (floatingNavRef.current && !floatingNavRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [menuOpen])

  // Animate mobile menu panel
  useEffect(() => {
    const panel = mobileMenuRef.current
    const items = mobileMenuItemsRef.current.filter(Boolean)
    if (!panel) return

    if (mobileMenuOpen) {
      gsap.set(panel, { display: 'flex' })
      gsap.fromTo(panel,
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 0.4, ease: 'power3.out' }
      )
      gsap.fromTo(items,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.07, ease: 'power3.out', delay: 0.15 }
      )
    } else {
      gsap.to(panel, {
        scaleY: 0, opacity: 0, duration: 0.3, ease: 'power3.in',
        onComplete: () => gsap.set(panel, { display: 'none' })
      })
    }
  }, [mobileMenuOpen])

  const handleMenuClick = (e) => {
    setMenuOpen(false)
    const href = e.currentTarget.getAttribute('href')
    if (href && href.startsWith('#')) {
      e.preventDefault()
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const menuItems = [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'FAQ', href: '#faq' },
  ]

  return (
    <>
      {/* ── Top navbar (visible before scroll) ── */}
      <nav
        ref={topNavRef}
        aria-label="Main navigation"
        className={`fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-base-border transition-opacity duration-300 ${isFloating ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="nav-logo flex items-center gap-2" style={{ opacity: 0 }}>
            <div className="w-8 h-8 bg-base-dark flex items-center justify-center rounded">
              <span className="font-mono text-white text-xs font-bold tracking-tighter">SL</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Soni Labs.</span>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            {menuItems.map(item => (
              <a key={item.label} href={item.href} className="nav-link hover:text-base-dark transition-colors" style={{ opacity: 0 }}>{item.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="#contact" className="nav-cta hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium bg-base-dark text-white rounded-full hover:bg-gray-800 transition-colors" style={{ opacity: 0 }}>
              Start a Project
            </a>
            <button className="md:hidden text-base-dark" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile menu" aria-expanded={mobileMenuOpen}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

      </nav>

      {/* ── Mobile menu overlay (dark panel, matches floating nav style) ── */}
      <div
        ref={mobileMenuRef}
        className="md:hidden fixed inset-0 z-[60] flex flex-col bg-base-dark origin-top"
        style={{ display: 'none', transform: 'scaleY(0)', opacity: 0 }}
      >
        {/* Top bar with logo and close button */}
        <div className="flex items-center justify-between px-6 h-20">
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded">
              <span className="font-mono text-black text-xs font-bold tracking-tighter">SL</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">Soni Labs.</span>
          </a>
          <button className="text-white" onClick={() => setMobileMenuOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Menu content */}
        <div className="flex flex-col flex-grow px-6 pt-8">
          {/* Tagline */}
          <p
            ref={el => mobileMenuItemsRef.current[0] = el}
            className="text-gray-400 text-xs leading-relaxed mb-8 font-mono"
          >
            Premium design, AI-powered development, and lead generation automation from one specialised studio.
          </p>

          {/* Menu links */}
          <div className="flex flex-col gap-1 mb-8">
            {menuItems.map((item, i) => (
              <a
                key={item.label}
                ref={el => mobileMenuItemsRef.current[i + 1] = el}
                href={item.href}
                className="px-4 py-3 text-2xl font-display font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                onClick={(e) => { setMobileMenuOpen(false); handleMenuClick(e) }}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            ref={el => mobileMenuItemsRef.current[5] = el}
            href="#contact"
            className="inline-flex items-center justify-center px-6 py-4 text-sm font-bold bg-accent-orange text-white rounded-full hover:bg-[#e64a00] transition-colors mb-8"
            onClick={() => setMobileMenuOpen(false)}
          >
            Start a Project
          </a>

          {/* Divider + social links */}
          <div ref={el => mobileMenuItemsRef.current[6] = el} className="border-t border-white/10 pt-6 flex flex-col gap-3 mt-auto mb-10">
            <a href="mailto:hello@sonilabs.studio" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              hello@sonilabs.studio
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* ── Floating bottom nav (visible after scrolling past hero) ── */}
      <div
        ref={floatingNavRef}
        className="fixed bottom-16 md:bottom-6 z-50 opacity-0 flex flex-col items-center gap-3 w-[340px]"
        style={{ left: 'calc(50vw - 170px)', pointerEvents: isFloating ? 'auto' : 'none' }}
      >
        {/* Menu panel — expands upward above the pill */}
        <div
          ref={menuPanelRef}
          className="w-full flex flex-col px-6 py-6 rounded-2xl bg-base-dark/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/30 origin-bottom"
          style={{ display: 'none', transform: 'scaleY(0)', opacity: 0 }}
        >
          {/* Tagline */}
          <p
            ref={el => menuItemsRef.current[0] = el}
            className="text-gray-400 text-xs leading-relaxed mb-5 font-mono"
          >
            Premium design, AI-powered development, and lead generation automation from one specialised studio.
          </p>

          {/* Menu links */}
          <div className="flex flex-col gap-1 mb-5">
            {menuItems.map((item, i) => (
              <a
                key={item.label}
                ref={el => menuItemsRef.current[i + 1] = el}
                href={item.href}
                className="px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                onClick={handleMenuClick}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Divider */}
          <div ref={el => menuItemsRef.current[5] = el} className="border-t border-white/10 pt-4 flex flex-col gap-2">
            <a href="mailto:hello@sonilabs.studio" className="flex items-center gap-3 px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              hello@sonilabs.studio
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              Twitter
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-2 text-xs text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
          </div>
        </div>

        {/* Bottom pill — always visible */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-full bg-white/80 backdrop-blur-xl border border-base-border shadow-lg shadow-black/5 w-full justify-between">
          {/* Logo + Menu button grouped together */}
          <div className="flex items-center gap-1.5">
            {/* Logo */}
            <a href="#" className="flex items-center shrink-0" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
              <div className="w-10 h-10 bg-base-dark flex items-center justify-center rounded-full">
                <span className="font-mono text-white text-xs font-bold tracking-tighter">SL</span>
              </div>
            </a>

            {/* Menu pill button */}
            <button
              className="flex items-center gap-2 px-3 py-2.5 rounded-full bg-base-dark hover:bg-gray-800 transition-colors shrink-0"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <div className="flex flex-col items-center justify-center gap-[4px]">
                <span ref={hamburgerTopRef} className="block w-4 h-[1.5px] bg-white rounded-full origin-center"></span>
                <span ref={hamburgerMidRef} className="block w-4 h-[1.5px] bg-white rounded-full origin-center"></span>
                <span ref={hamburgerBotRef} className="block w-4 h-[1.5px] bg-white rounded-full origin-center"></span>
              </div>
              <span className="text-xs font-medium text-white uppercase tracking-wider">Menu</span>
            </button>
          </div>

          {/* CTA button */}
          <a
            href="#contact"
            className="px-5 py-2.5 text-sm font-medium bg-accent-orange text-white rounded-full hover:bg-[#e64a00] transition-colors shrink-0 whitespace-nowrap"
            onClick={handleMenuClick}
          >
            Start a Project
          </a>
        </div>
      </div>
    </>
  )
}
