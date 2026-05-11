import { useEffect, useRef } from 'react'

// Functional custom cursor — a small dot at rest, grows into a circle
// over interactive elements, morphs into "View" / "Drag" labels inside
// the showcase, and disappears over text inputs (so the native I-beam
// takes over). State is driven by `data-cursor` attributes on hovered
// elements; text inputs are auto-detected via tagName.
//
// Native cursor stays visible alongside the dot in default mode (so
// affordances like the pointer hand still appear on links). For "grow"
// / "view" / "drag" / "hidden" states the native cursor is hidden via
// CSS so the custom one carries the affordance.
//
// Hidden on touch / coarse-pointer devices.
export default function CustomCursor() {
  const cursorRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    const cursor = cursorRef.current
    const label = labelRef.current
    if (!cursor || !label) return

    let mouseX = 0
    let mouseY = 0
    let curX = 0
    let curY = 0
    let raf = 0
    let visible = false
    let state = 'default'

    // Apply visual state. `mix-blend-mode` toggles via class so it can
    // be removed cleanly when growing / labelling (otherwise text inside
    // a difference-blended circle becomes unreadable).
    const setState = (next) => {
      if (next === state) return
      state = next
      cursor.dataset.state = next
      // Update label text.
      if (next === 'view') label.textContent = 'View'
      else if (next === 'drag') label.textContent = 'Drag'
      else label.textContent = ''
    }

    const detectState = (target) => {
      if (!target) return 'default'
      // Text inputs / contentEditable: hide.
      if (target.matches?.('input, textarea, select, [contenteditable="true"], [contenteditable=""]')) {
        return 'hidden'
      }
      // Walk up to nearest element with data-cursor.
      const cursorTarget = target.closest?.('[data-cursor]')
      if (cursorTarget) {
        const value = cursorTarget.dataset.cursor
        if (value === 'grow' || value === 'view' || value === 'drag' || value === 'hidden') {
          return value
        }
      }
      // Default: any clickable / link / button gets "grow".
      if (target.closest?.('a, button, [role="button"], [role="tab"]')) {
        return 'grow'
      }
      return 'default'
    }

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visible) {
        curX = mouseX
        curY = mouseY
        cursor.style.opacity = '1'
        visible = true
      }
      setState(detectState(e.target))
    }

    const onMouseLeave = () => {
      cursor.style.opacity = '0'
      visible = false
    }

    const tick = () => {
      curX += (mouseX - curX) * 0.18
      curY += (mouseY - curY) * 0.18
      cursor.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      data-state="default"
      className="custom-cursor fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center rounded-full"
      style={{ opacity: 0, willChange: 'transform, width, height' }}
    >
      <span
        ref={labelRef}
        className="custom-cursor-label font-mono uppercase tracking-wider whitespace-nowrap"
      />
    </div>
  )
}
