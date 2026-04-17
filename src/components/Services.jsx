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
          <p className="text-gray-500 max-w-md font-medium">Everything you need to launch and grow your digital presence — designed and built from one studio.</p>
        </div>

        <div className="svc-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Flagship card — Website Design & Build */}
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

              <h4 className="font-display text-3xl md:text-4xl font-bold mb-4">Website Design<br />&amp; Build</h4>
              <p className="text-gray-400 text-lg max-w-md mb-8">Custom website design and development — from concept to launch. Designed and built by the same person, so nothing gets lost in translation.</p>

              <ul className="space-y-3 mb-12">
                {[
                  'Custom website design (UI/UX)',
                  'No-code development & AI-assisted development',
                  'Responsive across all devices',
                  'Motion & interactions',
                  'Performance optimisation',
                  'Basic form setup & integrations',
                  'One round of revisions',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-300">
                    <svg className="text-accent-orange w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    {item}
                  </li>
                ))}
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
            {/* Brand Identity & Strategy card */}
            <div className="bg-base-light border border-base-border p-8 rounded-[12px] flex flex-col h-full hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-white border border-base-border flex items-center justify-center mb-6 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-base-dark">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
              </div>
              <h4 className="font-display text-2xl font-bold mb-3 text-base-dark">Brand Identity &amp; Strategy</h4>
              <p className="text-gray-600 mb-6 flex-grow">Brand positioning, visual identity, and guidelines — built to communicate what makes you different before you say a word.</p>

              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                {[
                  'Brand positioning & naming',
                  'Visual identity (logo, colour, typography)',
                  'Brand guidelines document',
                  'Marketing materials design',
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-orange shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-base-border">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">Price</p>
                    <p className="font-medium text-lg">$2,000 – $5,000</p>
                  </div>
                  <p className="text-sm font-medium text-gray-500">2–3 weeks</p>
                </div>
              </div>
            </div>

            {/* Embedded Design Partner retainer card */}
            <div className="bg-accent-lime p-8 rounded-[12px] flex flex-col h-full relative overflow-hidden text-base-dark hover:scale-[1.02] transition-transform origin-bottom">
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8cGF0aCBkPSJNMCAwbDR2NE0wIDRsNC00IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMC41Ii8+Cjwvc3ZnPg==')]"></div>

              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-base-dark text-accent-lime flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20v-6M6 20V10M18 20V4" />
                  </svg>
                </div>
                <h4 className="font-display text-2xl font-bold mb-3">Embedded Design Partner</h4>
                <p className="text-base-dark/80 mb-6 font-medium flex-grow">Ongoing UI/UX design, website updates, and brand consistency. Like having an in-house designer, without the overhead.</p>

                <div className="pt-6 border-t border-base-border/40">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-base-dark/60 font-mono uppercase tracking-wider mb-1">Retainer</p>
                      <p className="font-bold text-lg">$2k–$4k/mo</p>
                    </div>
                    <p className="text-sm font-medium text-base-dark/60">Monthly rolling</p>
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
