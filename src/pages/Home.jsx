import { lazy, Suspense, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import Showreel from '../components/Showreel'
import WhatWeDo from '../components/WhatWeDo'
import Services from '../components/Services'
import ProcessAlt from '../components/ProcessAlt'
import WorkShowcase from '../components/WorkShowcase'
import Contact from '../components/Contact'
import { schedulePrefetchOnIdle } from '../utils/showcasePrefetch'
import SEO from '../components/SEO'

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
        description="Senior design studio for founders, startups, and product teams. Brand, product, and websites from one studio — no fragmented handoffs."
      />
      <Hero />
      <Showreel />
      <WhatWeDo />
      <WorkShowcase />
      <ProcessAlt />
      <Services />
      <Suspense fallback={null}>
        <FAQ />
      </Suspense>
      <Contact />
    </>
  )
}
