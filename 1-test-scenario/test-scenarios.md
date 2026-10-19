# Skenario Pengujian - Restful-Booker API

Skenario tingkat tinggi. Langkah rinci ada di `test-cases.csv`.

## TS-AUTH - Autentikasi (`POST /auth`)

| ID | Skenario | Jenis |
|---|---|---|
| TS-AUTH-01 | Pengguna dengan kredensial valid menerima token | Positif |
| TS-AUTH-02 | Pengguna dengan kredensial salah tidak menerima token | Negatif |
| TS-AUTH-03 | Permintaan tanpa kredensial tidak menerima token | Negatif |

## TS-CRT - Membuat booking (`POST /booking`)

| ID | Skenario | Jenis |
|---|---|---|
| TS-CRT-01 | Booking dengan semua field valid berhasil dibuat dan id dikembalikan | Positif |
| TS-CRT-02 | Booking tanpa field opsional berhasil dibuat | Positif |
| TS-CRT-03 | Permintaan dengan field wajib yang hilang ditolak dengan error dari sisi client | Negatif |
| TS-CRT-04 | Nilai field di luar rentang valid (harga negatif, checkout sebelum checkin) ditolak | Batas / negatif |
| TS-CRT-05 | Tipe data yang salah dan format tanggal yang rusak ditolak | Negatif |
| TS-CRT-06 | Teks kosong / sangat panjang / berisi karakter khusus ditangani dengan aman | Batas / keamanan |
| TS-CRT-07 | Permintaan ditolak ketika header `Accept` tidak ada | Negatif |

## TS-GET - Membaca booking (`GET /booking`, `GET /booking/{id}`)

| ID | Skenario | Jenis |
|---|---|---|
| TS-GET-01 | Booking yang ada bisa diambil berdasarkan id dan sesuai schema | Positif |
| TS-GET-02 | Id yang tidak ada atau formatnya salah mengembalikan 404 | Negatif |
| TS-GET-03 | Daftar booking mengembalikan id | Positif |
| TS-GET-04 | Daftar bisa difilter berdasarkan nama dan tanggal | Positif |

## TS-UPD - Mengubah booking (`PUT`, `PATCH /booking/{id}`)

| ID | Skenario | Jenis |
|---|---|---|
| TS-UPD-01 | Pengguna yang terautentikasi bisa mengganti seluruh isi booking | Positif |
| TS-UPD-02 | Pengguna yang terautentikasi bisa mengubah sebagian field saja | Positif |
| TS-UPD-03 | Permintaan tanpa token atau dengan token tidak valid ditolak | Keamanan |

## TS-DEL - Menghapus booking (`DELETE /booking/{id}`)

| ID | Skenario | Jenis |
|---|---|---|
| TS-DEL-01 | Pengguna yang terautentikasi bisa menghapus booking, dan booking itu tidak bisa diambil lagi | Positif |
| TS-DEL-02 | Penghapusan tanpa autentikasi ditolak | Keamanan |
| TS-DEL-03 | Menghapus booking yang sudah tidak ada ditangani dengan wajar | Negatif |

## TS-E2E - Alur end-to-end

| ID | Skenario |
|---|---|
| TS-E2E-01 | Login -> buat booking -> baca -> ubah -> ubah sebagian -> hapus -> pastikan sudah hilang (folder Postman 1-5 dijalankan berurutan) |

## TS-NFR - Non-fungsional

| ID | Skenario | Alat |
|---|---|---|
| TS-NFR-01 | Endpoint utama merespons dalam waktu kurang dari 2 detik untuk satu pengguna | Assertion Postman |
| TS-NFR-02 | Dengan 10 pengguna bersamaan, latensi p95 dan tingkat error tetap dalam threshold | Load test k6 |
| TS-NFR-03 | Perilaku saat beban dinaikkan melewati tingkat normal (mencari titik jenuh) | Stress test k6 |

## Keterlacakan

| Skenario | Test case |
|---|---|
| TS-AUTH-* | TC-AUTH-01 .. 03 |
| TS-CRT-* | TC-CRT-01 .. 11 |
| TS-GET-* | TC-GET-01 .. 06 |
| TS-UPD-* | TC-UPD-01 .. 05 |
| TS-DEL-* | TC-DEL-01 .. 04 |
