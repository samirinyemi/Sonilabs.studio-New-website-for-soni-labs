// Showcase prefetch — three tiers, increasing cost.
//
// 1. prefetchShowcaseChunk(): pulls the lazy-loaded JS chunk so the page
//    mounts instantly when the user clicks Showcase. Cheap.
// 2. prefetchShowcasePriority(): prefetches the first 8 above-the-fold
//    media items so the initial Showcase viewport renders from cache.
//    Moderate cost (~10 MB).
// 3. prefetchShowcaseAll(): prefetches the remaining ~29 items. Heavy
//    (~80–100 MB). Only triggered on user intent (hover/focus on the
//    Showcase nav link) and skipped on slow/data-saver connections.
//
// File-name list is duplicated from src/pages/Showcase.jsx. If items are
// added/removed there, update this list — they won't break, they just
// won't get prefetched.

const MEDIA_BASE = `${import.meta.env.BASE_URL}showcase-media/`
const mediaSrc = (file) => `${MEDIA_BASE}${encodeURIComponent(file)}`

const PRIORITY_FILES = [
  'Slate — One card. Every currency. Zero friction..webp',
  'Aura — This Card is Soul.webp',
  'Heritage.webp',
  'Atlas AI — One API for every AI model.webp',
  'D5 — Velour (13).webp',
  'D9 — Axis Talent Agency.webp',
  'D11 — Bloom Roastery · Studio.webp',
  'Edge of Light.webp',
]

const REMAINING_FILES = [
  'Kairo Maye — Sports Editorial.webp',
  'Nova — Generate Stunning AI Images.webp',
  'Pulse — Sound Meets Soul.webp',
  'Silentship.webp',
  'haus — The Rebirth of Real Estate.webp',
  'A-News — Train. Recover. Repeat..webp',
  'Body.webp',
  'D10 — Nia Obi · Web Designer · Art Director.webp',
  'D2 — Fold Atelier.webp',
  'D3 — Maren Studio · Voss portfolio.webp',
  'D4 — Sato ® · Photography.webp',
  'D6 — Meridian Atelier · Perfume essay.webp',
  'D8 - Crumb - Bakery and Cafe.webp',
  'Device Mockup By Soni Labs3.webp',
  'Hero.webp',
  'Vision Board.webp',
  'Desktop Elegant 2.mp4',
  'Desktop---14.mp4',
  'Desktop---15---Elegant.mp4',
  'Desktop---15---Elegant (2).mp4',
  'Desktop---17---Elegant.mp4',
  'Frame-197---Elegant.mp4',
  'Frame-197---Elegant (1).mp4',
  'Frame-199---Elegant.mp4',
  'Frame-200.mp4',
  'Frame-203.mp4',
  'Moon---Elegant.mp4',
  'Image---Elegant.mp4',
  '1219(1).mp4',
]

let chunkDone = false
let priorityDone = false
let allDone = false

function isSlowConnection() {
  if (typeof navigator === 'undefined') return false
  const c = navigator.connection
  if (!c) return false
  if (c.saveData) return true
  if (c.effectiveType === '2g' || c.effectiveType === 'slow-2g') return true
  return false
}

function injectPrefetch(href, asType) {
  if (typeof document === 'undefined') return
  // Avoid duplicating existing prefetch links
  if (document.querySelector(`link[rel="prefetch"][href="${CSS.escape(href)}"]`)) return
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  if (asType) link.as = asType
  document.head.appendChild(link)
}

function asTypeFor(file) {
  return file.endsWith('.mp4') ? 'video' : 'image'
}

export function prefetchShowcaseChunk() {
  if (chunkDone) return
  chunkDone = true
  // Vite splits Showcase into its own chunk; this fetches and caches it
  // without executing it. The page mounts instantly on later navigation.
  import('../pages/Showcase').catch(() => { chunkDone = false })
}

export function prefetchShowcasePriority() {
  if (priorityDone) return
  if (isSlowConnection()) return
  priorityDone = true
  PRIORITY_FILES.forEach((f) => injectPrefetch(mediaSrc(f), asTypeFor(f)))
}

export function prefetchShowcaseAll() {
  if (allDone) return
  if (isSlowConnection()) return
  allDone = true
  REMAINING_FILES.forEach((f) => injectPrefetch(mediaSrc(f), asTypeFor(f)))
}

// Convenience: schedule chunk + priority during browser idle time so the
// homepage paint isn't disturbed.
export function schedulePrefetchOnIdle() {
  if (typeof window === 'undefined') return
  const run = () => {
    prefetchShowcaseChunk()
    prefetchShowcasePriority()
  }
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(run, { timeout: 4000 })
  } else {
    setTimeout(run, 1500)
  }
}
