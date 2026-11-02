# Module: ai-design-review

In this module, `<skill-dir>`, `<skill>`, `<skill-base-dir>` and "the folder containing this SKILL.md" all mean the `modules/ai-design-review/` directory of design-studio (the folder that contains this MODULE.md).

design-studio doctrine (`doctrine/`) and the project's `DESIGN.md` / `PRODUCT.md` override this module's defaults.

Module-specific skips:
- Keep this module's report format for review/audit/roast routes.
- Scanner IDs (CL1, LY5, CP1, SD1–SD5, …) are the canonical vocabulary.

Load this module only when the design-studio router selects it. Do not treat this file as a standalone skill.

<!--
upstream frontmatter:
---
name: ai-design-review
description: Reviews UI/UX for the patterns that make interfaces look AI-generated or "vibe-coded" (purple/indigo gradients, Inter-only type, pill badge + centered hero + three icon cards, glassmorphism, emoji as icons, untouched shadcn, hype copy like "Elevate your workflow", fade-up-everything, invented stats, missing empty/loading states) and suggests concrete, product-specific ways to break each one. Works on frontend code, mobile app code (React Native, Flutter, SwiftUI, Compose), screenshots and live URLs. Use this whenever the user asks to review, critique, audit or roast a UI, landing page, dashboard or app screen; says a design looks AI-made, generic, templated, "like every SaaS site" or "slop"; or wants it to feel more human, distinctive, premium or less cookie-cutter, even if they never say "AI".
---
-->

---


# AI Design Review

AI-built interfaces converge on the statistical median of the web. The result is a recognizable look: a purple gradient, Inter, a centered hero with a pill badge, three icon cards, `rounded-2xl shadow-lg` on everything, and copy like "Build the future of work". Users increasingly read that look as "nobody designed this", and trust drops with it.

This skill does two jobs:
1. **Find** the tells, explain why each one reads as machine-made, and rank them.
2. **Break** them with moves anchored in *this* product. A fix that is generic just swaps one default for the next. Remove purple without thinking, and you get cream with terracotta.

By default it produces a review and stops. Change code only when the user asks you to apply fixes, either in the original request or after reading the report.

## Bundled resources

All paths are relative to the folder containing this SKILL.md.

| File | Read when |
|---|---|
| `references/ai-tells-catalog.md` | Always, before judging. It holds every tell with its ID, severity, why it reads as AI, and how to break it. Use the TOC to jump to sections. |
| `references/break-patterns.md` | Before writing the Direction section, and before applying any fix. |
| `references/visual-review.md` | Whenever you have, or can get, pixels: a screenshot, a URL, or a rendered page. |
| `references/mobile.md` | When the target is a native or cross-platform mobile app. |
| `scripts/scan.mjs` | For any code input. It is a zero-dependency scanner and needs Node 18+. |

## Workflow

### 1. Scope and brief

Identify what you're reviewing: a code path, screenshot(s), a URL, or a mobile app. Then work out the brief. Read the README, `package.json`, existing copy, tokens and any `DESIGN.md` to find:
- what the product is,
- who uses it, and in what context,
- which choices look deliberate (a brand guide, an existing token system).

The brief matters because every fix you suggest must trace back to it. "Use a better font" is worthless. "A condensed grotesque echoing shipping-crate stencils, because this is freight logistics" is a direction. Ask the user only if the product really can't be inferred. Otherwise state the brief you assumed in the report, so they can correct it.

### 2. Scan (code inputs)

```bash
node <skill-dir>/scripts/scan.mjs <target-path> --json
```

`<skill-dir>` is the directory containing this SKILL.md. The scanner skips node_modules, build output and example folders. It exits with code 2 when it finds P0 or P1 candidates, which is expected and not an error. If Node isn't available, skip this step and grep for the Signal patterns listed in the catalog instead.

Treat scanner hits as **candidates**. Check each one in context:
- Is the purple actually the brand?
- Is the gray text on a dark surface, where it's fine?
- Is the "stat strip" made of real numbers?

Drop false positives quietly. Don't pad the report with them.

### 3. Look

The scanner can't see palette weight, hierarchy, rhythm, glow, imagery or the overall silhouette, and those carry much of the AI signal.
- **Screenshots:** read them and follow `references/visual-review.md`.
- **URLs:** if a browser or screenshot tool is available, capture the page at desktop and mobile widths. If not, fetch the HTML, save it to a temp file, and scan that.
- **Code only:** render it if a dev server is already running or trivially startable. Otherwise review from source.

