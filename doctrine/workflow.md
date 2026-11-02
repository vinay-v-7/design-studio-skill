# Workflow

Universal, every route except a pure `hooks` admin call:

**Brief → Direction → Build → Look → Gate → Report**

## 1. Brief — `PRODUCT.md`

If the project has no `PRODUCT.md`, write a short one at the project root (or run impeccable `init` on the `app`/`build` routes). Capture: what it is, who it is for, the job to be done, constraints, what must not be invented.

Do not block a narrow review on a missing brief. State the brief you assumed.

## 2. Direction — `DESIGN.md`

One direction file at the project root, readable by every module.

Minimum fields:

- **Anchor** — the product's world in one sentence
- **Palette roles** — ground, ink, accent, why
- **Type pairing** — display / body / UI, with roles
- **Structural idea** — how the page is composed (not "hero + three cards")
- **Signature detail** — one thing a visitor would remember
- **Motion stance** — one authored moment, or none
- **Tokens** — CSS variables or named values

How to fill it:

- `build` / `direction`: run taste `scripts/draw.mjs`, pick a direction, then summarize the sheet into `DESIGN.md`. Leave `.taste-skill/` as working files; other modules read `DESIGN.md` only.
- `app`: impeccable operate + taste `references/app-screens.md`. Tokens over spectacle.
- Existing project: impeccable `document` can draft DESIGN.md from code; still filter through [principles.md](principles.md).

ui-ux-pro-max `--design-system` may feed candidates. Filter them. Never paste a style name into DESIGN.md without a slop-floor pass.

## 3. Build

Load only the routed `MODULE.md` files. Follow that module. Doctrine and DESIGN.md override module defaults ([conflicts.md](conflicts.md)).

## 4. Look

Render and look at shipping sizes:

- Product UI / landing: desktop and a mobile width
- Slides: 1920×1080
- Diagrams: the named output size in diagram-design

If you cannot render, say so and drop the visual tier in the report. Do not claim to have seen pixels you inferred from source.

## 5. Gate

Follow [gate.md](gate.md). Zero P0. Every P1 justified by the brief. Genericness ≤ 3/10 for new work. Review of a slop fixture is allowed to score high — that is the point of the fixture.

## 6. Report

- **Review route:** ai-design-review format in `modules/ai-design-review/MODULE.md`.
- **Build / app / slides / diagram:** say what shipped, which scanners ran, which tiers were skipped, and whether the hook was proposed.
