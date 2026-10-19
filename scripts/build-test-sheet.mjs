// Builds 1-test-scenario/test-cases.xlsx from the same files the website reads
// (test-cases.csv, test-scenarios.md, bug-reports/), so the sheet never drifts from them.
// Run with: npm run sheet
import ExcelJS from "exceljs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(path.join(root, "site")); // site/lib/data.js reads files relative to site/
const { getTestCases, getBugs, getScenarios, REPO_URL } = await import(
  pathToFileURL(path.join(root, "site", "lib", "data.js")).href
);

const cases = getTestCases();
const bugs = getBugs();
const scenarios = getScenarios();

// Where each test case lives in the Postman collection (matched by the TC id in the request name).
const collection = JSON.parse(
  fs.readFileSync(path.join(root, "2-postman", "RestfulBooker.postman_collection.json"), "utf8")
);
const postmanOf = new Map();
(function walk(items, trail) {
  for (const it of items) {
    if (it.request) {
      for (const id of it.name.match(/TC-[A-Z]+-\d+/g) ?? []) {
        const where = trail.join(" / ").replace(" (expected to fail)", "");
        const list = postmanOf.get(id) ?? [];
        if (!list.includes(where)) list.push(where);
        postmanOf.set(id, list);
      }
    }
    if (it.item) walk(it.item, [...trail, it.name]);
  }
})(collection.item, []);

