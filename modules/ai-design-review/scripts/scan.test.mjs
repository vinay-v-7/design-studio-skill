// Run: node --test scripts/scan.test.mjs
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanPaths, RULES } from "./scan.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const evals = path.join(here, "..", "evals");

function tmp(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "adr-"));
  for (const [name, body] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, name)), { recursive: true });
    fs.writeFileSync(path.join(dir, name), body);
  }
  return dir;
}
const ids = (res) => new Set(res.findings.map((f) => f.id));

test("rule IDs are unique", () => {
  const seen = RULES.map((r) => r.id);
  assert.equal(new Set(seen).size, seen.length);
});

test("slop landing fixture: core P0 tells found", () => {
  const got = ids(scanPaths([path.join(evals, "slop-saas-landing", "files")]));
  for (const id of ["CL1", "CL3", "LY1", "LY2", "IC1", "CP1", "CM6", "IM4", "CP6", "TY1", "CM1", "MO1", "MO3", "LY5", "LY7"]) assert.ok(got.has(id), `missing ${id}`);
});

test("RN fixture: mobile tells found", () => {
  const got = ids(scanPaths([path.join(evals, "rn-onboarding-screen", "files")]));
  for (const id of ["MB1", "MB3", "MB4", "MB10", "IC1", "CP1"]) assert.ok(got.has(id), `missing ${id}`);
});

test("dashboard fixture: app tells found", () => {
  const got = ids(scanPaths([path.join(evals, "apply-fixes-dashboard", "files")]));
  for (const id of ["CL1", "CL3", "CL11", "CM3", "MO3", "MO4", "UX1", "UX9", "CM7"]) assert.ok(got.has(id), `missing ${id}`);
});

test("deliberate, authored page stays quiet", () => {
  const dir = tmp({
    "app/page.tsx": `
import { Playfair_Display, Work_Sans } from "next/font/google";
const display = Playfair_Display({ subsets: ["latin"] });
export default function Page({ shipments }) {
  return (
    <main className="bg-[var(--ground)] text-[var(--ink)]">
      <section className="grid grid-cols-12 gap-6 px-8 py-20">
        <h1 className="col-span-7 text-7xl leading-none">Track every pallet from dock to door.</h1>
        <p className="col-span-5 self-end">Live ETAs for 1,284 trucks across the Midwest, updated every 90 seconds.</p>
        <a href="/demo" className="focus-visible:outline-2">Track a shipment</a>
      </section>
      {shipments.length === 0 ? <p>No shipments yet. Import a manifest to begin.</p> : shipments.map((s) => <Row key={s.id} s={s} />)}
    </main>
  );
}`,
    "app/globals.css": `:root { --ground: #e9e6e1; --ink: #1b1b1a; --signal: #ff5a1f; --radius-input: 2px; }
@media (prefers-reduced-motion: no-preference) { @keyframes route { from { stroke-dashoffset: 400 } to { stroke-dashoffset: 0 } } }`,
  });
  const res = scanPaths([dir]);
  assert.equal(res.summary.P0, 0, JSON.stringify(res.findings, null, 1));
  assert.ok(res.summary.P1 === 0, JSON.stringify(res.findings, null, 1));
});

test("ignore comments suppress a finding", () => {
  const dir = tmp({
    "a.tsx": `// brand guide mandates violet. ai-design-review-ignore: CL1
const Hero = () => <div className="bg-gradient-to-r from-violet-600 to-indigo-600" />;`,
  });
  assert.ok(!ids(scanPaths([dir])).has("CL1"));
  const dir2 = tmp({ "b.tsx": `/* ai-design-review-ignore-file: CL1 */\nconst A = () => <div className="bg-gradient-to-r from-violet-600 to-indigo-600" />;\nconst B = () => <div className="bg-gradient-to-r from-purple-500 to-pink-500" />;` });
  assert.ok(!ids(scanPaths([dir2])).has("CL1"));
});

test("CSS gradient with purple hex is detected; blue-only gradient is not", () => {
  const purple = tmp({ "s.css": `.hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }` });
  assert.ok(ids(scanPaths([purple])).has("CL1"));
  const blue = tmp({ "s.css": `.hero { background: linear-gradient(180deg, #0ea5e9, #0369a1); }` });
  assert.ok(!ids(scanPaths([blue])).has("CL1"));
});

test("Flutter and SwiftUI purple gradients are detected", () => {
  const dir = tmp({
    "home.dart": `Container(decoration: BoxDecoration(gradient: LinearGradient(colors: [Colors.deepPurple, Colors.indigo])))`,
    "Home.swift": `LinearGradient(colors: [.purple, .blue], startPoint: .top, endPoint: .bottom)`,
  });
  const res = scanPaths([dir]);
  assert.equal(res.findings.filter((f) => f.id === "MB4").length, 2);
});

test("--min filter drops lower severities", () => {
  const res = scanPaths([path.join(evals, "slop-saas-landing", "files")], { min: "P0" });
  assert.ok(res.findings.every((f) => f.severity === "P0"));
});

test("emoji on comment lines is ignored", () => {
  const dir = tmp({ "c.tsx": `// 🚀 ship it\n// ✅ done\nexport const x = 1;` });
  assert.ok(!ids(scanPaths([dir])).has("IC1"));
});
