// Returns true if the user has set OS-level "Reduce motion."
// Animations should be skipped or replaced with static end-states when this
// is true, per WCAG 2.3.3 and our reduced-motion policy.
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

// Subscribe to reduced-motion changes — fires the callback whenever the
// user toggles their OS preference, so animation systems can re-evaluate
// without requiring a page reload. Returns an unsubscribe function.
export function subscribeReducedMotion(callback) {
  if (typeof window === 'undefined' || !window.matchMedia) return () => {}
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
  const handler = (e) => callback(e.matches)
  // Modern browsers use addEventListener; older Safari uses addListener.
  if (mql.addEventListener) mql.addEventListener('change', handler)
  else mql.addListener(handler)
  return () => {
    if (mql.removeEventListener) mql.removeEventListener('change', handler)
    else mql.removeListener(handler)
  }
}
