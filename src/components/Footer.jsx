import { Link } from 'react-router-dom'
import {
  prefetchShowcaseChunk,
  prefetchShowcasePriority,
  prefetchShowcaseAll,
} from '../utils/showcasePrefetch'

const CALENDLY_URL = 'https://calendly.com/madebysoni/30min'

const showcaseIntent = () => {
  prefetchShowcaseChunk()
  prefetchShowcasePriority()
  prefetchShowcaseAll()
}

export default function Footer() {
  return (
    <footer className="relative w-full bg-white text-base-dark overflow-hidden" role="contentinfo">
      {/* Top divider — full-width black line that respects the site's
          horizontal padding (max-w-[1600px] + px-6 md:px-10), the same container
          every other footer row uses. */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="h-px bg-base-dark" />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-16 md:pt-20 pb-32 md:pb-48">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 mb-10">
          <div className="lg:col-span-4">
            <p className="font-display font-bold text-2xl md:text-3xl tracking-tighter leading-[1.1] text-base-dark max-w-xs">
              Brands, products, and<br />websites - built under one roof.
            </p>
          </div>

          <div className="lg:col-span-8 flex flex-wrap justify-start lg:justify-end gap-x-12 lg:gap-x-16 gap-y-10">
            <div>
              <h4 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">Pricing &amp; Engagements</h4>
              <ul className="space-y-3">
                <li><Link to="/#services" className="text-gray-700 text-sm hover:text-base-dark transition-colors">Brand + Website</Link></li>
                <li><Link to="/#services" className="text-gray-700 text-sm hover:text-base-dark transition-colors">Product Design (UI/UX)</Link></li>
                <li><Link to="/#services" className="text-gray-700 text-sm hover:text-base-dark transition-colors">Design Partner</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link to="/showcase" onMouseEnter={showcaseIntent} onFocus={showcaseIntent} onTouchStart={showcaseIntent} className="text-gray-700 text-sm hover:text-base-dark transition-colors">Showcase</Link></li>
                <li><Link to="/approach" className="text-gray-700 text-sm hover:text-base-dark transition-colors">Approach</Link></li>
                <li><Link to="/about" className="text-gray-700 text-sm hover:text-base-dark transition-colors">About</Link></li>
                <li><Link to="/#faq" className="text-gray-700 text-sm hover:text-base-dark transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4">Contact</h4>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-base-dark text-white rounded-full font-medium text-sm hover:bg-base-dark-soft transition-colors"
              >
                Book a call
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom row: copyright on the left, social links on the right —
          shares the same max-w-[1600px] page container as the rest of the
          footer so both respect the site's margins. The oversized "Soni
          Labs" wordmark sits below this row and is cropped at the page
          edge so its bottom third peeks below the footer. */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-0">
          <span className="font-mono text-xs text-gray-500 leading-snug">
            &copy; 2026 Soni labs Studio.<br />All rights reserved.
          </span>
          <ul className="flex flex-wrap md:justify-end gap-x-5 md:gap-x-7 gap-y-2">
            {[
              { label: 'Email',     href: 'mailto:hello@madebysoni.com' },
              { label: 'Instagram', href: 'https://www.instagram.com/samirinyemi/' },
              { label: 'Twitter',   href: 'https://x.com/samuel_uiux' },
              { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/samuel-irinyemi-703643183/' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="group inline-flex items-baseline gap-1.5 font-mono text-xs md:text-sm uppercase tracking-[0.15em] text-gray-500 hover:text-base-dark transition-colors"
                >
                  {label}
                  <svg
                    aria-hidden="true"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="translate-y-[1px] transition-transform duration-200 ease-out group-hover:-translate-y-px group-hover:translate-x-px"
                  >
                    <path d="M2 8 L8 2 M8 2 H3.5 M8 2 V6.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div
          aria-hidden="true"
          className="relative w-full overflow-hidden pointer-events-none select-none"
          // `container-type: inline-size` lets the inner span size with
          // `cqw` units — i.e. 22% of THIS container's width, not the
          // viewport's. That keeps the wordmark spanning the full
          // max-w-[1600px] frame at every viewport ≥1280px, instead of
          // being capped by a vw-based clamp.
          style={{ containerType: 'inline-size' }}
        >
          <span
            className="block w-full font-display font-bold tracking-tighter text-base-dark leading-[0.8] whitespace-nowrap text-center"
            // 26cqw — calibrated so "Soni Labs" with Aeonik bold +
            // tracking-tighter spans the container edge-to-edge.
            // translateY uses em so the crop ratio stays consistent at
            // every size; 0.15em clips only the bottom ~15% of the
            // letterforms (less aggressive than the previous 0.28em).
            style={{ fontSize: '23cqw', transform: 'translateY(0.15em)' }}
          >
            Soni Labs
          </span>
        </div>
      </div>
    </footer>
  )
}
