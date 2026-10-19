# Rencana Pengujian - Restful-Booker API

| | |
|---|---|
| **Proyek** | Restful-Booker (API demo pemesanan hotel yang terbuka untuk umum) |
| **Base URL** | https://restful-booker.herokuapp.com |
| **Penyusun** | Lailatul Badriyah |
| **Versi** | 1.0 |

## 1. Tujuan

Memastikan API booking mengautentikasi pengguna dengan benar, menjalankan operasi CRUD pada booking, menolak input yang tidak valid, melindungi operasi tulis, dan tetap responsif di bawah beban ringan.

## 2. Ruang lingkup

**Termasuk**

| Area | Endpoint |
|---|---|
| Health | `GET /ping` |
| Autentikasi | `POST /auth` |
| CRUD booking | `POST /booking`, `GET /booking`, `GET /booking/{id}`, `PUT /booking/{id}`, `PATCH /booking/{id}`, `DELETE /booking/{id}` |
| Non-fungsional | Waktu respons, perilaku di bawah beban ringan / stress (lihat `3-k6-performance`) |

**Tidak termasuk**: UI, penetration testing keamanan, infrastruktur di baliknya, dan beban skala besar (server ini layanan publik yang dipakai bersama).

## 3. Pendekatan pengujian

| Tingkat | Teknik | Alat |
|---|---|---|
| API fungsional | Equivalence partitioning, boundary value analysis, alur berbasis state (create -> read -> update -> delete), negative testing | Postman + Newman |
| Data-driven | Request yang sama dijalankan pada beberapa baris data | Collection runner Postman + CSV |
| Performa | Smoke, load, stress dengan threshold | k6 |
| Eksploratori | Validasi input, penanganan error, header | Manual (Postman / curl) |

Test case dirancang dari skenario di `test-scenarios.md` dan dicatat di `test-cases.csv`. Setiap test case otomatis memakai ID yang sama di collection Postman (misalnya `TC-CRT-01`).

## 4. Lingkungan pengujian

- Server demo publik (dipakai bersama; datanya direset berkala oleh pengelolanya).
- Kredensial: akun demo publik yang didokumentasikan API (`admin` / `password123`).
- Alat: Postman, Newman 6, k6, Node.js 18+, GitHub Actions.

## 5. Kriteria masuk / keluar

**Masuk**: API dapat dijangkau (`GET /ping` mengembalikan 201); data uji dan kredensial tersedia.

**Keluar**
- 100% test case Prioritas 1 sudah dieksekusi.
- Semua test case regression yang stabil lulus.
- Setiap test case yang gagal dicatat sebagai bug lengkap dengan severity dan bukti.
- Threshold performa yang ditetapkan di `3-k6-performance/REPORT.md` terpenuhi, atau penyimpangannya dijelaskan.

## 6. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Server publik dipakai bersama, data bisa direset atau diubah orang lain | Test tidak stabil | Setiap run membuat dan membersihkan booking sendiri; tanpa id yang ditulis mati |
| Server tier gratis dan bisa lambat setelah lama tidak dipakai | Assertion waktu gagal | Threshold waktu respons yang longgar (2 detik); request pemanasan lebih dulu |
| Load test bisa mengganggu pengguna lain | Etika / ketersediaan | Dibatasi 10 virtual user dengan durasi singkat |
| Validasi API lemah | Banyak pengecekan "diharapkan gagal" | Defect yang sudah diketahui dipisah di folder sendiri agar CI tetap hijau |

## 7. Hasil kerja

Rencana pengujian, skenario pengujian, test case, collection dan environment Postman, laporan HTML Newman, skrip dan laporan k6, serta laporan bug.

## 8. Panduan severity defect

| Severity | Arti | Contoh |
|---|---|---|
| Critical | Data hilang, celah keamanan, sistem mati | Penghapusan tanpa autentikasi |
| Major | Fitur inti salah, tanpa solusi sementara | Data tidak valid tersimpan diam-diam |
| Minor | Perilaku salah tetapi ada solusi sementara | Status code salah |
| Trivial | Kosmetik / dokumentasi | Salah ketik pada pesan |
