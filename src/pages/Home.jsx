import { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import HeroV2 from '../components/HeroV2'
import Showreel from '../components/Showreel'
import WhatWeDo from '../components/WhatWeDo'
import Services from '../components/Services'
import ServicesTeaser from '../components/ServicesTeaser'
import ProcessAlt from '../components/ProcessAlt'
import WorkShowcase from '../components/WorkShowcase'
import Contact from '../components/Contact'
import { schedulePrefetchOnIdle } from '../utils/showcasePrefetch'
import SEO from '../components/SEO'

// Home-page hero iteration toggle.
//   true  → new wordmark/line/showreel layout (HeroV2; embeds its own
//           showreel so the standalone <Showreel /> below is skipped).
//   false → original Hero + standalone Showreel (the design that's been
//           live until now).
// Flip this single value to revert. Both Hero components remain in the
// codebase so no destructive change is needed to switch back.
const USE_V2_HERO = true

// Home-page pricing toggle.
//   true  → stripped-down ServicesTeaser (3-row tier strip + CTA to
//           /services for the full breakdown).
//   false → full Services component (same as the /services page).
// /services page is unaffected by this flag — it always shows the full
// pricing breakdown.
const USE_PRICING_TEASER = true

// FAQ pulls in @sanity/client (~50KB gz). Code-split it so it only loads
// when the homepage actually mounts the section.
const FAQ = lazy(() => import('../components/FAQ'))

export default function Home() {
  const { hash } = useLocation()

  // When the user lands on / with a hash (e.g. /#services from another page),
  // scroll to the section after layout settles.
  useEffect(() => {
    if (!hash) return
    const el = document.querySelector(hash)
    if (!el) return
    const t = setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 120)
    return () => clearTimeout(t)
  }, [hash])

  // Warm up Showcase during idle: JS chunk + first 8 above-the-fold media.
  // The remaining ~29 items are deferred until the user hovers/focuses the
  // Showcase nav link (see Navbar.jsx).
  useEffect(() => { schedulePrefetchOnIdle() }, [])

  return (
    <>
      <SEO
        path="/"
        description="Senior design studio for founders, startups, and product teams. Brand, product, and websites from one studio. No fragmented handoffs."
      />
      {USE_V2_HERO ? (
        <HeroV2 />
      ) : (
        <>
          <Hero />
          <Showreel />
        </>
      )}
      <WorkShowcase />
      <WhatWeDo />
      <ProcessAlt />
      {USE_PRICING_TEASER ? <ServicesTeaser /> : <Services />}
      <Suspense fallback={null}>
        <FAQ />
      </Suspense>
      <Contact />
    </>
  )
}
