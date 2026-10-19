import fs from "node:fs";
import path from "node:path";

// The site lives in site/; the portfolio content lives one level up.
const ROOT = path.resolve(process.cwd(), "..");
const read = (...p) => fs.readFileSync(path.join(ROOT, ...p), "utf8");

export const REPO_URL = "https://github.com/lailatulbadriyah24/qa-portfolio";
export const TARGET_URL = "https://restful-booker.herokuapp.com";

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some(Boolean)) rows.push(row);
      row = [];
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
}

// The CSV headers are in Indonesian; the rest of the code uses these stable keys.
const CSV_KEYS = {
  Skenario: "Scenario", Modul: "Module", Judul: "Title", Jenis: "Type", Prioritas: "Priority",
  Prasyarat: "Preconditions", Langkah: "Steps", "Hasil yang Diharapkan": "Expected Result",
  "Hasil Aktual": "Actual Result", Otomasi: "Automated",
};

export function getTestCases() {
  return parseCsv(read("1-test-scenario", "test-cases.csv")).map((row) =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [CSV_KEYS[k] ?? k, v]))
  );
}

export function getBugs() {
  const readme = read("1-test-scenario", "bug-reports", "README.md");
  const files = fs.readdirSync(path.join(ROOT, "1-test-scenario", "bug-reports"));
  const oneLiners = Object.fromEntries(
    [...readme.matchAll(/\*\*(BUG-\d+) reproduksi \(satu baris\):\*\*\s*(.+)/g)].map((m) => [m[1], m[2]])
  );
  const bugs = [];
  for (const line of readme.split("\n")) {
    const m = line.match(/^\|\s*(?:\[(BUG-\d+)\]\([^)]*\)|(BUG-\d+))\s*\|(.+)\|\s*$/);
    if (!m) continue;
    const id = m[1] || m[2];
    const [title, severity, priority, status] = m[3].split("|").map((s) => s.trim());
    const file = files.find((f) => f.startsWith(id));
    const body = file
      ? read("1-test-scenario", "bug-reports", file).replace(/^# .*\n+/, "")
      : `## Langkah reproduksi\n\n${oneLiners[id] ?? ""}`;
    bugs.push({ id, title, severity, priority, status, body, file: file ?? null });
  }
  return bugs;
}

export function getScenarios() {
  const text = read("1-test-scenario", "test-scenarios.md");
  const groups = [];
  for (const block of text.split(/^## /m).slice(1)) {
    const [heading, ...rest] = block.split("\n");
    const items = rest
      .filter((l) => /^\|\s*TS-[A-Z0-9]+-\d+/.test(l)) // skips the traceability table (TS-AUTH-*)
      .map((l) => l.split("|").map((s) => s.trim()).filter(Boolean));
    if (items.length) groups.push({ heading: heading.trim(), items });
  }
  return groups;
}

export function getPostman() {
  const col = JSON.parse(read("2-postman", "RestfulBooker.postman_collection.json"));
  const count = (items) => {
    let requests = 0, assertions = 0;
    for (const it of items) {
      if (it.request) requests++;
      for (const e of it.event ?? []) {
        assertions += (e.script?.exec?.join("\n").match(/pm\.test\(/g) ?? []).length;
      }
      if (it.item) { const c = count(it.item); requests += c.requests; assertions += c.assertions; }
    }
    return { requests, assertions };
  };
  const folders = col.item.map((f) => ({ name: f.name, ...count(f.item ?? []) }));
  // The regression suite is folders 0-5 (see package.json test:api).
  const regression = folders.slice(0, 6).reduce(
    (a, f) => ({ requests: a.requests + f.requests, assertions: a.assertions + f.assertions }),
    { requests: 0, assertions: 0 }
  );
  return { folders, regression };
}

const LIMITS = {
  smoke: { p95: 2000, fail: 0.01 },
  load: { p95: 1500, fail: 0.01 },
  stress: { p95: 3000, fail: 0.05 },
};

export function getPerf() {
  const defs = [
    { key: "smoke", label: "Smoke", profile: "1 VU, 5 iterations", file: "smoke-summary.json", limit: LIMITS.smoke },
    { key: "load", label: "Load", profile: "10 VUs, 3 min", file: "load-summary.json", limit: LIMITS.load },
    { key: "stress1", label: "Stress, run 1", profile: "up to 10 VUs, 3 min", file: "stress-run1-summary.json", limit: LIMITS.stress },
    { key: "stress2", label: "Stress, run 2", profile: "up to 10 VUs, 3 min", file: "stress-summary.json", limit: LIMITS.stress },
  ];
  return defs.map((d) => {
    const m = JSON.parse(read("3-k6-performance", "results", d.file)).metrics;
    const dur = m.http_req_duration;
    const failRate = m.http_req_failed.value ?? m.http_req_failed.passes / (m.http_reqs.count || 1);
    const checks = m.checks;
    const checkRate = checks.value ?? checks.passes / (checks.passes + checks.fails);
    const p95 = dur["p(95)"];
    return {
      key: d.key, label: d.label, profile: d.profile, limit: d.limit,
      requests: m.http_reqs.count,
      rps: m.http_reqs.rate,
      avg: dur.avg, med: dur.med, p95, max: dur.max,
      failRate, checkRate,
      pass: p95 < d.limit.p95 && failRate < d.limit.fail,
    };
  });
}
