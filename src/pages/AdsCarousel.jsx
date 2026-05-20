import AdFrame from '../components/ads/AdFrame'

const PAGE_INDICATOR_BASE =
  'font-mono text-[18px] uppercase tracking-[0.2em] text-muted'

function PageIndicator({ n }) {
  return (
    <span className={PAGE_INDICATOR_BASE}>
      {String(n).padStart(2, '0')} / 10
    </span>
  )
}

function SoniMark({ className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-mono text-[18px] uppercase tracking-[0.2em] ${className}`}
    >
      <span
        className="inline-block w-2 h-2 rounded-full"
        style={{ background: 'var(--color-accent-red)' }}
      />
      Soni Labs
    </span>
  )
}

/* ───────────────────────── SLIDE 1 · HOOK ───────────────────────── */
function Slide1Hook() {
  return (
    <div className="w-full h-full bg-base-pure px-20 py-20 flex flex-col justify-between font-display">
      <div>
        <SoniMark className="text-muted mb-12" />
        <h1 className="font-display font-bold text-[88px] leading-[1.02] tracking-tight text-base-dark">
          Most startups buy
          <br />
          design backwards.
        </h1>
      </div>

      {/* Three mismatched swatches — the disagreement IS the visual. */}
      <div className="flex gap-5">
        <div
          className="w-[280px] h-[180px] rounded-2xl flex items-center justify-center"
          style={{
            background:
              'linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)',
          }}
        >
          <span className="text-white font-bold text-[36px] tracking-tight">
            LOGO
          </span>
        </div>
        <div className="w-[280px] h-[180px] rounded-md bg-[#2563eb] p-5 flex flex-col justify-between">
          <span className="text-white/80 text-xs uppercase tracking-widest">
            Dashboard
          </span>
          <div>
            <div className="h-2 w-3/5 bg-white/40 rounded mb-2" />
            <div className="h-2 w-2/5 bg-white/20 rounded mb-4" />
            <button className="bg-white text-[#2563eb] text-sm rounded-md px-3 py-1.5 font-medium">
              Get started →
            </button>
          </div>
        </div>
        <div
          className="w-[280px] h-[180px] bg-[#FAF5EB] p-5 flex items-center justify-center"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          <span className="text-[#7a5a2f] text-[34px] italic">
            Welcome, friend.
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-12">
        <p className="font-display font-light text-[28px] leading-[1.4] text-subtle max-w-[640px]">
          A logo from one freelancer. A site from another. A product designer
          when funding lands. Then nothing matches.
        </p>
        <PageIndicator n={1} />
      </div>
    </div>
  )
}

/* ───────────────────────── SLIDE 2 · REFRAME ───────────────────────── */
function Slide2Reframe() {
  return (
    <div className="w-full h-full bg-base-pure px-20 py-20 flex flex-col justify-between font-display">
      <div>
        <span className="inline-flex items-center gap-2 font-mono text-[18px] uppercase tracking-[0.2em] text-muted mb-12">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ background: 'var(--color-accent-red)' }}
          />
          A studio, under one roof
        </span>
        <h2 className="font-display font-bold text-[88px] leading-[1.02] tracking-tight text-base-dark">
          Brands, products,
          <br />
          and websites — built
          <br />
          <span className="relative">
            under one roof.
            <span
              className="absolute -bottom-2 left-0 h-[6px] w-full"
              style={{ background: 'var(--color-accent-red)' }}
            />
          </span>
        </h2>
      </div>

      {/* Three swatches — now resolved into a unified Soni system. */}
      <div className="flex gap-5">
        {['Brand', 'Product', 'Website'].map((label) => (
          <div
            key={label}
            className="w-[280px] h-[180px] rounded-xl bg-card-soft border border-base-border p-5 flex flex-col justify-between"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              {label}
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="h-2 w-4/5 bg-base-dark/80 rounded" />
              <div className="h-2 w-2/5 bg-base-dark/30 rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between gap-12">
        <p className="font-display font-light text-[28px] leading-[1.4] text-subtle max-w-[640px]">
          One studio. Same team. Senior strategy and design — no fragmented
          handoffs.
        </p>
        <PageIndicator n={2} />
      </div>
    </div>
  )
}

/* ───────────────────────── SLIDE 3 · WHO WE ARE ───────────────────────── */
function Slide3WhoWeAre() {
  return (
    <div className="w-full h-full bg-base-pure px-20 py-20 flex flex-col justify-between font-display">
      <p className="font-mono text-[18px] uppercase tracking-[0.2em] text-muted">
        // The studio
      </p>

      <div>
        <h2 className="font-display font-bold text-[88px] leading-[1.02] tracking-tight text-base-dark mb-10">
          A studio.
          <br />
          Not a single
          <br />
          freelancer.
        </h2>
        <p className="font-display font-light text-[26px] leading-[1.5] text-subtle max-w-[720px]">
          Soni Labs is a design studio led by Samuel Irinyemi, working with a
          small bench of trusted collaborators across brand, motion, and
          engineering. Based in Lagos. Clients across the US, UK, Europe, and
          Australia.
        </p>
      </div>

      <div className="flex items-end justify-between">
        <SoniMark className="text-base-dark" />
        <PageIndicator n={3} />
      </div>
    </div>
  )
}

/* ───────────────────────── PACKAGE-SLIDE LAYOUT ───────────────────────── */
function PackageSlide({
  n,
  number,
  badge,
  title,
  body,
  timing,
  visual,
  dark = false,
}) {
  const surface = dark ? 'bg-base-dark text-base-pure' : 'bg-base-pure'
  const muted = dark ? 'text-white/60' : 'text-muted'
  const subtle = dark ? 'text-white/80' : 'text-subtle'
  const borderTone = dark ? 'border-white/15' : 'border-base-border'

  return (
    <div className={`w-full h-full ${surface} px-20 py-20 flex flex-col justify-between font-display`}>
      <div className="flex items-center justify-between">
        <span
          className={`font-mono text-[18px] uppercase tracking-[0.2em] ${muted}`}
        >
          Package · {number}
        </span>
        {badge && (
          <span
            className="font-mono text-[14px] uppercase tracking-[0.2em] text-white px-3 py-1.5 rounded-full"
            style={{ background: 'var(--color-accent-red)' }}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="grid grid-cols-12 gap-10 items-center">
        <div className="col-span-7">
          <h2 className="font-display font-bold text-[80px] leading-[0.98] tracking-tight mb-8">
            {title}
          </h2>
          <p className={`font-display font-light text-[26px] leading-[1.45] ${subtle} max-w-[520px]`}>
            {body}
          </p>
        </div>
        <div className="col-span-5">{visual}</div>
      </div>

      <div className="flex items-end justify-between">
        <div className={`flex items-center gap-3 border-t ${borderTone} pt-4 pr-8`}>
          <span
            className={`font-mono text-[18px] uppercase tracking-[0.2em] ${muted}`}
          >
            Timeline
          </span>
          <span className="font-display font-bold text-[24px]">{timing}</span>
        </div>
        <PageIndicator n={n} />
      </div>
    </div>
  )
}

/* Visual blocks shared by package slides */
function WebsiteMockup({ tone = 'light' }) {
  const surface = tone === 'dark' ? '#FFFFFF' : '#F3F3F3'
  return (
    <div
      className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-base-border"
      style={{ background: surface }}
    >
      <div className="h-8 flex items-center gap-1.5 px-3 bg-base-dark/5 border-b border-base-border">
        <span className="w-2 h-2 rounded-full bg-base-dark/20" />
        <span className="w-2 h-2 rounded-full bg-base-dark/20" />
        <span className="w-2 h-2 rounded-full bg-base-dark/20" />
      </div>
      <div className="p-6 flex flex-col gap-3">
        <div className="h-3 w-2/5 bg-base-dark/80 rounded" />
        <div className="h-3 w-3/5 bg-base-dark/30 rounded" />
        <div className="h-40 bg-base-dark/10 rounded-md mt-3" />
        <div className="grid grid-cols-3 gap-2 mt-2">
          <div className="h-16 bg-base-dark/10 rounded" />
          <div className="h-16 bg-base-dark/10 rounded" />
          <div className="h-16 bg-base-dark/10 rounded" />
        </div>
      </div>
    </div>
  )
}

function BrandingMockup() {
  return (
    <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-base-border bg-card-soft p-6 flex flex-col justify-between">
      <div>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Lockup
        </span>
        <div className="mt-3 flex items-center gap-2">
          <span
            className="inline-block w-4 h-4 rounded-full"
            style={{ background: 'var(--color-accent-red)' }}
          />
          <span className="font-display font-bold text-[28px] tracking-tight text-base-dark">
            northwind
          </span>
        </div>
      </div>
      <div>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Palette
        </span>
        <div className="mt-2 flex gap-2">
          <span className="w-10 h-10 rounded-md bg-base-dark" />
          <span
            className="w-10 h-10 rounded-md"
            style={{ background: 'var(--color-accent-red)' }}
          />
          <span className="w-10 h-10 rounded-md bg-card-soft border border-base-border" />
          <span className="w-10 h-10 rounded-md bg-base-pure border border-base-border" />
        </div>
      </div>
      <div>
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Typography
        </span>
        <p className="font-display font-bold text-[36px] text-base-dark leading-none mt-2">
          Aa
        </p>
        <p className="font-mono text-xs uppercase tracking-wider text-subtle mt-1">
          Aeonik · Display
        </p>
      </div>
    </div>
  )
}

function BrandPlusWebMockup() {
  return (
    <div className="w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/15 p-6 flex flex-col gap-4 bg-white/5">
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-3 h-3 rounded-full"
          style={{ background: 'var(--color-accent-red)' }}
        />
        <span className="font-display font-bold text-[22px] tracking-tight text-white">
          northwind
        </span>
      </div>
      <div className="bg-white rounded-md flex-1 p-4 flex flex-col gap-2">
        <div className="h-2.5 w-1/2 bg-base-dark rounded" />
        <div className="h-2.5 w-3/4 bg-base-dark/30 rounded" />
        <div className="flex-1 bg-base-dark/5 rounded mt-2" />
      </div>
      <div className="flex gap-2">
        <span className="w-7 h-7 rounded bg-white" />
        <span
          className="w-7 h-7 rounded"
          style={{ background: 'var(--color-accent-red)' }}
        />
        <span className="w-7 h-7 rounded bg-white/20" />
      </div>
    </div>
  )
}

function ProductDesignMockup() {
  return (
    <div className="w-full aspect-[4/5] grid grid-cols-3 gap-2 items-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="aspect-[9/16] rounded-2xl border border-base-border bg-base-pure p-3 flex flex-col gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          style={{
            transform: i === 1 ? 'translateY(-12px)' : 'translateY(8px)',
          }}
        >
          <div className="h-1.5 w-4/5 bg-base-dark/70 rounded" />
          <div className="h-1.5 w-3/5 bg-base-dark/30 rounded" />
          <div className="flex-1 bg-card-soft rounded mt-2" />
          <div
            className="h-6 rounded-full mt-1"
            style={{ background: 'var(--color-accent-red)' }}
          />
        </div>
      ))}
    </div>
  )
}

/* ───────────────────────── SLIDE 8 · PROOF ───────────────────────── */
function Slide8Proof() {
  const projects = [
    { name: 'AMA Victoria', line: 'Brand + site for Australia’s medical association.' },
    { name: 'meCash', line: 'Product UI/UX for a fintech scaling its app.' },
    { name: 'time-BMX', line: 'Brand and site for the cycling retailer.' },
    { name: 'Julian Mercier', line: 'Personal brand and portfolio site.' },
  ]
  return (
    <div className="w-full h-full bg-base-pure px-20 py-20 flex flex-col justify-between font-display">
      <div>
        <p className="font-mono text-[18px] uppercase tracking-[0.2em] text-muted mb-8">
          // Selected work
        </p>
        <h2 className="font-display font-bold text-[80px] leading-[0.98] tracking-tight text-base-dark">
          Quiet proof.
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {projects.map((p) => (
          <div
            key={p.name}
            className="border-t border-base-dark/15 pt-5 pr-2 flex flex-col gap-2"
          >
            <span className="font-display font-bold text-[32px] text-base-dark leading-tight">
              {p.name}
            </span>
            <span className="font-display font-light text-[20px] text-subtle leading-snug">
              {p.line}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between">
        <SoniMark className="text-base-dark" />
        <PageIndicator n={8} />
      </div>
    </div>
  )
}

/* ───────────────────────── SLIDE 9 · FOUNDER ───────────────────────── */
function Slide9Founder() {
  return (
    <div className="w-full h-full bg-base-pure px-20 py-20 flex flex-col justify-between font-display">
      <p className="font-mono text-[18px] uppercase tracking-[0.2em] text-muted">
        // The founder
      </p>

      <div className="grid grid-cols-12 gap-10 items-center">
        <div className="col-span-7">
          <h2 className="font-display font-bold text-[72px] leading-[1.02] tracking-tight text-base-dark mb-8">
            Designed by
            <br />
            someone,
            <br />
            not something.
          </h2>
          <p className="font-display font-light text-[24px] leading-[1.45] text-subtle max-w-[480px]">
            Samuel Irinyemi — Founder, Soni Labs. Designing brand systems,
            products, and websites for over a decade.
          </p>
        </div>
        <div className="col-span-5 flex justify-center">
          {/* Portrait card — 4:5 vertical rectangle. Source asset lives at
              /public/Founders images/. object-position keeps Samuel's face
              high in the crop so the eye line lands above the visual centre. */}
          <div className="w-[320px] h-[400px] rounded-xl overflow-hidden bg-base-dark">
            <img
              src="/Founders%20images/0505%20(1).webp"
              alt="Samuel Irinyemi, founder of Soni Labs"
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 25%' }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <SoniMark className="text-base-dark" />
        <PageIndicator n={9} />
      </div>
    </div>
  )
}

/* ───────────────────────── SLIDE 10 · CTA ───────────────────────── */
function Slide10CTA() {
  return (
    <div className="w-full h-full bg-base-dark text-base-pure px-20 py-20 flex flex-col justify-between font-display">
      <span className="font-mono text-[18px] uppercase tracking-[0.2em] text-white/60">
        // Book a strategy call
      </span>

      <div>
        <h2 className="font-display font-bold text-[88px] leading-[0.98] tracking-tight mb-8">
          30 minutes.
          <br />
          No pitch theater.
        </h2>
        <p className="font-display font-light text-[26px] leading-[1.45] text-white/80 max-w-[640px] mb-12">
          We’ll figure out if we’re a fit, what the scope might look like, and
          whether the timing makes sense for you. That’s it.
        </p>
        <p
          className="font-display font-bold text-[44px] tracking-tight leading-none"
          style={{ color: 'var(--color-accent-red)' }}
        >
          calendly.com/madebysoni/30min
        </p>
      </div>

      <div className="flex items-end justify-between">
        <SoniMark className="text-base-pure" />
        <PageIndicator n={10} />
      </div>
    </div>
  )
}

/* ───────────────────────── PAGE ───────────────────────── */
export default function AdsCarousel() {
  const slides = [
    { n: 1, label: 'Slide 1 · Hook', el: <Slide1Hook /> },
    { n: 2, label: 'Slide 2 · Reframe', el: <Slide2Reframe /> },
    { n: 3, label: 'Slide 3 · Who we are', el: <Slide3WhoWeAre /> },
    {
      n: 4,
      label: 'Slide 4 · Websites',
      el: (
        <PackageSlide
          n={4}
          number="01"
          title="Websites"
          body="Production marketing site built on an existing brand. No-code execution in Framer, Webflow, or Wix Studio."
          timing="2–3 weeks"
          visual={<WebsiteMockup />}
        />
      ),
    },
    {
      n: 5,
      label: 'Slide 5 · Branding',
      el: (
        <PackageSlide
          n={5}
          number="02"
          title="Branding"
          body="Identity-only engagement: brand strategy, logo, type, colour, and a guidelines document."
          timing="2 weeks"
          visual={<BrandingMockup />}
        />
      ),
    },
    {
      n: 6,
      label: 'Slide 6 · Brand + Website (flagship)',
      el: (
        <PackageSlide
          n={6}
          number="03"
          badge="Most popular"
          title={
            <>
              Brand
              <br />
              + Website.
            </>
          }
          body="Brand identity plus a production website for founders launching or rebranding. The combined build most founders actually want."
          timing="4–6 weeks"
          visual={<BrandPlusWebMockup />}
          dark
        />
      ),
    },
    {
      n: 7,
      label: 'Slide 7 · Product Design',
      el: (
        <PackageSlide
          n={7}
          number="04"
          title={
            <>
              Product
              <br />
              Design.
            </>
          }
          body="UI/UX design for startups scaling a digital product. Hand-off to your engineering team."
          timing="5 weeks"
          visual={<ProductDesignMockup />}
        />
      ),
    },
    { n: 8, label: 'Slide 8 · Proof', el: <Slide8Proof /> },
    { n: 9, label: 'Slide 9 · Founder', el: <Slide9Founder /> },
    { n: 10, label: 'Slide 10 · CTA', el: <Slide10CTA /> },
  ]

  return (
    <div className="min-h-screen bg-canvas py-16 px-8">
      <div className="max-w-[1180px] mx-auto mb-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-3">
          // Ads · Carousel · cold acquisition
        </p>
        <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight text-base-dark">
          Built under one roof — 10-slide carousel
        </h1>
        <p className="text-subtle mt-3 max-w-[640px] leading-relaxed">
          Each frame renders at 1080×1080. Open this page on a screen ≥1100px
          wide, scroll to a slide, and screenshot the framed box directly (or
          use DevTools to capture node at 1× DPR).
        </p>
      </div>

      <div className="flex flex-col gap-16 items-start mx-auto" style={{ width: 'fit-content' }}>
        {slides.map((s) => (
          <AdFrame
            key={s.n}
            label={s.label}
            className="rounded-md"
          >
            {s.el}
          </AdFrame>
        ))}
      </div>
    </div>
  )
}
