#!/usr/bin/env node
// ai-design-review scanner: flags code-level AI UI tells. Zero dependencies, Node 18+.
// Findings are candidates, not verdicts; IDs map to references/ai-tells-catalog.md and references/mobile.md.
//
// Usage: node scan.mjs [paths...] [--json] [--min=P0|P1|P2] [--include-examples] [--rules] [--hook] [--help]
// Exit codes: 0 = no P0/P1 (or --rules/--help), 2 = P0 or P1 found, 1 = error.

import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const VERSION = "0.1.0";
const SEV_ORDER = { P0: 0, P1: 1, P2: 2 };

const SKIP_DIRS = new Set([
  "node_modules", ".git", "dist", "build", "out", ".next", ".nuxt", ".svelte-kit", ".output",
  "coverage", "vendor", ".turbo", ".vercel", ".cache", "Pods", ".dart_tool", ".gradle", "DerivedData",
  ".expo", "android", "ios",
]);
const EXAMPLE_DIRS = new Set(["examples", "example", "fixtures", "__fixtures__", "stories", ".storybook", "__tests__", "test", "tests"]);
const WEB_EXT = new Set([".html", ".htm", ".css", ".scss", ".sass", ".less", ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs", ".vue", ".svelte", ".astro", ".mdx"]);
const MOBILE_EXT = new Set([".dart", ".swift", ".kt"]);

// ---------- color helpers ----------
function parseColor(str) {
  let m = str.match(/^(?:#|0x(?:[0-9a-f]{2}))([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (m) {
    let h = m[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  }
  m = str.match(/rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i);
  if (m) return [+m[1], +m[2], +m[3]];
  return null;
}
function toHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0));
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}
function colorsIn(s) {
  const out = [];
  for (const m of s.matchAll(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b|0x[0-9a-f]{8}\b|rgba?\([^)]*\)/gi)) {
    const c = parseColor(m[0]);
    if (c) out.push(c);
  }
  return out;
}
const isPurple = (c) => { const [h, s, l] = toHsl(c); return h >= 235 && h <= 300 && s > 0.3 && l > 0.2 && l < 0.85; };
const isSaturated = (c) => { const [, s, l] = toHsl(c); return s > 0.45 && l > 0.25 && l < 0.8; };

// ---------- text helpers ----------
const lineOf = (text, idx) => text.slice(0, idx).split("\n").length;
function matchLines(text, re) {
  const flags = re.flags.includes("g") ? re.flags : re.flags + "g";
  const g = new RegExp(re.source, flags);
  const lines = new Set();
  for (const m of text.matchAll(g)) lines.add(lineOf(text, m.index));
  return [...lines];
}
function linesWhere(ctx, pred) {
  const out = [];
  ctx.lines.forEach((ln, i) => { if (pred(ln)) out.push(i + 1); });
  return out;
}
const EMOJI = /\p{Extended_Pictographic}/u;
const EMOJI_EXCLUDE = /[©®™↔↕✨✦✧→←↑↓]/gu;

// ---------- rules ----------
// kind "file": fn(ctx) -> line numbers (array, empty = no finding).
// kind "project": fn(ctxs) -> [{file, lines}].
const R = [];
const rule = (id, severity, name, why, fn, opts = {}) => R.push({ id, severity, name, why, fn, kind: opts.kind || "file", scope: opts.scope || "all" });
const min = (n, arr) => (arr.length >= n ? arr : []);

