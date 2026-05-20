# Ad 4 — Founder POV (Static + Text Series)

**Goal:** Build Samuel as a founder-voice cold audiences want to follow. Each post is a sharp opinion that pre-qualifies — people who nod at the take are already half-sold.

**Format:**
- **X:** native text post, no image needed (280 chars forces compression).
- **LinkedIn:** 1:1 quote card image (1080×1080), signed "— Samuel, Soni Labs".
- **IG Feed:** same 1:1 quote card.

**Voice rules:** Peer-to-peer. First person. No "we believe" agency-speak. Sharp lines, no hedging. End with a take, not a question.

---

## The 5 quote cards

Each card has one headline, one signature. The headline IS the design. No subhead, no decoration.

### Card 1 — On logos
**Quote (LinkedIn / IG card):**
> "We won't sell you a logo. A logo is the cheapest part of a brand. What we sell is a system that holds together across your site, your pitch deck, your product, and your hiring page."

**X version (280 chars):**
> we won't sell you a logo.
>
> a logo is the cheapest part of a brand.
>
> what we sell is a system that holds together across your site, your pitch deck, your product, and your hiring page.
>
> that's the work.

**Caption (LinkedIn + IG):**
> Most founders think they need a logo. They need a brand system. The logo is a 4-hour decision inside a 2-week project. The system is what keeps your site, deck, product, and hiring page agreeing with each other 18 months from now.
>
> If you're rebranding or launching, that's the conversation worth having.
>
> Book a 30-minute strategy call → calendly.com/madebysoni/30min

---

### Card 2 — On shipping
**Quote:**
> "Most agency websites die in a Figma file. Two months of design, one month of dev rebuild, three months of 'we'll launch after Q3.' Our sites ship the week they're approved — because the designer is the developer."

**X version:**
> most agency websites die in a Figma file.
>
> 2 months of design. 1 month of dev rebuild. 3 months of "we'll launch after Q3."
>
> ours ship the week they're approved.
>
> because the designer is the developer.

**Caption (LinkedIn + IG):**
> The vendor handoff is where momentum dies. Designer ships Figma → dev tries to interpret → things get lost in translation → six rounds of "can you make it more like the design?"
>
> When the same person designs and builds, the gap doesn't exist. Soni Labs sites ship the week they're approved. No translation tax.
>
> If you've been stuck in a rebuild loop with your current site, book a call → calendly.com/madebysoni/30min

---

### Card 3 — On polish
**Quote:**
> "Polished design isn't decoration. It's a signal. Investors, customers, and hires all read the cover before they read the book. If your cover looks like a default Shopify theme, they assume the book is too."

> *Adapted from the existing site copy at [HeroV2.jsx:52](src/components/HeroV2.jsx#L52). Most aligned with existing brand voice — start with this card.*

**X version:**
> polish isn't decoration. it's a signal.
>
> investors, customers, and hires read the cover before they read the book.
>
> if your cover looks like a default Shopify theme, they assume the book is too.

**Caption:**
> "We'll fix the design later" is one of the most expensive sentences a founder can say. The cover gets read every time someone lands on your site, opens your deck, or sees your product for the first time.
>
> If your design is sending the wrong signal, you're losing money before the conversation even starts.
>
> Book a strategy call → calendly.com/madebysoni/30min

---

### Card 4 — On alignment
**Quote:**
> "If your brand and your product don't agree, your customers won't either. That's why we won't take a brand job and pretend the product doesn't exist. They're one decision, made by one team."

**X version:**
> if your brand and your product don't agree, your customers won't either.
>
> that's why we won't take a brand job and pretend the product doesn't exist.
>
> they're one decision. made by one team.

**Caption:**
> The hardest design problem in startups is consistency. Brand says "warm and human." Product says "enterprise dashboard." Marketing site says "AI-first SaaS." Customers feel the disconnect even when they can't articulate it.
>
> One studio. One team. Brand, product, and website agreeing with each other. Under one roof.
>
> Book a strategy call → calendly.com/madebysoni/30min

---

### Card 5 — On process
**Quote:**
> "There's no discovery-phase theater here. No 6-week kickoff to tell you what you already know. You book a 30-minute call, I tell you what I think, we either work together or we don't. That's the process."

**X version:**
> no discovery-phase theater here.
>
> no 6-week kickoff to tell you what you already know.
>
> book a 30-minute call. i tell you what i think. we either work together or we don't.
>
> that's the process.

**Caption:**
> Most agencies charge you to learn what you already know. Soni Labs doesn't. The discovery call is the discovery — 30 minutes, free, you walk away with a clear next step whether we work together or not.
>
> Book the call → calendly.com/madebysoni/30min

---

## Visual design — the quote cards

All 5 cards share the same layout. Difference is the quote only.

**Layout (1080×1080):**
- Background: `bg-base-pure` (#FFFFFF) for warmth, OR `bg-base-dark` (#000000) for the sharper takes (cards 4 + 5). Test both — black cards stand out in feed.
- Top-left eyebrow: small Fira Code mono, uppercase, tracking-wider:
  > `// SAMUEL / SONI LABS`
- Center: the quote in `font-display` (Aeonik). Size scales to fill the card with generous whitespace — typically 64–80px depending on quote length.
- Bottom-left: signature block:
  > `Samuel Irinyemi`
  > `Founder · Soni Labs`
- Bottom-right: small Soni mark (32px square) for brand identification at thumbnail size.
- Optional accent: a single `bg-accent-red` square (32px) in the top-right corner for the sharpest cards (2 + 5).

**Negative space ratio:** 60% empty. Restraint is the brand.

---

## Cadence & schedule

- **Cadence:** 1–2 posts per week per platform.
- **Order:** Card 3 (polish — most aligned with existing voice) → Card 2 (shipping — sharpest hook) → Card 1 (logos — reframe) → Card 4 (alignment — wedge re-anchor) → Card 5 (process — soft CTA).
- **Cross-post:** Same card content posts to all 3 platforms within ~48 hours of each other. Reuse the visual; only the caption varies per platform.
- **On X specifically:** reply to relevant founder threads with these takes (when natural). Higher organic reach than ads.

---

## A/B variants for the next round

These are sharper / more polarizing variants. Run AFTER the original 5 to see which voice tone wins.

| # | Variant of | Quote |
|---|---|---|
| A1 | Card 1 | "If you're paying $5K for a logo, you're not buying design. You're buying a guess." |
| A2 | Card 2 | "The slowest part of building a website is hiring a developer to rebuild your designer's work." |
| A3 | Card 4 | "Your brand is whatever your customers see first. Probably not your logo." |

Sharper = higher reach on X, higher risk on LinkedIn. Test cautiously.

---

## Pre-publish checklist

- [ ] Each card reads aloud like Samuel talking, not like a sales deck.
- [ ] No mention of price (the site is on `packages-no-pricing` for a reason).
- [ ] Caption CTA is consistent: book a strategy call + the Calendly URL.
- [ ] LinkedIn caption fits 3,000 chars; IG fits 2,200; X fits 280 (excluding link).
- [ ] Quote card design passes the "would this fit on the current Soni Labs site?" test.
- [ ] Card files exported as `soni-pov-01-logos.png` ... `soni-pov-05-process.png` for archive.
