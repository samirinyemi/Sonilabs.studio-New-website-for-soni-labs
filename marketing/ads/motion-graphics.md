# Ad 2 — Motion Graphics

**Goal:** Dramatize the wedge — vendor chaos collapsing into one studio — in 15 seconds. Visual proof of "Built under one roof."

**Format:**
- **Primary:** 9:16 vertical (1080×1920) for IG Reels.
- **Secondary:** 1:1 square (1080×1080) for LinkedIn / X. Produced natively (not cropped from the vertical) so type sizes remain readable.
- **Length:** 15 seconds. Hard cap.
- **Audio:** Must read with sound off. Type and motion carry the entire story. One soft "whoosh" SFX at the collapse beat is permitted but not required.

---

## Production approach

Build the animation in **code** as a React component using **GSAP** (already in your stack at v3.14 — see `package.json`). Render in the dev browser at the target dimensions, then screen-record at 60fps with QuickTime or `recordrtc`. This guarantees the brand tokens, type, and palette match the rest of Soni Labs exactly.

**Why not After Effects:** Adds a separate toolchain, divorces motion from the brand tokens, slows iteration, can't be revisited by anyone but a motion designer. The premise of Soni Labs ("designer is developer") means motion lives in code too.

---

## Frame-by-frame storyboard (15s)

Timecodes are in seconds. Animation runs on a single GSAP timeline.

### 0.0 – 0.5s · Cold open

**Visual:** Black canvas (`bg-base-dark`). Center: small Fira Code label fades in.
**Type (Fira Code, 18px, uppercase, tracking-wider, color `text-base-pure`):**
> `// A startup, buying design`

**Motion:** Type fades in at 0.0s, holds. No movement.

---

### 0.5 – 2.5s · The chaos beat

**Visual:** Three rectangular cards slide in from off-canvas in three different visual languages. Each is labeled with what kind of "vendor" they came from.

| Card | Style | Label (Fira Code, top of card) |
|---|---|---|
| Left | Purple gradient, glassmorphism, neon accent | `LOGO GUY` |
| Center | Mid-2010s flat SaaS — blue, rounded buttons, dashboard chart cliché | `WEB DEV` |
| Right | Soft beige, serifed, blog-style — completely different vibe | `UX FREELANCER` |

**Motion:**
- 0.5s — left card slides up from bottom (`y: 1080 → 0`, easing `power3.out`, duration 0.4s)
- 0.7s — center card slides in from right (`x: 1080 → 0`, same easing/duration)
- 0.9s — right card slides down from top (`y: -1080 → 0`)
- 1.3–2.5s — all three cards held. Slight jitter (`x: ±2px` random) so the chaos feels unstable.

---

### 2.5 – 4.5s · The clash

**Visual:** A type overlay drops onto the cards.
**Type (Aeonik Bold, 80px, white over black):**
> Three vendors.
>
> Three styles.

**Motion:**
- 2.5s — "Three vendors." line splits in from below (`y: 40 → 0`, opacity 0 → 1, duration 0.35s).
- 3.0s — "Three styles." follows with same animation.
- 3.5–4.5s — held. The three cards subtly clash — borders glitch / colors shift slightly out of phase. Conveys disagreement without being overdesigned.

---

### 4.5 – 6.0s · The pivot — collapse

**Visual:** Camera "pulls back." A larger frame slides into view, labeled `SONI LABS` in Fira Code uppercase. The three mismatched cards get pulled inward, shrink, and snap into the larger frame — but now reformatted into a unified visual language (same Aeonik type, same off-white surfaces, same red accent, same grid).

**Motion:**
- 4.5s — `SONI LABS` frame fades in (`opacity: 0 → 1`, duration 0.3s) and scales from 0.9 → 1.0.
- 4.8s — three vendor cards scale down (`scale: 1 → 0.4`) and translate to a 3-column grid inside the Soni frame (`stagger: 0.1`).
- 5.3s — each card "flips" visually — new typography, new palette, new grid — using a cross-dissolve (each card briefly fades through black, then re-renders in the unified style). 0.5s per card, staggered.
- 6.0s — the three cards now read as "BRAND", "PRODUCT", "WEBSITE" in clean Aeonik labels.

**SFX (optional):** A subtle, low-frequency whoosh at 4.8s as the collapse begins. No music bed.

---

### 6.0 – 9.0s · The payoff

**Visual:** The unified Soni frame holds center. Below it, headline type appears line by line.

**Type (Aeonik Bold, 96px, white):**
> Brands. Products.
>
> Websites.
>
> Built under one roof.

