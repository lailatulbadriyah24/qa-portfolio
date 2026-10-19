import TestCases from "../components/TestCases";
import StatusBar from "../components/StatusBar";
import Bugs from "../components/Bugs";
import Perf from "../components/Perf";
import Inline from "../components/Inline";
import ThemeToggle from "../components/ThemeToggle";
import Enhance from "../components/Enhance";
import {
  REPO_URL, TARGET_URL, getTestCases, getBugs, getScenarios, getPostman, getPerf,
} from "../lib/data";
import { OWNER, contacts, skillGroups, education, jobs, projects } from "../lib/cv";

export default function Home() {
  const cases = getTestCases();
  const bugs = getBugs();
  const scenarios = getScenarios();
  const postman = getPostman();
  const perf = getPerf();

  const automated = cases.filter((c) => c.Automated.startsWith("Postman")).length;
  const scenarioCount = scenarios.reduce((n, g) => n + g.items.length, 0);
  const major = bugs.filter((b) => b.severity === "Major").length;

  const figures = [
    [cases.length, "test case", `${automated} sudah otomatis`, false],
    [postman.regression.assertions, "assertion", `di ${postman.regression.requests} request Postman`, false],
    [bugs.length, "bug", `${major} di antaranya major`, true],
    [perf.length, "run k6", "smoke, load, dan 2× stress", false],
  ];

  return (
    <>
      <header className="site-head">
          <div className="wrap">
            <a href="#profile" className="name">{OWNER}</a>
            <nav aria-label="Bagian">
              <a href="#profile">Profile</a>
              <a href="#pendidikan">Pendidikan</a>
              <a href="#pengalaman">Pengalaman Kerja</a>
              <a href="#keahlian">Keahlian</a>
              <a href="#portfolio">Portfolio</a>
              <a href="#kontak">Kontak</a>
              <ThemeToggle />
            </nav>
          </div>
      </header>

      <div className="band">
        <div className="wrap hero" id="profile">
          <p className="role">Software QA | API Testing &amp; Performance Testing</p>
          <h1>{OWNER}</h1>
          <p className="lead">
            Berpengalaman dalam pengujian API, uji performa dengan K6 pada 95 API, dan validasi
            fungsional aplikasi, dengan latar belakang sebagai Application Developer. Terbiasa
            menyelidiki defect, memvalidasi perilaku API, dan memverifikasi perbaikan bersama tim
            lintas fungsi. Saat ini mendalami praktik quality assurance yang terstruktur untuk
            berkarier di bidang QA/QC.
          </p>
          <p className="cta">
            <a className="primary" href="#portfolio">Lihat portfolio</a>
            <a href="mailto:lailatulbadriyah654@gmail.com">Email</a>
            <a href="https://www.linkedin.com/in/lailatulbadriyah/">LinkedIn</a>
          </p>
        </div>
      </div>

      <main className="wrap">
        <section id="pendidikan">
          <h2>Pendidikan</h2>
          <div className="entry">
            <p className="when">{education.period}</p>
            <div>
              <h3>{education.school}</h3>
              <p className="sub">{education.degree} · {education.gpa}</p>
              <ul className="bullets">
                {education.achievements.map((a) => <li key={a}>{a}</li>)}
              </ul>
            </div>
          </div>
        </section>

        <section id="pengalaman">
          <h2>Pengalaman Kerja</h2>
          {jobs.map((j) => (
            <div key={j.role + j.period} className="entry">
              <p className="when">{j.period}</p>
              <div>
                <h3>{j.role}</h3>
                <p className="sub">{j.company}</p>
                {j.testing.length > 0 && (
                  <>
                    <p className="tag test">Testing</p>
                    <ul className="bullets">{j.testing.map((p) => <li key={p}>{p}</li>)}</ul>
                  </>
                )}
                <details className="devfold">
                  <summary>Pekerjaan pengembangan ({j.dev.length})</summary>
                  <ul className="bullets">{j.dev.map((p) => <li key={p}>{p}</li>)}</ul>
                </details>
              </div>
            </div>
          ))}
          <h3 className="entry-group">Proyek terpilih</h3>
          <div>
            {projects.map((j) => (
              <div key={j.role} className="entry">
                <p className="when">{j.period}</p>
                <div>
                  <h3>{j.role}</h3>
                  <p className="sub">{j.company}</p>
                  <p className="tag test">Testing</p>
                  <ul className="bullets">{j.testing.map((p) => <li key={p}>{p}</li>)}</ul>
                  <details className="devfold">
                    <summary>Pekerjaan pengembangan ({j.dev.length})</summary>
                    <ul className="bullets">{j.dev.map((p) => <li key={p}>{p}</li>)}</ul>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="keahlian">
          <h2>Keahlian</h2>
          <div className="skillrows">
            {skillGroups.map((g) => (
              <div key={g.title} className="skillrow">
                <h3>{g.title}</h3>
                <ul className={g.lead ? "chips chips-dark" : "chips"}>
                  {g.items.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="portfolio">
          <h2>Portfolio</h2>
          <h3 className="proj-title">Pengujian API Restful-Booker</h3>
          <p className="prose">
            Proyek mandiri untuk latihan: saya menguji Restful-Booker, sebuah{" "}
            <a href={TARGET_URL}>API pemesanan hotel publik</a> yang memang disediakan untuk belajar
            testing. Saya menulis test case, mengotomasinya dengan Postman, mengukur performanya
            dengan k6, lalu melaporkan bug yang ketemu. Semua angka di bawah dibaca langsung dari{" "}
            <a href={REPO_URL}>repository</a>.
          </p>
          <dl className="figures">
            {figures.map(([n, label, sub, hot]) => (
              <div key={label} className={hot ? "hot" : ""}>
                <dt>{n}</dt>
                <dd><strong>{label}</strong><span>{sub}</span></dd>
              </div>
            ))}
          </dl>

          <h3 className="part">Temuan</h3>
          <p className="prose">
            API ini hampir tidak memvalidasi input. Harga negatif, tanggal checkout sebelum checkin,
            dan nama kosong tetap diterima, dan field wajib yang hilang malah menghasilkan error{" "}
            <code>500</code>. Sisi baiknya, semua <code>PUT</code>, <code>PATCH</code>, dan{" "}
            <code>DELETE</code> tanpa token ditolak dengan <code>403</code>. Klik satu bug untuk
            melihat langkah reproduksinya.
          </p>
          <Bugs bugs={bugs} />

          <h3 className="part">Desain tes</h3>
          <p className="prose">
            Saya mulai dari {scenarioCount} skenario, lalu memecahnya jadi {cases.length} test case.
            Tiap ID bisa ditelusuri sampai ke Postman, misalnya <code>TC-CRT-01</code>.
          </p>
          <StatusBar rows={cases} />
          <details className="fold">
            <summary>Lihat {scenarioCount} skenario</summary>
            <div className="scenarios">
              {scenarios.map((g) => (
                <div key={g.heading} className="sc">
                  <h3><Inline text={g.heading} /></h3>
                  <ul>
                    {g.items.map(([id, text]) => (
                      <li key={id}><span className="mono muted">{id}</span> <Inline text={text} /></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
          <details className="fold">
            <summary>Lihat semua {cases.length} test case</summary>
            <TestCases rows={cases} />
          </details>

          <h3 className="part">Otomasi dan CI</h3>
          <p className="prose">
            Test case yang bisa diotomasi saya tulis sebagai collection Postman dan dijalankan dengan
            Newman. Isinya token chaining, validasi JSON schema, dan satu run data-driven dari CSV.
            Test untuk bug yang sudah diketahui saya pisahkan ke folder sendiri, supaya regression
            suite tetap hijau. Semuanya berjalan otomatis di GitHub Actions setiap ada push, bersama
            k6 smoke test (<a href={`${REPO_URL}/blob/main/.github/workflows/ci.yml`}>lihat workflow</a>).
          </p>
          <details className="fold">
            <summary>Lihat rincian per folder dan perintahnya</summary>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Folder</th><th className="num">Request</th><th className="num">Assertion</th></tr></thead>
                <tbody>
                  {postman.folders.map((f) => (
                    <tr key={f.name}><td>{f.name}</td><td className="num">{f.requests}</td><td className="num">{f.assertions}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <pre className="code"><code>{[
              "npm run test:api          # regression suite, laporan HTML",
              "npm run test:api:data     # run data-driven dari CSV",
              "npm run test:api:defects  # known defect, gagal memang disengaja",
            ].join("\n")}</code></pre>
          </details>

          <h3 className="part">Performa</h3>
          <p className="prose">
            Saya menjalankan skrip k6 ber-threshold ke API sungguhan dari satu laptop, jadi angkanya
            sudah termasuk latensi jaringan sekitar 230 sampai 250 ms. Smoke dan load lulus, sedangkan
            stress belum bisa disimpulkan (alasannya di bawah grafik).{" "}
            <a href={`${REPO_URL}/blob/main/3-k6-performance/REPORT.md`}>Baca laporan lengkap</a>.
          </p>
          <Perf runs={perf} />
        </section>

        <section id="kontak">
          <h2>Kontak</h2>
          <p className="prose">Saya terbuka untuk peran QA, QC, dan software tester. Silakan hubungi saya lewat:</p>
          <dl className="contact">
            {contacts.map(([label, text, href]) => (
              <div key={label}><dt>{label}</dt><dd><a href={href}>{text}</a></dd></div>
            ))}
            <div><dt>GitHub</dt><dd><a href={REPO_URL}>{REPO_URL.replace("https://", "")}</a></dd></div>
          </dl>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <span>© {OWNER}</span>
          <span>Dibuat dengan Next.js.</span>
        </div>
      </footer>
      <Enhance />
    </>
  );
}
