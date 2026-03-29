import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const pos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Only show on non-touch devices
    if ('ontouchstart' in window) return

    const cursor = cursorRef.current
    if (!cursor) return

    // Crosshair line elements
    const topLine = cursor.querySelector('.cursor-top')
    const bottomLine = cursor.querySelector('.cursor-bottom')
    const leftLine = cursor.querySelector('.cursor-left')
    const rightLine = cursor.querySelector('.cursor-right')
    const dot = cursor.querySelector('.cursor-dot')

    // Smooth follow with GSAP
    const moveCursor = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power3.out',
      })
    }

    // Check if mouse is in a custom-cursor zone
    const checkZone = (e) => {
      const target = e.target
      const zone = target.closest('[data-cursor-zone]')
      if (zone) {
        if (!isVisible) setIsVisible(true)
      } else {
        if (isVisible) setIsVisible(false)
      }
    }

    // Hover detection for interactive elements
    const handleMouseOver = (e) => {
      const target = e.target
      if (target.closest('a, button, input, textarea, select, [role="button"]')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mousemove', checkZone)
    window.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mousemove', checkZone)
      window.removeEventListener('mouseover', handleMouseOver)
    }
  }, [isVisible])

  // Animate visibility
  useEffect(() => {
    if ('ontouchstart' in window) return
    const cursor = cursorRef.current
    if (!cursor) return

    if (isVisible) {
      gsap.to(cursor, { opacity: 1, duration: 0.3, ease: 'power2.out' })
    } else {
      gsap.to(cursor, { opacity: 0, duration: 0.2, ease: 'power2.in' })
    }
  }, [isVisible])

  // Animate hover state
  useEffect(() => {
    if ('ontouchstart' in window) return
    const cursor = cursorRef.current
    if (!cursor) return

    const lines = cursor.querySelectorAll('.cursor-line')
    const dot = cursor.querySelector('.cursor-dot')

    if (isHovering) {
      gsap.to(lines, { scaleX: 0.5, scaleY: 0.5, duration: 0.3, ease: 'power3.out' })
      gsap.to(dot, { scale: 2.5, duration: 0.3, ease: 'power3.out' })
    } else {
      gsap.to(lines, { scaleX: 1, scaleY: 1, duration: 0.3, ease: 'power3.out' })
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'power3.out' })
    }
  }, [isHovering])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
      style={{ opacity: 0, transform: 'translate(-50%, -50%)' }}
    >
      {/* Center dot */}
      <div className="cursor-dot absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3px] h-[3px] rounded-full bg-white" />

      {/* Top line — starts 6px above center, extends 14px up */}
      <div
        className="cursor-line cursor-top absolute left-1/2 -translate-x-1/2 origin-bottom"
        style={{ bottom: 'calc(50% + 6px)', width: '1px', height: '14px', backgroundColor: 'white' }}
      />

      {/* Bottom line — starts 6px below center, extends 14px down */}
      <div
        className="cursor-line cursor-bottom absolute left-1/2 -translate-x-1/2 origin-top"
        style={{ top: 'calc(50% + 6px)', width: '1px', height: '14px', backgroundColor: 'white' }}
      />

      {/* Left line — starts 6px left of center, extends 14px left */}
      <div
        className="cursor-line cursor-left absolute top-1/2 -translate-y-1/2 origin-right"
        style={{ right: 'calc(50% + 6px)', height: '1px', width: '14px', backgroundColor: 'white' }}
      />

      {/* Right line — starts 6px right of center, extends 14px right */}
      <div
        className="cursor-line cursor-right absolute top-1/2 -translate-y-1/2 origin-left"
        style={{ left: 'calc(50% + 6px)', height: '1px', width: '14px', backgroundColor: 'white' }}
      />
    </div>
  )
}
