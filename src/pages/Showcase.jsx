import { useState, useEffect, useRef, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Lenis from 'lenis'
import { LayoutGrid, LayoutList, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { prefersReducedMotion } from '../utils/motion'
import { loadShowcaseState, saveShowcaseState } from '../utils/showcaseSession'
import { VideoSources } from '../utils/videoSources'
import SEO from '../components/SEO'


// Real media. Each item's `w`/`h` are the asset's native pixel dimensions —
// the wrapper div uses `aspect-ratio: w/h` so the box matches the asset
// exactly and there's no cropping (object-cover is a no-op when aspects
// match). Files live in /public/showcase-media/.
const MEDIA_BASE = `${import.meta.env.BASE_URL}showcase-media/`
const mediaSrc = (file) => `${MEDIA_BASE}${encodeURIComponent(file)}`

// All 38 media in /public/showcase-media wired in. Adding more later? Just
// append a new entry — `<MobileGridView />` and `<GridView />` both pick
// up new items automatically; `STRIDE` and `COL_COUNT` stay stable as long
// as items.length doesn't pass ~75. If it does, retune STRIDE for a small
// (COL_COUNT × STRIDE) mod items.length value.
//
// `w` and `h` are the file's *displayed* pixel dimensions. For videos with
// rotation metadata (mdls reports storage dimensions, browsers respect
// the rotation), we use the displayed orientation here.
const items = [
  // ── Brand / web case images ──
  { id: '00', name: 'slate',      type: 'image', file: 'Slate — One card. Every currency. Zero friction..webp', w: 1742, h: 1053 },
  { id: '01', name: 'aura',       type: 'image', file: 'Aura — This Card is Soul.webp',                          w: 1742, h: 1065 },
  { id: '02', name: 'heritage',   type: 'image', file: 'Heritage.webp',                                          w: 1775, h: 1119 },
  { id: '03', name: 'atlas',      type: 'image', file: 'Atlas AI — One API for every AI model.webp',             w: 1742, h: 1053 },
  { id: '04', name: 'velour',     type: 'image', file: 'D5 — Velour (13).webp',                                  w: 1742, h: 1053 },
  { id: '05', name: 'axis',       type: 'image', file: 'D9 — Axis Talent Agency.webp',                           w: 1742, h: 1053 },
  { id: '06', name: 'bloom',      type: 'image', file: 'D11 — Bloom Roastery · Studio.webp',                     w: 1742, h: 1053 },
  { id: '07', name: 'edge',       type: 'image', file: 'Edge of Light.webp',                                     w: 1742, h: 1119 },
  { id: '08', name: 'kairo',      type: 'image', file: 'Kairo Maye — Sports Editorial.webp',                     w: 1742, h: 1053 },
  { id: '09', name: 'nova',       type: 'image', file: 'Nova — Generate Stunning AI Images.webp',                w: 1742, h: 1053 },
  { id: '10', name: 'pulse',      type: 'image', file: 'Pulse — Sound Meets Soul.webp',                          w: 1743, h: 1065 },
  { id: '11', name: 'silent',     type: 'image', file: 'Silentship.webp',                                        w: 1742, h: 1046 },
  { id: '12', name: 'haus',       type: 'image', file: 'haus — The Rebirth of Real Estate.webp',                 w: 1742, h: 1053 },
  { id: '13', name: 'anews',      type: 'image', file: 'A-News — Train. Recover. Repeat..webp',                  w: 1742, h: 1063 },
  { id: '14', name: 'body',       type: 'image', file: 'Body.webp',                                              w: 1709, h: 1053 },
  { id: '15', name: 'nia',        type: 'image', file: 'D10 — Nia Obi · Web Designer · Art Director.webp',       w: 1742, h: 1053 },
  { id: '16', name: 'fold',       type: 'image', file: 'D2 — Fold Atelier.webp',                                 w: 1742, h: 1053 },
  { id: '17', name: 'maren',      type: 'image', file: 'D3 — Maren Studio · Voss portfolio.webp',                w: 1742, h: 1053 },
  { id: '18', name: 'sato',       type: 'image', file: 'D4 — Sato ® · Photography.webp',                         w: 1742, h: 1053 },
  { id: '19', name: 'meridian',   type: 'image', file: 'D6 — Meridian Atelier · Perfume essay.webp',             w: 1742, h: 1053 },
  { id: '20', name: 'crumb',      type: 'image', file: 'D8 - Crumb - Bakery and Cafe.webp',                      w: 1742, h: 1053 },
  { id: '21', name: 'mockup',     type: 'image', file: 'Device Mockup By Soni Labs3.webp',                       w: 2880, h: 1951 },
  { id: '22', name: 'hero',       type: 'image', file: 'Hero.webp',                                              w: 1742, h: 1053 },
  { id: '23', name: 'vision',     type: 'image', file: 'Vision Board.webp',                                      w: 1742, h: 1047 },

  // ── Motion / video ──
  { id: '24', name: 'desktop-2',  type: 'video', file: 'Desktop Elegant 2.mp4',                                 w: 1920, h: 1920 },
  { id: '28', name: 'desktop-17', type: 'video', file: 'Desktop---17---Elegant.mp4',                            w: 2418, h: 2160 },
  { id: '29', name: 'frame-197',  type: 'video', file: 'Frame-197---Elegant.mp4',                               w: 2482, h: 2160 },
  { id: '31', name: 'frame-199',  type: 'video', file: 'Frame-199---Elegant.mp4',                               w: 2506, h: 2160 },
  { id: '32', name: 'frame-200',  type: 'video', file: 'Frame-200.mp4',                                         w: 2506, h: 2160 },
  { id: '33', name: 'frame-203',  type: 'video', file: 'Frame-203.mp4',                                         w: 2506, h: 2160 },
  { id: '34', name: 'moon',       type: 'video', file: 'Moon---Elegant.mp4',                                    w: 3038, h: 2160 },
  { id: '35', name: 'image',      type: 'video', file: 'Image---Elegant.mp4',                                   w: 2596, h: 2160 },
  { id: '36', name: '1219',       type: 'video', file: '1219(1).mp4',                                           w: 2910, h: 2160 },
]

function isLandscape(item) {
  return item.w / item.h > 1
}

// Sequential 3-digit label derived from item.id (which is zero-indexed
// "00", "01", …). Displayed everywhere instead of the file-derived name.
function itemLabel(item) {
  return String(parseInt(item.id, 10) + 1).padStart(3, '0')
}

// Renders the actual <img> or <video> for a given item. Performance:
//   - images use loading="lazy" + decoding="async" → off-screen items don't
//     fetch or decode until they enter the viewport.
//   - videos use preload="metadata" + no autoplay → only first-frame
//     metadata loads (~50–150KB each); they don't compete for decode/paint
//     budget while the user is panning.
// Phone-vs-tablet+ viewport detection. The 2D pan canvas is great on
// pointer-and-wheel devices but fights native gestures on a phone, so we
// branch the layout below 768px to a vertical-scroll masonry instead.
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches
  )
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    const handler = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [breakpoint])
  return isMobile
}

