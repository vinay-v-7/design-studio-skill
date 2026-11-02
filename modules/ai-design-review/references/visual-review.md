# Visual Review (screenshots, live URLs, rendered pages)

Many tells only show in pixels: palette weight, hierarchy, spacing rhythm, glow, imagery and overall silhouette. Use this file whenever you can see the UI, either from a screenshot the user gave you or from a render you took.

## Getting pixels

| Input | How |
|---|---|
| Screenshot or image file | Read the image directly. If there are several screens, review them as a set and check consistency across them (SY1). |
| Live URL | If a browser or screenshot tool is available (browser MCP, Playwright, a built-in browser pane), open the page, capture the full page at desktop width (~1440px) and mobile width (~390px), and scroll through it. If no tool is available, fetch the HTML, run the scanner on the saved file, and say in the report that the visual review was limited to source. |
| Local code | Only render it if that's cheap: the dev server is already running, or a single `npm run dev` works. Otherwise review from code alone and mark visual-tier findings as "inferred from code". |

Never claim to have seen something you only inferred. Label each finding's tier honestly.

## What to look for, in order

Work from the overall page down to the details. The big picture carries most of the AI signal.

1. **Silhouette (first 3 seconds).** Blur your attention. Is this the centered hero → three cards → logo strip → testimonials → pricing → footer shape (LY1, LY2, LY5)? Would it be indistinguishable from five other SaaS pages?
2. **Palette weight.** What color dominates? Is there a purple or blue gradient (CL1), a dark-plus-glow (CL5), neon everywhere (CL4), cream plus terracotta or black plus lime (SD1, SD2)? Is there one clear accent used sparingly?
3. **Type.** Does the headline face have a voice, or is it Inter/system (TY1)? Is there one painted word (TY5)? Is there real size contrast (TY8)? Are there all-caps eyebrows everywhere (TY6)?
4. **Containers.** Count the boxes. Are there cards inside cards (LY3)? Is the same radius and shadow on everything (LY4, CM2)? Is there frosted glass (CM3)?
5. **Icons and emoji.** Emoji as icons (IC1)? Icons in tinted chips (CM4)? ✨ next to "AI" (IC2)?
6. **Imagery.** Glossy 3D blobs (IM2), stock teams (IM1), placeholder avatars or gray boxes (IM4), fake window chrome (SD5)?
7. **Copy.** Read the headline, subhead and CTAs aloud. Vague (CP1), hype (CP2), generic CTAs (CP3), lorem or "John Doe" (CP6)?
8. **Proof.** Round-number stats, logo walls, generated testimonial faces (LY6)?
9. **Hierarchy (squint).** At thumbnail size, does exactly one thing lead? Is long text centered (LY12)?
10. **States and edges** (app screens). Is there an empty state, loading, error, focus ring, or disabled state? Do status dots mean anything (UX2)? Does every block sit in a card (UX3)?
11. **Mobile width.** Does it reflow, or does it overflow (UX6)? Are touch targets large enough? Is a web hero squeezed onto a phone (MB7)?
12. **Cross-screen consistency.** If you have several screens, compare nav, fonts, radius, button styles and spacing (SY1, UX5).

## Calibrating the verdict

Score genericness from 0 to 10:

| Score | Meaning |
|---|---|
| 0–2 | Clearly authored. A distinctive direction, consistently applied. |
| 3–4 | Mostly authored, with a few default components showing. |
| 5–6 | Mixed. A competent template with some real choices. Users won't call it AI, designers might. |
| 7–8 | Reads as generated to most designers, and some users. Several P0s. |
| 9–10 | Textbook: the median AI page. Purple gradient, pill hero, three cards, emoji, hype copy. |

Explain the score in one line, naming the two or three biggest contributors.

## Honest limits

- A screenshot can't show motion, hover, focus or responsiveness. List those as "not assessed" rather than guessing.
- Source-only review can't judge palette weight or hierarchy reliably. Mark those findings "inferred".
- A tell can be deliberate. If the brand actually uses purple, or the product is a crypto app that should feel neon, call it intentional and move on. Flag only what looks unchosen.
