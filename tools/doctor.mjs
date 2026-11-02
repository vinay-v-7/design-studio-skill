#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FAIL = [];
const WARN = [];
const OK = [];

function note(ok, msg) {
  (ok ? OK : FAIL).push(msg);
  console.log(`${ok ? "ok  " : "FAIL"} ${msg}`);
}
function warn(msg) {
  WARN.push(msg);
  console.log(`warn ${msg}`);
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.name === ".git" || ent.name === "node_modules") continue;
    if (ent.isDirectory()) walk(abs, out);
    else out.push(abs);
  }
  return out;
}

function which(cmd) {
  const r = spawnSync(cmd, ["--version"], { encoding: "utf8", shell: true });
  if (r.status === 0) return (r.stdout || r.stderr || "").trim().split(/\r?\n/)[0];
  return null;
}

function findChrome() {
  const home = os.homedir();
  const cands = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    path.join(home, "AppData/Local/Google/Chrome/Application/chrome.exe"),
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ];
  for (const p of cands) {
    if (fs.existsSync(p)) return p;
  }
  return which("chrome") || which("msedge") || which("google-chrome") || null;
}

function parseFrontmatter(text) {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---", 3);
  if (end < 0) return {};
  const block = text.slice(4, end);
  const out = {};
  const desc = block.match(/^description:\s*"([\s\S]*?)"\s*$/m) || block.match(/^description:\s*"([\s\S]*?)"\s*$/m);
  const name = block.match(/^name:\s*["']?([a-z0-9-]+)/m);
  if (name) out.name = name[1];
  const dq = block.match(/description:\s*"([\s\S]*?)"/);
  if (dq) out.description = dq[1].replace(/\s+/g, " ").trim();
  else {
    const plain = block.match(/^description:\s*(.+)$/m);
    if (plain) out.description = plain[1].trim();
  }
  return out;
}

function checkSkillMd() {
  const files = walk(ROOT).filter((f) => path.basename(f) === "SKILL.md");
  note(files.length === 1, `exactly one SKILL.md (found ${files.length})`);
  const skill = path.join(ROOT, "SKILL.md");
  if (!fs.existsSync(skill)) {
    note(false, "SKILL.md missing at repo root");
    return;
  }
  const fm = parseFrontmatter(fs.readFileSync(skill, "utf8"));
  const folder = path.basename(ROOT);
  note(fm.name === folder, `name "${fm.name || ""}" equals folder "${folder}"`);
  const dlen = (fm.description || "").length;
  note(dlen > 0 && dlen <= 1024, `description length ${dlen} (max 1024)`);
}

function checkHardcodes() {
  const banned = ["~/.claude/skills/", "~/.cursor/skills", ".claude/skills/impeccable"];
  let hits = 0;
  for (const abs of walk(ROOT)) {
    const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
    const inScope =
      rel === "SKILL.md" ||
      rel.startsWith("doctrine/") ||
      rel.startsWith("modules/");
    if (!inScope) continue;
    if (/\.(png|jpe?g|woff2?|ttf|exe|bin|wasm)$/i.test(abs)) continue;
    let text;
    try {
      text = fs.readFileSync(abs, "utf8");
    } catch {
      continue;
    }
    for (const b of banned) {
      if (text.includes(b)) {
        hits++;
        note(false, `hardcoded ${JSON.stringify(b)} in ${rel}`);
      }
    }
  }
  if (hits === 0) note(true, "no ~/.claude/skills, ~/.cursor/skills, or .claude/skills/impeccable hardcodes");
}

function checkLinks() {
  const targets = [];
  for (const abs of walk(ROOT)) {
    const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
    if (!/\.(md)$/i.test(rel)) continue;
    if (!/(^SKILL\.md$|^doctrine\/|MODULE\.md$)/.test(rel) && !rel.endsWith("MODULE.md") && !rel.startsWith("doctrine/")) continue;
    targets.push(abs);
  }
  // Always include root SKILL.md and doctrine + every MODULE.md
  const extra = walk(ROOT).filter((f) => {
    const b = path.basename(f);
    const rel = path.relative(ROOT, f).replace(/\\/g, "/");
    return b === "SKILL.md" || b === "MODULE.md" || rel.startsWith("doctrine/");
  });
  const files = [...new Set(extra)];
  let broken = 0;
  const re = /\[[^\]]*\]\(([^)]+)\)/g;
  for (const abs of files) {
    const text = fs.readFileSync(abs, "utf8");
    let m;
    while ((m = re.exec(text))) {
      let href = m[1].trim().replace(/\\ /g, " ");
      if (/^[a-z]+:/i.test(href)) continue;
      if (href.startsWith("#")) continue;
      if (href.includes("<") || href.includes("{")) continue;
      href = href.split("#")[0].split("?")[0];
      if (!href) continue;
      const dest = path.resolve(path.dirname(abs), href);
      if (!fs.existsSync(dest)) {
        broken++;
        note(false, `broken link ${href} in ${path.relative(ROOT, abs)}`);
      }
    }
  }
  if (broken === 0) note(true, `relative links resolve in SKILL.md, doctrine, MODULE.md`);
}

function checkEnv() {
  const node = which("node");
  note(!!node, `Node ${node || "missing"}`);
  const py = which("python") || which("python3");
  if (py) note(true, `Python ${py}`);
  else warn("Python missing (ui-ux-pro-max and diagram verify-geometry will skip)");
  const chrome = findChrome();
  if (chrome) note(true, `browser ${chrome}`);
  else warn("Chrome/Edge missing (taste inspect / URL detect will skip)");
}

function engineProbe() {
  const win = process.platform === "win32";
  const launcher = path.join(
    ROOT,
    "modules/impeccable/scripts",
    win ? "impeccable.cmd" : "impeccable"
  );
  if (!fs.existsSync(launcher)) {
    note(false, `impeccable launcher missing at ${path.relative(ROOT, launcher)}`);
    return;
  }
  const r = spawnSync(launcher, ["engine-probe"], {
    encoding: "utf8",
    timeout: 180000,
    shell: win,
  });
  if (r.status === 0) note(true, "impeccable engine-probe ok");
  else {
    note(false, `impeccable engine-probe failed (${r.status}): ${(r.stderr || r.stdout || "").trim().slice(0, 400)}`);
  }
}

function main() {
  console.log(`doctor ${ROOT}`);
  checkSkillMd();
  checkHardcodes();
  checkLinks();
  checkEnv();
  engineProbe();
  console.log(`\n${OK.length} ok, ${WARN.length} warn, ${FAIL.length} fail`);
  if (FAIL.length) process.exit(1);
}

main();
