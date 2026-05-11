---
name: Soni Labs Studio
description: Lagos design studio offering brand, web, and product design under one roof
colors:
  black: "#000000"
  black-soft: "#1A1A1A"
  white: "#FFFFFF"
  off-white: "#F2F2F2"
  border: "#E5E5E5"
  signal-red: "#DA241C"
  signal-red-deep: "#C72018"
  highlighter-yellow: "#FAFD3A"
typography:
  display:
    fontFamily: "'Aeonik', system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Aeonik', system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Aeonik', system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "'Aeonik', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "'Fira Code', monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.05em"
rounded:
  pill: "9999px"
  card: "12px"
  visual: "8px"
  icon-tile: "16px"
spacing:
  section-y-sm: "5rem"
  section-y-lg: "8rem"
  card-pad-sm: "2.5rem"
  card-pad-lg: "3rem"
components:
  button-primary:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.signal-red-deep}"
    textColor: "{colors.white}"
  button-ink:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-ink-hover:
    backgroundColor: "{colors.black-soft}"
    textColor: "{colors.white}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.black}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  card-page:
    backgroundColor: "{colors.off-white}"
    textColor: "{colors.black}"
    rounded: "{rounded.card}"
    padding: "40px 48px"
  card-ink:
    backgroundColor: "{colors.black}"
    textColor: "{colors.white}"
    rounded: "{rounded.card}"
    padding: "40px 48px"
  card-yellow:
    backgroundColor: "{colors.highlighter-yellow}"
    textColor: "{colors.black}"
    rounded: "{rounded.card}"
    padding: "40px 48px"
  pill-trigger:
    backgroundColor: "transparent"
    textColor: "{colors.black}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  eyebrow:
    backgroundColor: "transparent"
    textColor: "{colors.signal-red}"
    typography: "{typography.label}"
---

# Design System: Soni Labs Studio

## 1. Overview

**Creative North Star: "The Warm Workshop"**

This is a studio at work, not a slick agency selling itself. Pages feel made: a senior practitioner has been here, made deliberate choices, and left clean evidence of the work. Restraint is the loudest signal. Type does the heavy lifting; surfaces stay quiet so the writing and the work can be the proof. Visitors are not consumers being marketed to; they are peers being shown how the studio thinks.

The visual register sits between editorial and craft. Cards are pages from a working notebook, not feature tiles in a SaaS dashboard. The signature accent (Signal Red) reads as a fresh ink mark on a brief: small, intentional, used to point at things that matter. The committed yellow card breaks the page exactly once, where the studio wants the eye, then disappears for the rest of the site.

The system explicitly rejects the saturated reflexes PRODUCT.md names: AI-generated SaaS slop (purple gradients, neon AI accents, glassmorphism, hero-metric templates, identical card grids), generic Framer or Webflow templates, corporate consultancy aesthetics, and maximalist brutalism. If the surface starts to feel like any of those, it has drifted off-system.

**Key Characteristics:**
- White page (`#FFFFFF`) and pure black text (`#000000`) as the brand-defined neutrals.
- One signature accent (Signal Red `#DA241C`) used at small volume; one committed accent (Highlighter Yellow `#FAFD3A`) used full-card and only once per page.
- Aeonik throughout (display and body), Fira Code for mono labels and eyebrows.
- Flat by default. No drop shadows. Depth via tonal layering, never via blur or glow.
- Generous whitespace; section padding scales `5rem` to `8rem`.

## 2. Colors: The Soni Labs Brand Palette

A high-contrast palette taken directly from the Soni Labs brand identity document. Three neutrals (black, white, off-white), one signature accent, one committed accent. Every color in the system is on-brand or absent.

### Primary
- **Signal Red** (`#DA241C`, also called *Soni Orange-Red*): the studio's voice. Used for headline accents (the closing line in the hero), eyebrow indicator dots, the primary CTA fill, list checkmarks, ambient pillar numbers, and the inline `For` prefix inside service cards. Always small surface area; never the dominant color of any surface except the CTA itself.
- **Signal Red (deep)** (`#C72018`): hover state for the primary CTA. A subtle darken in the same hue, *not* a different color. The hover should read as "the same red, just a shade deeper."

### Secondary
- **Highlighter Yellow** (`#FAFD3A`): full-card commitment. Only on the Design Partner service card. The whole card is yellow; the dark CTA inside it inverts to white-text-on-black. Yellow is never used as a small accent or a hover state. Its restraint is the point.

