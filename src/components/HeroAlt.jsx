export default function HeroAlt() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#f5f3ef]">
      {/* Subtle grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Horizontal line */}
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gray-300/60"></div>
        {/* Vertical line */}
        <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gray-300/60"></div>
        {/* Connection dots */}
        <div className="absolute top-1/2 left-[15%] w-2 h-2 rounded-full bg-gray-300 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-[85%] w-2 h-2 rounded-full bg-gray-300 -translate-x-1/2 -translate-y-1/2"></div>
        {/* Branch lines */}
        <div className="absolute top-[38%] left-[15%] w-[1px] h-[24%] bg-gray-300/60"></div>
        <div className="absolute top-[38%] right-[15%] w-[1px] h-[24%] bg-gray-300/60"></div>
        {/* Small labels on lines */}
        <span className="absolute top-[37%] left-[13%] font-mono text-[10px] text-gray-400 bg-[#f5f3ef] px-2">Design</span>
        <span className="absolute top-[37%] right-[13%] font-mono text-[10px] text-gray-400 bg-[#f5f3ef] px-2">Code</span>
        <span className="absolute top-[63%] left-[10%] font-mono text-[10px] text-gray-400 bg-[#f5f3ef] px-2">Automate</span>
        <span className="absolute top-[63%] right-[10%] font-mono text-[10px] text-gray-400 bg-[#f5f3ef] px-2">Convert</span>
        {/* Lower branch lines */}
        <div className="absolute top-[62%] left-[15%] w-[1px] h-[10%] bg-gray-300/60 -translate-x-1/2"></div>
        <div className="absolute top-[62%] right-[15%] w-[1px] h-[10%] bg-gray-300/60 -translate-x-1/2"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Top dot-matrix text */}
        <h2
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-base-dark mb-6 uppercase"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: '-0.02em',
          }}
        >
          Design. Build.
        </h2>

        {/* Center icon card */}
        <div className="relative my-8 md:my-12">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-[28px] bg-white border border-base-border shadow-sm flex items-center justify-center mx-auto" style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)' }}>
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-[20px] bg-[#f5f3ef] flex items-center justify-center">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 bg-base-dark rounded-md"></div>
                <div className="flex flex-col gap-1">
                  <div className="w-3.5 h-3.5 bg-base-dark rounded-sm"></div>
                  <div className="w-3.5 h-3.5 bg-base-dark rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom dot-matrix text */}
        <h2
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-base-dark mb-8 uppercase"
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: '-0.02em',
          }}
        >
          Convert.
        </h2>

        <p className="text-base md:text-lg text-gray-500 max-w-xl mb-10 leading-relaxed">
          Soni Labs brings premium design, AI-powered development, and automation together — so your website doesn't just exist, it works for your business.
        </p>

        <a
          href="#contact"
          className="inline-flex items-center gap-3 px-7 py-4 bg-base-dark text-white rounded-full font-medium text-base hover:bg-gray-800 transition-all group"
        >
          <div className="w-7 h-7 rounded-full bg-accent-orange flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
          Start a Project
        </a>
      </div>
    </section>
  )
}
