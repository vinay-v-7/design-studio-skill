# design-studio

An [Agent Skill](https://agentskills.io/specification) that unifies six upstream design skills behind one router, one anti-slop doctrine, and one quality gate. Use it to build, restyle, review, deck, or diagram interfaces without the default AI look.

Successor of the standalone `design-skill` and `AI-Design-Skill` repos. Install the folder as **`design-studio`** (the `SKILL.md` `name`). The GitHub repo is named `design-studio-skill`.

Vendored `SKILL.md` files are renamed to `MODULE.md` so agents do not register six extra skills.

## Requirements

| Need | Used by | If missing |
|---|---|---|
| Node 18+ | `ai-design-review` scanner | skip scanner, say so |
| Node 22+ | taste draw / lint / inspect | skip taste scripts |
| Python 3 | ui-ux-pro-max search, diagram verify-geometry | skip those |
| Chrome / Edge | taste inspect, Impeccable URL detect | skip visual browser tier |
| Playwright | slide PDF export | skip PDF |
| python-pptx | PPT import | skip import |

On Windows use `python` if `python3` is missing, and `modules/impeccable/scripts/impeccable.cmd` instead of the uncooked launcher.

The skill still routes and writes without optional binaries; it must say when a tier was skipped.

## Install

One copy of the folder. The on-disk directory must be named `design-studio`. Do **not** also copy it into a second skills root or the same agent will register it twice.

### Fast path (many agents)

```bash
npx skills add vinay-v-7/design-studio-skill
```

Pass `--agent` for the tools you use (`cursor`, `claude-code`, `github-copilot`, `codex`, `windsurf`, `gemini-cli`, `cline`, `continue`, …).

### Clone, then install (Claude Code + Cursor)

```bash
git clone https://github.com/vinay-v-7/design-studio-skill.git design-studio
cd design-studio
node tools/doctor.mjs
node tools/install.mjs
```

`install.mjs` mirrors the skill (not `tools/`, `tests/`, or lockfiles) into `~/.claude/skills/design-studio/` and archives older `ui-ux-pro-max` / `ai-design-review` installs so they do not sit beside this one. Cursor loads `~/.claude/skills/` for compatibility.

For Copilot, Codex, Windsurf, Gemini CLI, Cline, Continue, or Amp: **symlink that same folder** into the path below. Do not copy a second tree.

### Where each tool looks

| Tool | User-level folder | Project-level folder |
|---|---|---|
| Claude Code | `~/.claude/skills/design-studio/` | `.claude/skills/design-studio/` |
| Cursor | `~/.cursor/skills/design-studio/` or `~/.claude/skills/design-studio/` | `.agents/skills/design-studio/` or `.cursor/skills/design-studio/` |
| GitHub Copilot | `~/.copilot/skills/design-studio/` | `.agents/skills/design-studio/` |
| OpenAI Codex | `~/.codex/skills/design-studio/` | `.agents/skills/design-studio/` |
| Windsurf | `~/.codeium/windsurf/skills/design-studio/` | `.windsurf/skills/design-studio/` |
| Gemini CLI | `~/.gemini/skills/design-studio/` | `.agents/skills/design-studio/` |
| Cline / Amp | `~/.agents/skills/design-studio/` | `.agents/skills/design-studio/` |
| Continue | `~/.continue/skills/design-studio/` | `.continue/skills/design-studio/` |

Cursor also loads Claude and Codex skill directories. Prefer one of those, not both.

**Windows (PowerShell)** — extra agent, same clone:

```powershell
$src = "$HOME\.claude\skills\design-studio"
New-Item -ItemType Junction -Path "$HOME\.copilot\skills\design-studio" -Target $src
```

Never `rm -rf` or `Remove-Item -Recurse` a junction: those follow the link and delete the files. Delete the link itself.

**macOS / Linux**

```bash
ln -s ~/.claude/skills/design-studio ~/.copilot/skills/design-studio
```

**Aider** has no skills folder:

```bash
aider --read /path/to/design-studio/SKILL.md
```

**ChatGPT and other tools without a skills directory:** paste `SKILL.md` as a custom instruction. Keep `doctrine/` and the routed `modules/*/MODULE.md` in the workspace if you want the playbooks loaded.

### Safe uninstall

```powershell
(Get-Item "$HOME\.claude\skills\design-studio").Delete()
```

```bash
rm ~/.claude/skills/design-studio
```

## Use

```
/design-studio build
/design-studio app
/design-studio direction
/design-studio review <path>
/design-studio slides
/design-studio diagram
/design-studio polish|bolder|typeset|…
/design-studio hooks status|on|off
```

Read [SKILL.md](SKILL.md) for routing. Doctrine lives in [doctrine/](doctrine/).

## Maintain

```bash
node tools/sync.mjs --check          # how far upstream moved
node tools/sync.mjs --update <id>    # vendor one module, then git diff
node tools/sync.mjs --all
node tools/doctor.mjs
node tools/install.mjs               # mirror to ~/.claude/skills/design-studio
```

`sources.json` lists include/exclude globs and patches. `sources.lock.json` stores resolved SHAs. A missing patch anchor fails the sync so an upstream edit cannot silently corrupt the skill.

## Layout

```
SKILL.md                 router
doctrine/                slop floor, workflow, conflicts, gate
modules/                 vendored sources (MODULE.md, not SKILL.md)
tools/                   sync, doctor, install (not copied on install)
tests/fixtures/          slop-landing.html
CHANGELOG.md
LICENSE                  wrapper MIT
NOTICE.md                full upstream attribution
```

## Attribution

LICENSE and [NOTICE.md](NOTICE.md) are the legal record. This section is the human one. Pins are in [sources.lock.json](sources.lock.json).

### Original wrapper

MIT, Copyright (c) 2026 Vinay Vijaykumar: `SKILL.md`, `doctrine/`, `tools/`, `tests/`.

### Vendored modules

| Module | Upstream | License | Pin | Taken | Not taken / local change |
|---|---|---|---|---|---|
| `modules/ui-ux-pro-max/` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) (historically shipped as `vinay-v-7/design-skill`) | MIT, Copyright (c) 2024 Next Level Builder | local vendored copy | searchable styles / palettes / stacks / UX CSVs and Python CLI | React Native as the only stack; database picks are inputs and must pass the slop floor; Windows `python` fallback |
| `modules/ai-design-review/` | this author's former `AI-Design-Skill`; catalog structure from [funboy322/avoid-ai-design](https://github.com/funboy322/avoid-ai-design) | MIT, Copyright (c) 2026 Vinay Vijaykumar | local vendored copy | tell catalog IDs, scanner, review report format | avoid-ai-design as a drop-in; workflow and evals are original |
| `modules/impeccable/` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Apache-2.0, Copyright 2025 Paul Bakaus | `e89e3ada` | craft commands, detect, hooks, platform refs | `pin` / `unpin` (they write extra skills); Codex `.agents/*.toml` subagents. Nested MIT: [ehmo/platform-design-skills](https://github.com/ehmo/platform-design-skills) in iOS/Android refs |
| `modules/taste/` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | MIT, Copyright (c) 2026 Leonxlnx | `12af471f` | art direction draw/lint/inspect, library | evals (not vendored). Direction output is summarized into the project's `DESIGN.md` |
| `modules/slides/` | [zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides) | MIT, Copyright (c) 2025 Zara Zhang | `9906a34d` | HTML deck workflow, bold template pack | plugins / `.claude-plugin`. Template HTML is last-resort |
| `modules/slides/template-library/` | [zarazhangrui/beautiful-html-templates](https://github.com/zarazhangrui/beautiful-html-templates) | MIT, Copyright (c) 2026 Zara Zhang | `e5e204fb` | templates, runtime, `AGENTS.md` | screenshots |
| `modules/diagrams/` | [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | MIT, Copyright (c) 2025 Cathryn Lavery | `0cf73c3f` | HTML/SVG diagrams, import/export commands | docs and screenshots. Project `DESIGN.md` tokens win over the module house style |

Each module keeps its own `LICENSE` in its tree. Apache-2.0 obligations for Impeccable (and the nested MIT notice) are in `modules/impeccable/`.

## License

MIT for the original wrapper. Vendored modules keep MIT or Apache-2.0 as recorded in [NOTICE.md](NOTICE.md) and each module's `LICENSE`. See [CHANGELOG.md](CHANGELOG.md).
