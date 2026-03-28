import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
  return (
    <>
      <Navbar />
      <main className="w-full h-full pt-20">
        <Hero />
        <ValueProps />
        <Services />
        <ProcessAlt />
        <WorkShowcase />
        <About />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
    </>
  )
}