// Typography
rule("TY1", "P1", "Inter / Roboto as the primary face", "The default face of nearly every AI builder and starter; signals type was never chosen.", (c) =>
  [...new Set([
    ...matchLines(c.text, /font-family\s*:\s*["']?(Inter|Roboto)\b/i),
    ...matchLines(c.text, /fonts\.googleapis\.com\/css2?\?[^"'\s]*family=(Inter|Roboto)\b/),
    ...matchLines(c.text, /\b(Inter|Roboto)\s*\(\s*\{/),
    ...matchLines(c.text, /@fontsource(-variable)?\/(inter|roboto)\b/),
    ...matchLines(c.text, /sans\s*:\s*\[\s*["'](Inter|Roboto)/),
    ...matchLines(c.text, /fontFamily\s*:\s*["'](Inter|Roboto)/),
    ...matchLines(c.text, /GoogleFonts\.(inter|roboto|poppins)\s*\(/),
  ])].sort((a, b) => a - b));
rule("TY2", "P2", "'Tasteful free font' default", "Space Grotesk / Syne / Instrument Serif / Fraunces etc. are what models pick when told 'not Inter' -- a second-tier default unless tied to a direction.", (c) =>
  matchLines(c.text, /(Space[ _]Grotesk|\bSyne\b|\bSora\b|Instrument[ _]Serif|\bFraunces\b|Cal[ _]Sans|\bManrope\b|DM[ _]Sans|Plus[ _]Jakarta[ _]Sans|Bricolage[ _]Grotesque)/));
rule("TY3", "P2", "Geist left at the Next.js default", "create-next-app's default face; reads as 'scaffold, unstyled'.", (c) =>
  matchLines(c.text, /\bGeist(Sans|Mono)\b|from\s+["']geist\/font|\bGeist(_Mono)?\s*\(\s*\{/));
rule("TY5", "P1", "One painted word in the headline", "Coloured/italic/gradient accent word in an H1/H2 -- stock emphasis instead of a type system.", (c) =>
  matchLines(c.text, /<h[12]\b[^>]*>(?:(?!<\/h[12]>)[\s\S]){0,240}?<(span|em|i|mark)\b[^>]*>\s*[^<{}]{1,40}\s*<\/\1>/));
rule("TY6", "P2", "Tracked all-caps eyebrows", "Uppercase + letter-spaced labels above every section; decoration that repeats the heading.", (c) =>
  min(3, linesWhere(c, (l) => /\buppercase\b/.test(l) && /\btracking-(wide|wider|widest|\[)/.test(l)) ));
rule("TY7", "P2", "Monospace as decoration", "Tiny mono labels on non-code content: dev-tool cosplay.", (c) =>
  min(3, linesWhere(c, (l) => /\bfont-mono\b/.test(l) && /\btext-(xs|\[1[0-2]px\])/.test(l))));
rule("TY9", "P2", "Title Case on UI text", "Model-default casing on buttons and headings; reads like a slide deck.", (c) =>
  min(4, matchLines(c.text, />\s*(?:[A-Z][a-z]+ ){2,5}[A-Z][a-z]+\s*</)), { scope: "web" });

// Color
rule("CL1", "P0", "Purple / indigo / violet gradient", "The most recognised AI tell (Tailwind indigo-500 lineage). Visitors now read it as 'generated'.", (c) => {
  const lines = new Set(matchLines(c.text, /\b(from|via|to)-(indigo|violet|purple|fuchsia)-\d{2,3}\b/));
  for (const m of c.text.matchAll(/(linear|radial|conic)-gradient\(/g)) {
    const seg = c.text.slice(m.index, m.index + 320).split(/[;}]/)[0];
    if (colorsIn(seg).some(isPurple) || /\b(purple|violet|indigo|fuchsia|blueviolet|rebeccapurple)\b/i.test(seg)) lines.add(lineOf(c.text, m.index));
  }
  return [...lines].sort((a, b) => a - b);
}, { scope: "web" });
rule("CL2", "P1", "Indigo / violet CTA buttons", "bg-indigo-500/600 primary actions: the Tailwind UI default, visible even without a gradient.", (c) =>
  matchLines(c.text, /\bbg-(indigo|violet|purple)-[4-7]00\b(?!\/)/), { scope: "web" });
rule("CL3", "P0", "Gradient-filled text", "bg-clip-text + transparent text on headlines/stats: the 'premium AI' effect; often hurts legibility.", (c) =>
  [...new Set([...linesWhere(c, (l) => /\bbg-clip-text\b/.test(l) && /\btext-transparent\b/.test(l)), ...matchLines(c.text, /background-clip\s*:\s*text/)])], { scope: "web" });
rule("CL6", "P1", "Coloured glow shadows", "Saturated glow standing in for elevation and hierarchy.", (c) => {
  const lines = new Set(matchLines(c.text, /\bshadow-(indigo|violet|purple|fuchsia|pink|blue|sky|cyan|emerald|teal|lime)-\d{3}\b/));
  for (const n of linesWhere(c, (l) => /box-shadow\s*:/.test(l) || /\bshadow-\[/.test(l))) {
    const l = c.lines[n - 1];
    const blur = l.match(/\b0(?:px)?\s+0(?:px)?\s+(\d+)px|_0_(\d+)px/);
    if (colorsIn(l).some(isSaturated) && (!blur || +(blur[1] || blur[2]) >= 8)) lines.add(n);
  }
  return [...lines].sort((a, b) => a - b);
}, { scope: "web" });
rule("CL7", "P2", "Primary and accent are one hue", "Primary and accent tokens within ~20 deg of hue: looks varied in code, reads as one colour.", (c) => {
  const get = (name) => { const m = c.text.match(new RegExp(`--${name}\\s*:\\s*(#[0-9a-f]{3,6})\\b`, "i")); return m ? { c: parseColor(m[1]), line: lineOf(c.text, m.index) } : null; };
  const p = get("(?:color-)?primary"), a = get("(?:color-)?(?:accent|secondary)");
  if (!p || !a || !p.c || !a.c || !isSaturated(p.c) || !isSaturated(a.c)) return [];
  const d = Math.abs(toHsl(p.c)[0] - toHsl(a.c)[0]);
  return Math.min(d, 360 - d) < 20 ? [p.line, a.line] : [];
}, { scope: "web" });
rule("CL8", "P1", "Coloured side-stripe cards", "A coloured left/top border on each card, cycling hues with no state behind them.", (c) =>
  min(2, [...new Set([
    ...linesWhere(c, (l) => /\bborder-[lt]-(2|4|8|\[\dpx\])\b/.test(l) && /\bborder-(?:[lt]-)?(red|blue|green|orange|purple|indigo|emerald|amber|yellow|pink|violet|sky|cyan|teal|rose)-\d{3}\b/.test(l)),
    ...linesWhere(c, (l) => /border-(left|top)\s*:\s*[2-8]px\s+solid/.test(l) && colorsIn(l).some(isSaturated)),
  ])]), { scope: "web" });
rule("CL9", "P1", "Low-contrast grey text on light surfaces", "text-gray-300/400 on white is ~1.5-2.5:1, under WCAG 4.5:1; models overuse 'muted' to look refined. (Ignore if this surface is dark.)", (c) =>
  min(3, matchLines(c.text, /(?<![:\w-])text-(gray|slate|zinc|neutral|stone)-(300|400)\b/)), { scope: "web" });
rule("CL11", "P1", "Default dark SaaS card (zinc-950 + white/10 border)", "Grey-on-grey surfaces separated only by a 10%-white hairline: no real elevation system.", (c) =>
  /\bbg-(zinc|gray|slate|neutral|stone)-(900|950)\b/.test(c.text) ? min(2, matchLines(c.text, /\bborder-white\/(5|10)\b/)) : [], { scope: "web" });

// Second-order defaults
rule("SD1", "P1", "Cream + terracotta ('the Claude look')", "The 'tasteful' escape models reach for once purple is banned. Fine only if the subject really is warm/editorial.", (c) =>
  [...new Set([...matchLines(c.text, /#(d97757|c96442|cc785c|da7756|d4734f|c15f3c)\b/i), ...linesWhere(c, (l) => /\bbg-(amber|orange|stone)-50\b/.test(l) && /\btext-(orange|amber)-(600|700|800)\b/.test(l))])]);
rule("SD2", "P1", "Near-black + one acid accent", "The 'edgy dev tool' default: black ground with a single lime/acid-green signal.", (c) =>
  /\bbg-(black|zinc-950|neutral-950|stone-950|gray-950|slate-950)\b|#(0a0a0a|0b0b0b|0c0c0c|111111|111)\b/i.test(c.text)
    ? [...new Set([...matchLines(c.text, /\b(text|bg|border)-(lime)-(300|400|500)\b/), ...matchLines(c.text, /#(a3e635|bef264|84cc16|c6f432|d4ff00|ccff00|b8ff00)\b/i)])] : []);
rule("SD3", "P2", "Emerald as the safe accent", "What's left when purple is banned; choose the accent for a product reason.", (c) =>
  min(3, matchLines(c.text, /\bemerald-\d{3}\b|#(10b981|059669|34d399|047857)\b/i)));
rule("SD5", "P2", "Fake window chrome", "Traffic-light dots on a generic panel: a prop that says 'product' without showing it.", (c) => {
  const hex = matchLines(c.text, /#(ff5f57|febc2e|ffbd2e|28c840|27c93f)\b/i);
  if (hex.length >= 2) return hex;
  const dot = (col) => linesWhere(c, (l) => /\brounded-full\b/.test(l) && new RegExp(`\\bbg-${col}-(400|500)\\b`).test(l) && /\b(w|h|size)-(2|2\.5|3)\b/.test(l));
  const r = dot("red"), y = dot("yellow"), g = dot("green");
  return r.length && y.length && g.length ? [r[0], y[0], g[0]] : [];
}, { scope: "web" });

// Layout
rule("LY1", "P0", "Pill badge + centered hero", "Rounded-full 'New' capsule above a centered H1 + subhead + two CTAs: the default AI hero.", (c) => {
  const out = [];
  for (const m of c.text.matchAll(/<h1\b/g)) {
    const before = c.text.slice(Math.max(0, m.index - 900), m.index);
    const h1 = c.text.slice(m.index, m.index + 300);
    if (/\brounded-full\b/.test(before) && (/\btext-center\b/.test(before) || /\btext-center\b/.test(h1))) out.push(lineOf(c.text, m.index));
  }
  return out;
}, { scope: "web" });
rule("LY2", "P0", "Three identical feature cards", "grid-cols-3 of icon + title + two lines: the 'three-card reflex' flattens features into interchangeable claims.", (c) => {
  const grid = matchLines(c.text, /\b(?:sm:|md:|lg:)?grid-cols-3\b|repeat\(\s*3\s*,\s*1fr\s*\)/);
  if (!grid.length) return [];
  const chips = iconChipLines(c).length, lucide = lucideImports(c).length, emoji = emojiLines(c).length;
  return chips || lucide >= 3 || emoji >= 3 ? grid : [];
}, { scope: "web" });
rule("LY5", "P1", "Stock section waterfall", "Hero > logos > features > how-it-works > testimonials > stats > pricing > FAQ > CTA > footer: the median SaaS outline.", (c) => {
  const markers = [/\bhero\b/i, /trusted by|logo(s|cloud|wall)\b/i, /\bfeatures\b/i, /how it works/i, /testimonial/i, /\bstats\b|by the numbers/i, /\bpricing\b/i, /\bfaq\b|frequently asked/i, /ready to (get started|start|try)|get started today|\bcta\b/i, /<footer\b|\bFooter\b/];
  const hits = markers.map((re) => { const m = c.text.match(re); return m ? lineOf(c.text, m.index) : 0; }).filter(Boolean);
  return hits.length >= 6 ? [hits[0]] : [];
}, { scope: "web" });
rule("LY6", "P0", "Round-number stat strip / fake proof", "'10,000+ users / 99.9% uptime / 4.9 stars' -- invented-looking proof is both a tell and a trust risk. Verify every number is real.", (c) =>
  min(3, [...new Set([
    ...matchLines(c.text, /["'>\s](\d{1,3}(,\d{3})+|\d+(\.\d)?[kKmM])\+/),
    ...matchLines(c.text, /\b99\.9+%/),
    ...matchLines(c.text, /\b4\.[89]\s*(\/\s*5|★|⭐|stars?)/i),
    ...matchLines(c.text, /\b\d{2,3}\+\s*(countries|integrations|customers|companies|teams)/i),
  ])]));
rule("LY7", "P1", "Three-tier pricing with 'Most popular' ring", "Template pricing regardless of the actual offer.", (c) =>
  /most popular/i.test(c.text) && /\b(scale-105|scale-110|ring-2|ring-primary|border-primary|border-2)\b/.test(c.text) ? matchLines(c.text, /most popular/i) : [], { scope: "web" });
rule("LY8", "P2", "Four-column footer with newsletter box", "Footer filled in by template, not the site's real structure.", (c) => {
  let seg = null, offset = 0;
  const i = c.text.search(/<footer\b/);
  if (i >= 0) { const j = c.text.indexOf("</footer>", i); seg = c.text.slice(i, j > 0 ? j : undefined); offset = i; }
  else if (/footer/i.test(path.basename(c.file))) seg = c.text;
  if (!seg) return [];
  const heads = (seg.match(/<h[3-6]\b/g) || []).length;
  return heads >= 4 && /<input\b|<Input\b/.test(seg) ? [lineOf(c.text, offset)] : [];
}, { scope: "web" });
rule("LY9", "P2", "Decorative 01 / 02 / 03 numbering", "Two-digit numerals on things that aren't a sequence.", (c) =>
  min(3, matchLines(c.text, />\s*0[1-9]\s*<|["'`]0[1-9]["'`]/)), { scope: "web" });
rule("LY11", "P2", "Same container on every section", "max-w-7xl mx-auto everywhere: one width, no pacing.", (c) =>
  min(3, matchLines(c.text, /\b(max-w-7xl mx-auto|mx-auto max-w-7xl|container mx-auto)\b/)), { scope: "web" });

// Components
rule("CM1", "P1", "Untouched shadcn/ui theme", "Stock base colour / --primary / --radius: recognisable on sight. Theme it in the brand's own terms.", (c) => {
  if (path.basename(c.file) === "components.json") return matchLines(c.text, /"baseColor"\s*:\s*"(zinc|slate|neutral|gray|stone)"/);
  return [...new Set([...matchLines(c.text, /--primary\s*:\s*(oklch\(\s*0\.205\s+0\s+0\s*\)|222\.2\s+47\.4%\s+11\.2%|240\s+5\.9%\s+10%)/)])];
});
rule("CM2", "P1", "rounded-2xl + shadow-lg on everything", "One big radius + soft shadow on every surface: the generic 'make it nice' move.", (c) =>
  min(3, linesWhere(c, (l) => /\brounded-(xl|2xl|3xl)\b/.test(l) && /\bshadow-(md|lg|xl|2xl)\b/.test(l))), { scope: "web" });
rule("CM3", "P1", "Glassmorphism by reflex", "backdrop-blur on navs/cards/modals, often over nothing to blur.", (c) =>
  min(2, matchLines(c.text, /\bbackdrop-blur(-\w+)?\b|backdrop-filter\s*:\s*blur/)), { scope: "web" });
rule("CM4", "P1", "Icon in a tinted rounded square", "One Lucide icon in a bg-primary/10 chip per feature: the most repeated feature-card decoration.", (c) => iconChipLines(c), { scope: "web" });
rule("CM5", "P1", "Sparkle / 'New' pill above the H1", "Announces news that isn't there.", (c) => {
  const out = [];
  for (const m of c.text.matchAll(/<h1\b/g)) {
    const before = c.text.slice(Math.max(0, m.index - 800), m.index);
    if (/✨|<Sparkles\b/.test(before) || (/\brounded-full\b/.test(before) && />\s*(New|Introducing|Announcing|Now with|Beta|v\d)/.test(before))) out.push(lineOf(c.text, m.index));
  }
  return out;
}, { scope: "web" });
rule("CM6", "P0", "Stock effect-library components", "Aceternity / Magic UI demos pasted into thousands of generated sites; recognisable on sight.", (c) =>
  matchLines(c.text, /<(Spotlight|BackgroundBeams|BackgroundBeamsWithCollision|AnimatedBeam|ShimmerButton|BorderBeam|Meteors|SparklesCore|AuroraBackground|MagicCard|Marquee|TextGenerateEffect|TypewriterEffect|LampContainer|WavyBackground|GridPattern|DotPattern|Particles|RetroGrid|ShineBorder)\b|components\/(magicui|aceternity|ui\/aceternity)/), { scope: "web" });
rule("CM7", "P1", "No focus-visible styles anywhere", "Interactive elements with no focus styling: the happy-path screenshot was optimised, keyboard users weren't.", (cs) => {
  const web = cs.filter((c) => c.scope === "web");
  const hasFocus = web.some((c) => /focus-visible|:focus\b|\bfocus:|\bfocus-within/.test(c.text));
  if (hasFocus) return [];
  const first = web.find((c) => /<button\b|<Button\b|onClick=|<a\s/.test(c.text));
  return first ? [{ file: first.file, lines: [matchLines(first.text, /<button\b|<Button\b|onClick=|<a\s/)[0]] }] : [];
}, { kind: "project" });

// Iconography
rule("IC1", "P0", "Emoji used as UI icons", "Emoji as icons/bullets/nav/headings read as placeholder, render differently per platform, and can't be themed.", (c) => min(2, emojiLines(c)));
rule("IC2", "P1", "Sparkle-for-AI / worn Lucide set", "Sparkles, Zap, Rocket, Shield, CheckCircle2... the icons a model reaches for first.", (c) => {
  const names = lucideImports(c);
  const sparkle = matchLines(c.text, /\bSparkles\b|✨/);
  if (sparkle.length) return sparkle;
  return names.length >= 4 ? matchLines(c.text, /from\s+["']lucide-react["']/) : [];
}, { scope: "web" });
rule("IC3", "P2", "Arrow glyph on every CTA", "'Get started ->' everywhere: a reflex flourish.", (c) => min(2, matchLines(c.text, /[→⟶➜➔]\s*(<|["'`])/)));

// Copy
const FLUFF = /\b(elevate your|build the future|the future of [\w\s]{1,30} is here|all-in-one (platform|solution|workspace|tool)|scale without limits|unleash the (full )?power|revolutioni[sz]e (your|the way|how)|transform (your|the way|how)|supercharge your|reimagine (your|how|the way)|next-generation|take your [\w\s]{1,20} to the next level|your [\w\s]{1,20}, (reimagined|simplified|supercharged)|built for the (future|modern))\b/i;
rule("CP1", "P0", "Vague aspirational headline", "Copy that could front any product says nothing about this one.", (c) => matchLines(c.text, FLUFF));
rule("CP2", "P1", "Hype adjectives", "seamless / powerful / robust / cutting-edge carry no information; replace each with a number, verb or mechanism.", (c) =>
  min(2, matchLines(c.text, /\b(seamless(ly)?|cutting[- ]edge|best[- ]in[- ]class|world[- ]class|effortless(ly)?|game[- ]chang(ing|er)|next[- ]level|state[- ]of[- ]the[- ]art|revolutionary|blazing(ly)?[- ]fast|lightning[- ]fast|robust|powerful|intuitive)\b/i)));
rule("CP3", "P1", "Generic CTA labels", "Get Started / Learn More / Submit: placeholders never replaced. Name the action and its object.", (c) =>
  matchLines(c.text, /(>|["'`])\s*(Get Started( Today| Free| Now)?|Learn More|Submit|Click Here|Sign Up Now|Start Now)\s*(<|["'`])/i));
rule("CP4", "P2", "Tricolon slogan", "'Faster. Smarter. Simpler.' -- the rule-of-three rhythm habit.", (c) =>
  matchLines(c.text, /\b[A-Z][a-z]+(er|ly|est)\.\s+[A-Z][a-z]+(er|ly|est)\.\s+[A-Z][a-z]+(er|ly|est)\.|\b\w+er,\s+\w+er,?\s+and\s+\w+er\b/));
rule("CP5", "P2", "Hedging / stock openers", "'in today's fast-paced world', 'whether you're X or Y', 'designed to help' -- model filler.", (c) =>
  matchLines(c.text, /in today'?s fast[- ]paced|whether you'?re an? [\w\s]{1,30} or an?|designed to help|can potentially|look no further|we'?ve got you covered/i));
rule("CP6", "P0", "Placeholder content shipped", "Lorem ipsum / John Doe / Acme / href='#' -- visibly unfinished generation.", (c) =>
  [...new Set([...matchLines(c.text, /lorem ipsum|\b(John|Jane) (Doe|Smith)\b|\bAcme (Inc|Corp|Co)\b|example\.com/i), ...min(3, matchLines(c.text, /href=["']#["']/))])].sort((a, b) => a - b));

// Motion
rule("MO1", "P1", "Same fade-up on every section", "Uniform opacity+y reveal carries no meaning and makes the page feel slower.", (c) =>
  min(2, matchLines(c.text, /initial=\{\{\s*opacity:\s*0\s*,\s*y:\s*-?\d+|\bwhileInView\b|data-aos=["']fade-up|\bfadeInUp\b|fade-in-up|animate-fade-up|animate-fade-in-up/)), { scope: "web" });
rule("MO2", "P2", "Bounce / elastic easing", "Playful overshoot by default, whatever the brand.", (c) => {
  const lines = new Set(matchLines(c.text, /\banimate-bounce\b|\beaseOutBack\b|\bbackOut\b|elastic\.out|\beaseOutElastic\b/));
  for (const m of c.text.matchAll(/cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/g)) {
    if (+m[2] < -0.05 || +m[2] > 1.05 || +m[4] < -0.05 || +m[4] > 1.05) lines.add(lineOf(c.text, m.index));
  }
  return [...lines].sort((a, b) => a - b);
}, { scope: "web" });
rule("MO3", "P1", "Count-up stats", "Theatrical reveal of (usually invented) numbers.", (c) =>
  matchLines(c.text, /\b(NumberTicker|CountUp|useCountUp|AnimatedNumber|AnimatedCounter)\b|react-countup/));
rule("MO4", "P1", "Motion ignores prefers-reduced-motion", "Animation present but no reduced-motion handling anywhere in the scanned code.", (cs) => {
  const anim = /@keyframes|from\s+["'](framer-motion|motion\/react|motion|gsap)["']|data-aos=|\bwhileInView\b|<motion\./;
  const reduce = /prefers-reduced-motion|useReducedMotion|reducedMotion|motion-safe:|motion-reduce:/;
  const web = cs.filter((c) => c.scope === "web");
  if (web.some((c) => reduce.test(c.text))) return [];
  const first = web.find((c) => anim.test(c.text));
  return first ? [{ file: first.file, lines: [matchLines(first.text, anim)[0]] }] : [];
}, { kind: "project" });

// Imagery
rule("IM4", "P0", "Placeholder avatars / media", "pravatar / dicebear / picsum / gray aspect-video boxes: visibly unfinished.", (c) =>
  [...new Set([...matchLines(c.text, /\b(pravatar\.cc|dicebear|ui-avatars\.com|randomuser\.me|picsum\.photos|placehold\.co|via\.placeholder\.com|placekitten|boring-avatars|robohash)\b/), ...linesWhere(c, (l) => /\baspect-video\b/.test(l) && /\bbg-(muted|gray-\d+|slate-\d+|zinc-\d+)\b/.test(l))])]);

// App UX
rule("UX1", "P1", "List rendered with no empty state", "data.map(...) with no empty branch: the screenshot state was designed, the real ones weren't.", (c) => {
  if (!/\.(jsx|tsx|vue|svelte)$/.test(c.file)) return [];
  // Only data-driven lists: skip arrays declared as literals in the same file (static content).
  const maps = [];
  for (const m of c.text.matchAll(/\{\s*([\w.?]+)\.map\(\s*\(?\s*\w+/g)) {
    const name = m[1].split(/[.?]+/).pop();
    if (!new RegExp(`(const|let|var)\\s+${name}\\s*(:[^=]+)?=\\s*\\[`).test(c.text)) maps.push(lineOf(c.text, m.index));
  }
  if (!maps.length) return [];
  return /\.length\s*(===?\s*0|<\s*1|\?|&&|>\s*0)|!\s*[\w.?]+\.length|isEmpty|EmptyState|ListEmptyComponent|No [\w\s]{1,30} (yet|found)|nothing here/i.test(c.text) ? [] : [maps[0]];
}, { scope: "web" });
rule("UX9", "P1", "Clickable divs / unlabeled images", "div onClick without role/keyboard support, or <img> without alt: appearance optimised over access.", (c) =>
  [...new Set([...linesWhere(c, (l) => /<(div|span)\b[^>]*\bonClick=/.test(l) && !/\brole=/.test(l)), ...linesWhere(c, (l) => /<img\b(?![^>]*\balt=)[^>]*>/.test(l))])], { scope: "web" });

// System
rule("SY2", "P2", "Arbitrary one-off spacing", "p-[13px], mt-[22px]... spacing invented per component: no rhythm.", (c) =>
  min(5, matchLines(c.text, /\b-?(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-\[\d+(\.\d+)?px\]/)), { scope: "web" });
rule("SY3", "P2", "Hard-coded colours in components", "Hex values scattered through components instead of semantic tokens.", (c) =>
  /\.(jsx|tsx|vue|svelte)$/.test(c.file) ? min(8, matchLines(c.text, /#[0-9a-fA-F]{6}\b/)) : []);
rule("SY4", "P1", "Generator leftovers", "lovable-tagger / gpt-engineer / v0 / bolt signatures in the build.", (c) =>
  matchLines(c.text, /lovable-tagger|lovable\.dev|gpt-engineer|v0\.dev|v0\.app|bolt\.new|name=["']generator["'][^>]*content=["'](v0|Lovable|Bolt)/i));

// Mobile
rule("MB1", "P0", "Gradient onboarding carousel", "Three swipeable intro slides with Skip/Next: the default generated app intro that users skip.", (c) =>
  /onboard/i.test(c.file + c.text.slice(0, 4000)) && /\bSkip\b/.test(c.text) && /\bNext\b/.test(c.text) && /(slides|pages|steps)\s*[=:]\s*\[|PageView|TabView|FlatList[\s\S]{0,200}pagingEnabled|pagingEnabled/.test(c.text)
    ? [matchLines(c.text, /\bSkip\b/)[0]] : [], { scope: "mobile" });
rule("MB3", "P0", "Emoji as tab-bar icons", "Emoji tab icons: platform-inconsistent and unthemeable; use SF Symbols / Material Symbols.", (c) =>
  matchLines(c.text, /tabBarIcon[\s\S]{0,160}?<Text[^>]*>\s*\{?\s*["'`]?\p{Extended_Pictographic}|tabBarIcon[\s\S]{0,80}?["'`]\p{Extended_Pictographic}/u), { scope: "mobile" });
rule("MB4", "P0", "Purple LinearGradient header/background", "The purple gradient tell (CL1) in native form.", (c) => {
  const out = new Set();
  for (const m of c.text.matchAll(/\bLinearGradient\b|Brush\.(linear|radial)Gradient/g)) {
    if (/^\s*import\b/.test(c.lines[lineOf(c.text, m.index) - 1])) continue;
    const seg = c.text.slice(m.index, m.index + 420);
    if (colorsIn(seg).some(isPurple) || /Colors\.(purple|deepPurple|indigo|purpleAccent|deepPurpleAccent|indigoAccent)\b|[.(\s](purple|indigo)\b/.test(seg)) out.add(lineOf(c.text, m.index));
  }
  return [...out].sort((a, b) => a - b);
}, { scope: "mobile" });
rule("MB5", "P1", "Same large radius on everything", "borderRadius 16+ on most elements: the web-card reflex on mobile.", (c) =>
  min(4, matchLines(c.text, /borderRadius\s*:\s*(1[6-9]|2\d|3[0-2])\b|BorderRadius\.circular\(\s*(1[6-9]|2\d|3[0-2])|cornerRadius\s*:\s*(1[6-9]|2\d|3[0-2])\b|\.cornerRadius\(\s*(1[6-9]|2\d|3[0-2])|RoundedCornerShape\(\s*(1[6-9]|2\d|3[0-2])\.dp/)), { scope: "mobile" });
rule("MB6", "P1", "Glass material everywhere", "Blur/material on cards and sheets with nothing behind them.", (c) =>
  min(3, matchLines(c.text, /\.(ultraThin|thin|regular|thick)Material\b|<BlurView\b|BackdropFilter\(|Modifier\.blur\(/)), { scope: "mobile" });
rule("MB10", "P1", "FlatList with no empty state", "Lists that render a blank screen when empty; users hit this constantly on mobile.", (c) =>
  /<FlatList\b/.test(c.text) && !/ListEmptyComponent|\.length\s*===?\s*0|isEmpty/.test(c.text) ? [matchLines(c.text, /<FlatList\b/)[0]] : [], { scope: "mobile" });

// ---------- shared detectors ----------
function iconChipLines(c) {
  return linesWhere(c, (l) =>
    /\brounded-(md|lg|xl|2xl|full)\b/.test(l) && /\bbg-[a-z]+(-\d{2,3})?\/(5|10|15|20)\b/.test(l) && /\b(w|h|size)-(8|9|10|11|12|14)\b/.test(l) && /\bjustify-center\b/.test(l));
}
function lucideImports(c) {
  const m = c.text.match(/import\s*\{([^}]*)\}\s*from\s*["']lucide-react["']/);
  if (!m) return [];
  const worn = /^(Sparkles|Zap|Rocket|Shield|ShieldCheck|CheckCircle|CheckCircle2|BarChart|BarChart3|Star|ArrowRight|TrendingUp|Lock|Globe|Users|Layers|Cpu|Bolt)$/;
  return m[1].split(",").map((s) => s.trim().split(/\s+as\s+/)[0]).filter((n) => worn.test(n));
}
function emojiLines(c) {
  return linesWhere(c, (l) => {
    if (/^\s*(\/\/|\/\*|\*|#(?!\w)|<!--)/.test(l)) return false;
    return EMOJI.test(l.replace(EMOJI_EXCLUDE, ""));
  });
}

// ---------- scanning ----------
function walk(target, opts, out) {
  let st;
  try { st = fs.statSync(target); } catch { return; }
  if (st.isDirectory()) {
    const base = path.basename(target);
    if (SKIP_DIRS.has(base)) return;
    if (!opts.includeExamples && EXAMPLE_DIRS.has(base) && !opts.roots.has(path.resolve(target))) return;
    for (const e of fs.readdirSync(target)) walk(path.join(target, e), opts, out);
  } else if (st.isFile()) {
    const ext = path.extname(target).toLowerCase();
    const base = path.basename(target);
    if (WEB_EXT.has(ext) || MOBILE_EXT.has(ext) || base === "components.json") {
      if (/\.min\.(js|css)$/.test(base) || st.size > 1_500_000) return;
      out.push(target);
    }
  }
}

function makeCtx(file) {
  const text = fs.readFileSync(file, "utf8");
  const ext = path.extname(file).toLowerCase();
  const isRN = /from\s+["']react-native["']|from\s+["']expo-/.test(text);
  const scope = MOBILE_EXT.has(ext) ? "mobile" : "web";
  return { file, text, lines: text.split(/\r?\n/), ext, isRN, scope };
}
const appliesTo = (r, c) => r.scope === "all" || r.scope === c.scope || (r.scope === "mobile" && c.isRN);

function ignored(c, id, line) {
  if (new RegExp(`ai-design-review-ignore-file:[^\\n]*\\b${id}\\b`).test(c.text)) return true;
  const re = new RegExp(`ai-design-review-ignore:[^\\n]*\\b${id}\\b`);
  return re.test(c.lines[line - 1] || "") || re.test(c.lines[line - 2] || "");
}

export function scanPaths(paths, opts = {}) {
  const roots = new Set(paths.map((p) => path.resolve(p)));
  const files = [];
  for (const p of paths) walk(p, { ...opts, roots }, files);
  const ctxs = files.map(makeCtx);
  const findings = [];
  const add = (r, file, lines, c) => {
    const kept = lines.filter((n) => !ignored(c, r.id, n));
    if (kept.length) findings.push({ file, id: r.id, severity: r.severity, tier: "scanner", name: r.name, lines: kept, why: r.why });
  };
  for (const r of R) {
    if (r.kind === "project") {
      for (const hit of r.fn(ctxs)) add(r, hit.file, hit.lines, ctxs.find((c) => c.file === hit.file));
      continue;
    }
    for (const c of ctxs) if (appliesTo(r, c)) add(r, c.file, r.fn(c) || [], c);
  }
  const minSev = SEV_ORDER[opts.min || "P2"];
  const kept = findings.filter((f) => SEV_ORDER[f.severity] <= minSev)
    .sort((a, b) => a.file.localeCompare(b.file) || SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || a.id.localeCompare(b.id));
  const summary = { P0: 0, P1: 0, P2: 0, total: kept.length };
  for (const f of kept) summary[f.severity]++;
  return { tool: "ai-design-review", version: VERSION, scanned: files.length, summary, findings: kept };
}

function formatText(res, cwd) {
  const out = [];
  const byFile = new Map();
  for (const f of res.findings) { if (!byFile.has(f.file)) byFile.set(f.file, []); byFile.get(f.file).push(f); }
  for (const [file, fs_] of byFile) {
    const c = { P0: 0, P1: 0, P2: 0 };
    fs_.forEach((f) => c[f.severity]++);
    out.push(`\n${path.relative(cwd, file) || file}  P0 ${c.P0} · P1 ${c.P1} · P2 ${c.P2}`);
    for (const f of fs_) {
      const ls = f.lines.slice(0, 5).map((n) => `L${n}`).join(", ") + (f.lines.length > 5 ? ` (+${f.lines.length - 5})` : "");
      out.push(`  ${f.severity} ${f.id.padEnd(5)} ${f.name}  ${ls}`);
      out.push(`         ${f.why}`);
    }
  }
  const s = res.summary;
  out.push(`\n${res.scanned} files scanned · ${s.total} findings · P0 ${s.P0} · P1 ${s.P1} · P2 ${s.P2}`);
  out.push("Scanner hits are candidates, not verdicts: confirm against the brief. Details: references/ai-tells-catalog.md");
  return out.join("\n");
}

const HELP = `ai-design-review scanner ${VERSION}
Usage: node scan.mjs [paths...] [options]
  --json              machine-readable output
  --min=P0|P1|P2      lowest severity to report (default P2)
  --include-examples  also scan examples/, fixtures/, stories/, tests/
  --rules             list rule IDs
  --hook              Claude Code PostToolUse hook mode (reads JSON on stdin)
Ignore a line: // ai-design-review-ignore: CL1   (same line or line above)
Ignore a file: // ai-design-review-ignore-file: TY1
Exit: 0 clean (no P0/P1), 2 P0/P1 found, 1 error`;

async function main(argv) {
  const args = argv.filter((a) => !a.startsWith("--"));
  const flag = (n) => argv.includes(`--${n}`);
  const minArg = (argv.find((a) => a.startsWith("--min=")) || "").split("=")[1];
  if (flag("help") || argv.includes("-h")) { console.log(HELP); return 0; }
  if (flag("rules")) { for (const r of R) console.log(`${r.id.padEnd(5)} ${r.severity}  ${r.name}`); return 0; }
  if (minArg && !(minArg in SEV_ORDER)) { console.error(`Bad --min value: ${minArg}`); return 1; }
  if (flag("hook")) {
    let input = "";
    for await (const chunk of process.stdin) input += chunk;
    let file;
    try { file = JSON.parse(input)?.tool_input?.file_path; } catch { return 0; }
    if (!file || !fs.existsSync(file)) return 0;
    const res = scanPaths([file], { min: "P1", includeExamples: true });
    if (!res.findings.length) return 0;
    console.error(`ai-design-review: ${res.summary.P0} P0 / ${res.summary.P1} P1 AI-pattern candidates in ${path.basename(file)}:`);
    for (const f of res.findings.slice(0, 10)) console.error(`  ${f.severity} ${f.id} ${f.name} (L${f.lines.slice(0, 3).join(", L")})`);
    return 2;
  }
  const targets = args.length ? args : ["."];
  for (const t of targets) if (!fs.existsSync(t)) { console.error(`Not found: ${t}`); return 1; }
  const res = scanPaths(targets, { min: minArg, includeExamples: flag("include-examples") });
  console.log(flag("json") ? JSON.stringify(res, null, 2) : formatText(res, process.cwd()));
  return res.summary.P0 + res.summary.P1 > 0 ? 2 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).then((code) => process.exit(code), (e) => { console.error(e.stack || String(e)); process.exit(1); });
}

export const RULES = R.map(({ id, severity, name }) => ({ id, severity, name }));
