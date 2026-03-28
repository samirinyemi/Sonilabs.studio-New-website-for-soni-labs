export default function Process() {
  const steps = [
    { num: '01', title: 'Discovery', time: '2–3 Days', desc: 'We talk about your business goals, target audience, and what success looks like. We map out the site architecture and define the features needed to convert visitors.' },
    { num: '02', title: 'Design', time: '3–5 Days', desc: 'Visual concepts grounded in your brand identity. You review high-fidelity mockups of key pages, and we iterate until you approve the direction before building.' },
    { num: '03', title: 'Build', time: '5–10 Days', desc: 'Design becomes production code using Next.js and Tailwind, accelerated by AI tools. You get a staging link to review the fully functional, responsive website.' },
    { num: '04', title: 'Launch & Automate', time: '2–3 Days', desc: 'We deploy the site, set up your lead capture forms, configure automated email sequences and CRM integrations, ensure SEO basics are set, and hand you the keys.' },
  ]

  return (
    <section className="w-full py-32 md:py-40 px-6 bg-base-light border-y border-base-border bg-dots">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-mono text-accent-orange text-sm font-bold uppercase tracking-widest mb-4">// Process</h2>
          <h3 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark max-w-2xl mx-auto">From first call to live site in 2–4 weeks.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">
          {/* Grid lines */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-base-border -translate-y-1/2 -z-10"></div>
          <div className="hidden md:block absolute top-0 left-1/2 w-[1px] h-full bg-base-border -translate-x-1/2 -z-10"></div>

          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`bg-white p-8 md:p-10 rounded-[12px] border border-base-border relative group hover:border-gray-400 transition-colors ${i % 2 === 1 ? 'md:translate-y-12' : ''}`}
            >
              <div className="text-7xl font-mono text-gray-200 font-bold mb-6 group-hover:text-accent-orange transition-colors duration-300">{step.num}</div>
              <h4 className="font-display text-2xl font-bold mb-3 text-base-dark">{step.title}</h4>
              <p className="font-mono text-xs text-accent-orange uppercase tracking-wider mb-4">{step.time}</p>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
