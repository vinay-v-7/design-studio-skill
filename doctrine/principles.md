# Slop floor

Canonical vocabulary is **ai-design-review IDs** (`references/ai-tells-catalog.md`). Other modules map onto those IDs. A pick from ui-ux-pro-max, a taste direction, or an Impeccable command that violates this floor is an input that failed, not a decision.

Deliberate brand assets and a written `DESIGN.md` beat the floor when they are real. Invented justification does not.

## Map

| ID | Rule | Also from |
|---|---|---|
| TY1 | Inter / Roboto / system stack as the only face | taste default-font; slides "avoid Inter" |
| TY2 | Space Grotesk, Geist, Instrument Serif, Fraunces, Manrope, DM Sans as the only gesture | impeccable overused-font; diagram house fonts unless DESIGN.md says so |
| TY5 | One painted / italic / gradient word in the headline | taste "one word of the headline" |
| TY6 | Tracked all-caps eyebrows everywhere | taste eyebrow ban; impeccable kicker ban (no brief earns it back) |
| CL1 | Purple / indigo / violet hero or CTA gradient | taste first-wave violet; slides purple-on-white |
| CL3 | Gradient-filled text | taste; impeccable refuse |
| CL6 | Coloured glow shadows | taste glow; impeccable depth (zero-offset halo is decoration) |
| CM3 | Glassmorphism / backdrop-blur as decoration | taste glass; ui-ux-pro-max may *suggest* glass — reject unless DESIGN.md requires it |
| CM4 / LY2 | Three identical icon+title+text cards | taste three-card; impeccable same-size cards; diagrams "3 identical generic cards" |
| LY1 | Pill badge + centered hero + two CTAs | taste pill badge |
| LY5 | Hero → logos → features → quotes → stats → pricing → FAQ → CTA | taste stock section order |
| LY6 | Invented stats, testimonials, logos, star rows | taste invented proof; never invent |
| CP1–CP3 | "Elevate your workflow", hype adjectives, Get Started / Learn More | taste copy tells; impeccable copy floor |
| IC1 | Emoji as icons | taste; impeccable Unicode-as-icon refuse |
| MO1 | Same fade-up on every section | taste fade-and-rise; impeccable one authored moment |
| SD1 | Cream + terracotta ("the Claude look") | taste third-wave warm editorial |
| SD2 | Near-black + one acid/neon accent | taste neon-on-black |
| SD3–SD5 | Emerald-as-safe, trendy font-only-fix, fake window chrome | catalog second-order defaults |
| UX1 | Missing empty / loading / error states | impeccable states; required for app UI |
| SY1 | Design-system drift across pages | impeccable detect |

## New IDs (not in the catalog)

| ID | Rule | Source |
|---|---|---|
| ST1 | Hairline rules, 01/02/03 markers, monospace micro-labels as costume | taste gallery fashion; impeccable section numbers |
| ST2 | Avoidance aesthetic: every tell removed and nothing put in its place | taste §8; impeccable "commit, don't just refuse" |
| ST3 | Motion without purpose (hover-lift on every card, infinite loops, bounce easing with no meaning) | taste motion; catalog MO* |
| ST4 | Diagrams: drop shadows, diagonal connectors, Mermaid defaults shipped as the artifact | diagram-design |
| ST5 | Slides: Inter + purple gradient + cookie-cutter card grid on a 16:9 deck | frontend-slides aesthetics |

## Hard bans (no brief earns these back)

- Kickers / eyebrows above headings (impeccable).
- Invented numbers, quotes, logos, or customers.
- Shipping `lorem ipsum`, `href="#"`, or dummy names as finished work.

## Craft floor (mechanics)

From impeccable `craft-floor.md`, always:

- Contrast ≥4.5:1 body, ≥3:1 large text.
- Spacing: tight groups, generous separation, more space above a heading than below.
- One authored motion moment, exponential ease-out from an already-visible default.
- Theme browser chrome (selection, caret, focus, scrollbars) from the palette.
- Look at the rendered result at shipping sizes. Scanners do not replace looking.
