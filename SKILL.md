---
name: design-studio
description: "Unified design system for building and reviewing clean, distinctive, non-generic interfaces: websites, landing pages, product UI, dashboards, forms, web and native app screens, HTML slide decks, and diagrams. Use whenever the user asks to design, build, redesign, restyle, polish, critique, audit or roast a UI; pick a palette, font pairing or style; says something looks generic, templated or AI-made; wants a presentation/deck in HTML; or wants an architecture, flow, sequence, ER, timeline or other diagram. Combines taste-skill art direction, Impeccable craft commands, the ui-ux-pro-max database, AI-pattern review, frontend-slides with beautiful-html-templates, and diagram-design under one anti-slop doctrine and quality gate."
metadata:
  version: "1.0.0"
---

# design-studio

`<studio>` is the folder that contains this SKILL.md. On Windows use `python` if `python3` is missing, and `modules/impeccable/scripts/impeccable.cmd` instead of the uncooked launcher.

## Load

1. This file.
2. Doctrine for the route: [doctrine/workflow.md](doctrine/workflow.md), [doctrine/principles.md](doctrine/principles.md), [doctrine/gate.md](doctrine/gate.md); [doctrine/conflicts.md](doctrine/conflicts.md) when modules disagree.
3. Only the routed `MODULE.md` file(s) below, then the references they point at.

Never load every module. Vendored `MODULE.md` files are not standalone skills.

## Precedence

1. The user's explicit instruction and real brand assets
2. The project's `DESIGN.md` / `PRODUCT.md`
3. design-studio doctrine
4. The active module's rules
5. ui-ux-pro-max database picks — *inputs, never decisions*; every pick must pass the slop floor

## Route

`/design-studio <route> [target]`. If no route, infer from the ask.

| Intent / arg | Load | Notes |
|---|---|---|
| `build` — landing, marketing, portfolio, public page | [modules/taste/MODULE.md](modules/taste/MODULE.md) + [modules/impeccable/MODULE.md](modules/impeccable/MODULE.md) (persuade) | ui-ux-pro-max only for stack guidelines |
| `app` — dashboard, settings, forms, product UI, native screens | impeccable (operate) + taste [references/app-screens.md](modules/taste/references/app-screens.md) | ui-ux-pro-max stack + UX guidelines |
| `direction` — palette, fonts, style | taste library first; [modules/ui-ux-pro-max/MODULE.md](modules/ui-ux-pro-max/MODULE.md) search second, slop-filtered | writes `DESIGN.md` |
| `review` / audit / roast | [modules/ai-design-review/MODULE.md](modules/ai-design-review/MODULE.md) **and its report format** | scanners below; dedupe into IDs |
| `polish` `bolder` `quieter` `typeset` `colorize` `animate` `harden` `clarify` `distill` `delight` `adapt` `onboard` `optimize` `layout` `overdrive` `shape` `init` `document` `extract` `critique` `audit` `live` `generate` | impeccable command reference | pin/unpin disabled |
| `slides` / deck / presentation | [modules/slides/MODULE.md](modules/slides/MODULE.md) | `template-library/` last resort; `.pptx` → pptx skill |
| `diagram` (+ `import mermaid\|drawio\|excalidraw`, `export`) | [modules/diagrams/MODULE.md](modules/diagrams/MODULE.md) + [commands/](modules/diagrams/commands/) | |
| charts in an app | `dataviz` skill if installed, else ui-ux-pro-max charts domain | |
| long-form copy | ai-design-review copy tells; `unslop` skill if installed | |
| `hooks on\|off\|status` | impeccable [reference/hooks.md](modules/impeccable/reference/hooks.md) | hook policy below |

## Workflow

Brief (`PRODUCT.md`) → Direction (`DESIGN.md`) → Build → Look → Gate → Report. Details: [doctrine/workflow.md](doctrine/workflow.md).

Taste working files stay in `.taste-skill/`. Summarize the chosen direction into `DESIGN.md` so every module reads one file.

## Gate

Done when: looked at shipping sizes; relevant scanners ran; **zero P0**; every P1 justified by the brief; genericness ≤ 3/10 for new UI; SD1–SD5 pass; nothing invented; app UI has empty/loading/error; report names tiers that ran. Full table: [doctrine/gate.md](doctrine/gate.md).

Review scanners (dedupe onto catalog IDs):

```text
node <studio>/modules/ai-design-review/scripts/scan.mjs <target> --json
<studio>/modules/impeccable/scripts/impeccable detect <target>
node <studio>/modules/taste/scripts/lint.mjs <target>
```

Windows detect: `<studio>\modules\impeccable\scripts\impeccable.cmd detect <target>`.

## Hook policy

Off by default. Never enable silently.

At the start of a `build` or `app` route in a real project, run:

```text
<studio>/modules/impeccable/scripts/impeccable hooks status
```

**Propose opt-in, one sentence of reason, when** any of: the task will touch ≥3 UI files or span sessions; a review found ≥2 mechanical P0/P1 (contrast, gradient text, glow, overflow, design-system drift); the user asks for ongoing enforcement.

Explain: per-edit scan via `.claude/settings.local.json` (Claude Code) or `.cursor/hooks.json` (Cursor). Cursor gets per-edit checks only, no Stop deep pass. Point at `<studio>/modules/impeccable/scripts/impeccable`.

Respect `hook.consent` in `.impeccable/config.local.json`. Do not re-ask in that project.

If they accept: `impeccable hooks on`. If they decline: `hooks off` and do not ask again there.

## Environment

| Need | Used by | If missing |
|---|---|---|
| Node 18+ | scan.mjs | skip scanner, say so |
| Node 22+ | taste draw / lint / inspect | skip taste scripts |
| Python 3 | ui-ux-pro-max, diagram verify-geometry | skip those |
| Chrome / Edge | taste inspect, impeccable URL detect | skip visual browser tier |
| Playwright | slide PDF export | skip PDF |
| python-pptx | PPT import | skip import |

## Module map

| Path | Role |
|---|---|
| `modules/taste/` | Art direction (`draw.mjs`), lint/inspect |
| `modules/impeccable/` | Craft commands, detect, hooks |
| `modules/ui-ux-pro-max/` | Searchable styles / palettes / stacks |
| `modules/ai-design-review/` | Tells catalog, scan, review report |
| `modules/slides/` | HTML decks; `template-library/` is implementation reference |
| `modules/diagrams/` | HTML/SVG diagrams |