const FONT = "Arial";
const NAVY = "FF0F1D3A";
const LIGHT = "FFEAF1FF";
const LINE = "FFD5DBE8";
const strip = (s) => String(s ?? "").replace(/`/g, "");
const border = { style: "thin", color: { argb: LINE } };
const box = { top: border, left: border, bottom: border, right: border };

function styleHeader(row) {
  row.height = 24;
  row.eachCell((c) => {
    c.font = { name: FONT, size: 10, bold: true, color: { argb: "FFFFFFFF" } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
    c.alignment = { vertical: "middle", horizontal: "left", wrapText: true };
    c.border = box;
  });
}
function styleBody(ws, fromRow) {
  ws.eachRow((row, n) => {
    if (n < fromRow) return;
    row.eachCell({ includeEmpty: true }, (c) => {
      c.font = { name: FONT, size: 10, ...(c.font || {}) };
      c.alignment = { vertical: "top", wrapText: true };
      c.border = box;
    });
  });
}

const wb = new ExcelJS.Workbook();
wb.creator = "Lailatul Badriyah";
wb.title = "Restful-Booker API test cases";

// Sheets are created in tab order; the summary is filled in last because it points at 'Test Cases'.
const summary = wb.addWorksheet("Ringkasan", { properties: { tabColor: { argb: "FF2F66E8" } } });
const tc = wb.addWorksheet("Test Case", { properties: { tabColor: { argb: NAVY } } });
const sc = wb.addWorksheet("Skenario", { properties: { tabColor: { argb: "FF93A4C8" } } });
const bg = wb.addWorksheet("Laporan Bug", { properties: { tabColor: { argb: "FFD93A3A" } } });

/* ---------------- Test Cases ---------------- */
const tcCols = [
  ["ID", 13], ["Skenario", 13], ["Modul", 10], ["Judul", 38], ["Jenis", 11], ["Prioritas", 10],
  ["Status", 28], ["Otomasi", 24], ["Folder Postman", 34], ["Prasyarat", 22], ["Langkah", 42],
  ["Hasil yang Diharapkan", 34], ["Hasil Aktual", 44], ["Bug", 12],
];
tc.columns = tcCols.map(([header, width]) => ({ header, width }));
for (const r of cases) {
  const bugIds = [...new Set(r["Actual Result"].match(/BUG-\d{3}/g) ?? [])].join(", ");
  tc.addRow([
    r.ID, r.Scenario, r.Module, r.Title, r.Type, r.Priority, r.Status, r.Automated,
    (postmanOf.get(r.ID) ?? []).join("\n") || (r.Automated === "Manual" ? "-" : "(belum ditemukan)"),
    r.Preconditions, r.Steps, r["Expected Result"], r["Actual Result"], bugIds,
  ]);
}
styleHeader(tc.getRow(1));
styleBody(tc, 2);
tc.views = [{ state: "frozen", xSplit: 1, ySplit: 1 }];
tc.autoFilter = { from: "A1", to: { row: 1, column: tcCols.length } };
tc.getColumn(1).font = { name: FONT, size: 10, bold: true };
tc.pageSetup = { orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 0 };

const LAST = 200; // dropdowns, colours and summary formulas cover rows up to here so new rows just work
const lists = {
  E: '"Positif,Negatif,Batas,Keamanan"',
  F: '"P1,P2,P3"',
  G: '"Lulus,Gagal,Gagal (sudah diketahui),Lulus (perilaku terdokumentasi),Observasi,Belum dijalankan"',
  H: '"Postman,Postman (folder defect),Manual"',
};
for (let n = 2; n <= LAST; n++) {
  for (const [col, list] of Object.entries(lists)) {
    tc.getCell(`${col}${n}`).dataValidation = { type: "list", allowBlank: true, formulae: [list] };
  }
}
const fill = (argb) => ({ type: "pattern", pattern: "solid", bgColor: { argb } });
tc.addConditionalFormatting({
  ref: `G2:G${LAST}`,
  rules: [
    { type: "expression", formulae: ['LEFT($G2,5)="Lulus"'], style: { fill: fill("FFDDF3E4"), font: { color: { argb: "FF1D6A36" } } } },
    { type: "expression", formulae: ['LEFT($G2,5)="Gagal"'], style: { fill: fill("FFFBE0E0"), font: { color: { argb: "FFB42323" } } } },
    { type: "expression", formulae: ['AND($G2<>"",LEFT($G2,5)<>"Lulus",LEFT($G2,5)<>"Gagal")'], style: { fill: fill("FFFFF1CC"), font: { color: { argb: "FF8A5A00" } } } },
  ],
});

/* ---------------- Scenarios ---------------- */
sc.columns = [
  { header: "ID", width: 14 }, { header: "Area", width: 34 },
  { header: "Skenario", width: 80 }, { header: "Jenis / Alat", width: 20 },
];
for (const g of scenarios) {
  for (const [id, text, extra] of g.items) sc.addRow([id, strip(g.heading), strip(text), extra ?? ""]);
}
styleHeader(sc.getRow(1));
styleBody(sc, 2);
sc.views = [{ state: "frozen", xSplit: 1, ySplit: 1 }];
sc.autoFilter = { from: "A1", to: { row: 1, column: 4 } };
sc.getColumn(1).font = { name: FONT, size: 10, bold: true };

/* ---------------- Bug Reports ---------------- */
const section = (body, heading) => {
  const m = body.match(new RegExp(`## ${heading}\\s*\\n+([\\s\\S]*?)(?=\\n## |$)`, "i"));
  return m ? strip(m[1]).trim().split(/\n\s*\n/)[0].replace(/\s*\n\s*/g, " ") : "";
};
bg.columns = [
  { header: "ID Bug", width: 10 }, { header: "Judul", width: 52 }, { header: "Severity", width: 10 },
  { header: "Prioritas", width: 10 }, { header: "Status", width: 10 }, { header: "Test case terkait", width: 20 },
  { header: "Hasil yang diharapkan", width: 42 }, { header: "Hasil aktual", width: 42 }, { header: "Laporan", width: 16 },
];
for (const b of bugs) {
  // Bugs without their own report file fall back to the test cases that mention them.
  const related =
    (b.body.match(/\*\*Test case terkait\*\*\s*\|\s*([^|]+)\|/i) ?? [])[1] ??
    cases.filter((r) => r["Actual Result"].includes(b.id)).map((r) => r.ID).join(", ");
  const repro = b.file ? "" : section(b.body, "Langkah reproduksi");
  const row = bg.addRow([
    b.id, strip(b.title), b.severity, b.priority, b.status, related.trim(),
    section(b.body, "Hasil yang diharapkan"), b.file ? section(b.body, "Hasil aktual") : repro, "",
  ]);
  if (b.file) {
    row.getCell(9).value = {
      text: "Lihat laporan",
      hyperlink: `${REPO_URL}/blob/main/1-test-scenario/bug-reports/${b.file}`,
    };
  }
}
styleHeader(bg.getRow(1));
styleBody(bg, 2);
bg.eachRow((row, n) => {
  if (n === 1) return;
  row.getCell(1).font = { name: FONT, size: 10, bold: true };
  if (row.getCell(9).value?.hyperlink) row.getCell(9).font = { name: FONT, size: 10, color: { argb: "FF1D4FC7" }, underline: true };
  if (row.getCell(3).value === "Major") row.getCell(3).font = { name: FONT, size: 10, bold: true, color: { argb: "FFB42323" } };
});
bg.views = [{ state: "frozen", xSplit: 1, ySplit: 1 }];
bg.autoFilter = { from: "A1", to: { row: 1, column: 9 } };

/* ---------------- Ringkasan (formulas, with cached results) ---------------- */
const rng = (col) => `'Test Case'!$${col}$2:$${col}$${LAST}`;
const count = (key, pred) => cases.filter((r) => pred(r[key])).length;
const total = cases.length;
const pass = count("Status", (s) => s.startsWith("Lulus"));
const fail = count("Status", (s) => s.startsWith("Gagal"));
const auto = count("Automated", (s) => s.startsWith("Postman"));

