# BUG-006 - Login gagal mengembalikan `200 OK`, bukan `401`

| | |
|---|---|
| **Severity / Prioritas** | Minor / P2 |
| **Status** | Terbuka |
| **Lingkungan** | https://restful-booker.herokuapp.com (demo publik) |
| **Test case terkait** | TC-AUTH-02, TC-AUTH-03 |

## Langkah reproduksi

1. Kirim:
   ```http
   POST /auth
   Content-Type: application/json

   { "username": "admin", "password": "wrong" }
   ```

## Hasil yang diharapkan

`401 Unauthorized`.

## Hasil aktual

`200 OK` dengan body `{"reason":"Bad credentials"}` (tanpa token). Body kosong `{}` menghasilkan perilaku yang sama.

## Dampak

Client dan API gateway yang menganggap `2xx` sebagai sukses bisa salah menafsirkan login yang gagal. Pemantauan login gagal dan rate limiting yang berbasis status code tidak akan berfungsi.

## Saran perbaikan

Kembalikan `401 Unauthorized` untuk kredensial yang tidak valid dan `400` untuk permintaan yang formatnya salah.
