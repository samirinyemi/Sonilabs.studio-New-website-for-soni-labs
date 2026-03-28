import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function Services() {
  const container = useRef(null)

  useGSAP(() => {
    gsap.from('.svc-header', {
      y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.svc-header', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.svc-card', {
      y: 80, opacity: 0, duration: 0.9, stagger: 0.2, ease: 'power3.out',
      scrollTrigger: { trigger: '.svc-grid', start: 'top 80%', toggleActions: 'play none none reverse' },
    })
  }, { scope: container })

  return (
    <section ref={container} id="services" className="w-full py-20 md:py-40 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="svc-header mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-mono text-accent-orange text-sm font-bold uppercase tracking-widest mb-4">// Capabilities</h2>
            <h3 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark">Services</h3>
          </div>
          <p className="text-gray-500 max-w-md font-medium">Everything you need to launch, scale, and automate your digital presence without managing multiple freelancers.</p>
        </div>

        <div className="svc-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flagship card */}
          <div className="svc-card lg:col-span-2 bg-base-dark text-white p-10 md:p-12 rounded-[12px] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 blur-[100px] rounded-full transform translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
                <span className="font-mono text-xs uppercase tracking-wider text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">Flagship Service</span>
              </div>

              <h4 className="font-display text-3xl md:text-4xl font-bold mb-4">AI-Powered Website<br />Design & Build</h4>
              <p className="text-gray-400 text-lg max-w-md mb-8">End-to-end creation of premium, conversion-optimized websites utilizing modern AI development workflows for unprecedented speed and quality.</p>

              <ul className="space-y-3 mb-12">
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="text-accent-orange w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Custom visual design & UX
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="text-accent-orange w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  Production-ready clean code
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <svg className="text-accent-orange w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  AI chatbot or smart feature integration
                </li>
              </ul>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 border-t border-white/10 mt-auto">
              <div>
                <p className="text-sm text-gray-400 font-mono mb-1">Price</p>
                <p className="text-xl font-medium">$3,000 – $7,000</p>
              </div>
              <div className="mt-4 sm:mt-0 text-left sm:text-right">
                <p className="text-sm text-gray-400 font-mono mb-1">Timeline</p>
                <p className="text-xl font-medium">2–4 weeks</p>
              </div>
            </div>
          </div>

          <div className="svc-card flex flex-col gap-6 lg:col-span-1">
            {/* Lead Gen card */}
            <div className="bg-base-light border border-base-border p-8 rounded-[12px] flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-white border border-base-border flex items-center justify-center mb-6 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-base-dark">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <h4 className="font-display text-2xl font-bold mb-3 text-base-dark">Lead Gen Automation</h4>
              <p className="text-gray-600 mb-6 flex-grow">Automated systems that turn traffic into qualified leads. Stop losing prospects to broken forms.</p>

              <div className="pt-6 border-t border-base-border">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Starts at</p>
                    <p className="font-medium text-lg">$1,500</p>
                  </div>
                  <p className="text-sm font-medium text-gray-500">1-2 weeks</p>
                </div>
              </div>
            </div>

            {/* Retainer card */}
            <div className="bg-accent-lime p-8 rounded-[12px] flex flex-col h-full relative overflow-hidden text-base-dark hover:scale-[1.02] transition-transform origin-bottom">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwbDR2NE0wIDRsNC00IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMC41Ii8+Cjwvc3ZnPg==')]"></div>

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-base-dark text-accent-lime flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20v-6M6 20V10M18 20V4" />
                  </svg>
                </div>
                <h4 className="font-display text-2xl font-bold mb-3">Embedded Design Partner</h4>
                <p className="text-base-dark/80 mb-6 font-medium flex-grow">Ongoing design and development support. Like having an in-house team, without the overhead.</p>

                <div className="pt-6 border-t border-base-border">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-base-dark/60 font-mono uppercase tracking-wider mb-1">Retainer</p>
                      <p className="font-bold text-lg">$2k–$4k/mo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