summary.columns = [{ width: 34 }, { width: 12 }, { width: 4 }, { width: 30 }, { width: 12 }];
summary.getCell("A1").value = "Ringkasan test case: Restful-Booker API";
summary.getCell("A1").font = { name: FONT, size: 16, bold: true, color: { argb: NAVY } };
summary.getCell("A2").value =
  "Angka di bawah dihitung dengan rumus dari sheet 'Test Case', jadi ikut berubah saat status atau kolom lain diubah.";
summary.getCell("A2").font = { name: FONT, size: 9, italic: true, color: { argb: "FF5A6783" } };

const put = (cell, value, opts = {}) => {
  const c = summary.getCell(cell);
  c.value = value;
  c.font = { name: FONT, size: 10, bold: !!opts.bold };
  c.border = box;
  if (opts.fmt) c.numFmt = opts.fmt;
  if (opts.fill) c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: opts.fill } };
  c.alignment = { vertical: "middle", horizontal: opts.right ? "right" : "left" };
};
const head = (cell, text) => {
  const c = summary.getCell(cell);
  c.value = text;
  c.font = { name: FONT, size: 10, bold: true, color: { argb: "FFFFFFFF" } };
  c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: NAVY } };
  c.border = box;
};
const formula = (cell, f, result, fmt) => {
  put(cell, { formula: f, result }, { right: true, fmt, bold: true });
};

head("A4", "Ringkasan"); head("B4", "Jumlah");
put("A5", "Total test case"); formula("B5", `COUNTA(${rng("A")})`, total);
put("A6", "Lulus"); formula("B6", `COUNTIF(${rng("G")},"Lulus*")`, pass);
put("A7", "Gagal"); formula("B7", `COUNTIF(${rng("G")},"Gagal*")`, fail);
put("A8", "Observasi / belum dijalankan"); formula("B8", "B5-B6-B7", total - pass - fail);
put("A9", "Persentase lulus"); formula("B9", "IF(B5=0,0,B6/B5)", total ? pass / total : 0, "0.0%");
put("A10", "Sudah diotomasi (Postman)"); formula("B10", `COUNTIF(${rng("H")},"Postman*")`, auto);
put("A11", "Masih manual"); formula("B11", `COUNTIF(${rng("H")},"Manual")`, total - auto);

head("A13", "Jenis"); head("B13", "Jumlah");
["Positif", "Negatif", "Batas", "Keamanan"].forEach((t, i) => {
  put(`A${14 + i}`, t);
  formula(`B${14 + i}`, `COUNTIF(${rng("E")},A${14 + i})`, count("Type", (s) => s === t));
});
head("A19", "Prioritas"); head("B19", "Jumlah");
["P1", "P2", "P3"].forEach((t, i) => {
  put(`A${20 + i}`, t);
  formula(`B${20 + i}`, `COUNTIF(${rng("F")},A${20 + i})`, count("Priority", (s) => s === t));
});
head("D4", "Status"); head("E4", "Jumlah");
const statuses = ["Lulus", "Lulus (perilaku terdokumentasi)", "Gagal", "Gagal (sudah diketahui)", "Observasi", "Belum dijalankan"];
statuses.forEach((t, i) => {
  put(`D${5 + i}`, t);
  formula(`E${5 + i}`, `COUNTIF(${rng("G")},D${5 + i})`, count("Status", (s) => s === t));
});
put("D11", "Total", { bold: true, fill: LIGHT });
formula("E11", "SUM(E5:E10)", statuses.reduce((n, t) => n + count("Status", (s) => s === t), 0));
summary.getCell("E11").fill = { type: "pattern", pattern: "solid", fgColor: { argb: LIGHT } };

summary.getCell("A25").value = "Sumber: 1-test-scenario/test-cases.csv, test-scenarios.md, dan bug-reports/ di repository. File ini dibuat ulang dengan: npm run sheet";
summary.getCell("A25").font = { name: FONT, size: 9, italic: true, color: { argb: "FF5A6783" } };
summary.views = [{ showGridLines: false }];

const out = path.join(root, "1-test-scenario", "test-cases.xlsx");
await wb.xlsx.writeFile(out);
console.log(`Wrote ${out}`);
console.log(`test cases ${total} | scenarios ${scenarios.reduce((n, g) => n + g.items.length, 0)} | bugs ${bugs.length}`);
console.log(`pass ${pass} | fail ${fail} | other ${total - pass - fail} | automated ${auto}`);
const known = new Set(cases.map((r) => r.ID));
const extra = [...postmanOf.keys()].filter((id) => !known.has(id));
if (extra.length) console.log(`In Postman but not in the sheet: ${extra.join(", ")}`);