Label each finding's tier honestly (scanner / visual / judgment). Never claim to have seen something you only inferred from code.

### 4. Judge

Walk the judgment-tier items in the catalog. Code can't settle these:
- copy specificity (CP1, CP7),
- the section waterfall (LY5),
- invented proof (LY6),
- fake functionality (UX8),
- design-system drift across pages (SY1),
- missing UX states (UX1),
- second-order defaults (SD*).

Then run the tests from `break-patterns.md`:
- **Silhouette:** does the page reduce to the same block shape as every other page?
- **Default:** for each major choice, ask "Would I have made this choice for any similar product?"
- **Four questions:** is the font chosen, is the color meaningful, does the layout break the three-card reflex, could only this product say this headline?

Also notice what is already good. A clear layout, solid contrast and a working component library are foundations worth keeping. The aim is distinctive *and appropriate*. A banking app should still feel calm and trustworthy.

### 5. Report

Use this structure. It is fixed so that reviews are comparable across runs and the user can act on IDs directly.

```markdown
# AI-Pattern Review: <target>

**Verdict:** <genericness score 0–10> / 10. <one line naming the 2–3 biggest contributors>
**Brief assumed:** <product · audience · context of use · deliberate choices respected>
**Reviewed:** <files / screens / URL> · **Tiers covered:** scanner ✔ visual ✔|limited|✘ judgment ✔

## P0: reads as AI to anyone
### [CL1] Purple → indigo hero gradient · `app/page.tsx:24`, `:140` · scanner
**What:** <what's there, concretely>
**Why it reads AI:** <one or two sentences; teach, don't just label>
**Break it:** <specific move tied to the brief, with a small code sketch when it helps>

## P1: a designer would notice
...same entry format...

## P2: polish
<compact list: one line per finding, with ID · location · fix>

## Keep: already distinctive or solid
- <things not to lose in a redesign>

## Direction
3–6 bullets that turn the fixes into one coherent idea:
anchor (the product's world) · palette roles · type pairing · one structural idea · one signature detail · motion stance.
Offer to write it into DESIGN.md (template in break-patterns.md).

## Next step
Say **"apply P0"**, **"apply P0+P1"**, or list IDs (e.g. "apply CL1, LY2, CP1"), and I'll make the changes and re-scan.
```

Guidelines for the report:
- **Group repeated hits.** One CL1 entry listing every location beats five separate entries.
- **Order by impact within each severity.** Lead with what changes perception most: hero, headline, palette.
- **Keep it proportional.** A page with three tells gets a short report. Don't inflate it. A clean page can get a 1–2 and mostly "Keep" items, which is a useful result.
- **Write "Break it" as instructions a developer could follow today,** not as abstract principles.

### 6. Apply fixes (only when asked)

When the user says "apply …", or asked for fixes in the original request:

1. **Set the direction first.** Write down the anchor, the palette roles, the type pairing and one signature detail (see `break-patterns.md`). Changes made without a direction drift straight to the next default.
2. **Edit in priority order** (P0 first), keeping functionality intact. When you change a token, change it at the source (the CSS variables or theme) rather than per component, so the system stays coherent.
3. **Fix the copy along with the visuals.** A distinctive layout full of hype copy still reads as generated. Use the user's real details where you know them. Where you don't, write specific placeholder text the user can replace, such as "[real customer quote]". Never invent stats or testimonials.
4. **Re-scan the changed files**, and check the second-order list (SD1–SD5). You must not have introduced cream with terracotta, black with acid green, an emerald fallback, or a trendy free font as the only gesture.
5. **Summarize** with a before/after list of the IDs fixed, the new direction in two lines, and anything left for the user. Real photos, real numbers and brand assets can only come from them.

## Calibration notes

- **Severity:**
  - **P0:** an ordinary visitor would think "AI made this".
  - **P1:** a designer or front-end developer would notice.
  - **P2:** craft and polish.

  Always report P0 and P1. Include P2 when the report isn't already long.
- **Deliberate choices beat the catalog.** If the brand guide says Inter, or a crypto product should feel neon, mark it as intentional and move on. Respecting deliberate choices is what makes the review trustworthy.
- **Prefer subtraction.** Many of the best fixes remove things: the pill badge, icon chips, glow, fade-ups, the stat strip. Removal often does more than adding a "creative" flourish.
- **Long-form prose** (blog posts, docs) isn't covered here. If a writing or de-AI prose skill is installed, mention it for those parts.
