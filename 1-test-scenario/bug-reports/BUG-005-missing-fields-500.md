# BUG-005 - Field wajib yang hilang menyebabkan `500 Internal Server Error`

| | |
|---|---|
| **Severity / Prioritas** | Major / P1 |
| **Status** | Terbuka |
| **Lingkungan** | https://restful-booker.herokuapp.com (demo publik) |
| **Test case terkait** | TC-CRT-03 |

## Langkah reproduksi

1. Kirim:
   ```http
   POST /booking
   Content-Type: application/json
   Accept: application/json

   { "firstname": "OnlyName" }
   ```

## Hasil yang diharapkan

`400 Bad Request` yang menyebutkan field wajib yang hilang (`lastname`, `totalprice`, `depositpaid`, `bookingdates`).

## Hasil aktual

`500 Internal Server Error` dengan body yang generik.

## Dampak

Kode 5xx memberi tahu client bahwa server yang gagal, bukan permintaannya yang salah. Ini mengotori monitoring error dan membuat pengguna API tidak punya petunjuk untuk memperbaiki permintaannya.

## Saran perbaikan

Validasi body permintaan dan kembalikan `400` beserta rinciannya, bukan membiarkan exception merambat.
