# Ad 1 — Talking-Head Video (Samuel)

**Goal:** Put a real founder on camera. Cold audiences buy from people, not brand identities.

**Format:**
- **Master:** 4K (3840×2160) shot landscape, framed safe for 9:16 vertical crop.
- **Vertical cut (Reels):** 1080×1920, 9:16.
- **Square cut (LinkedIn / X):** 1080×1080.
- **Length:** 35 seconds (acceptable range 30–45). Cold-audience tolerance maxes at 45.

---

## Final script (read aloud at natural pace — should land around 35s)

> **[0–2s · HOOK · direct to camera, half-smile]**
> "If you're paying a brand agency, a web developer, and a UI/UX freelancer separately — you're doing this the expensive way."
>
> **[2–6s · INTRO]**
> "I'm Samuel. I run Soni Labs."
>
> **[6–18s · SETUP]**
> "I built it because founders kept telling me the same thing — the brand person doesn't talk to the web person, the web person doesn't talk to the product person. Work suffers. Timelines blow up. And you're the one paying for the gap."
>
> **[18–28s · PROMISE]**
> "At Soni Labs, brand, product, and website come from the same studio. Same taste. Same standards. One team. Zero handoffs. We've shipped that way for AMA Victoria, meCash, time-BMX, and a dozen others."
>
> **[28–35s · CTA]**
> "If your brand and your product don't agree, your customers won't either. Book a thirty-minute strategy call. Link below. We'll figure out fit and scope — no pitch theater."
>
> **[35–38s · END CARD]**
> (silent, 3s hold) Soni Labs wordmark · calendly.com/madebysoni/30min

**Word count:** 119 words. At ~3.4 words/sec, lands at 35s naturally.

---

## Shot list

Single setup. No location moves. Total shoot time: ~1 hour for 5–6 takes plus B-roll.

### Setup 1 — Direct address (~85% of the ad)
- **Camera:** Single fixed angle, head-and-shoulders. Slight off-center framing (left or right rule-of-thirds, not dead center) — feels less corporate.
- **Lens:** 50mm equivalent or 85mm. Slight compression flatters the face and separates Samuel from background.
- **Distance:** Camera ~6ft away. Eye level.
- **Background:** Your actual workspace. NOT a clean white set. Lived-in is the point — cold audiences distrust over-produced founder videos. Visible: bookshelf, Figma window in background blur, plant, lamp. Avoid: brand wall, ring light reflections, anything that screams "I'm filming an ad."
- **Lighting:** Soft natural window light if possible, supplemented with one fill panel at 45°. No harsh ring light directly on lens.
- **Audio:** Lavalier (lapel) mic on Samuel. Boom mic if available as backup. Camera audio is fallback only.

### B-roll cutaways (3–4 short inserts, optional but recommended)
Use sparingly — max 3 cutaways across the 35s. Cold audiences want to see your face, not your hands.

| Cutaway | Insert at | Source |
|---|---|---|
| Hands on Figma trackpad | 8–10s (during "work suffers, timelines blow up") | Screen-record or over-shoulder |
| Client work montage — AMA / meCash / BMX thumbnails | 24–26s (during "we've shipped that way for…") | Pull from `public/showcase-media/` |
| Soni Labs wordmark / brand mark close-up | 33–35s (during transition to end card) | Static frame |

---

## Wardrobe & presence notes

- **Wardrobe:** Whatever you normally wear on a client call. No suit. No agency-uniform black turtleneck. A solid-color shirt or a clean tee — restraint matches the brand.
- **Body language:** Hands visible occasionally (gestures land better than locked-arm). Lean into the camera slightly. Half-smile, not full grin.
- **Eye contact:** Look at the lens, not at the monitor or the script. Use a teleprompter app behind the lens if needed.
- **Tone:** Peer-to-peer. Like you're talking to a founder friend over coffee, not pitching to a panel.

---

## Supers (lower-thirds and on-screen text)

Light kinetic type augments the spoken delivery. Use sparingly — type should support, not compete.