### Neutral
- **Black** (`#000000`): primary text on light surfaces, and the dark card surface (Brand + Website flagship). Pure black per the brand doc; not tinted.
- **Black (soft)** (`#1A1A1A`): the only acceptable hover state for the dark CTA. A neutral lift, no blue cast. Tailwind's `gray-800` and `gray-900` are forbidden for ink hovers because they introduce a cool tint.
- **White** (`#FFFFFF`): primary page background. Every section's base surface is white. Pure white per the brand doc; not tinted.
- **Off-White** (`#F2F2F2`): card surface for light-variant cards (Product Design service card, ValueProps-style typographic blocks if they return, internal placeholder regions). Provides visible tonal layering when sat over the white page.
- **Border** (`#E5E5E5`): the only line color. Card borders, section dividers, footer rules. Never used as text or fill.

### Named Rules

**The Two-Voice Rule.** Signal Red speaks for the studio at small volume (eyebrows, accents, primary CTA). Highlighter Yellow speaks only at full-card commitment, exactly once per page. Mixing the two on one surface is forbidden. The voices are sequential, not simultaneous.

**The Brand Neutrals Rule.** The brand palette specifies pure black, pure white, and a single off-white. The system uses those three values, in that order. Tinted near-black or warm off-white from the previous draft are out; the brand identity wins.

**The Neutral Text Rule.** Brand `base-*` tokens are reserved for branded surfaces and primary ink (page background, card surfaces, primary text/borders, hover states). Secondary text — body paragraphs, eyebrows, mono labels, faint disclosures — uses Tailwind's `gray-400 / gray-500 / gray-600 / gray-700` palette directly. The brand token surface is deliberately small; we don't shadow Tailwind's neutral scale with a parallel custom system. Picking by intent: a *branded* surface or ink role uses `base-*`; a generic secondary-text role uses Tailwind gray. Mixing both for the same role on the same element (e.g., `text-base-dark-soft` for body text instead of `text-gray-600`) is forbidden.

**The Ten Percent Rule.** Signal Red covers no more than 10% of any single screen. If a section feels red-heavy, an accent has crept past its allocation. Cut.

**The Subtle Hover Rule.** Hover states for the primary CTA and the ink CTA are *very small* shifts in the same hue. Signal Red `#DA241C` to Signal Red Deep `#C72018`. Black `#000000` to Black Soft `#1A1A1A`. The user should feel "I'm hovering" without the color appearing to shift toward a different family.

## 3. Typography

**Display Font:** Aeonik (with `system-ui, sans-serif` fallback)
**Body Font:** Aeonik (same family; weight does the work)
**Label / Mono Font:** Fira Code (with `monospace` fallback)

**Character:** A single workhorse geometric sans family carries the whole system. Aeonik's restraint matches the restraint of the surfaces; the only typographic punctuation comes from Fira Code in mono labels and eyebrow tags. The pairing reads as editorial-technical, not corporate-techy.

### Hierarchy

- **Display** (700, `clamp(2.25rem, 5vw, 3.75rem)`, `1.05` line-height, `-0.02em` tracking): hero headline, section H2s. Tight tracking pulls the letterforms into a confident block. One Display per section maximum.
- **Headline** (700, `clamp(1.5rem, 3vw, 2.25rem)`, `1.15` line-height): card headings (service names, work case study titles, About headline). Smaller than Display but unmistakably a heading.
- **Title** (700, `1.5rem`, `1.25` line-height): minor headings, footer column titles, About founder name.
- **Body** (400, `1.125rem`, `1.65` line-height): the For paragraphs, About paragraphs, FAQ answers. Comfortable reading length capped around 65 to 75 characters per line.
- **Label** (Fira Code 500, `0.75rem`, `0.05em` tracking, uppercase): every section eyebrow (`// Services`, `// The studio`), every metadata tag inside cards (Includes, Starting from, Timeline), the navbar tagline. Always uppercase, always Fira Code, always `0.05em` to `0.2em` tracking.

### Named Rules

**The Mono-Eyebrow Rule.** Every section opens with a Fira Code uppercase label, prefixed by `//`. It frames the section like a notebook tab and signals craft. No section ships without one.

**The Two-Weights-Only Rule.** Aeonik is used in 400 (body) and 700 (display, headline, title) only. No 500, no 600. Hierarchy comes from size and weight contrast, not from filling the weight ladder.

**The No-Italic Rule.** Aeonik italics exist in the file but are not used anywhere in the system. The voice is direct, not stage-whispered.

## 4. Elevation

