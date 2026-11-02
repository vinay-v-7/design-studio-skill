#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const HOME = os.homedir();
const DEST = path.join(HOME, ".claude", "skills", "design-studio");
const ARCHIVE = path.join(HOME, ".claude", "skills-archive");
const STAMP = "2026-11-02";

const SKIP_TOP = new Set([".git", "tools", "tests"]);
const SKIP_FILES = new Set(["sources.json", "sources.lock.json"]);

function die(msg) {
  console.error(`install: ${msg}`);
  process.exit(1);
}

function runDoctor() {
  const doctor = path.join(ROOT, "tools", "doctor.mjs");
  const r = spawnSync(process.execPath, [doctor], { stdio: "inherit" });
  if (r.status !== 0) die("doctor failed; refusing to install");
}

function walk(dir, base = dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    const rel = path.relative(base, abs).replace(/\\/g, "/");
    const top = rel.split("/")[0];
    if (SKIP_TOP.has(ent.name) && dir === base) continue;
    if (SKIP_TOP.has(top)) continue;
    if (ent.isDirectory()) walk(abs, base, out);
    else if (!SKIP_FILES.has(ent.name)) out.push({ abs, rel });
  }
  return out;
}

function mirror() {
  fs.mkdirSync(DEST, { recursive: true });
  const keep = new Set();
  for (const f of walk(ROOT)) {
    const dest = path.join(DEST, f.rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(f.abs, dest);
    keep.add(f.rel.replace(/\\/g, "/"));
  }
  prune(DEST, keep);
  console.log(`mirrored ${keep.size} files → ${DEST}`);
}

function prune(dir, keep, base = dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    const rel = path.relative(base, abs).replace(/\\/g, "/");
    if (ent.isDirectory()) {
      prune(abs, keep, base);
      if (fs.readdirSync(abs).length === 0) fs.rmdirSync(abs);
    } else if (!keep.has(rel)) {
      fs.unlinkSync(abs);
    }
  }
}

function archiveDir(src, name) {
  if (!fs.existsSync(src)) {
    console.log(`skip archive (missing): ${src}`);
    return;
  }
  fs.mkdirSync(ARCHIVE, { recursive: true });
  const dest = path.join(ARCHIVE, `${name}-${STAMP}`);
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.renameSync(src, dest);
  console.log(`archived ${src} → ${dest}`);
}

function findAgentStoreUiUx() {
  const roots = [
    path.join(HOME, "AppData/Local/Cursor/AgentStores/cursor_agent_stores"),
    path.join(HOME, ".cursor/skills"),
  ];
  const hits = [];
  function hunt(dir, depth) {
    if (depth > 6 || !fs.existsSync(dir)) return;
    let ents;
    try {
      ents = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const ent of ents) {
      if (!ent.isDirectory()) continue;
      const abs = path.join(dir, ent.name);
      if (ent.name === "ui-ux-pro-max" && path.basename(path.dirname(abs)) === "skills") {
        hits.push(abs);
        continue;
      }
      hunt(abs, depth + 1);
    }
  }
  for (const r of roots) hunt(r, 0);
  return hits;
}

function main() {
  runDoctor();
  archiveDir(path.join(HOME, ".claude/skills/ui-ux-pro-max"), "ui-ux-pro-max");
  archiveDir(path.join(HOME, ".claude/skills/ai-design-review"), "ai-design-review");
  for (const hit of findAgentStoreUiUx()) {
    archiveDir(hit, "cursor-agent-store-ui-ux-pro-max");
  }
  mirror();
  console.log("install complete");
}

main();
