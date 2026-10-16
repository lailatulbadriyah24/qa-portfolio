const ms = (n) => (n >= 1000 ? `${(n / 1000).toFixed(2)} s` : `${Math.round(n)} ms`);
const pct = (n) => `${(n * 100).toFixed(n === 0 || n === 1 ? 0 : 1)}%`;

export default function Perf({ runs }) {
  // One shared axis for every run, so the runs can be compared by eye.
  const top = Math.ceil(Math.max(...runs.map((r) => r.max)) / 1000) * 1000;
  const x = (v) => `${(v / top) * 100}%`;
  const ticks = Array.from({ length: top / 1000 + 1 }, (_, i) => i * 1000);

  return (
    <div>
      <figure className="range">
        <div className="range-axis" aria-hidden="true">
          <span />
          <div>{ticks.map((t) => <i key={t} style={{ left: x(t) }}>{t / 1000}s</i>)}</div>
        </div>
        {runs.map((r) => (
          <div key={r.key} className="range-row"
            role="img"
            aria-label={`${r.label}: median ${ms(r.med)}, p95 ${ms(r.p95)}, maksimum ${ms(r.max)}, batas p95 ${ms(r.limit.p95)}, ${r.pass ? "lulus" : "gagal"}`}>
            <div className="range-name">{r.label}<small>{r.profile}</small></div>
            <div className="range-track">
              {ticks.map((t) => <b key={t} className="grid-line" style={{ left: x(t) }} />)}
              <span className="r-max" style={{ width: x(r.max) }} />
              <span className={`r-p95 ${r.pass ? "" : "is-bad"}`} style={{ width: x(r.p95) }} />
              <span className="r-med" style={{ left: x(r.med) }} />
              <span className="r-limit" style={{ left: x(r.limit.p95) }} />
            </div>
          </div>
        ))}
        <figcaption>
          Batang tebal: dari 0 sampai p95. Garis tipis: sampai nilai maksimum. Titik: median.
          Garis tegak merah: batas p95 untuk run itu. Batang merah: run melewati threshold, bisa
          karena latensi atau karena persentase request gagal (cek tabel angka).
        </figcaption>
      </figure>

      <details className="fold">
        <summary>Lihat tabel angka</summary>
        <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Run</th>
              <th className="num">Request</th>
              <th className="num">Median</th>
              <th className="num">p95 (batas)</th>
              <th className="num">Maks</th>
              <th className="num">Gagal (batas)</th>
              <th>Hasil</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.key}>
                <td className="strong">{r.label}</td>
                <td className="num">{r.requests.toLocaleString("en-US")}</td>
                <td className="num">{ms(r.med)}</td>
                <td className="num">{ms(r.p95)} <span className="muted">({ms(r.limit.p95)})</span></td>
                <td className="num">{ms(r.max)}</td>
                <td className={`num ${r.failRate >= r.limit.fail ? "bad strong" : ""}`}>
                  {pct(r.failRate)} <span className="muted">({pct(r.limit.fail)})</span>
                </td>
                <td className={r.pass ? "" : "bad strong"}>{r.pass ? "Lulus" : "Gagal"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </details>

      <p className="aside">
        Dua run stress memakai pengaturan yang sama tapi hasilnya berbeda: run 1 gagal 6,1% (semuanya
        di <code>DELETE</code>), run 2 bersih. Karena itu saya belum menyimpulkan batas kapasitasnya.
        Beban saya batasi 10 VU karena targetnya server publik yang dipakai bersama.
      </p>
    </div>
  );
}
