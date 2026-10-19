# Laporan Pengujian Performa - Restful-Booker API

| | |
|---|---|
| **Tanggal** | 2026-10-16 |
| **Target** | https://restful-booker.herokuapp.com (demo publik, tier gratis) |
| **Alat** | k6 v2.3.0, dijalankan dari satu laptop lewat internet publik |
| **Beban maksimum** | 10 virtual user (sengaja rendah: server publik yang dipakai bersama) |

> Hasil sudah termasuk latensi jaringan dari mesin penguji (waktu bolak-balik minimum sekitar 230-250 ms), sehingga angka absolutnya menggambarkan "yang terlihat oleh client dari jauh", bukan waktu proses di server.

## 1. Tujuan

1. Memastikan alur booking utama berjalan saat dipakai bersamaan (kebenaran fungsional di bawah beban).
2. Memeriksa bahwa latensi dan tingkat error tetap dalam threshold pada beban yang diharapkan (10 VU).
3. Mengamati perilaku API di bawah trafik yang lebih agresif.

## 2. Skenario

Semua skenario menjalankan alur yang sama: daftar booking -> buat -> ambil -> (patch) -> hapus (pembersihan).

| Tes | Profil | Think time |
|---|---|---|
| Smoke | 1 VU, 5 iterasi | 1 d |
| Load | 0 -> 10 VU dalam 30 d, tahan 2 menit, turun 30 d | 1-3 d |
| Stress | 2 -> 5 -> 8 -> 10 VU, tahan 1 menit di 10, lalu turun (total 3 menit) | 0,5 d |

## 3. Threshold

| Tes | Threshold |
|---|---|
| Smoke | `http_req_failed < 1%`, `checks > 99%`, `p95 < 2000 ms` |
| Load | `http_req_failed < 1%`, `checks > 99%`, `p95 < 1500 ms`, `p99 < 3000 ms`, p95 `GET /booking/{id}` < 1000 ms, p95 `POST /booking` < 1500 ms |
| Stress | `http_req_failed < 5%`, `p95 < 3000 ms` |

## 4. Hasil

### Smoke (1 VU)

| Metrik | Hasil |
|---|---|
| Check yang lulus | 42 / 42 (100%) |
| Request | 26, 0 gagal |
| Latensi p95 | 258 ms |
| Kesimpulan | **Lulus** |

### Load (10 VU, 3 menit)

| Metrik | Hasil | Threshold | Kesimpulan |
|---|---|---|---|
| Request | 1.301 (7,0 req/d), 260 iterasi | - | - |
| Check yang lulus | 2.082 / 2.082 (100%) | > 99% | Lulus |
| `http_req_failed` | 0,00% | < 1% | Lulus |
| Latensi rata-rata / median | 382 ms / 256 ms | - | - |
| Latensi p90 / p95 | 793 ms / 952 ms | p95 < 1500 ms | Lulus |
| Latensi maksimum | 1,91 d | p99 < 3000 ms | Lulus |
| p95 `GET /booking/{id}` | 347 ms | < 1000 ms | Lulus |
| p95 `POST /booking` | 343 ms | < 1500 ms | Lulus |

**Kesimpulan: Lulus.** API sanggup melayani 10 pengguna bersamaan tanpa error.

### Stress (sampai 10 VU, think time lebih pendek, 3 menit) - dijalankan dua kali

Tes stress dijalankan dua kali dengan pengaturan yang sama. Hasil kedua run berbeda.

| Metrik | Run 1 (10:18) | Run 2 (10:26) | Threshold |
|---|---|---|---|
| Request / iterasi | 1.773 / 443 | 2.061 / 515 | - |
| Check yang lulus | 2.995 / 3.103 (96,5%) | 100% | - |
| `http_req_failed` | **6,09%** (108 request) | 0,00% | < 5% |
| Latensi rata-rata / median | 423 ms / 263 ms | 349 ms / 262 ms | - |
| Latensi p90 / p95 | 761 ms / 1,05 d | 568 ms / 665 ms | p95 < 3000 ms |
| Latensi maksimum | **6,36 d** | 1,18 d | - |
| Kesimpulan | **Gagal** (tingkat error) | Lulus | |

