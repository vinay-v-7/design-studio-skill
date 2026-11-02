# design-studio

One anti-slop design skill for Claude Code and Cursor. Six upstream skills, one router, one doctrine, one quality gate.

Install **once** at `~/.claude/skills/design-studio/`. Cursor loads that folder for compatibility. Do not copy it into `~/.cursor/skills` or the Cursor Agent Store — it would show up twice.

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

Vendored `SKILL.md` files are renamed to `MODULE.md` so Cursor does not register six extra skills.

## Layout

```
SKILL.md                 router
doctrine/                slop floor, workflow, conflicts, gate
modules/                 vendored sources
tools/                   sync, doctor, install (not copied on install)
tests/fixtures/          slop-landing.html
```

## License

MIT for the original wrapper. Vendored modules keep MIT or Apache-2.0 as recorded in [NOTICE.md](NOTICE.md) and each module's `LICENSE`.
