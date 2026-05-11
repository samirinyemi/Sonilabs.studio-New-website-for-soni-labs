// Session-scoped state persistence for the Showcase page.
//
// Saves view mode, selected list item, lightbox state, and grid pan offset
// to sessionStorage so navigating away and coming back lands the user
// exactly where they left off — without rebuilding state from scratch.
//
// Cleared automatically when the browser tab closes (sessionStorage
// semantics). A full page refresh also wipes it; that's intentional.

const KEY = 'showcase:state-v1'

export function loadShowcaseState() {
  if (typeof sessionStorage === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveShowcaseState(patch) {
  if (typeof sessionStorage === 'undefined') return
  try {
    const prev = loadShowcaseState() || {}
    sessionStorage.setItem(KEY, JSON.stringify({ ...prev, ...patch }))
  } catch {
    // Silent fail: quota exceeded, private mode, etc.
  }
}