**The system is flat. It uses tonal layering, not shadows, to build depth.** Depth comes from surface tone changes (Off-White card over White page, Black card over White page, Yellow card over White page) and from border lines (`#E5E5E5` 1px). Drop shadows, blur effects, and glow halos are forbidden for cards, buttons, and section surfaces.

The only elevation that can read as "lifted" is the floating bottom nav, and even there the lift is conveyed by position (it floats over content) and a thin border, not by a heavy shadow. Popovers (Includes / Process content) are an exception: they render via React portal into `document.body` and use `shadow-2xl shadow-black/30` to detach visually from the cards behind them. This is the only sanctioned shadow in the system.

### Named Rules

**The No-Shadow Rule.** Cards, buttons, inputs, navigation: all flat. Depth is conveyed through tone, not through light. The only sanctioned shadow is on the floating popover surface (because the popover must clearly detach from the page behind it).

**The Tonal Layering Rule.** Three tonal levels in order of depth: White (`#FFFFFF`, the page surface), Off-White (`#F2F2F2`, card surfaces that need to differentiate from the page), Black (`#000000`, dark cards and Process steps). Each level reads as a step in a notebook stack, not as a shadow plane.

**The Portal-Popover Rule.** Popovers (the "What's included" and "See the process" pills) must render via React portal into `document.body`. Absolutely-positioned popovers inside a card get clipped by sibling cards' stacking contexts. Portal + computed coordinates from the trigger's bounding rect is the only correct pattern.

## 5. Components

### Buttons

- **Shape:** all buttons are pill-shaped (`rounded-full`, ~9999px radius). The pill is the studio's CTA shape; rectangles or rounded rectangles are not used.
- **Primary (Signal Red):** `#DA241C` background, white text, `padding: 10px 20px` for inline CTAs, `padding: 16px 32px` for hero/standalone CTAs. Hover darkens to Signal Red Deep `#C72018` (a *subtle* shift, not a color change). Used for the primary site-wide action: "Book a strategy call", "Book a call".
- **Ink:** `#000000` background, white text, same shape and padding as Primary. Hover lifts to Black Soft `#1A1A1A` (neutral, not blue-tinted). Used for the hero primary CTA path and on the Light service card (Product Design) where Signal Red would conflict with the red accents already on that card.
- **Ghost:** transparent background, ink text, 1px ink-tinted border at 20% opacity. Used for "See our work" hero secondary CTA. Hover fills with a 5% ink tint.
- **Text-link:** no border, no fill. Signal Red text with arrow glyph. Used inside light cards as a tertiary CTA ("Book a call →" inside the Product Design card body).

**The All-Pills Rule.** No button in the system uses anything other than `rounded-full`. If a CTA needs a different shape, it is not a CTA. Convert to a text link.

### Cards / Containers

- **Corner Style:** `12px` radius (`rounded-[12px]`), used everywhere. Smaller `8px` radius reserved for visual placeholders nested inside cards (work screenshots, Product Design icon tiles).
- **Variants:**
  - **Page card** (light): `bg-base-light` (Off-White `#F2F2F2`) background, 1px `#E5E5E5` border, ink text. Used for the Product Design service card, About founder card, FAQ container, Work case studies.
  - **Ink card**: `bg-base-dark` (`#000000`) background, no border, white text. Used for the flagship Brand + Website service card and dark steps inside the Process bento (Direction, System build).
  - **Yellow card**: `bg-accent-yellow` (`#FAFD3A`) background, no border, ink text. Used only for the Design Partner service card, exactly once on the page.
- **Internal Padding:** `40px` (`p-10`) at base, `48px` (`p-12`) at `md:`. The padding is generous and consistent; do not shrink it to fit content.
- **No nested cards.** A card never contains another card. The popover content is not a card; it is a popover surface.

### Pill Triggers (signature component)

The "What's included" and "See the process" pill buttons inside service cards are the studio's signature interactive primitive. They look like a metadata chip but behave like a popover trigger.

- **Shape:** pill (`rounded-full`).
- **Padding:** `8px 16px` (small).
- **Type:** Fira Code, uppercase, `0.75rem`, `0.05em` tracking.
- **Border:** 1px, color follows card variant (white at 20% on Ink card, `#E5E5E5` on Page card, ink at 25% on Yellow card).
- **Icon + chevron:** info or clock icon left, chevron-down right (rotates 180° when open).
- **Hover:** border shifts to Signal Red (or to ink on the Yellow card).

### Popovers (portal-rendered)

