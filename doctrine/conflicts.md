# Conflict resolutions

When modules disagree, use this file. Do not blend the two answers.

## 1. ui-ux-pro-max styles vs the slop floor

**Clash:** `search.py --design-system` can recommend glassmorphism, purple-adjacent palettes, Inter/Roboto pairings, or other catalog hits that ai-design-review, taste, and impeccable flag.

**Resolution:** Database picks are *inputs, never decisions*. Run every pick through [principles.md](principles.md). Drop or restyle anything that hits P0. P1 is allowed only when the project's `DESIGN.md` or the user's brand assets already specify it. Prefer the taste library (dealt type, palette, composition) over a ui-ux style name when building a public page.

## 2. Taste scroll scenes vs fade-up-everything (MO1)

**Clash:** Taste directions include scroll-driven scenes. The catalog flags uniform fade-up on every section.

**Resolution:** Motion with purpose. One signature move (or the dealt scene) is in. Repeating the same opacity+y reveal on every block is out. If inspect/lint flags fade-up-everything, keep the one authored moment and kill the rest.

## 3. beautiful-html-templates "ask occasion and mood first" vs frontend-slides

**Clash:** `template-library/AGENTS.md` Step 1 asks occasion and mood before doing anything. frontend-slides generates three visual previews (safe / bold / wildcard) and lets the user pick.

**Resolution:** frontend-slides is master for decks. Do not stop to interview for mood when the slides route is active — generate the three previews. `template-library/` is last-resort implementation reference after a bold template is chosen (`template-library/templates/<id>/template.html`). Occasion/mood questions are optional colour for the wildcard slot, not a gate.

## 4. Diagram Instrument Serif / Geist vs project tokens

**Clash:** diagram-design's house style is Instrument Serif + Geist + Geist Mono. TY2 flags those faces as second-order defaults when they are the only gesture. A project `DESIGN.md` may specify other type.

**Resolution:** Project tokens first. Use diagram-design profile/onboarding to load client tokens. The house style is the fallback when the project has no DESIGN.md and the user did not name a brand. Do not "upgrade" a branded diagram onto Geist.

## 5. Review format vs impeccable critique/audit

**Clash:** Both ai-design-review and impeccable can review a UI.

**Resolution:** `/design-studio review` (audit, roast, "looks AI") uses the **ai-design-review report format** and IDs. Impeccable `critique` / `audit` run as extra scanners; fold their findings into those IDs. Do not emit two competing reports.

## 6. Operate restraint vs persuade ambition

**Clash:** taste and impeccable persuade want a committed world. Impeccable operate wants scanability and known patterns.

**Resolution:** Mode follows the surface, not the product. A tool's landing page is persuade (`build`). Its settings screen is operate (`app`). Do not dress operate UI in a marketing world, and do not flatten a landing page into a dashboard.