// Videos only play while they're actually in view. Off-screen videos are
// paused so the browser doesn't decode 6+ video streams simultaneously
// (the main cause of grid lag). Images use native lazy loading.
function ItemMedia({ item }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (item.type !== 'video') return
    const el = videoRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.play().catch(() => { /* autoplay may be blocked; ignore */ })
          } else {
            el.pause()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [item.type])

  if (item.type === 'video') {
    return (
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="metadata"
        className="block w-full h-full object-cover pointer-events-none"
      >
        <VideoSources src={mediaSrc(item.file)} />
      </video>
    )
  }
  return (
    <img
      src={mediaSrc(item.file)}
      alt={`${item.name.charAt(0).toUpperCase() + item.name.slice(1)} — design concept by Soni Labs`}
      loading="lazy"
      decoding="async"
      className="block w-full h-full object-cover pointer-events-none"
    />
  )
}

// ── Hook: Lenis smooth scroll on a container, with optional infinite-loop
// reset (the list view rail uses this; the masonry grid skips the reset
// because CSS columns redistribute items in a way the reset can't track).
function useSmoothContainerScroll(containerRef, options = {}) {
  const { infiniteSelector = null } = options
  const lenisRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (prefersReducedMotion()) {
      // No Lenis under reduced motion. If infinite-loop selector is given,
      // wire it to native scroll.
      if (!infiniteSelector) return
      let setHeight = 0
      let ready = false
      const init = () => {
        const inner = container.querySelector(infiniteSelector)
        if (!inner) return
        setHeight = inner.scrollHeight / 3
        container.scrollTop = setHeight
        ready = true
      }
      const handleScroll = () => {
        if (!ready) return
        const top = container.scrollTop
        if (top >= setHeight * 2) container.scrollTop = top - setHeight
        else if (top < setHeight * 0.5) container.scrollTop = top + setHeight
      }
      requestAnimationFrame(init)
      container.addEventListener('scroll', handleScroll, { passive: true })
      return () => container.removeEventListener('scroll', handleScroll)
    }

    const lenis = new Lenis({
      wrapper: container,
      content: container.firstElementChild || container,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.075,
      lerp: 0.09,
    })
    lenisRef.current = lenis

    if (infiniteSelector) {
      let setHeight = 0
      let ready = false
      const init = () => {
        const inner = container.querySelector(infiniteSelector)
        if (!inner) return
        setHeight = inner.scrollHeight / 3
        lenis.scrollTo(setHeight, { immediate: true, force: true })
        ready = true
      }
      lenis.on('scroll', ({ scroll }) => {
        if (!ready) return
        if (scroll >= setHeight * 2) {
          lenis.scrollTo(scroll - setHeight, { immediate: true, force: true })
        } else if (scroll < setHeight * 0.5) {
          lenis.scrollTo(scroll + setHeight, { immediate: true, force: true })
        }
      })
      requestAnimationFrame(init)
    }

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, infiniteSelector])

  return lenisRef
}