- **Render via React portal** to `document.body`. Critical: do not rely on `position: absolute` inside the card. Card siblings create stacking contexts that clip an inline popover.
- **Position:** computed from the trigger's bounding rect at open time. Recomputed on window resize.
- **Surface:** inverts the parent card. Ink card gets a white popover; Page card and Yellow card get an Ink popover.
- **Width:** `20rem` mobile, `26rem` desktop, capped at `calc(100vw - 2.5rem)`.
- **Max height:** `70vh`, scrolls internally if content exceeds.
- **Padding:** `24px` (`p-6`).
- **Border:** 1px, same color as surface (visually borderless).
- **Z-index:** `z-[60]` so popover layers above all cards and the navbar pill.
- **Animation:** GSAP fade plus 6px translate-y plus 0.97 scale, `0.22s` ease-out-quart on open, `0.16s` ease-in on close.
- **Dismissal:** click outside (checked against both the trigger and the popover), or Escape key.
- **No backdrop, no dim.** The page behind stays fully interactive.

### Navigation

- **Top bar (default):** fixed, `h-20`, white at 80% opacity with backdrop-blur, 1px Border on bottom. Logo and inline links left/center, primary pill CTA right.
- **Floating bottom nav (after first viewport scrolled):** `340px` wide, fixed at bottom-center, ink background at 95% with backdrop-blur, pill shape, 1px white-at-10 border. Contains a hamburger that expands a menu panel upward. This is the only place backdrop-blur appears in the system; treat as exception.
- **Mobile menu:** full-viewport ink overlay; menu items at Title size, white text.

### Section Header

- **Anatomy:** mono eyebrow (`// Section name`) at top, then Display heading, optionally followed by a body-size description on the right or below.
- **Spacing:** eyebrow to heading `1rem`. Heading to description `1.5rem`. Section header to first content `2.5rem` to `3.5rem`.

## 6. Do's and Don'ts

### Do:

- **Do** open every section with a Fira Code mono eyebrow prefixed by `//`.
- **Do** keep Signal Red under 10% of any visible surface.
- **Do** use Highlighter Yellow exactly once per page, as a full-card commitment.
- **Do** use the brand neutrals: pure White (`#FFFFFF`) for the page, Pure Black (`#000000`) for ink, Off-White (`#F2F2F2`) for card surfaces that need tonal differentiation.
- **Do** keep hover states within the same hue: Signal Red → Signal Red Deep, Black → Black Soft.
- **Do** use `rounded-[12px]` for cards and `rounded-full` for buttons. Two radii in the whole system.
- **Do** convey depth with tonal layering (Off-White over White, Black over White, Yellow over White). Three tonal levels, no shadows.
- **Do** render popovers via React portal so they layer above sibling cards.
- **Do** keep all transitions short (200 to 400ms) and ease-out (`power2.out` or `power3.out`). No bounce, no elastic.
- **Do** honor `prefers-reduced-motion` for all decorative animations.
- **Do** use generous section padding: `5rem` mobile, `8rem` desktop.

### Don't:

- **Don't** use purple gradients, neon "AI" accents, glassmorphism (except the documented footer drift, which should be removed), hero-metric templates, or identical card grids.
- **Don't** use `hover:bg-gray-800` or `hover:bg-gray-900` on the ink CTA. They introduce a blue tint. Use `hover:bg-base-dark-soft` instead.
- **Don't** use a strongly-darkened red (`#B91E17` or harder) as the Signal Red hover. Use `#C72018` so the shift is subtle.
- **Don't** use drop shadows for depth. The only sanctioned shadow is on the popover surface.
- **Don't** use side-stripe borders (a colored `border-left` greater than 1px on a card). Universal ban.
- **Don't** use gradient text (`background-clip: text` over a gradient). Solid colors only; emphasis via weight.
- **Don't** add a third radius value. `12px` for cards, `9999px` for buttons. New radii must be justified system-wide.
- **Don't** ship a Webflow / Framer template look. The site has to feel made, not assembled.
- **Don't** add corporate-consultancy patterns: navy and gray palette, stock photography, IBM-enterprise framing.
- **Don't** add maximalist-brutalist patterns: aggressive grids, clashing type, raw HTML aesthetics. Restraint, not noise.
- **Don't** introduce a new accent color without removing an existing one. Two voices total.
- **Don't** use Aeonik italic anywhere. The voice is direct.
- **Don't** sell AI as a service in any visual treatment: AI badges, "powered by AI" copy, robot icons, automated sparkle effects. AI is a method, never a deliverable.
- **Don't** rely on `position: absolute` for popovers inside cards. Use a portal.
