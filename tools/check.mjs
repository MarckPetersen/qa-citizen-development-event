#!/usr/bin/env node
// Quick quality checks for the presentation. No dependencies: run with `node tools/check.mjs`.
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(path.join(root, f), "utf8");
let failures = 0, warnings = 0;
const ok = (m) => console.log("  ✓ " + m);
const fail = (m) => { failures++; console.log("  ✗ " + m); };
const warn = (m) => { warnings++; console.log("  ! " + m); };

// Load config + notes as the browser would
const sandbox = { window: {} };
vm.createContext(sandbox);
for (const f of ["js/config.js", "js/notes.js"]) {
  try { vm.runInContext(read(f), sandbox, { filename: f }); ok(`${f} parses`); }
  catch (e) { fail(`${f} has a syntax error: ${e.message}`); }
}
const cfg = sandbox.window.DECK_CONFIG || {};
const notes = sandbox.window.SPEAKER_NOTES || {};

for (const f of ["js/site.js", "js/notes-render.js"]) {
  try { new vm.Script(read(f), { filename: f }); ok(`${f} parses`); }
  catch (e) { fail(`${f} has a syntax error: ${e.message}`); }
}

const html = read("index.html");
const ids = [...html.matchAll(/<section class="section[^"]*" id="([^"]+)"/g)].map((m) => m[1]);
console.log(`\nSections (${ids.length}):`);
ids.length === 8 ? ok("all 8 sections present") : fail(`expected 8 sections, found ${ids.length}`);
new Set(ids).size === ids.length ? ok("section ids are unique") : fail("duplicate section ids");
const navTargets = [...html.matchAll(/class="nav__menu"[\s\S]*?<\/ul>/g)][0]?.[0].match(/href="#([^"]+)"/g)?.map((h) => h.slice(7, -1)) || [];
ids.every((id) => navTargets.includes(id)) ? ok("every section is in the navigation") : fail("navigation is missing a section");

console.log("\nSpeaker notes:");
for (const id of ids) notes[id] ? null : fail(`missing notes for section "${id}"`);
for (const id of Object.keys(notes)) ids.includes(id) ? null : warn(`notes for unknown section "${id}"`);
if (ids.every((id) => notes[id])) ok("every section has notes");

console.log("\nLinks & config:");
const linkKeys = [...new Set([...html.matchAll(/data-link="([^"]+)"/g)].map((m) => m[1]))];
for (const k of linkKeys) {
  if (!(k in (cfg.links || {}))) fail(`data-link="${k}" not defined in config.links`);
  else if (!cfg.links[k]) warn(`link "${k}" is empty (shows "link coming soon")`);
  else if (!/^https:\/\//.test(cfg.links[k])) warn(`link "${k}" does not start with https://`);
}
const textKeys = [...html.matchAll(/data-config-text="([^"]+)"/g)].map((m) => m[1]);
for (const k of textKeys) {
  const v = k.split(".").reduce((o, p) => (o == null ? undefined : o[p]), cfg);
  if (v === undefined) fail(`data-config-text="${k}" not found in config`);
  else if (v === "") warn(`config "${k}" is empty (placeholder shown)`);
}
for (const s of cfg.demoScreenshots || []) {
  if (/^https?:/.test(s.file)) continue;
  if (!existsSync(path.join(root, s.file))) warn(`backup screenshot missing: ${s.file}`);
}

console.log("\nFiles & safety:");
for (const f of [...html.matchAll(/(?:src|href)="((?:css|js|assets)\/[^"?]+)(?:\?[^"]*)?"/g)].map((m) => m[1])) {
  existsSync(path.join(root, f)) ? null : fail(`referenced file missing: ${f}`);
}
ok("referenced local files checked");
const allJs = ["js/config.js", "js/notes.js", "js/site.js", "index.html", "presenter.html"].map(read).join("\n");
/(sk-[A-Za-z0-9]{20,}|api[_-]?key\s*[:=]\s*["'][^"']+["']|ghp_[A-Za-z0-9]{20,})/i.test(allJs)
  ? fail("possible API key or secret found in client-side code")
  : ok("no API keys or secrets found");

console.log(`\n${failures} failure(s), ${warnings} warning(s)`);
process.exit(failures ? 1 : 0);