// ── Mobile Grid View — single-render vertical masonry ─────────────────
// Phones get a 1–2 column native-scroll masonry. No 2D pan, no virtualization,
// no toggle to a split-screen list. Tap a tile → lightbox. Light DOM (one
// element per item), buttery scroll, video play still gated by
// IntersectionObserver inside <ItemMedia />.
function MobileGridView({ items, onSelect }) {
  return (
    <div
      data-lenis-prevent
      className="h-full w-full overflow-y-auto"
      style={{ scrollbarWidth: 'none', overscrollBehavior: 'contain' }}
    >
      <div className="columns-1 sm:columns-2 gap-3 p-3 pt-16 pb-6">
        {items.map((item, idx) => (
          <div key={item.id} className="break-inside-avoid mb-3">
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="font-mono text-[10px] text-base-dark">{itemLabel(item)}</span>
            </div>
            <button
              type="button"
              onClick={() => onSelect(idx)}
              aria-label={`Open ${itemLabel(item)}`}
              data-cursor="view"
              className="block w-full overflow-hidden"
            >
              <div
                className="w-full overflow-hidden"
                style={{ aspectRatio: `${item.w}/${item.h}` }}
              >
                <ItemMedia item={item} />
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Grid View — 2D infinite pan via virtualized 2×2 cell tiling ────────
// Four DOM cells in a 2×2 layout always cover the viewport; each cell
// holds the same unit content (a scattered art-gallery layout where
// items sit at deterministic random positions, no row/column reading).
// Per-frame rAF positions the 4 cells via transform so wherever the user
// pans, valid content is visible. Performance:
//   • IntersectionObserver in <ItemMedia /> pauses videos that aren't in
//     view → at most a handful of video sources decode at any time.
//   • Images use loading="lazy" + decoding="async".
//   • Cells use will-change: transform + contain: paint so off-screen
//     cells skip paint work.
const ITEM_WIDTH = 220    // px — every item renders at this width; height
                          //      follows from each item's native aspect.
const UNIT_W = 1800       // px — unit-cell width (tile size).
const UNIT_H = 1500       // px — unit-cell height. Sized so 38 items fit
                          //      with breathing room and no edge crowding.
const ITEM_PADDING = 32   // px — minimum gap between two items.

// Mulberry32 — simple deterministic PRNG so the scatter is stable across
// reloads and consistent across cells / tiles.
function mulberry32(seed) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Compute random non-overlapping (x, y) for each item inside an
// UNIT_W × UNIT_H box. Falls back to a slightly relaxed-padding pass if
// it can't find a slot, so every item is guaranteed a position even if
// the cell is dense.
function computeScatter(items, seed = 7) {
  const rand = mulberry32(seed)
  const placed = []
  const tryPlace = (item, padding) => {
    const w = ITEM_WIDTH
    const h = ITEM_WIDTH * (item.h / item.w)
    for (let attempt = 0; attempt < 80; attempt++) {
      const x = rand() * (UNIT_W - w)
      const y = rand() * (UNIT_H - h)
      const overlaps = placed.some((p) =>
        !(x + w + padding < p.x ||
          x > p.x + p.w + padding ||
          y + h + padding < p.y ||
          y > p.y + p.h + padding)
      )
      if (!overlaps) return { x, y, w, h }
    }
    return null
  }
  items.forEach((item) => {
    let pos = tryPlace(item, ITEM_PADDING)
    if (!pos) pos = tryPlace(item, ITEM_PADDING / 2)
    if (!pos) pos = tryPlace(item, 0)
    if (!pos) {
      // Final fallback — place at a deterministic spot based on index.
      const w = ITEM_WIDTH
      const h = ITEM_WIDTH * (item.h / item.w)
      pos = { x: rand() * (UNIT_W - w), y: rand() * (UNIT_H - h), w, h }
    }
    placed.push(pos)
  })
  return placed
}

function GridView({ items, onSelect }) {

  const containerRef = useRef(null)
  const cellsRef = useRef([null, null, null, null])
  // Scattered positions are deterministic per item — computed once.
  const positions = useMemo(() => computeScatter(items), [items])

  // Restore pan position from sessionStorage so the user lands at the same
  // viewport coordinates after returning to /showcase from another route.
  const stateRef = useRef((() => {
    const persisted = loadShowcaseState() || {}
    const px = persisted.panX ?? 0
    const py = persisted.panY ?? 0
    return {
      targetX: px, targetY: py,
      currentX: px, currentY: py,
      isDragging: false,
      lastPointerX: 0, lastPointerY: 0,
      distance: 0,
    }
  })())

  // Save the latest pan offset on unmount so a return navigation can
  // resume from where the user left off.
  useEffect(() => {
    return () => {
      saveShowcaseState({
        panX: stateRef.current.targetX,
        panY: stateRef.current.targetY,
      })
    }
  }, [])
  // Per-frame: lerp current toward target, then translate the 4 cells so
  // they always cover the viewport regardless of pan distance. The unit
  // cell size is fixed (UNIT_W × UNIT_H), so no measurement is needed.
  useEffect(() => {
    if (prefersReducedMotion()) return
    let raf
    const lerp = 0.12
    const tick = () => {
      const s = stateRef.current
      s.currentX += (s.targetX - s.currentX) * lerp
      s.currentY += (s.targetY - s.currentY) * lerp

      const tileX = Math.floor(s.currentX / UNIT_W)
      const tileY = Math.floor(s.currentY / UNIT_H)

      const slots = [
        [tileX,     tileY    ],
        [tileX + 1, tileY    ],
        [tileX,     tileY + 1],
        [tileX + 1, tileY + 1],
      ]
      slots.forEach(([sx, sy], i) => {
        const el = cellsRef.current[i]
        if (!el) return
        const px = sx * UNIT_W - s.currentX
        const py = sy * UNIT_H - s.currentY
        el.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0)`
      })

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Wheel — non-passive so we can preventDefault. Maps deltaX/Y to 2D pan.
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleWheel = (e) => {
      e.preventDefault()
      const s = stateRef.current
      s.targetY += e.deltaY
      s.targetX += e.deltaX
    }
    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [])

  const onPointerDown = (e) => {
    if (e.target.closest('button')) return
    const s = stateRef.current
    s.isDragging = true
    s.lastPointerX = e.clientX
    s.lastPointerY = e.clientY
    s.distance = 0
    containerRef.current.style.cursor = 'grabbing'
    containerRef.current.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    const s = stateRef.current
    if (!s.isDragging) return
    const dx = e.clientX - s.lastPointerX
    const dy = e.clientY - s.lastPointerY
    s.lastPointerX = e.clientX
    s.lastPointerY = e.clientY
    s.distance += Math.abs(dx) + Math.abs(dy)
    s.targetX -= dx
    s.targetY -= dy
  }

  const onPointerUp = (e) => {
    const s = stateRef.current
    if (!s.isDragging) return
    s.isDragging = false
    containerRef.current.style.cursor = ''
    containerRef.current.releasePointerCapture?.(e.pointerId)
  }

  const onClickCapture = (e) => {
    if (stateRef.current.distance > 6) {
      e.preventDefault()
      e.stopPropagation()
      stateRef.current.distance = 0
    }
  }

  // Each unit cell is a fixed UNIT_W × UNIT_H box. Items sit at their
  // pre-computed scatter positions via absolute placement — no rows or
  // columns, so the eye doesn't read the gallery as a grid.
  const renderUnitCell = () => (
    <div className="relative" style={{ width: `${UNIT_W}px`, height: `${UNIT_H}px` }}>
      {items.map((item, i) => {
        const pos = positions[i]
        if (!pos) return null
        return (
          <div
            key={item.id}
            className="absolute"
            style={{ left: `${pos.x}px`, top: `${pos.y}px`, width: `${pos.w}px` }}
          >
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-mono text-[11px] text-base-dark">{itemLabel(item)}</span>
            </div>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Open ${itemLabel(item)}`}
              data-cursor="view"
              className="block w-full overflow-hidden"
              draggable={false}
            >
              <div
                className="w-full overflow-hidden"
                style={{ aspectRatio: `${item.w}/${item.h}` }}
              >
                <ItemMedia item={item} />
              </div>
            </button>
          </div>
        )
      })}
    </div>
  )

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onClickCapture={onClickCapture}
      data-cursor="drag"
      className="relative h-full w-full overflow-hidden cursor-grab select-none"
      style={{ touchAction: 'none' }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          ref={(el) => (cellsRef.current[i] = el)}
          className="absolute top-0 left-0"
          // contain: paint isolates each cell as its own paint container so
          // off-screen cells don't pollute the parent's paint work.
          style={{ willChange: 'transform', contain: 'paint' }}
        >
          {renderUnitCell()}
        </div>
      ))}
    </div>
  )
}

