# Gate

Definition of done. Skip a scanner only when its runtime is missing; name the skip in the report.

## Always

- Rendered and looked at (desktop + mobile; slides at 1920×1080).
- Zero P0 tells.
- Every P1 justified by the brief or DESIGN.md.
- Genericness score ≤ 3/10 on the ai-design-review rubric for **new** UI. A review of existing slop may score higher; say so.
- SD1–SD5 second-order-default check passes (or is justified).
- Nothing invented (stats, testimonials, logos, customers).
- App UI has empty, loading, and error states.
- Report states which tiers actually ran: scanner / visual / judgment.

## Scanners by output

Resolve `<studio>` as the folder that contains design-studio `SKILL.md`. On Windows use `python` if `python3` is missing. Use `impeccable.cmd` on Windows.

| Output | Commands |
|---|---|
| Any code / HTML | `node <studio>/modules/ai-design-review/scripts/scan.mjs <target> --json` (exit 2 = P0/P1 candidates, expected) |
| Renderable HTML / URL | `<studio>/modules/impeccable/scripts/impeccable detect <target>` (Windows: `impeccable.cmd`) |
| Public page / landing | `node <studio>/modules/taste/scripts/lint.mjs <target>` and, if Chrome/Edge and Node 22+, `inspect.mjs` |
| Slides | Look at 1920×1080. scan.mjs on the HTML. No taste inspect required. |
| Diagrams | `python <studio>/modules/diagrams/tools/verify-geometry.py <file>` plus diagram-design self-check when present |
| App screens | scan.mjs + impeccable detect. Empty/loading/error must exist. |

## Degenerate

| Missing | Skip | Say |
|---|---|---|
| Node | scan.mjs, taste scripts | "scanner skipped: no Node" |
| Node < 22 | taste draw/lint/inspect | "taste skipped: need Node 22+" |
| Python | ui-ux search, diagram verify-geometry | "python skipped" |
| Chrome / Edge | taste inspect, impeccable URL detect | "visual browser skipped" |
| Playwright | slide PDF export | "PDF export skipped" |

A skipped tier is not a pass.
