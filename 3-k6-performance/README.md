# Pengujian Performa k6

Target: https://restful-booker.herokuapp.com (demo publik). Beban sengaja dibatasi **10 virtual user** karena layanan ini dipakai bersama.

| Skrip | Jenis | Profil | Tujuan |
|---|---|---|---|
| `smoke.js` | Smoke | 1 VU, 5 iterasi | Memastikan skrip dan API berfungsi |
| `load.js` | Load | Naik sampai 10 VU, tahan 2 menit | Memvalidasi perilaku pada trafik yang diharapkan |
| `stress.js` | Stress | 2 -> 5 -> 8 -> 10 VU, think time lebih pendek | Mengamati penurunan kinerja dan pemulihannya |

Kode bersama ada di `lib/`: `config.js` (URL, threshold) dan `api.js` (helper request dengan `check` dan tag request).

## Menjalankan

Pasang k6: https://grafana.com/docs/k6/latest/set-up/install-k6/

```bash
k6 run 3-k6-performance/smoke.js
k6 run --summary-export=3-k6-performance/results/load-summary.json 3-k6-performance/load.js
k6 run --summary-export=3-k6-performance/results/stress-summary.json 3-k6-performance/stress.js
```

Pengaturan bisa diganti lewat environment variable: `k6 run -e BASE_URL=https://other-host 3-k6-performance/smoke.js`.

## Yang diperlihatkan skrip ini

- `setup()` untuk login sekali dan membagikan token
- Alur pengguna yang realistis (telusuri -> buat -> baca -> ubah -> hapus) dengan think time dan pembersihan data
- `check` untuk memastikan kebenaran fungsional saat ada beban
- Threshold pada tingkat error dan latensi, termasuk threshold per endpoint memakai tag
- Profil bertahap: naik, stabil, lalu turun

Lihat [`REPORT.md`](REPORT.md) untuk hasil dan analisisnya.
