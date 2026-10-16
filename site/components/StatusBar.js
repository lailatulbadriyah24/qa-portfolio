// One bar showing how the test cases ended up: pass / fail / not conclusive.
export default function StatusBar({ rows }) {
  const groups = [
    { key: "pass", label: "Lulus", n: rows.filter((r) => r.Status.startsWith("Pass")).length },
    { key: "fail", label: "Gagal", n: rows.filter((r) => r.Status.startsWith("Fail")).length },
    { key: "open", label: "Observasi / belum dijalankan", n: rows.filter((r) => !/^(Pass|Fail)/.test(r.Status)).length },
  ];
  const total = rows.length;
  return (
    <figure className="statusbar">
      <div className="statusbar-track" role="img"
        aria-label={groups.map((g) => `${g.label}: ${g.n} dari ${total}`).join(", ")}>
        {groups.map((g) => (
          <span key={g.key} className={`seg-${g.key}`} style={{ flexGrow: g.n }}>{g.n}</span>
        ))}
      </div>
      <figcaption>
        {groups.map((g) => (
          <span key={g.key}><i className={`sw seg-${g.key}`} />{g.label}</span>
        ))}
      </figcaption>
    </figure>
  );
}
