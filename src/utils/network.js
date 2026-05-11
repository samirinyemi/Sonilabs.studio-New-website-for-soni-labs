// Returns true when the visitor's connection is metered or slow enough
// that autoplaying decorative video would be hostile (data costs, choppy
// playback). Used to gate hero videos in About / Services / home pages.
//
// Detection is best-effort:
//   - Network Information API (Chromium, modern Edge): saveData flag,
//     effectiveType '2g' / 'slow-2g'.
//   - Safari / Firefox: API is missing — treat as fast (no opt-out).
export function isSlowOrMeteredConnection() {
  if (typeof navigator === 'undefined') return false
  const c = navigator.connection
  if (!c) return false
  if (c.saveData) return true
  if (c.effectiveType === '2g' || c.effectiveType === 'slow-2g') return true
  return false
}
