# Breaking AI Patterns

The catalog says *what* is generic. This file explains *how* to replace it with something that belongs to the product. Read it before writing the "Direction suggestion" section of a report, and before applying any fixes.

## The core idea

AI output converges on the statistical median of the web. The fix is not a better list of banned things, because a ban list just moves the median: no purple gives you cream and terracotta, and no Inter gives you Space Grotesk. The fix is to **anchor every choice in something specific to this product** that a generic page couldn't have.

Ask of every element: *"Would I have arrived here for any similar page?"* If the answer is yes, it's a default.

## Step 1: Find the anchor

Before suggesting any visual change, write down three things. Infer them from the codebase, the README and the copy, or ask the user.

1. **The subject's world.** What physical or cultural artifacts belong to the domain?
   - A tax tool has forms, ledgers and receipts.
   - A climbing gym app has chalk, grade charts and route tape.
   - A developer CLI has terminals, man pages and diffs.
   - A bakery has paper bags, flour and handwritten boards.
2. **The audience and context of use.** Who is looking, on what device, and in what mood? "Ops engineers at 3am during an incident" leads to a very different design than "parents browsing on a phone".
3. **The product's most characteristic artifact.** What one thing could only this product show? A real screen, a specific output, a number, a before-and-after.

Every suggestion in the report should trace back to one of these. "Swap Inter for Fraunces" is a default swap. "Headings in a condensed grotesque like the stencil type on shipping crates, since this is freight logistics" is a direction.

## Step 2: Build a small system

A direction needs just enough system to stay consistent across pages. Drift is the strongest multi-page tell.

| Layer | Decide | Example (freight-logistics SaaS) |
|---|---|---|
| **Color roles** | 4–6 colors named by job, weighted 60/30/10 | `--ground` warm concrete gray, `--ink` near-black, `--signal` safety orange (actions only), `--ok` / `--warn` / `--bad` semantic |
| **Type** | A display face and a body face, each with a job, and a scale with real contrast | Condensed grotesque for display, a neutral grotesk for UI, tabular numerals for data |
| **Shape** | Radius per role, one personality | 2px on inputs, 4px on containers, 0 on media. Industrial, not soft |
| **Elevation** | Which surfaces float. Most should not. | Flat page; shadow only on menus and dialogs |
| **Spacing** | A 4/8 scale with named tiers | 4 / 8 / 12 / 16 / 24 / 40 / 64 |
| **Motion** | One easing set, a duration scale, one signature moment | ease-out 160/240ms; the shipment route draws in once on load |
| **Signature detail** | One memorable, product-born element | A route-line motif that also works as a divider |

Suggest writing this to `DESIGN.md`, or the project's tokens file, so every future page and prompt can pull from it. The template is below.

## Step 3: Structural moves, by tell

| Instead of | Try |
|---|---|
| Centered pill-hero with two CTAs | Lead with the product's artifact: an annotated real screenshot, a live interactive demo, the one number, or the output the user gets. Use an asymmetric grid. One CTA that names the action. |
| Three icon cards | Rank the features. One large showcase plus 2–4 smaller points. Alternating text and visual rows. A comparison against the old way of doing it. Prose with inline emphasis. |
| The stock section waterfall | Order the page by the questions this buyer asks, in the order they ask them. Cut any section without real material. Give the page one structural idea, such as a timeline, a before-and-after or a walkthrough. |
| Stat strip | One real number with its source and context, or nothing. |
| Testimonial grid | One or two real quotes with name, role and specifics, placed next to the claim they support. |
| Three-tier pricing | Mirror the real offer: one plan, a calculator, or a comparison table. |
| Cards everywhere | Use whitespace, alignment, dividers and type for grouping. Cards only for independently actionable items. |
| Dark-plus-glow | Light, unless the context of use is truly dark. If dark, define real surface levels. |
| Fade-up everything | Static content, plus one purposeful moment that shows the product working. |
| Emoji or Lucide chips | No icon, or a small custom set drawn in the brand's stroke and shape. |
| Gradient text or paint-one-word | Get emphasis from scale, weight and line breaks. |

## Step 4: Copy moves

- **Headline:** state what it does, for whom, with one concrete claim. Test: could a competitor use the same sentence? If yes, rewrite it.
- **Subhead:** describe the mechanism or proof, not more adjectives.
- **CTAs:** use verb + object ("Track a shipment", "Start a 14-day trial"), and keep it consistent through the flow.
- **Microcopy:** say what happened, why, and what to do next. Name the user's own objects ("3 invoices overdue", not "You have notifications").
- Rewrite copy and visuals together. A distinctive layout full of hype copy still reads as generated.

## Tests to run and report

- **Silhouette test:** picture the page as gray blocks. Would it be indistinguishable from five competitors' pages? If yes, the structure is the problem, not the styling.
- **Squint test:** at 25% zoom or blurred, does one thing clearly lead? Is the hierarchy obvious?
- **Default test:** for each major choice, would you have made it for any similar product? Each "yes" is a candidate to replace.
- **Four questions:**
  1. Is the font chosen or defaulted?
  2. Is the color meaningful or the median?
  3. Does the layout break the three-card reflex?
  4. Could only this product say this headline?
- **Second-order check (after fixes):** did removing a default introduce its escape? Watch for cream + terracotta, black + acid green, the emerald accent, broadsheet styling or a "tasteful" free font.

## Keep what's good

Not everything generic is wrong. Clear layouts, accessible contrast, sensible spacing and a working component library are worth keeping. The report should name what already works, so fixes don't remove solid foundations. The goal is *distinctive and appropriate*, not *different for its own sake*. A banking dashboard should still feel trustworthy and calm.

## DESIGN.md template

Offer this when the review recommends a direction. Fill it in from the anchor.

```markdown
# Design system: <Product>

## Anchor
- World: <artifacts / materials / vernacular of the domain>
- Audience & context: <who, device, mood>
- Signature artifact: <the one thing only we can show>

## Color (by role)
| Token | Value | Use |
|---|---|---|
| --ground | | page background (60%) |
| --surface | | raised surfaces (30%) |
| --ink | | primary text (≥ 7:1 on ground) |
| --ink-muted | | secondary text (≥ 4.5:1) |
| --signal | | primary action only (10%) |
| --ok / --warn / --bad | | semantic states only |

## Type
- Display: <face>, used for <h1/h2>; why: <tie to anchor>
- Body/UI: <face>; tabular numerals for data
- Scale: <e.g. 14 / 16 / 20 / 28 / 40 / 64>

## Shape & elevation
- Radius: inputs <x>, containers <y>, media <z>
- Shadows: only on <menus, dialogs>

## Spacing: 4 / 8 / 12 / 16 / 24 / 40 / 64
## Motion: easing <curve>; durations <120/200/320>; signature moment: <one>; respects prefers-reduced-motion
## Voice: <3 adjectives + 1 banned habit>; CTA pattern: verb + object

## Do not use (for this product)
- <defaults explicitly ruled out, with reason>
```
