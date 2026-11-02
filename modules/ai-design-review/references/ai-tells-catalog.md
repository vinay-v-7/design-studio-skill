# AI Tells Catalog

Each entry below is a pattern that makes an interface read as machine-generated. Every entry has:

- **ID**, used in reports and by `scripts/scan.mjs`. Scanner rule IDs match these IDs.
- **Severity:**
  - **P0:** an ordinary visitor would say "AI made this".
  - **P1:** a designer or front-end developer would notice.
  - **P2:** craft and polish.
- **Tier:** how the tell is detected.
  - **scanner:** visible in the code.
  - **visual:** needs pixels: a screenshot, render or URL.
  - **judgment:** needs the brief or product context.
- **Signal:** what to look for.
- **Why it reads AI:** what to explain to the user. It is what turns a finding into understanding.
- **Break it:** the move. Make it specific to the product being reviewed. A generic swap usually just picks the next default.

A match is a **candidate**, not a verdict. If the brief or the codebase shows the choice was deliberate, say so and move on. A deliberate choice might be a brand guide that specifies Inter, or a crypto product that really is neon. The question is always: *was this chosen, or did it arrive by default?*

## Contents

1. [Typography](#typography): TY1–TY9
2. [Color](#color): CL1–CL12
3. [Second-order defaults](#second-order-defaults): SD1–SD5
4. [Layout and composition](#layout-and-composition): LY1–LY13
5. [Components](#components): CM1–CM9
6. [Iconography](#iconography): IC1–IC4
7. [Copy and microcopy](#copy-and-microcopy): CP1–CP7
8. [Motion and effects](#motion-and-effects): MO1–MO6
9. [Imagery](#imagery): IM1–IM4
10. [App and dashboard UX](#app-and-dashboard-ux): UX1–UX9
11. [System and consistency](#system-and-consistency): SY1–SY4

Mobile-specific tells are in `mobile.md` (MB IDs).

---

## Typography

### TY1 · Inter, Roboto or system stack as the only typeface: P1 · scanner
- **Signal:** `font-family: Inter`, `Inter({` from `next/font`, a Google Fonts `family=Inter` link, a Tailwind `fontFamily.sans: ["Inter"…]`, or only `system-ui`/`-apple-system`/Roboto/Arial. One family carries headings, body and UI with no display face.
- **Why it reads AI:** Inter is the default in nearly every AI builder, component kit and starter template. It's a good typeface, which is exactly why it became the median. On its own it says "nobody chose this".
- **Break it:** Choose type from the product's world. A legal tool might borrow from court documents, a coffee brand from its packaging, a dev tool from its terminal. Pair a display face with a readable body face, and give each a role (`--font-display`, `--font-body`). Keep Inter for dense UI text if you like it, but give headings a voice.

### TY2 · A "tasteful" free font as the only gesture: P2 · scanner
- **Signal:** Space Grotesk, Geist, Syne, Sora, Instrument Serif, Fraunces, Cal Sans, Manrope or DM Sans used as the single distinctive move, with everything else left default.
- **Why it reads AI:** These are what a model reaches for when told "not Inter". They have become the second tier of defaults. Swapping one font while the layout stays templated changes nothing.
- **Break it:** Typography only works as part of a direction. Pick the face because it matches the subject, not because it is "not Inter". Then make sure scale, weight contrast and layout carry the same idea.

### TY3 · Geist left at the Next.js default: P2 · scanner
- **Signal:** `GeistSans`, `GeistMono`, or `from "geist/font"` with no other type decision.
- **Why it reads AI:** This is the `create-next-app` default, so it signals "scaffold, unstyled".
- **Break it:** Keep Geist Mono for code if it fits. Give headings and marketing text a face that belongs to the brand.

### TY4 · Font declared but never loaded: P1 · scanner
- **Signal:** A `font-family` names a non-system face, but there is no `@font-face`, font `<link>`, `next/font` import, or font package for it.
- **Why it reads AI:** The model wrote the name of a font it never shipped. Visitors see the fallback, and the "typographic choice" doesn't exist.
- **Break it:** Load the font, or remove it from the stack. Verify the result in the rendered page, not in the source.

### TY5 · One painted word in the headline: P1 · scanner
- **Signal:** An `<h1>`/`<h2>` with a 1–3 word `<span>`/`<em>`/`<mark>` that is colored, gradient-filled, italicized or highlighted ("Analytics that *just works*").
- **Why it reads AI:** It's a stock way to create emphasis without a type system. The serif-italic accent word inside a sans headline has become a recognizable signature of AI-made pages.
- **Break it:** Create emphasis with the type system: size, weight, width, a deliberate line break, or by cutting the headline down so it doesn't need emphasis.

### TY6 · Tracked all-caps eyebrows everywhere: P2 · scanner
- **Signal:** A small, uppercase, letter-spaced label above every section heading ("FEATURES", "HOW IT WORKS", "PRICING"). Three or more of these per page.
- **Why it reads AI:** It is decoration that repeats the heading below it. A template uses it as filler, not to carry information.
- **Break it:** Keep an eyebrow only when it says something the heading doesn't (a date, a category, a step count). Use sentence case.

### TY7 · Monospace as decoration: P2 · scanner
- **Signal:** `font-mono` on tiny labels, metadata, badges and stats that aren't code or tabular data.
- **Why it reads AI:** It borrows a "technical" look without the content to justify it. Paired with all-caps labels and middle-dot separators ("v2.0 · BETA · 2026"), it is the dev-tool cosplay default.
- **Break it:** Use mono only for code, keys, IDs and numbers that people scan in columns.

### TY8 · Flat type scale: P1 · visual
- **Signal:** Headings barely larger than body text. One weight throughout. Everything 14–18px.
- **Why it reads AI:** Generated pages often set type to deliver words, not to structure them, so nothing leads the eye.
- **Break it:** Choose a scale with real contrast (for example a 1.25–1.333 ratio, or an intentional jump for display text). Use two or three weights with clear jobs. Squint at 25% zoom: the hierarchy should still read.

### TY9 · Title Case on every label: P2 · scanner
- **Signal:** "Get Started Today", "Our Amazing Features", "Manage Your Team" in buttons, headings and menus.
- **Why it reads AI:** It is the model's default casing, and it makes interfaces feel like slide decks.
- **Break it:** Use sentence case for interface text unless the brand guide says otherwise.

---

## Color

### CL1 · Purple, indigo or violet gradient: P0 · scanner
- **Signal:** `bg-gradient-to-* from-indigo|violet|purple|fuchsia-*`, `linear-gradient(…)` with violet stops, or a blue→purple hero background or CTA.
- **Why it reads AI:** This is the single most recognized AI tell. It traces back to Tailwind UI's `indigo-500` defaults and is reinforced by every model trained on those sites. Visitors now read it as "generated".
- **Break it:** Derive the palette from the product: its materials, its industry vernacular, or its existing brand. Name colors by role (`--ground`, `--ink`, `--signal`). If you need a gradient, keep it tonal within one brand hue, or replace it with a flat, committed color.

### CL2 · Indigo or violet primary buttons: P1 · scanner
- **Signal:** `bg-indigo-500/600`, `bg-violet-500/600`, `bg-purple-600` on CTAs. Gradient-filled CTA buttons.
- **Why it reads AI:** It is the same lineage as CL1, visible even when there is no gradient.
- **Break it:** The primary action color should be the brand signal, chosen for contrast against the ground and used sparingly enough to mean "act here".

### CL3 · Gradient-filled text: P0 · scanner
- **Signal:** `bg-clip-text text-transparent bg-gradient-to-*`, or `background-clip: text` with `color: transparent`, on headlines or big stats.
- **Why it reads AI:** It is the most "premium AI" effect, and it often hurts legibility.
- **Break it:** Use solid ink or the brand color. Get impact from size and weight.

### CL4 · Neon palette with no dominant color: P1 · visual
- **Signal:** Electric blue, hot pink, acid green and orange all at full saturation and similar weight.
- **Why it reads AI:** When everything is emphasized, nothing is. A human designer would ration the accents.
- **Break it:** Use 60/30/10: one dominant ground, one secondary, and one accent kept for the things that matter. Decide which elements get the accent and hold that line.

### CL5 · Dark mode with glow by default: P0 · visual (scanner partial)
- **Signal:** A near-black hero with a radial bloom, aurora blobs, glowing text, or a "spotlight" behind the headline, when nothing in the brief asked for dark.
- **Why it reads AI:** "Dark plus glow equals premium" is a model shortcut. It is the 2025–26 default for anything called AI or SaaS.
- **Break it:** Go dark only when the product earns it: night use, media, developer tools that live in dark terminals. When you do, theme it as a full palette with real surface levels. Get depth from contrast and typography, not glow.

### CL6 · Colored glow shadows: P1 · scanner
- **Signal:** `shadow-indigo-500/50`, `shadow-[0_0_40px_…]` in saturated colors, or a `box-shadow` with blur of 8px or more in a non-neutral color.
- **Why it reads AI:** Glow takes the place of elevation and hierarchy.
- **Break it:** Use shadows for elevation, in neutral tones, on few elements. Put atmosphere in the background treatment if you need it.

### CL7 · One hue pretending to be two: P2 · scanner
- **Signal:** Primary and accent tokens within about 20° of hue (indigo plus violet, blue plus sky).
- **Why it reads AI:** The palette looks varied in code but reads as one color, so the accent has no job.
- **Break it:** Give the second color a different job and a different hue or value.

### CL8 · Colored side stripe on every card: P1 · scanner
- **Signal:** A 2–8px colored left or top border on each card, often cycling red, blue, green and orange.
- **Why it reads AI:** It is decoration standing in for meaning. The colors don't map to any state.
- **Break it:** Remove the stripes. If cards really differ in state, use a text label plus one semantic color, or use position and weight.

### CL9 · Low-contrast muted text: P1 · scanner (token) / visual
- **Signal:** `text-gray-400` on white, or a `--muted-foreground` under 4.5:1 on the page background, in body or helper text.
- **Why it reads AI:** Models over-use "muted" to look refined, at the cost of readability. It is also an accessibility failure.
- **Break it:** Bring body and helper text to at least 4.5:1, and check it with a contrast tool. Create hierarchy with size and weight instead of fading text out.

### CL10 · Decorative color with no semantics: P1 · judgment
- **Signal:** Colors used for vibe. The same green means "success" in one place and is "just a nice card" in another.
- **Why it reads AI:** Generated UIs pick colors per component, not per meaning.
- **Break it:** Map colors to roles: action, success, warning, danger, info, and neutral surfaces. Use decorative color only in the brand layer (illustration, hero), never in UI states.

### CL11 · Grey-on-grey "modern dark" surfaces: P1 · scanner
- **Signal:** `bg-zinc-950`/`bg-gray-900` cards with `border-white/10` hairlines, stacked three levels deep.
- **Why it reads AI:** It is the default dark SaaS card. Surfaces are separated only by a 10%-white border, so there is no real elevation system.
- **Break it:** Define three or four surface levels with real value steps. Use borders and shadows on purpose, not by default.

### CL12 · Timid, evenly weighted palette: P2 · visual
- **Signal:** Five pastel or mid-tone colors at roughly equal weight. Nothing dominates.
- **Why it reads AI:** It is the opposite of the neon failure, but it has the same cause: no hierarchy among colors.
- **Break it:** Commit to a dominant color. A bold flat color often beats a careful gradient.

---

## Second-order defaults

These are the escapes a model reaches for once you tell it "no purple, no Inter". They are still defaults. Flag them, especially after a previous "de-AI" pass.

### SD1 · Cream plus terracotta ("the Claude look"): P1 · scanner
- **Signal:** A warm off-white background (around `#F4F1EA`, or `bg-amber-50`/`stone-50`) with a burnt-orange accent (around `#D97757`, `#C96442`, `#CC785C`), often with a serif headline.
- **Why it reads AI:** It is the "tasteful" alternative models default to, and it is close to Claude's own interface palette.
- **Break it:** Use it only if the subject's world is actually warm, editorial or crafted. Otherwise derive the palette from the product, as in CL1.

### SD2 · Near-black plus one acid accent: P1 · scanner
- **Signal:** A `#0B0B0B`–`#111` or `bg-black`/`zinc-950` background with a single lime, acid-green or vermilion signal color.
- **Why it reads AI:** This is the "edgy developer tool" default.
- **Break it:** Justify dark (see CL5), then build a full palette rather than one neon on black.

### SD3 · Emerald or teal as the safe accent: P2 · scanner
- **Signal:** `emerald-500/600`, `#10B981`, `#059669` as the only accent.
- **Why it reads AI:** It is what is left once purple is banned.
- **Break it:** Choose the accent for a reason tied to the product.

### SD4 · Broadsheet cosplay: P2 · visual
- **Signal:** Hairline rules, zero radius, newspaper columns, serif headlines and all-caps mono labels on a product that isn't editorial.
- **Why it reads AI:** It is the "designer-y" second-order look, and the content gives no reason for it.
- **Break it:** Use an editorial style only for editorial content.

### SD5 · Fake window chrome or terminal: P2 · scanner
- **Signal:** Traffic-light dots (`#ff5f57 #febc2e #28c840`) on a generic panel, or a fake terminal hero that shows nothing real.
- **Why it reads AI:** It is a prop that signals "product" without showing the product.
- **Break it:** Show the actual interface: a real screenshot, a live embed, or a mock of the product's own UI.

---

## Layout and composition

### LY1 · Pill badge, centered H1, centered subhead, two CTAs: P0 · scanner + visual
- **Signal:** A rounded-full "✨ New: …" capsule, then a centered headline, a centered gray subhead, and a primary plus a ghost button, often over a gradient or glow.
- **Why it reads AI:** It is the default hero of nearly every AI-built page. Centering is fine on its own; this exact stack is the tell.
- **Break it:** Open with the most characteristic thing in the product's world: a real screen, a live demo, the one number that matters, a customer's artifact. Place headline, text and media on a grid with intent. Asymmetry is often enough to stop the template feel. Drop the pill unless it carries real, dated news.

### LY2 · Three identical icon-topped feature cards: P0 · scanner + visual
- **Signal:** A `grid-cols-3` (or 6) of cards, each with an icon in a chip, a two-to-four-word title and two lines of text.
- **Why it reads AI:** It is the "three-card reflex". Features rarely come in equal threes, and the format flattens them into interchangeable claims.
- **Break it:** Let the content set the form:
  - one large showcase plus smaller supporting points;
  - alternating text and visual rows;
  - a comparison table;
  - prose with inline emphasis;
  - a real screenshot annotated with callouts.

  If one feature matters most, make it look that way.

### LY3 · Cards inside cards: P1 · visual / scanner
- **Signal:** Three or more levels of bordered or shadowed containers (card → card → card).
- **Why it reads AI:** It is a filing cabinet inside a filing cabinet. Every grouping gets a box because boxes are the model's only grouping tool.
- **Break it:** Allow one level of containment. Group everything else with whitespace, proximity, alignment and type. Use a card only for something the user can act on independently.

### LY4 · Uniform radius, padding and card height: P1 · scanner + visual
- **Signal:** The same `rounded-2xl`/16px radius and 24px padding on buttons, inputs, cards, images and modals. Every card the same height.
- **Why it reads AI:** Uniformity reads as "unconsidered". Human systems vary radius and spacing by role.
- **Break it:** Set radius per role (tight for inputs and chips, larger for containers, none for full-bleed media). Choose one radius personality: sharp for editorial or brutalist, soft for playful. Let some surfaces be flat.

### LY5 · Stock section waterfall: P1 · judgment (scanner partial)
- **Signal:** The page runs hero → logos → features → how-it-works → testimonials → stats → pricing → FAQ → CTA → footer, and six or more of these are present in this order.
- **Why it reads AI:** It is the median SaaS outline. A silhouette test can't tell it apart from a thousand others.
- **Break it:** Run the silhouette test (see `break-patterns.md`). Order sections by what this audience needs in order to decide. Cut sections that have nothing real to say. Give the page one structural idea.

### LY6 · Round-number stat strip and fake proof: P0 · scanner + judgment
- **Signal:** "10,000+ users · 99.9% uptime · 4.9★ · 50+ countries". Logo walls of companies that aren't customers. Invented SOC2 or GDPR badges. Testimonials with generated faces and generic praise.
- **Why it reads AI:** Invented proof is both a tell and a trust risk. Visitors notice when numbers are too round.
- **Break it:** Use one real, specific, sourced number, or none. Use real quotes with names and roles, or leave the section out.

### LY7 · Three-tier pricing with a "Most Popular" ring: P1 · scanner
- **Signal:** Three plan cards, the middle one scaled up or ringed, with a "Most popular" badge.
- **Why it reads AI:** It is the template default, whatever the actual offer is.
- **Break it:** Let the real offer set the layout: one plan with add-ons, two plans, a usage calculator, or a comparison table. Earn any highlight.

### LY8 · Four-column footer with a newsletter box: P2 · scanner
- **Signal:** Four equal link columns ("Product, Company, Resources, Legal"), an email input and a social icon row, often with links that go nowhere.
- **Why it reads AI:** It is filled in by template, not by the site's real structure.
- **Break it:** Build the footer from the links that actually exist. Two columns and a line can be enough.

### LY9 · Decorative 01/02/03 numbering: P2 · scanner
- **Signal:** Large two-digit numerals on features, or a "How it works 1-2-3" for things that aren't a sequence.
- **Why it reads AI:** It suggests a process where there isn't one.
- **Break it:** Number only real sequences.

### LY10 · Bento grid by reflex: P2 · visual
- **Signal:** A mixed-size tile grid where tile size doesn't reflect importance.
- **Why it reads AI:** It was the trend in 2024–25, so it became the default.
- **Break it:** Use bento only when tile sizes encode real differences in importance. Otherwise use a simpler structure.

### LY11 · The same container on every section: P2 · scanner
- **Signal:** `max-w-7xl mx-auto px-4` or `container mx-auto` repeated on every section.
- **Why it reads AI:** Every section has the same width and rhythm, so the page has no pacing.
- **Break it:** Vary width by role: a narrow measure for reading, wide or full-bleed for showcase media.

### LY12 · Everything centered: P1 · visual
- **Signal:** Every section is center-aligned, including long text and lists.
- **Why it reads AI:** Centering is the safest choice, and the model makes it everywhere. Long centered text is also harder to read.
- **Break it:** Left-align reading content. Center only short, symmetric moments.

### LY13 · Empty decorative space-fillers: P2 · visual
- **Signal:** Floating blurred blobs, grid-dot backgrounds or abstract shapes added to fill whitespace.
- **Why it reads AI:** It is decoration added because the space "looked empty", not because the content needed it.
- **Break it:** Let whitespace be whitespace, or fill it with real content.

---

## Components

### CM1 · Untouched shadcn/ui theme: P1 · scanner
- **Signal:** `components.json` with `baseColor: zinc|slate|neutral`, a stock `--primary: oklch(0.205 0 0)`, a stock `--radius: 0.5rem/0.625rem`, and Button and Card used as shipped.
- **Why it reads AI:** Roughly a quarter of AI-built sites ship shadcn untouched. It is a great base, but it is recognizable when left as is.
- **Break it:** Theme it: base color, radius, type scale, and Button and Card variants in the brand's own terms. Treat shadcn as the skeleton, not the skin.

### CM2 · `rounded-2xl shadow-lg` on every surface: P1 · scanner
- **Signal:** Three or more elements share a large radius plus a soft drop shadow. A "ghost card" with a hairline border plus a wide diffuse shadow.
- **Why it reads AI:** It is the most common "make it look nice" move in generated Tailwind.
- **Break it:** Choose an elevation system. Most surfaces should be flat, and only floating elements (menus, dialogs) need shadows. Vary radius by role (see LY4).

### CM3 · Glassmorphism by reflex: P1 · scanner
- **Signal:** `backdrop-blur` or `backdrop-filter: blur()` on navs, cards and modals. Translucent white or black panels with no real layering behind them.
- **Why it reads AI:** It is a trend effect applied everywhere, often over a flat background where there is nothing to blur.
- **Break it:** Use solid surfaces. Keep blur only where content really scrolls underneath, such as a sticky nav over content.

### CM4 · Icon in a tinted rounded square: P1 · scanner
- **Signal:** Each feature has a single Lucide icon inside a `rounded-xl bg-primary/10` chip.
- **Why it reads AI:** It is the most repeated feature-card decoration on AI-built sites.
- **Break it:** Ask whether the icon adds meaning. Often the answer is to have no icon. If icons stay, make their treatment a decision: size, weight, color, position, or a custom mark.

### CM5 · Sparkle "New" pill: P1 · scanner
- **Signal:** A small capsule with ✨ or "New", "Introducing", "Now with AI" above the H1.
- **Why it reads AI:** It announces news that isn't there.
- **Break it:** Keep it only for real, dated news, and style it in the brand.

### CM6 · Stock effect-library components: P0 · scanner
- **Signal:** Spotlight, BackgroundBeams, AnimatedBeam, ShimmerButton, BorderBeam, Meteors, SparklesCore, AuroraBackground, MagicCard, NumberTicker or Marquee, or folders like `components/magicui` or `components/aceternity`.
- **Why it reads AI:** These demos are copied straight into thousands of generated sites, so they are recognizable on sight.
- **Break it:** Cut them, or build effects from the product's own data or behavior. If one stays, customize it until it no longer looks like the library demo.

### CM7 · Missing interaction states: P1 · scanner + visual
- **Signal:** No `:focus-visible` or `focus-visible:` styles, buttons with no hover or active state, no disabled styling, forms with no inline errors.
- **Why it reads AI:** Models generate the happy-path screenshot. Interaction design is invisible in a static render, so it gets skipped.
- **Break it:** Add hover, focus-visible, active and disabled states plus transitions to every interactive element. Design error messages next to their fields.

### CM8 · Status-chip soup: P1 · visual
- **Signal:** "New", "Beta", "Pro" and "Hot" badges on many rows or cards with no state system behind them.
- **Why it reads AI:** Chips are used as decoration.
- **Break it:** Every chip should map to a defined, changing state. Remove the rest.

### CM9 · Default modal, toast or dropdown with no product voice: P2 · visual
- **Signal:** Library-default toasts ("Success!", "Something went wrong"), confirmation dialogs that say "Are you sure?", and unstyled dropdowns next to a styled page.
- **Why it reads AI:** The edges of the UI were never designed.
- **Break it:** Write specific messages ("Invoice #1042 sent to Dana"). Style overlays in the system. Say what happens next.

---

## Iconography

### IC1 · Emoji as UI icons: P0 · scanner
- **Signal:** Emoji used as feature icons, bullets, nav items, section headers, tab icons or button glyphs (🚀 ⚡ 🔒 📊 ✅ 💡 🎯).
- **Why it reads AI:** Generated UIs are full of them, and people read them as a placeholder. They also render differently on each platform and can't be themed.
- **Break it:** Use one consistent vector icon family, or no icons. Keep emoji for user content and tone (messages, reactions), not for the UI's own structure.

### IC2 · ✨ for "AI" and the worn Lucide set: P1 · scanner
- **Signal:** `Sparkles` beside anything AI-powered. Heavy use of Zap, Rocket, Shield, CheckCircle2, BarChart3, Star or ArrowRight.
- **Why it reads AI:** These are the icons a model picks first. The sparkle-for-AI is now a cliché.
- **Break it:** Pick icons for meaning. Describe the AI feature by what it does ("Drafts a reply") instead of decorating it.

### IC3 · An arrow on every CTA: P2 · scanner
- **Signal:** "Get started →", "Learn more →", "→" on every link.
- **Why it reads AI:** It is a reflex flourish.
- **Break it:** Use an arrow only where it means "go somewhere", and make it a real icon, consistently sized.

### IC4 · Generic thin-line icons, mixed styles: P2 · visual
- **Signal:** Interchangeable 1.5px outline icons that could mean anything. Filled and outline icons mixed at the same level. Inconsistent sizes.
- **Why it reads AI:** The icons were picked for availability, not meaning.
- **Break it:** Use one family, one stroke weight, one size scale, and one fill style per hierarchy level.

---

## Copy and microcopy

Copy is half the tell. A beautiful layout full of generic copy still reads as slop. For long-form prose, a dedicated writing skill (for example `unslop`, if installed) goes deeper.

### CP1 · Vague aspirational headline: P0 · scanner + judgment
- **Signal:** "Build the future of…", "Your all-in-one platform", "Elevate your workflow", "Unleash the power of…", "Scale without limits", "Reimagine how you…", "The future of X is here", "Supercharge your…".
- **Why it reads AI:** It could front any product, so it says nothing about this one.
- **Break it:** Say what it does, for whom, with one concrete claim. Ask: "Could only this product say this?" and "Would the founder say this out loud?"

### CP2 · Hype adjectives: P1 · scanner
- **Signal:** seamless, powerful, robust, cutting-edge, next-generation, best-in-class, world-class, effortless, revolutionary, game-changing, blazing fast, state-of-the-art, intuitive.
- **Why it reads AI:** These words carry no information, and models use them heavily.
- **Break it:** Replace each one with a number, a verb or a specific mechanism. "Syncs in under 2s" beats "blazing fast".

### CP3 · Generic CTA labels: P1 · scanner
- **Signal:** Get Started, Learn More, Submit, Click Here, Sign Up Now.
- **Why it reads AI:** It is a placeholder that never got replaced.
- **Break it:** Name the action and its object: "Start a 14-day trial", "Compare plans", "Send invoice". Keep the same verb through the whole flow.

### CP4 · Tricolon slogans: P2 · scanner
- **Signal:** "Faster. Smarter. Simpler." or "Plan, track, and ship."
- **Why it reads AI:** The rule of three is a model rhythm habit.
- **Break it:** Replace it with one concrete claim.

### CP5 · Hedging and filler: P2 · scanner
- **Signal:** "may help you", "can potentially", "designed to", "whether you're X or Y", "in today's fast-paced world".
- **Why it reads AI:** These are model hedges and stock openers.
- **Break it:** Remove them, and state the claim plainly.

### CP6 · Placeholder or lorem content shipped: P0 · scanner
- **Signal:** Lorem ipsum, "John Doe", "Acme Inc", "Jane Smith, CEO at Company", `example.com` links, `#` hrefs on primary navigation.
- **Why it reads AI:** It is unfinished generation.
- **Break it:** Use real content, or clearly mark the content as a draft.

### CP7 · Microcopy with no voice: P2 · judgment
- **Signal:** Empty states that say "No data", errors that say "An error occurred", button text that doesn't match the screen title.
- **Why it reads AI:** The edges were never written.
- **Break it:** Say what happened, why, and what to do next, in the product's voice.

---

## Motion and effects

### MO1 · The same fade-up on every section: P1 · scanner
- **Signal:** `initial={{ opacity: 0, y: 20 }}` with `whileInView` on every block, `data-aos="fade-up"`, a reused `fadeInUp` keyframe.
- **Why it reads AI:** It is the default Framer Motion recipe. Uniform motion carries no meaning and makes the page feel slower.
- **Break it:** Give motion a job: show a state change, direct attention, or express the brand. Keep one or two memorable moments and let the rest be still.

### MO2 · Bounce or elastic easing: P2 · scanner
- **Signal:** `animate-bounce` on CTAs, `easeOutBack`, spring overshoot, `cubic-bezier` values outside the 0–1 range on hover.
- **Why it reads AI:** It is playful by default, whatever the brand is.
- **Break it:** Use ease-out without overshoot for UI. Keep springs for brands that really are playful.

### MO3 · Count-up stats: P1 · scanner
- **Signal:** NumberTicker, CountUp, `react-countup`, `useCountUp`.
- **Why it reads AI:** It is a theatrical reveal of usually invented numbers.
- **Break it:** Show the real number. If it isn't impressive standing still, animating it won't help.

### MO4 · No reduced-motion handling: P1 · scanner
- **Signal:** Animations are present (keyframes, framer-motion, GSAP, AOS) and there is no `prefers-reduced-motion`, `useReducedMotion` or `MotionConfig reducedMotion`.
- **Why it reads AI:** It shows that accessibility was never considered.
- **Break it:** Wrap non-essential motion in `@media (prefers-reduced-motion: no-preference)` or use `MotionConfig reducedMotion="user"`.

### MO5 · Motion with no shared language: P2 · visual / judgment
- **Signal:** Every component has its own duration and easing. Hover transitions everywhere, at different speeds.
- **Why it reads AI:** Each component was generated in isolation.
- **Break it:** Define one easing set and a duration scale (for example 120, 200 and 320ms), and use only those.

### MO6 · Effects as noise: P1 · visual
- **Signal:** Parallax on every section, custom cursors, animated gradient backgrounds, particles, tilt-on-hover cards.
- **Why it reads AI:** It adds "wow" without purpose, and extra motion is itself a signal that a page was AI-made.
- **Break it:** Cut the effects to one signature moment that shows the product.

---

## Imagery

### IM1 · Stock "diverse team at a laptop": P1 · visual
- **Signal:** A bright office, people smiling at a screen, a handshake, a lightbulb.
- **Why it reads AI:** It is the generic default for "people".
- **Break it:** Use real product screens, real team photos, or illustration with a point of view.

### IM2 · Glossy 3D blobs and AI renders: P0 · visual
- **Signal:** Iridescent floating shapes, plastic-sheen 3D objects, and too-smooth, too-symmetrical AI illustrations.
- **Why it reads AI:** These are the visual signature of image models.
- **Break it:** Use custom art with a point of view, or no illustration. Abstract forms should come from the brand.

### IM3 · Corporate Memphis figures: P2 · visual
- **Signal:** Flat people with tiny heads and long limbs.
- **Why it reads AI:** It is an older trend that image models reproduce endlessly.
- **Break it:** Choose an illustration style with its own voice, or use photography.

### IM4 · Placeholder avatars and gray media boxes: P0 · scanner
- **Signal:** `pravatar`, `dicebear`, `ui-avatars`, `randomuser.me`, `picsum.photos`, `placehold.co`, or `aspect-video bg-muted` boxes where a screenshot should be.
- **Why it reads AI:** The generation is visibly unfinished.
- **Break it:** Use real images, or an intentional, branded placeholder.

---

## App and dashboard UX

Most AI-pattern tools stop at landing pages. App UIs fail differently: the happy path is polished and everything around it is missing.

### UX1 · Missing empty, loading and error states: P1 · scanner + judgment
- **Signal:** Lists and tables render `data.map` with no empty branch. A spinner was bolted on at the end. No skeletons. Errors are only logged to the console.
- **Why it reads AI:** The model generated the screenshot state. Real products spend most of their design effort on the other states.
- **Break it:** Design each state:
  - **Empty:** explain what goes here and give the first action.
  - **Loading:** use a skeleton that matches the layout.
  - **Error:** say what failed and how to recover.
  - **Partial:** handle results that are only partly available.
  - **Overflow:** handle long names and huge numbers.

### UX2 · Status dots and colors with no meaning: P1 · visual
- **Signal:** Colored dots on nav items, card headers and labels that never change, and aren't labeled.
- **Why it reads AI:** It decorates the screen to look "live".
- **Break it:** Map each indicator to a defined state, and add a text label. Color must not be the only signal.

### UX3 · A card around every data block: P1 · visual
- **Signal:** Every KPI, chart and table sits in its own bordered, shadowed card. The dashboard is a grid of identical boxes.
- **Why it reads AI:** Boxes are the default grouping tool, so hierarchy disappears.
- **Break it:** Rank the information first. Give the main metric or chart real prominence, and group secondary data with spacing and dividers, not boxes.

### UX4 · Invented KPI strip: P1 · judgment
- **Signal:** Four stat cards at the top ("Total Revenue $45,231.89 +20.1% from last month"), the shadcn dashboard example almost verbatim.
- **Why it reads AI:** It is the stock dashboard demo, whatever the product's real metrics are.
- **Break it:** Show the numbers this user acts on, with comparison context that matters: target, trend, threshold.

### UX5 · Inconsistent inputs and controls: P1 · visual
- **Signal:** The filter bar, settings form and modal each use different input heights, radii and label styles. Some selects are native, some are custom.
- **Why it reads AI:** Each screen was generated in a separate pass.
- **Break it:** Use one form system: field height, label position, help and error text, and spacing. Reuse the components.

### UX6 · Non-responsive data views: P1 · visual
- **Signal:** Tables overflow on mobile. Charts have fixed widths. Sidebars don't collapse.
- **Why it reads AI:** Only the desktop screenshot was checked.
- **Break it:** Turn table rows into stacked cards or use horizontal scroll with sticky columns, make charts responsive, and give the sidebar a drawer pattern. Test at 375px.

### UX7 · Hero-style marketing inside the app: P2 · visual
- **Signal:** A gradient welcome banner ("Welcome back, John! 👋"), big decorative headings, and illustrations on work screens.
- **Why it reads AI:** It uses landing-page instincts in a tool people use every day.
- **Break it:** Put the user's work first. Keep the greeting short or drop it.

### UX8 · Fake functionality: P0 · judgment
- **Signal:** Buttons with no handler, nav to `#`, search boxes that don't search, settings toggles with no effect, "AI insights" that are hardcoded strings.
- **Why it reads AI:** It is a generated facade, and the most damaging kind of tell.
- **Break it:** Wire it up, or remove it. Never ship decorative controls.

### UX9 · Accessibility gaps: P1 · scanner + visual
- **Signal:** Icon-only buttons with no `aria-label`, `div onClick` with no role or keyboard handling, missing form labels, color as the only state indicator, touch targets under 44px.
- **Why it reads AI:** The model optimized for appearance.
- **Break it:** Use semantic elements first. Label every control. Make everything keyboard-navigable, with visible focus.

---

## System and consistency

### SY1 · Design-system drift across pages: P0 · judgment
- **Signal:** Font, palette, radius, nav or footer differ from page to page. The same token has different names in different files (`--color-primary-500` here, `--brand-action-bg` there).
- **Why it reads AI:** It is the strongest tell in multi-page AI builds. Each page was generated fresh, without memory of the others.
- **Break it:** Write the system down once, in `DESIGN.md` or a tokens file. Make every page pull from it, and review new pages against it.

### SY2 · Spacing invented per component: P2 · scanner + visual
- **Signal:** Arbitrary values (`p-[13px]`, `mt-7`, `gap-5`, `gap-6`) with no rhythm. Five different paddings on similar cards.
- **Why it reads AI:** By the fifth component, the UI is a patchwork.
- **Break it:** Use a 4/8-based spacing scale with named tiers per hierarchy level.

### SY3 · Hardcoded colors instead of tokens: P2 · scanner
- **Signal:** Hex values and one-off Tailwind colors scattered through components. No CSS variables or theme.
- **Why it reads AI:** Colors were picked per component.
- **Break it:** Use semantic tokens (`--color-action`, `--color-surface-raised`) mapped once per theme.

### SY4 · Generator leftovers: P1 · scanner
- **Signal:** `lovable-tagger`, `gpt-engineer`, `v0.dev`, `bolt.new`, or a `<meta name="generator" content="v0|Lovable|Bolt">`.
- **Why it reads AI:** It is literally a signature of the generator.
- **Break it:** Remove it, unless attribution is intended.
