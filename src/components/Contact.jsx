import { useState, useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Contact() {
  const [budgetOpen, setBudgetOpen] = useState(false)
  const [budgetValue, setBudgetValue] = useState('')
  const dropdownRef = useRef(null)
  const sectionRef = useRef(null)

  const budgetOptions = [
    { value: '1.5-3k', label: '$1,500 - $3,000' },
    { value: '3-7k', label: '$3,000 - $7,000' },
    { value: 'retainer', label: 'Monthly Retainer ($2k+)' },
  ]

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setBudgetOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useGSAP(() => {
    gsap.from('.contact-container', {
      y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-container', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="contact" className="w-full bg-white pt-20 md:pt-40 px-4 md:px-6">
      <div className="contact-container max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 border border-base-border rounded-[12px] overflow-hidden">
        {/* Left panel */}
        <div className="md:col-span-4 bg-base-light p-6 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-base-border">
          <h2 className="font-display text-5xl md:text-6xl font-bold text-base-dark tracking-tighter mb-6">Start a project.</h2>
          <p className="text-gray-500 font-mono text-sm leading-relaxed">Tell me about your project. I usually respond within 24 hours to schedule a discovery call.</p>
        </div>

        {/* Right panel */}
        <div className="md:col-span-8 flex flex-col">
          <div className="p-5 md:p-8 border-b border-base-border bg-base-light flex flex-col justify-center">
            <p className="font-mono text-sm font-bold uppercase tracking-widest text-base-dark mb-2">
              <span className="text-accent-orange mr-2">&#9642;</span>Project Inquiry
            </p>
            <p className="text-gray-500 text-sm font-mono lowercase">Fill out the details below</p>
          </div>

          <div className="p-5 md:p-10 bg-white">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" aria-label="Project inquiry form">
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-name" className="font-mono text-xs text-gray-500 uppercase tracking-wider">Name</label>
                <input id="contact-name" name="name" type="text" placeholder="John Doe" autoComplete="name" className="w-full bg-base-light border border-base-border rounded-lg px-4 py-3 text-base-dark focus:outline-none focus:border-accent-orange transition-colors font-sans placeholder-gray-400" />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-email" className="font-mono text-xs text-gray-500 uppercase tracking-wider">Email</label>
                <input id="contact-email" name="email" type="email" placeholder="john@company.com" autoComplete="email" className="w-full bg-base-light border border-base-border rounded-lg px-4 py-3 text-base-dark focus:outline-none focus:border-accent-orange transition-colors font-sans placeholder-gray-400" />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2" ref={dropdownRef}>
                <label id="budget-label" className="font-mono text-xs text-gray-500 uppercase tracking-wider">Budget Range</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setBudgetOpen(!budgetOpen)}
                    aria-labelledby="budget-label"
                    aria-expanded={budgetOpen}
                    aria-haspopup="listbox"
                    className={`w-full bg-base-light border rounded-lg px-4 py-3 text-left flex items-center justify-between transition-colors font-sans ${budgetOpen ? 'border-accent-orange' : 'border-base-border'}`}
                  >
                    <span className={budgetValue ? 'text-base-dark' : 'text-gray-400'}>
                      {budgetValue ? budgetOptions.find(o => o.value === budgetValue)?.label : 'Select a range'}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform ${budgetOpen ? 'rotate-180' : ''}`}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {budgetOpen && (
                    <div role="listbox" aria-label="Budget range options" className="absolute top-full left-0 right-0 mt-2 bg-white border border-base-border rounded-lg overflow-hidden z-50 shadow-lg">
                      {budgetOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => { setBudgetValue(option.value); setBudgetOpen(false) }}
                          className={`w-full px-4 py-3 text-left text-sm font-sans transition-colors flex items-center justify-between ${budgetValue === option.value ? 'bg-accent-orange/5 text-accent-orange' : 'text-base-dark hover:bg-base-light'}`}
                        >
                          {option.label}
                          {budgetValue === option.value && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-orange">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label htmlFor="contact-details" className="font-mono text-xs text-gray-500 uppercase tracking-wider">Project Details</label>
                <textarea id="contact-details" name="details" rows="4" placeholder="Tell me about your project goals..." className="w-full bg-base-light border border-base-border rounded-lg px-4 py-3 text-base-dark focus:outline-none focus:border-accent-orange transition-colors font-sans placeholder-gray-400 resize-none"></textarea>
              </div>

              <div className="md:col-span-2">
                <button type="button" className="w-full py-4 bg-accent-orange text-white rounded-lg font-bold text-lg hover:bg-[#e64a00] transition-colors">
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative overflow-hidden min-h-[1000px] flex flex-col justify-end mt-16 md:mt-32 -mx-6" role="contentinfo">
        {/* Background image */}
        <img src="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_2y8vb5Mw0K3MUO0JxEbVoRRIJNJ%2Fhf_20260328_012435_33a8a710-811e-4794-8891-03726b4867d6.png&w=1280&q=85" alt="Soni Labs Studio - Planet and nebula background" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Glass card */}
        <div className="relative z-10 mx-4 md:mx-8 mb-4 md:mb-8 rounded-[12px] p-8 md:p-10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px) saturate(1.4) brightness(1.1)', WebkitBackdropFilter: 'blur(12px) saturate(1.4) brightness(1.1)', border: '1px solid rgba(255,255,255,0.15)', boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.25), inset 0 -1px 0 0 rgba(255,255,255,0.05), 0 12px 40px rgba(0,0,0,0.2)' }}>
          {/* Liquid glass specular highlight */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          <div className="absolute top-0 left-[10%] w-[40%] h-[60%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)', filter: 'blur(20px)' }}></div>
          <div className="absolute bottom-0 right-[10%] w-[30%] h-[40%] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, transparent 70%)', filter: 'blur(15px)' }}></div>
          {/* Footer content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-10">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white flex items-center justify-center rounded">
                  <span className="font-mono text-black text-sm font-bold tracking-tighter">SL</span>
                </div>
                <span className="font-display font-bold text-2xl tracking-tight text-white">Soni Labs.</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Premium design, AI-powered development, and lead generation automation from one specialized studio.</p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-mono text-xs text-white/60 uppercase tracking-widest mb-4">Services</h4>
                <ul className="space-y-3">
                  <li><a href="#services" className="text-gray-300 text-sm hover:text-white transition-colors">Website Design & Build</a></li>
                  <li><a href="#services" className="text-gray-300 text-sm hover:text-white transition-colors">Lead Gen Automation</a></li>
                  <li><a href="#services" className="text-gray-300 text-sm hover:text-white transition-colors">Embedded Partner</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-mono text-xs text-white/60 uppercase tracking-widest mb-4">Company</h4>
                <ul className="space-y-3">
                  <li><a href="#work" className="text-gray-300 text-sm hover:text-white transition-colors">Work</a></li>
                  <li><a href="#about" className="text-gray-300 text-sm hover:text-white transition-colors">About</a></li>
                  <li><a href="#faq" className="text-gray-300 text-sm hover:text-white transition-colors">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-mono text-xs text-white/60 uppercase tracking-widest mb-4">Contact</h4>
                <ul className="space-y-3">
                  <li><a href="mailto:hello@sonilabs.com" className="text-gray-300 text-sm hover:text-white transition-colors">hello@sonilabs.com</a></li>
                  <li><span className="text-gray-400 text-sm">Remote / Worldwide</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <a href="mailto:hello@sonilabs.com" className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/10 text-white flex items-center justify-center rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-xs text-white/50 uppercase tracking-wider mb-1">Email</p>
                <p className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">hello@sonilabs.com</p>
              </div>
            </a>

            <a href="#" className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/10 text-white flex items-center justify-center rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-xs text-white/50 uppercase tracking-wider mb-1">Twitter</p>
                <p className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">@sonilabs</p>
              </div>
            </a>

            <a href="#" className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/10 text-white flex items-center justify-center rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <div>
                <p className="font-mono text-xs text-white/50 uppercase tracking-wider mb-1">LinkedIn</p>
                <p className="font-mono text-sm text-gray-300 group-hover:text-white transition-colors">linkedin/sonilabs</p>
              </div>
            </a>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/15 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="font-mono text-xs text-white/40">Design begins with a good question.</span>
            <span className="font-mono text-xs text-white/40">Soni Labs &copy;2026</span>
          </div>
        </div>
      </footer>
    </section>
  )
}
