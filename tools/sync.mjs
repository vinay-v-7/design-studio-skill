#!/usr/bin/env node
// design-studio vendor sync. Zero dependencies. Treats cloned sources as untrusted data:
// copy + text-patch only; never execute files from a source tree.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCES_PATH = path.join(ROOT, "sources.json");
const LOCK_PATH = path.join(ROOT, "sources.lock.json");

const ALWAYS_EXCLUDE = [
  ".git/**",
  "**/.git/**",
  ".github/**",
  "**/.github/**",
  ".cursor/**",
  ".gemini/**",
  ".agents/**",
  "node_modules/**",
  "**/node_modules/**",
  ".DS_Store",
  "**/__pycache__/**",
  "**/*.pyc",
];

function die(msg) {
  console.error(`sync: ${msg}`);
  process.exit(1);
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

function git(args, opts = {}) {
  const r = spawnSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...opts,
  });
  if (r.error) throw new Error(`git ${args.join(" ")}: ${r.error.message}`);
  if (r.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed (${r.status}): ${(r.stderr || r.stdout || "").trim()}`);
  }
  return (r.stdout || "").trim();
}

function globToRegExp(glob) {
  const g = glob.replace(/\\/g, "/").replace(/\/+$/, "");
  let re = "";
  for (let i = 0; i < g.length; i++) {
    if (g[i] === "*" && g[i + 1] === "*") {
      if (g[i + 2] === "/") {
        re += "(?:.*/)?";
        i += 2;
      } else {
        re += ".*";
        i += 1;
      }
    } else if (g[i] === "*") {
      re += "[^/]*";
    } else if (g[i] === "?") {
      re += "[^/]";
    } else if ("+.^${}()|[]\\".includes(g[i])) {
      re += "\\" + g[i];
    } else {
      re += g[i];
    }
  }
  return new RegExp(`^${re}$`);
}

const globCache = new Map();
function globMatch(rel, pattern) {
  const n = rel.replace(/\\/g, "/");
  const p = pattern.replace(/\\/g, "/");
  let rx = globCache.get(p);
  if (!rx) {
    rx = globToRegExp(p);
    globCache.set(p, rx);
  }
  if (rx.test(n)) return true;
  if (!p.endsWith("/**") && rx.test(n.replace(/\/$/, ""))) return true;
  return false;
}

function isExcluded(rel, extra) {
  const patterns = ALWAYS_EXCLUDE.concat(extra || []);
  return patterns.some((p) => globMatch(rel, p));
}

function isIncluded(rel, include) {
  if (!include || include.length === 0 || include.includes("**")) return true;
  return include.some((p) => globMatch(rel, p));
}

function walkFiles(dir, base = dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === ".git") continue;
      walkFiles(abs, base, out);
    } else if (name.isFile()) {
      out.push({ abs, rel: path.relative(base, abs).replace(/\\/g, "/") });
    }
  }
  return out;
}

function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}

function mkdirp(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyFile(src, dest) {
  mkdirp(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyTreeFiltered(srcRoot, destRoot, include, exclude) {
  const files = walkFiles(srcRoot);
  let n = 0;
  for (const f of files) {
    if (!isIncluded(f.rel, include)) continue;
    if (isExcluded(f.rel, exclude)) continue;
    copyFile(f.abs, path.join(destRoot, f.rel));
    n++;
  }
  return n;
}

function copyExtras(cloneRoot, destRoot, extras) {
  for (const extra of extras || []) {
    const from = path.join(cloneRoot, extra.from);
    const to = path.join(destRoot, extra.to);
    if (!fs.existsSync(from)) {
      die(`extra missing: ${extra.from} (expected at ${from})`);
    }
    const st = fs.statSync(from);
    if (st.isDirectory()) {
      copyTreeFiltered(from, to, ["**"], []);
    } else {
      copyFile(from, to);
    }
  }
}

function stripFrontmatter(text) {
  if (!text.startsWith("---\n") && !text.startsWith("---\r\n")) {
    return { fm: "", body: text };
  }
  const nl = text.startsWith("---\r\n") ? "\r\n" : "\n";
  const rest = text.slice(("---" + nl).length);
  const end = rest.indexOf(nl + "---");
  if (end < 0) return { fm: "", body: text };
  const fm = rest.slice(0, end);
  let body = rest.slice(end + (nl + "---").length);
  if (body.startsWith(nl)) body = body.slice(nl.length);
  return { fm, body };
}

function adapterHeader(mod, fm) {
  const skips = (mod.adapterSkips || []).map((s) => `- ${s}`).join("\n");
  const skipBlock = skips ? `\nModule-specific skips:\n${skips}\n` : "";
  const fmBlock = fm
    ? `\n<!--\nupstream frontmatter:\n---\n${fm}\n---\n-->\n`
    : "";
  return `# Module: ${mod.id}

In this module, \`<skill-dir>\`, \`<skill>\`, \`<skill-base-dir>\` and "the folder containing this SKILL.md" all mean the \`modules/${mod.id}/\` directory of design-studio (the folder that contains this MODULE.md).

design-studio doctrine (\`doctrine/\`) and the project's \`DESIGN.md\` / \`PRODUCT.md\` override this module's defaults.
${skipBlock}
Load this module only when the design-studio router selects it. Do not treat this file as a standalone skill.
${fmBlock}
---

`;
}

