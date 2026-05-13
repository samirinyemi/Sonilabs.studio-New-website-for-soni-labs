import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import Loader from './components/Loader'
import ThemeSwitcher from './components/ThemeSwitcher'
import Home from './pages/Home'
import { prefersReducedMotion } from './utils/motion'
import { LoaderContext } from './contexts/LoaderContext'

// `/` is the default landing route, so keep it in the main bundle.
// Other routes are lazy-loaded so each route's components only download
// when the user actually navigates there.
const ServicesPage  = lazy(() => import('./pages/Services'))
const AboutPage     = lazy(() => import('./pages/About'))
const ShowcasePage = lazy(() => import('./pages/Showcase'))
const ApproachPage  = lazy(() => import('./pages/Approach'))
const EnquirePage   = lazy(() => import('./pages/Enquire'))
const ProjectPage   = lazy(() => import('./pages/Project'))
const ProjectsPage  = lazy(() => import('./pages/Projects'))

gsap.registerPlugin(ScrollTrigger)

// Routes that should run as full-screen "app" experiences:
//   - top navbar hidden, floating bottom nav forced visible
//   - footer hidden so the page doesn't double-scroll
//   - main padding stripped so the page can fill the viewport edge-to-edge
const FULLSCREEN_ROUTES = new Set(['/showcase'])

// On every route change, jump to the top and refocus the main landmark
// so keyboard / screen-reader users land at the start of the new page
// rather than wherever focus was on the old one.
function ScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
    // Defer focus until the new route has mounted; using the existing
    // `tabindex="-1"` on <main> means it can be focused programmatically
    // without entering the tab order. Skip on first mount (no prior page).
    const main = document.getElementById('main')
    if (main) {
      // setTimeout 0 lets the lazy-loaded route render before focusing.
      const t = setTimeout(() => main.focus({ preventScroll: true }), 0)
      return () => clearTimeout(t)
    }
  }, [pathname, hash])
  return null
}

// Layout consumes useLocation, so it has to live inside <BrowserRouter>.
function AppLayout() {
  const { pathname } = useLocation()
  const isFullscreen = FULLSCREEN_ROUTES.has(pathname)
  const pageRef = useRef(null)

  // Page transition: fade-up the route content on every navigation. The
  // animation fires after the new page mounts, so lazy routes still feel
  // smooth (Suspense null fallback while loading, then fade-up on arrival).
  // Reduced-motion users skip the animation entirely.
  useEffect(() => {
    if (prefersReducedMotion() || !pageRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
    })
    return () => ctx.revert()
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTopOnNavigate />
      <CustomCursor />
      <ThemeSwitcher />
      {/* Skip-to-content for keyboard users — visually hidden until focused */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:px-4 focus:py-2 focus:bg-base-dark focus:text-base-pure focus:rounded-full focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider"
      >
        Skip to content
      </a>

      {/* Force the floating bottom-pill nav on full-screen routes so the
          user has navigation without the static top bar. */}
      {/* v2={true} = home-page iteration nav (no wordmark, no border line,
          menu+CTA grouped right). Flip to {false} to revert. */}
      <Navbar v2={true} forceFloating={isFullscreen} />

      <main
        id="main"
        tabIndex="-1"
        className={`w-full flex-1 ${isFullscreen ? '' : 'pt-20'}`}
      >
        <div ref={pageRef}>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/showcase" element={<ShowcasePage />} />
              <Route path="/approach" element={<ApproachPage />} />
              <Route path="/enquire" element={<EnquirePage />} />
            <Route path="/work/:slug" element={<ProjectPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            </Routes>
          </Suspense>
        </div>
      </main>

      {/* Footer hidden on full-screen routes so the page doesn't scroll
          past the gallery into a footer block. */}
      {!isFullscreen && <Footer />}
    </div>
  )
}

export default function App() {
  // First-load Loader gate. `loaderDone` flips to true the moment the
  // Loader begins its parallax exit, so the home page underneath can
  // start its hero animations as the loader peels away. Reset on every
  // App mount (hard refresh) — no localStorage persistence on purpose.
  const [loaderDone, setLoaderDone] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return
    // Skip Lenis on touch / coarse-pointer devices. Native mobile scroll
    // is already silky-smooth and adding a wheel-based smooth-scroll
    // library on top fights iOS's momentum scrolling, eats battery, and
    // costs ~20KB of JS we shouldn't ship to phones.
    if (typeof window !== 'undefined' &&
        window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    let lenis
    let cleanedUp = false
    // Defer the Lenis import until after first paint so it doesn't block
    // hydration. Keeps the initial bundle ~20KB lighter.
    import('lenis').then(({ default: Lenis }) => {
      if (cleanedUp) return
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time) => { lenis.raf(time * 1000) })
      gsap.ticker.lagSmoothing(0)
    })

    return () => {
      cleanedUp = true
      if (lenis) {
        gsap.ticker.remove(lenis.raf)
        lenis.destroy()
      }
    }
  }, [])

  return (
    <LoaderContext.Provider value={{ loaderDone }}>
      {/* Loader is always mounted on first App mount; it returns null
          itself once its exit animation completes, so we don't need to
          conditionally unmount it (that would cut off the parallax). */}
      <Loader onExitStart={() => setLoaderDone(true)} />
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </LoaderContext.Provider>
  )
}