Pada run 1, semua kegagalan berasal dari check `DELETE /booking/{id}` yang gagal (108 dari 443 penghapusan). Endpoint lain tidak ada yang gagal. Run 2 tidak mengalami kegagalan sama sekali.

**Kesimpulan keseluruhan: belum bisa disimpulkan.** Threshold tingkat error terlampaui satu kali dari dua run, dan penyebabnya tidak sempat terekam.

## 5. Analisis

1. **Beban normal sehat.** Dengan think time yang realistis, API tidak menghasilkan error dan median-nya 256 ms, yang pada dasarnya hanyalah waktu bolak-balik jaringan. p95 (952 ms) sekitar empat kali median, artinya sebagian kecil request terasa jauh lebih lambat. Request yang sesekali lambat itu wajar untuk host tier gratis.
2. **Perilaku saat stress tidak stabil.** Run 1 memiliki tingkat error 6,1% dan latensi maksimum 6,4 d; run 2, dengan skrip dan beban yang sama, tidak ada error dan latensi maksimumnya 1,2 d. Karena hanya satu dari dua run yang gagal, kegagalannya bersifat sesekali, bukan batas kapasitas yang pasti pada 10 VU.
3. **Kegagalan di run 1 seluruhnya ada di `DELETE`.** 108 dari 443 penghapusan (sekitar 24%) gagal pada check-nya, sementara login, daftar, buat, dan ambil tetap 100%. Pengecekan terpisah secara berurutan (buat lalu langsung hapus, satu pengguna, 25 kali) mengembalikan `201` setiap kali, jadi satu pengguna saja tidak memicunya.
4. **Status code yang gagal tidak terekam di run 1.** `check` hanya mencatat lulus atau gagal, sehingga saya tidak bisa memastikan apakah kegagalannya `4xx`, `5xx`, atau timeout. Setelahnya saya menambahkan pencatatan status code pada `DELETE` (`lib/api.js`), tetapi run 2 tidak mengalami kegagalan, jadi belum menghasilkan bukti.
5. **Dugaan penyebab (hipotesis, belum terbukti):** pengguna lain yang memakai server demo tier gratis pada saat run 1, atau server sesekali tersendat. Latensi maksimum 6,4 d di run 1 lebih cocok dengan server tersendat daripada batas kapasitas yang stabil.

## 6. Rekomendasi

| # | Rekomendasi | Alasan |
|---|---|---|
| 1 | Ulangi tes stress minimal 3 kali lagi (pada jam yang berbeda) dan bandingkan tingkat error serta latensi maksimum | Dua run saling bertentangan; tren butuh data lebih banyak |
| 2 | Pertahankan pencatatan status code yang baru pada `DELETE` agar kegagalan berikutnya bisa didiagnosis | Akar masalahnya masih belum diketahui |
| 3 | Anggap 10 VU didukung untuk load (lulus dengan bersih), dan jangan klaim stabilitas stress dulu | Tes load lulus; stress belum bisa disimpulkan |
| 4 | Jika kegagalan terulang di lingkungan yang terkendali, selidiki `DELETE` saat ada penulisan bersamaan (locking, konsistensi penyimpanan data) | Semua error run 1 ada di endpoint ini |

## 7. Keterbatasan

- Tes dijalankan dari satu mesin lewat internet; variasi jaringan di sisi client ikut masuk ke angka-angka.
- Targetnya demo publik yang dipakai bersama, jadi trafik pengguna lain bisa memengaruhi hasil. Tes smoke dan load dijalankan sekali, tes stress dua kali (dengan hasil berbeda). Untuk menyimpulkan tren, ulangi minimal tiga kali lalu bandingkan.
- Beban sengaja dibatasi 10 VU, jadi laporan ini tidak bisa menyebutkan di mana batas kapasitas sebenarnya.
- Percobaan pertama dibuang karena dua run tidak sengaja berjalan tumpang tindih dan mengacaukan bebannya; angka di atas berasal dari run ulang yang bersih.

## 8. Data mentah

Ringkasan JSON ada di `results/`: `smoke-summary.json`, `load-summary.json`, `stress-run1-summary.json` (error 6,09%) dan `stress-summary.json` (run 2, error 0%).