function adaptSkillFile(destRoot, mod) {
  if (mod.adaptSkill === false) return;
  const skillPath = path.join(destRoot, "SKILL.md");
  if (!fs.existsSync(skillPath)) return;
  const raw = fs.readFileSync(skillPath, "utf8");
  const { fm, body } = stripFrontmatter(raw);
  const next = adapterHeader(mod, fm) + body;
  const modulePath = path.join(destRoot, "MODULE.md");
  fs.writeFileSync(modulePath, next, "utf8");
  fs.unlinkSync(skillPath);
}

function patchTargets(destRoot, spec) {
  if (!spec || spec === "**") {
    return walkFiles(destRoot).map((f) => f.abs);
  }
  if (spec.includes("*")) {
    return walkFiles(destRoot)
      .filter((f) => globMatch(f.rel, spec))
      .map((f) => f.abs);
  }
  return [path.join(destRoot, spec)];
}

function applyPatches(destRoot, mod) {
  for (const patch of mod.patches || []) {
    const files = patchTargets(destRoot, patch.file);
    const find = patch.find.replace(/\r\n/g, "\n");
    const replace = patch.replace.replace(/\r\n/g, "\n");
    let hits = 0;
    for (const file of files) {
      if (!fs.existsSync(file)) {
        if (patch.optional) continue;
        die(`patch target missing for ${mod.id}: ${path.relative(destRoot, file)}`);
      }
      const st = fs.statSync(file);
      if (!st.isFile()) continue;
      if (/\.(png|jpe?g|gif|webp|woff2?|ttf|otf|eot|ico|zip|gz|exe|bin|wasm|pdf|mp4)$/i.test(file)) continue;
      let raw;
      try {
        raw = fs.readFileSync(file, "utf8");
      } catch {
        continue;
      }
      const nl = raw.includes("\r\n") ? "\r\n" : "\n";
      const before = raw.replace(/\r\n/g, "\n");
      if (!before.includes(find)) continue;
      const after = before.split(find).join(replace);
      fs.writeFileSync(file, nl === "\r\n" ? after.replace(/\n/g, "\r\n") : after, "utf8");
      hits++;
    }
    if (hits === 0) {
      if (patch.optional) {
        console.log(`    skip optional patch ${JSON.stringify(patch.find)}`);
        continue;
      }
      die(
        `patch anchor missing for ${mod.id} in ${patch.file}: ${JSON.stringify(patch.find)}\n` +
          `Upstream changed; update sources.json after reviewing the diff.`
      );
    }
  }
}

function localSha(localPath) {
  try {
    return git(["rev-parse", "HEAD"], { cwd: localPath });
  } catch {
    return null;
  }
}

function remoteHead(repo) {
  const out = git(["ls-remote", repo, "HEAD"]);
  const sha = out.split(/\s+/)[0];
  if (!sha) throw new Error(`no HEAD for ${repo}`);
  return sha;
}

function cloneGithub(mod) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `design-studio-${mod.id}-`));
  const pin = mod.pin || null;
  git(["clone", "--depth", "1", "--filter=blob:none", "--sparse", mod.repo, tmp]);
  if (mod.sparse && mod.sparse.length) {
    git(["sparse-checkout", "set", "--no-cone", "--", ...mod.sparse], { cwd: tmp });
  }
  if (pin) {
    git(["fetch", "--depth", "1", "origin", pin], { cwd: tmp });
    git(["checkout", pin], { cwd: tmp });
  }
  const sha = git(["rev-parse", "HEAD"], { cwd: tmp });
  return { tmp, sha };
}

