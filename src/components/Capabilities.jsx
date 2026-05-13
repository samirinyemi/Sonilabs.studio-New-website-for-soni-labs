import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../utils/motion'
import { isSlowOrMeteredConnection } from '../utils/network'
import { VideoSources } from '../utils/videoSources'

const whatWeDo = [
  'Web design',
  'Brand strategy',
  'Brand identity',
  'Logo & visual systems',
  'Product design (UI/UX)',
  'Design systems',
  'No-code development',
  'AI-assisted development',
  'Motion & micro-interactions',
]

const howWeDoIt = [
  {
    num: '01',
    title: 'Brand',
    body: 'Identity, strategy, logo, type, and colour. Built as a system that scales across every surface, not a deck that gets shelved.',
  },
  {
    num: '02',
    title: 'Web',
    body: 'Marketing sites with no-code execution in Framer, Webflow, or Wix Studio. CMS, analytics, SEO basics, deployed and handed over.',
  },
  {
    num: '03',
    title: 'Product',
    body: 'UI/UX for digital products your engineering team will build. End-to-end flows, design systems, interactive prototypes, and engineering handoff.',
  },
  {
    num: '04',
    title: 'AI-assisted production',
    body: 'Modern tooling that compresses timelines without compromising taste. An accelerator across every engagement, not a separate service line.',
  },
]

export default function Capabilities() {
  const container = useRef(null)
  const autoplay = !isSlowOrMeteredConnection()

  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.from('.cap-header', {
      y: 50, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.cap-header', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.cap-item', {
      y: 20, opacity: 0, duration: 0.6, stagger: 0.04, ease: 'power3.out',
      scrollTrigger: { trigger: '.cap-list', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.cap-row', {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.cap-rows', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.cap-showreel', {
      y: 80, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.cap-showreel', start: 'top 90%', toggleActions: 'play none none reverse' },
    })
  }, { scope: container })

  return (
    <section ref={container} id="capabilities" className="w-full py-20 md:py-32 px-4 md:px-6 bg-base-pure">
      <div className="max-w-[1600px] mx-auto">
        {/* Section header */}
        <div className="cap-header mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-4">// Capabilities</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-base-dark leading-tight">
              Everything under one roof.
            </h2>
          </div>
          <p className="text-subtle text-base md:text-lg max-w-md leading-relaxed">
            A complete bench of disciplines, applied selectively to whatever your engagement actually needs.
          </p>
        </div>

        {/* What we do — flat list */}
        <div className="mb-20 md:mb-32">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6">// What we do</p>
          <ul className="cap-list grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 border-t border-base-border pt-6">
            {whatWeDo.map((item, i) => (
              <li
                key={item}
                className="cap-item flex items-center gap-3 py-2 text-base md:text-lg text-base-dark"
              >
                <span className="font-mono text-xs text-accent-red shrink-0 w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Launch showreel — 16:9 to match the source video (3840×2160) */}
        <div className="cap-showreel relative w-full aspect-video overflow-hidden bg-base-dark mb-20 md:mb-32">
          <video
            autoPlay={autoplay}
            muted
            loop
            playsInline
            controls={!autoplay}
            preload="metadata"
            aria-hidden={autoplay ? 'true' : undefined}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <VideoSources src={`${import.meta.env.BASE_URL}showreel.mp4`} />
          </video>
        </div>

        {/* How we do it — expanded disciplines */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted mb-6">// How we do it</p>
          <div className="cap-rows border-t border-base-border">
            {howWeDoIt.map((d) => (
              <div
                key={d.num}
                className="cap-row grid grid-cols-12 gap-x-6 md:gap-x-8 gap-y-3 py-10 md:py-14 border-b border-base-border"
              >
                <div className="col-span-12 md:col-span-2">
                  <span className="font-mono text-4xl md:text-5xl font-normal text-base-dark leading-none">
                    {d.num}
                  </span>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-base-dark leading-tight">
                    {d.title}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-7">
                  <p className="text-subtle text-base md:text-lg leading-relaxed">
                    {d.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