| Time | Type | Style |
|---|---|---|
| 0–2s | none | (the hook lands cleanest with no super) |
| 4–6s | `Samuel Irinyemi · Founder, Soni Labs` | Lower-third, Fira Code mono, white over subtle bottom gradient |
| 24–26s | Three client names appear in sequence: `AMA VICTORIA` / `MECASH` / `TIME-BMX` | Fade in/out as each name is spoken, centered above lower frame |
| 32–35s | `BOOK A STRATEGY CALL` (eyebrow) + `calendly.com/madebysoni/30min` (large) | Animates onto the end card |

These supers should be produced as a **separate transparent PNG overlay** built in code — see [src/components/ads/](src/components/ads/) — so they match site type and can be re-rendered if copy changes.

---

## End card design (3-second hold)

Same look as the Slide 10 / CTA frame from the carousel. Black background, Aeonik Bold headline, accent-red URL.

**Layout (1080×1920 vertical / 1080×1080 square):**
- Top eyebrow: `// SONI LABS`
- Center headline: `Book a 30-minute strategy call.`
- URL line: `calendly.com/madebysoni/30min` (in `text-accent-red`)
- Bottom: Soni mark + tagline `Brands · Products · Websites · Under one roof.`

This end card is **the same composition** that appears in:
- Slide 10 of the carousel
- The final beat of the motion graphics ad
- This talking-head ad

Treating it as a shared asset enforces brand consistency across all four ads.

---

## Audio post

- **Voice:** Clean lavalier track. Mild compression. -16 LUFS for social.
- **Music:** None. Or a barely-audible ambient pad (low cello drone, sub-bass) under the talking. The voice should carry the ad. Music makes cold viewers tune out.
- **End-card sound:** A single soft tick or chime as the URL appears. Optional.
- **Captions:** Burn in subtitles — most viewers will watch with sound off. Use Aeonik or system font, white text with subtle drop shadow, bottom safe zone.

---

## The two versions

### Vertical (9:16, 1080×1920) — Reels primary
- Frame Samuel slightly higher in the frame so the lower third doesn't crowd him.
- B-roll cutaways must be re-cropped to 9:16 (not cropped from 16:9 — re-shoot or re-frame).
- Subtitles bottom 20% safe zone (account for IG UI overlap).

### Square (1:1, 1080×1080) — LinkedIn / X
- Same audio, same script.
- Crop tighter so Samuel fills more of the frame.
- B-roll cutaways re-cropped to square.

---

## Pre-shoot checklist (do this the night before)

- [ ] Script printed AND loaded on a teleprompter app behind the camera (free option: PromptSmart Lite).
- [ ] Workspace tidied just enough — not staged.
- [ ] Lavalier mic charged. Camera card formatted. Backup card on hand.
- [ ] Test shot reviewed for: white balance, exposure, focus, audio levels.
- [ ] Wardrobe laid out — not the same shirt you wore on Tuesday's video calls.
- [ ] Calendar blocked for 90 minutes (not 30 — you'll do 5–6 takes).

---

## Post-shoot workflow

1. Pull selects — pick the 2 best full takes plus highlight moments from others.
2. Cut to 35s — trim filler words, keep natural pauses.
3. Color-grade lightly — match the warmth of the website (slight warm shift, lifted blacks).
4. Add captions, supers, B-roll, end card.
5. Export 1080×1920 + 1080×1080 H.264 MP4.
6. File naming: `soni-th-vertical-v1.mp4`, `soni-th-square-v1.mp4`.

---

## What I (Claude) can build for you in code

- The end-card overlay as a React component at `/ads/end-card` — render in browser, screen-record the 3-second hold.
- The lower-third super (`Samuel Irinyemi · Founder, Soni Labs`) as a transparent PNG export.
- The client-name supers (AMA / meCash / BMX) as 3 short animated overlays.
- The captions stylesheet if you want subtitle styling that matches the brand exactly.

The footage of you talking is the only piece you have to capture in person. Everything else lives in code.