function resolveLocal(mod) {
  const p = path.isAbsolute(mod.path) ? mod.path : path.resolve(ROOT, mod.path);
  if (!fs.existsSync(p)) die(`local path missing for ${mod.id}: ${p}`);
  return { src: p, sha: localSha(p) };
}

function vendorOne(mod, lock) {
  console.log(`\n==> ${mod.id}`);
  const dest = path.join(ROOT, mod.dest);
  rmrf(dest);
  mkdirp(dest);

  let sha = null;
  let tmp = null;
  try {
    if (mod.type === "local") {
      const { src, sha: local } = resolveLocal(mod);
      sha = local;
      const copied = copyTreeFiltered(src, dest, mod.include, mod.exclude);
      console.log(`    copied ${copied} files from ${src}`);
    } else if (mod.type === "github") {
      const cloned = cloneGithub(mod);
      tmp = cloned.tmp;
      sha = cloned.sha;
      const srcRoot = mod.subpath ? path.join(tmp, mod.subpath) : tmp;
      if (!fs.existsSync(srcRoot)) die(`${mod.id}: subpath missing after clone: ${mod.subpath}`);
      const copied = copyTreeFiltered(srcRoot, dest, mod.include, mod.exclude);
      console.log(`    copied ${copied} files from ${mod.repo}@${sha.slice(0, 7)}`);
      copyExtras(tmp, dest, mod.extras);
    } else {
      die(`unknown type for ${mod.id}: ${mod.type}`);
    }

    adaptSkillFile(dest, mod);
    applyPatches(dest, mod);
    lock.modules[mod.id] = {
      sha,
      type: mod.type,
      dest: mod.dest,
      repo: mod.repo || null,
      path: mod.path || null,
      vendoredAt: new Date().toISOString(),
    };
    console.log(`    ok ${mod.id}`);
  } finally {
    if (tmp) rmrf(tmp);
  }
}

function loadLock() {
  if (!fs.existsSync(LOCK_PATH)) return { modules: {} };
  return readJson(LOCK_PATH);
}

function checkOne(mod, lock) {
  const entry = lock.modules?.[mod.id];
  const locked = entry?.sha || null;
  let current = null;
  try {
    if (mod.type === "local") {
      const { src, sha } = resolveLocal(mod);
      current = sha;
      void src;
    } else {
      current = remoteHead(mod.repo);
    }
  } catch (e) {
    console.log(`${mod.id}: check failed: ${e.message}`);
    return { id: mod.id, locked, current: null, delta: "error" };
  }
  let delta = "unknown";
  if (!locked) delta = "not vendored";
  else if (!current) delta = "unreachable";
  else if (locked === current) delta = "current";
  else delta = "ahead (run --update " + mod.id + ")";
  console.log(`${mod.id}: lock=${locked ? locked.slice(0, 7) : "-"} remote=${current ? current.slice(0, 7) : "-"} ${delta}`);
  return { id: mod.id, locked, current, delta };
}

function main() {
  const args = process.argv.slice(2);
  if (!fs.existsSync(SOURCES_PATH)) die(`missing ${SOURCES_PATH}`);
  const sources = readJson(SOURCES_PATH);
  const mods = sources.modules || [];
  const ids = new Set(mods.map((m) => m.id));

  let mode = "--all";
  let only = null;
  if (args[0] === "--check") mode = "--check";
  else if (args[0] === "--update") {
    mode = "--update";
    only = args[1];
    if (!only) die("usage: node tools/sync.mjs --update <id>");
    if (!ids.has(only)) die(`unknown id ${only}. known: ${[...ids].join(", ")}`);
  } else if (args[0] === "--all" || args.length === 0) {
    mode = "--all";
  } else {
    die("usage: node tools/sync.mjs [--check | --update <id> | --all]");
  }

  if (mode === "--check") {
    const lock = loadLock();
    const rows = mods.map((m) => checkOne(m, lock));
    const stale = rows.filter((r) => r.delta !== "current");
    process.exit(stale.length ? 2 : 0);
  }

  const lock = loadLock();
  lock.generated = new Date().toISOString();
  lock.modules = lock.modules || {};
  const selected = mode === "--update" ? mods.filter((m) => m.id === only) : mods;
  for (const mod of selected) vendorOne(mod, lock);
  writeJson(LOCK_PATH, lock);
  console.log(`\nwrote ${path.relative(ROOT, LOCK_PATH)}`);
}

main();
