"use client";
import { useMemo, useState } from "react";

const statusClass = (s) =>
  s.startsWith("Pass") ? "ok" : s.startsWith("Fail") ? "bad" : "warn";

export default function TestCases({ rows }) {
  const [q, setQ] = useState("");
  const [module, setModule] = useState("All");
  const [status, setStatus] = useState("All");
  const [open, setOpen] = useState(null);

  const modules = useMemo(() => ["All", ...new Set(rows.map((r) => r.Module))], [rows]);
  const statuses = useMemo(() => ["All", ...new Set(rows.map((r) => r.Status))], [rows]);

  const shown = rows.filter(
    (r) =>
      (module === "All" || r.Module === module) &&
      (status === "All" || r.Status === status) &&
      (q === "" || `${r.ID} ${r.Title} ${r.Steps}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <div className="filters">
        <input
          type="search"
          placeholder="Cari ID, judul, atau langkah"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Cari test case"
        />
        <select value={module} onChange={(e) => setModule(e.target.value)} aria-label="Modul">
          {modules.map((m) => <option key={m}>{m}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          {statuses.map((m) => <option key={m}>{m}</option>)}
        </select>
        <span className="muted">{shown.length} dari {rows.length}</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>ID</th><th>Judul</th><th>Tipe</th><th>Prioritas</th><th>Status</th><th>Otomasi</th></tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <FragmentRow key={r.ID} r={r} open={open === r.ID} toggle={() => setOpen(open === r.ID ? null : r.ID)} />
            ))}
            {shown.length === 0 && (
              <tr><td colSpan={6} className="muted">Tidak ada test case yang cocok.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FragmentRow({ r, open, toggle }) {
  return (
    <>
      <tr className="clickable" onClick={toggle}>
        <td className="mono">
          <button className="linklike" aria-expanded={open} onClick={(e) => { e.stopPropagation(); toggle(); }}>
            {r.ID}
          </button>
        </td>
        <td>{r.Title}</td>
        <td>{r.Type}</td>
        <td>{r.Priority}</td>
        <td><span className={statusClass(r.Status)}>{r.Status}</span></td>
        <td>{r.Automated}</td>
      </tr>
      {open && (
        <tr className="detail">
          <td colSpan={6}>
            <dl>
              <dt>Skenario</dt><dd>{r.Scenario}</dd>
              <dt>Prasyarat</dt><dd>{r.Preconditions}</dd>
              <dt>Langkah</dt><dd>{r.Steps}</dd>
              <dt>Diharapkan</dt><dd>{r["Expected Result"]}</dd>
              <dt>Aktual</dt><dd>{r["Actual Result"]}</dd>
            </dl>
          </td>
        </tr>
      )}
    </>
  );
}
