# Portofolio QA - Restful-Booker API

Alur kerja QA yang lengkap dalam skala kecil pada sebuah API publik: perencanaan dan desain tes, pengujian API otomatis, dan pengujian performa.

**Sistem yang diuji:** [Restful-Booker](https://restful-booker.herokuapp.com), API demo pemesanan hotel yang terbuka untuk umum dan dibuat untuk latihan testing.

## Isi

| Bagian | Yang diperlihatkan | Lokasi |
|---|---|---|
| **1. Dokumentasi pengujian** | Rencana pengujian, skenario, 29 test case, keterlacakan, 7 laporan bug, sheet Excel test case | [`1-test-scenario/`](1-test-scenario) |
| **2. Otomasi API (Postman + Newman)** | 22 request, 41 assertion, pengecekan schema, token chaining, data-driven testing, laporan HTML | [`2-postman/`](2-postman) |
| **3. Pengujian performa (k6)** | Skrip smoke, load, dan stress dengan threshold, hasil, dan analisis | [`3-k6-performance/`](3-k6-performance) |
| **CI** | GitHub Actions menjalankan Newman dan k6 smoke test di setiap push | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) |

## Temuan utama

Pengujian menemukan bahwa API ini hampir tidak punya validasi input:

- Harga negatif, tanggal checkout sebelum checkin, nama kosong, dan nilai bukan angka diterima begitu saja (BUG-001..004). Sebagian rusak diam-diam, misalnya `"abc"` menjadi `null` dan `"not-a-date"` menjadi `"0NaN-aN-aN"`.
- Field wajib yang hilang menyebabkan `500`, bukan `400` (BUG-005).
- Login yang gagal mengembalikan `200 OK` (BUG-006).
- Operasi tulis sudah terlindungi dengan benar: semua `PUT`/`PATCH`/`DELETE` tanpa autentikasi atau dengan token tidak valid mengembalikan `403`.

Rincian lengkapnya ada di [`1-test-scenario/bug-reports/`](1-test-scenario/bug-reports).

## Memulai

Kebutuhan: Node.js 18+ dan [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/).

```bash
npm install
npm run test:api          # regression suite Postman lewat Newman (laporan HTML di 2-postman/reports/)
npm run test:api:data     # run data-driven
npm run test:api:defects  # known defect, gagal dengan sengaja
npm run sheet             # membuat ulang 1-test-scenario/test-cases.xlsx dari CSV, skenario, dan laporan bug
k6 run 3-k6-performance/smoke.js
```

## Pendekatan

- **Desain dulu**: skenario -> test case -> otomasi, dengan ID yang bisa ditelusuri di ketiganya (misalnya `TC-CRT-01` ada di CSV dan di collection).
- **Tes stabil vs. known defect**: assertion untuk bug ditaruh di folder terpisah supaya regression suite tetap hijau dan bermakna.
- **Load test yang bertanggung jawab**: targetnya server publik yang dipakai bersama, jadi beban dibatasi 10 virtual user dan setiap skrip membersihkan data yang dibuatnya.

## Alat

Postman, Newman (+ reporter htmlextra), k6, Node.js, GitHub Actions.

## Website

`site/` adalah situs statis Next.js yang menampilkan portofolio ini (laporan bug, test case, hasil Postman dan k6) langsung dari file-file di atas, sehingga isinya tidak pernah berbeda dari sumbernya.

```bash
cd site
npm install
npm run dev      # http://localhost:3000
npm run build    # ekspor statis ke site/out
```

Situs ini di-deploy ke GitHub Pages lewat `.github/workflows/pages.yml`. Di pengaturan repository, atur **Pages > Source** ke **GitHub Actions** (cukup sekali).
