# BUG-002 - Booking menerima tanggal checkout lebih awal dari checkin

| | |
|---|---|
| **Severity / Prioritas** | Major / P1 |
| **Status** | Terbuka |
| **Lingkungan** | https://restful-booker.herokuapp.com (demo publik) |
| **Test case terkait** | TC-CRT-06 |

## Langkah reproduksi

1. Kirim `POST /booking` dengan `"bookingdates": { "checkin": "2026-11-10", "checkout": "2026-11-01" }` dan data lain yang valid.

## Hasil yang diharapkan

`400 Bad Request`: checkout harus setelah checkin.

## Hasil aktual

`200 OK`; booking tersimpan dengan checkout sembilan hari sebelum checkin.

## Dampak

Masa menginap yang tidak valid merusak perhitungan ketersediaan kamar dan harga berdasarkan jumlah malam.

## Saran perbaikan

Validasi `checkout > checkin` saat membuat dan mengubah.