**Motion:**
- 6.0s — line 1 splits in from below (`y: 60 → 0`, opacity 0 → 1).
- 6.7s — line 2 same animation.
- 7.4s — line 3 — accent the word "**one**" in `text-accent-red` (#DA241C). Same animation but slightly slower (0.5s) so it punches.
- 8.0–9.0s — full title held. The unified Soni frame above pulses gently (scale 1.0 → 1.02 → 1.0) to suggest the system is alive.

---

### 9.0 – 12.0s · Studio reveal

**Visual:** Title and frame slide upward and off the top of the canvas. Replaced by a centered block:
- Soni Labs wordmark (large, Aeonik Bold)
- Founder line (smaller, Fira Code mono uppercase):
  > `// LED BY SAMUEL IRINYEMI`
- One line of supporting copy (Aeonik Light, 36px):
  > One studio. Brand, product, website.
  > Based in Lagos. Working globally.

**Motion:**
- 9.0s — previous content slides up (`y: 0 → -200`, opacity 0, 0.5s).
- 9.5s — wordmark fades in from below.
- 10.0s — supporting copy types in line by line (use `SplitText` if available, else simple line-by-line fade).

---

### 12.0 – 15.0s · CTA end card

**Visual:** Black canvas. Single CTA block centered.

**Layout:**
- Top eyebrow (Fira Code mono): `// BOOK A STRATEGY CALL`
- Center headline (Aeonik Bold, 80px): `30 minutes. No pitch theater.`
- Below headline, large URL (Aeonik Bold, 64px, color `text-accent-red`):
  > calendly.com/madebysoni/30min
- Bottom: Soni mark + studio tagline.

**Motion:**
- 12.0s — wordmark scene fades out. CTA card snaps in (0.2s fast fade).
- 12.5s — headline drops in.
- 13.0s — URL line glows / underline animates in. Held until 15.0s.
- 14.5s — small "tap to book" prompt fades in at bottom (for vertical Reels — viewers expect a tap zone at end).

---

## Type and color spec

| Element | Font | Weight | Size (1080×1920) | Color |
|---|---|---|---|---|
| Eyebrow (// labels) | Fira Code | Regular | 22px | base-pure on dark, base-dark on light |
| Card labels | Fira Code | Regular | 20px | base-dark |
| Main headline | Aeonik | Bold | 96px | base-pure (dark scenes) / base-dark (light scenes) |
| Accent word ("one") | Aeonik | Bold | 96px | accent-red (#DA241C) |
| Supporting copy | Aeonik | Light | 36px | base-pure or muted |
| URL | Aeonik | Bold | 64px | accent-red |

**Background canvas:** alternates `bg-base-dark` (#000000) and `bg-base-pure` (#FFFFFF) by scene — the alternation itself is part of the motion language.

**Forbidden:** purple gradients, glassmorphism, neon glows, 3D, AI accents. The "vendor chaos" beat may *parody* these styles for the bad-vendor cards, but the Soni-side visual must remain disciplined throughout.

---

## Square (1:1) version differences

The 9:16 storyboard above is the master. For the 1:1 cut:
- Headline type drops one tier (96px → 72px) so it fits horizontally.
- The 3-card chaos beat shifts to a horizontal row rather than triangle layout.
- End-card URL line stays same size — it's the most important element regardless of aspect.

Produce both natively. Do not crop the vertical to square.

---

## Production checklist

- [ ] Page route `/ads/motion` renders the animation in browser at exact dimensions.
- [ ] Animation timeline is GSAP, single timeline, no React state mutation during playback.
- [ ] Reduced-motion media query disables the animation and shows a static end-card poster (accessibility — matches the rest of the site, see `prefersReducedMotion` in `src/utils/motion.js`).
- [ ] Screen-record at 60fps, 1080×1920 (vertical) and 1080×1080 (square).
- [ ] Export as MP4 H.264, no audio (or with the optional whoosh).
- [ ] Test reel in mobile preview before publishing (the first 2 seconds must hook on a phone).
- [ ] File naming: `soni-motion-vertical-v1.mp4`, `soni-motion-square-v1.mp4`.

---

## Why this concept works

The structural choice — **chaos first, then collapse** — is doing the heavy lifting. Cold viewers don't yet care about "one studio." They DO care about not being burned by three vendors. By showing the burn first (3 mismatched cards) and only then resolving it (collapse into Soni), the ad sells the wedge BEFORE saying what Soni is.

The "one" highlighted in red on the payoff line is the only color accent in the entire piece. Restraint amplifies it.
