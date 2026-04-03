import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ValueProps from './components/ValueProps'
import Services from './components/Services'
import ProcessAlt from './components/ProcessAlt'
import WorkShowcase from './components/WorkShowcase'
import About from './components/About'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Contact from './components/Contact'

// Register GSAP plugins once at app level
gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(lenis.raf)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      {/* <CustomCursor /> */}
      <Navbar />
      <main className="w-full h-full pt-20">
        <div data-cursor-zone>
          <Hero />
        </div>
        <ValueProps />
        <Services />
        <ProcessAlt />
        <div data-cursor-zone>
          <WorkShowcase />
        </div>
        <About />
        <Testimonials />
        <FAQ />
        <div data-cursor-zone>
          <Contact />
        </div>
      </main>
    </>
  )
}
