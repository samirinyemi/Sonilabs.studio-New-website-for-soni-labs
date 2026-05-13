import { useEffect, useState } from 'react'

// Three-dot theme switcher pinned to the bottom-right corner.
// Sets `data-theme` on the <html> element so the per-theme tokens in
// index.css take effect. Persists the choice in localStorage so it
// survives page reloads — a tiny inline script in index.html applies
// the saved theme before paint to avoid a flash of the wrong theme.
const STORAGE_KEY = 'soni-theme'
const THEMES = [
  { id: 'light', label: 'Light theme', color: '#FFFFFF', ringOnLight: true },
  { id: 'dark',  label: 'Dark theme',  color: '#000000', ringOnLight: false },
  { id: 'red',   label: 'Red theme',   color: '#DA241C', ringOnLight: false },
]

function readInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    // The inline script in index.html already set data-theme — trust
    // that as the source of truth (covers the case where localStorage
    // and the attribute could diverge, e.g. after a manual edit).
    const fromAttr = document.documentElement.getAttribute('data-theme')
    if (fromAttr && THEMES.some((t) => t.id === fromAttr)) return fromAttr
    const fromStorage = localStorage.getItem(STORAGE_KEY)
    if (fromStorage && THEMES.some((t) => t.id === fromStorage)) return fromStorage
  } catch (_) {
    // localStorage can throw in privacy modes — fall through to default.
  }
  return 'light'
}

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(readInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(STORAGE_KEY, theme) } catch (_) {}
  }, [theme])

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      // data-cursor="hidden" tells the global CustomCursor to fade out
      // while the pointer is over this widget — the native browser
      // pointer takes over so the small dots feel like ordinary OS
      // controls rather than triggering the big "grow" cursor.
      data-cursor="hidden"
      // Mobile: top-center, horizontal — sits visually inside the
      // navbar's empty center space.
      // Desktop (md+): bottom-right, vertical. Order in both: light →
      // dark → red. z-[55] keeps it above the navbar/footer but below
      // the Loader.
      className="fixed z-[55] top-7 left-1/2 -translate-x-1/2 flex flex-row items-center gap-1.5 md:top-auto md:left-auto md:translate-x-0 md:bottom-6 md:right-3 md:flex-col"
    >
      {THEMES.map((t) => {
        const active = theme === t.id
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={t.label}
            onClick={() => setTheme(t.id)}
            className={`rounded-full border border-base-dark/30 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-dark focus-visible:ring-offset-2 ${
              active
                ? 'w-5 h-5'
                : 'w-[18px] h-[18px] hover:scale-110'
            }`}
            style={{ backgroundColor: t.color }}
          />
        )
      })}
    </div>
  )
}