// ── List View — split rail + detail; rail loops infinitely ─────────────
function ListView({ items, selectedIndex, onSelect }) {
  const listRef = useRef(null)
  const skipObserver = useRef(false)
  const skipTimeoutRef = useRef(null)
  const selected = items[selectedIndex]
  const repeated = useMemo(() => [...items, ...items, ...items], [items])

  useSmoothContainerScroll(listRef, { infiniteSelector: '.pf-list-inner' })

  const handleSelect = (idx) => {
    skipObserver.current = true
    if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current)
    skipTimeoutRef.current = setTimeout(() => { skipObserver.current = false }, 700)
    onSelect(idx)
  }

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (skipObserver.current) return
        let best = null
        let bestRatio = 0
        entries.forEach((entry) => {
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio
            best = entry.target
          }
        })
        if (best) {
          const idx = parseInt(best.dataset.idx, 10)
          if (!Number.isNaN(idx)) onSelect(idx)
        }
      },
      {
        root: list,
        threshold: [0.5, 0.75, 1],
        rootMargin: '-35% 0px -35% 0px',
      }
    )

    list.querySelectorAll('[data-idx]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  // Landscape: anchor to width up to 6xl (1152px) so wide items don't shrink
  // to a postcard. Portrait/square: anchor to height up to 88vh — gives
  // tall items room to breathe without overflowing the rail/detail row.
  const fitClass = isLandscape(selected)
    ? 'w-full max-w-6xl max-h-[88vh]'
    : 'h-full max-h-[88vh] max-w-full'

  return (
    <div className="h-full flex gap-4 md:gap-6 px-4 md:px-6 py-4 md:py-6">
      <div
        ref={listRef}
        data-lenis-prevent
        className="w-44 md:w-56 shrink-0 overflow-y-auto"
        style={{ scrollbarWidth: 'none', overscrollBehavior: 'contain' }}
      >
        <div className="pf-list-inner space-y-2">
          {repeated.map((item, dupeIdx) => {
            const origIdx = dupeIdx % items.length
            const isActive = selectedIndex === origIdx
            return (
              <div key={`${item.id}-${dupeIdx}`} className="relative">
                <button
                  type="button"
                  data-idx={origIdx}
                  data-cursor="view"
                  onClick={() => handleSelect(origIdx)}
                  aria-label={`View ${itemLabel(item)}`}
                  aria-current={isActive ? 'true' : undefined}
                  style={{ aspectRatio: `${item.w}/${item.h}` }}
                  className={`relative block h-20 md:h-24 overflow-hidden transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  <div className="absolute inset-0">
                    <ItemMedia item={item} />
                  </div>
                  {isActive && (
                    <span aria-hidden="true" className="absolute inset-0 ring-1 ring-base-dark" />
                  )}
                </button>
                {isActive && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-full ml-3 whitespace-nowrap pointer-events-none">
                    <p className="font-mono text-xs text-base-dark leading-tight">{itemLabel(item)}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center min-w-0">
        <div
          key={selected.id}
          className={`block overflow-hidden ${fitClass}`}
          style={{ aspectRatio: `${selected.w}/${selected.h}` }}
        >
          <ItemMedia item={selected} />
        </div>
      </div>
    </div>
  )
}

// ── Lightbox ───────────────────────────────────────────────────────────
// The overlay (black backdrop) only fades in/out on open/close. The image
// itself animates on every item change via a separate timeline. Splitting
// the dependencies eliminates the prev/next flicker that came from
// re-fading the whole modal on every navigation.
function Lightbox({ open, items, index, onClose, onPrev, onNext }) {
  const overlayRef = useRef(null)
  const imgRef = useRef(null)
  const item = index !== null ? items[index] : null

  // Backdrop fade — only on open/close.
  useGSAP(
    () => {
      if (!open || prefersReducedMotion()) return
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
    },
    { dependencies: [open] }
  )

  // Image scale-in — fires on open AND on every item change.
  useGSAP(
    () => {
      if (!open || !item || prefersReducedMotion()) return
      gsap.fromTo(
        imgRef.current,
        { scale: 0.94, y: 12, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
      )
    },
    { dependencies: [item?.id] }
  )

  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onNext()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'Tab') {
        // Focus trap — loop Tab between the lightbox's interactive elements
        // so keyboard users don't escape back to the underlying page.
        const overlay = overlayRef.current
        if (!overlay) return
        const focusables = overlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])')
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    // Park focus on the close button when the lightbox opens so the very
    // next Tab cycles inside the modal.
    const overlay = overlayRef.current
    const firstButton = overlay?.querySelector('button')
    firstButton?.focus()
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose, onNext, onPrev])

  if (!open || !item) return null

  return createPortal(
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.id} ${item.name}`}
      onClick={onClose}
      className="fixed inset-0 z-[200] bg-base-dark/55 flex items-center justify-center p-8 md:p-16"
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose() }}
        aria-label="Close"
        className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors z-10"
      >
        <X size={22} strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        aria-label="Previous"
        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
      >
        <ChevronLeft size={24} strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onNext() }}
        aria-label="Next"
        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
      >
        <ChevronRight size={24} strokeWidth={1.5} />
      </button>

      <div
        ref={imgRef}
        onClick={(e) => e.stopPropagation()}
        className="relative overflow-hidden"
        style={{
          aspectRatio: `${item.w}/${item.h}`,
          maxHeight: '82vh',
          maxWidth: '88vw',
          height: isLandscape(item) ? 'auto' : '82vh',
          width: isLandscape(item) ? 'min(88vw, 80rem)' : 'auto',
        }}
      >
        {item.type === 'video' ? (
          <video
            key={item.id}
            autoPlay
            muted
            loop
            playsInline
            className="block w-full h-full object-cover"
          >
            <VideoSources src={mediaSrc(item.file)} />
          </video>
        ) : (
          <img
            src={mediaSrc(item.file)}
            alt={`${item.name.charAt(0).toUpperCase() + item.name.slice(1)} — design concept by Soni Labs`}
            className="block w-full h-full object-cover"
          />
        )}
      </div>

      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-baseline gap-3 pointer-events-none">
        <span className="font-mono text-xs text-white/85">{item.id}</span>
        <span className="font-mono text-xs text-white/60">{item.name}</span>
      </div>
    </div>,
    document.body
  )
}

// ── Page ───────────────────────────────────────────────────────────────
export default function ShowcasePage() {
  // Lazy-init from sessionStorage so navigating away and returning lands
  // the user back where they were (view mode, list selection, lightbox).
  const [view, setView] = useState(() => loadShowcaseState()?.view ?? 'grid')
  const [selectedIndex, setSelectedIndex] = useState(() => loadShowcaseState()?.selectedIndex ?? 0)
  const [lightboxIndex, setLightboxIndex] = useState(() => loadShowcaseState()?.lightboxIndex ?? null)
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  // Back button — go to the previous page if we have history; otherwise
  // fall back to home. window.history.length includes the current entry,
  // so anything beyond the first entry means we have somewhere to go back to.
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }

  // Persist any change to sessionStorage. Cheap, runs on each state update.
  useEffect(() => {
    saveShowcaseState({ view, selectedIndex, lightboxIndex })
  }, [view, selectedIndex, lightboxIndex])

  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const lightboxNext = () =>
    setLightboxIndex((i) => (i === null ? 0 : (i + 1) % items.length))
  const lightboxPrev = () =>
    setLightboxIndex((i) =>
      i === null ? 0 : (i - 1 + items.length) % items.length
    )

  useGSAP(
    () => {
      if (prefersReducedMotion()) return
      gsap.fromTo(
        '.pf-content',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
    },
    { dependencies: [view] }
  )

  return (
    <>
      <SEO
        title="Showcase"
        path="/showcase"
        description="Brand and product design from Soni Labs — case work and concept explorations across editorial, fintech, hospitality, and sport."
      />
      <h1 className="sr-only">Showcase — Soni Labs Studio</h1>

      {/* Keyboard skip-link — lets keyboard users jump past the long pan
          canvas / list of thumbnails to the page controls without
          tabbing through every item. */}
      <a
        href="#showcase-controls"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[210] focus:px-4 focus:py-2 focus:bg-base-dark focus:text-base-pure focus:rounded-full focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider"
      >
        Skip to gallery controls
      </a>

      <section id="showcase-controls" className="relative w-full h-screen overflow-hidden bg-canvas">
        {/* Back button — top-left. Returns to the previous page in
            history, or falls back to home for direct landings. */}
        {!isMobile && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to previous page"
            className="absolute top-3 md:top-5 left-3 md:left-6 z-20 inline-flex items-center gap-2 h-10 px-4 bg-base-pure rounded-full border border-base-border font-mono text-[10px] uppercase tracking-[0.15em] text-base-dark hover:bg-base-light transition-colors"
          >
            <ChevronLeft size={14} strokeWidth={1.75} />
            <span>Back</span>
          </button>
        )}

        {/* View switcher pill — top-center, alone */}
        {!isMobile && (
          <div
            role="tablist"
            aria-label="Gallery view"
            className="absolute top-3 md:top-5 left-1/2 -translate-x-1/2 z-20 flex gap-0.5 p-0.5 bg-base-pure rounded-full border border-base-border"
          >
            <button
              role="tab"
              type="button"
              aria-label="Grid view"
              aria-selected={view === 'grid'}
              onClick={() => setView('grid')}
              className={`flex items-center justify-center h-11 w-11 rounded-full transition-colors ${
                view === 'grid' ? 'bg-base-light text-base-dark' : 'text-muted hover:text-base-dark'
              }`}
            >
              <LayoutGrid size={16} strokeWidth={1.75} />
            </button>
            <button
              role="tab"
              type="button"
              aria-label="List view"
              aria-selected={view === 'list'}
              onClick={() => setView('list')}
              className={`flex items-center justify-center h-11 w-11 rounded-full transition-colors ${
                view === 'list' ? 'bg-base-light text-base-dark' : 'text-muted hover:text-base-dark'
              }`}
            >
              <LayoutList size={16} strokeWidth={1.75} />
            </button>
          </div>
        )}

        {/* Content branch — phones get a vertical-scroll masonry; tablets+
            keep the 2D pan + list-view experience. */}
        <div key={isMobile ? 'mobile' : view} className="pf-content absolute inset-0">
          {isMobile ? (
            <MobileGridView items={items} onSelect={openLightbox} />
          ) : view === 'grid' ? (
            <GridView items={items} onSelect={openLightbox} />
          ) : (
            <ListView
              items={items}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
          )}
        </div>
      </section>

      <Lightbox
        open={lightboxIndex !== null}
        items={items}
        index={lightboxIndex}
        onClose={closeLightbox}
        onNext={lightboxNext}
        onPrev={lightboxPrev}
      />
    </>
  )
}
