# BUG-001 - Booking menerima `totalprice` negatif

| | |
|---|---|
| **Severity / Prioritas** | Major / P1 |
| **Status** | Terbuka |
| **Lingkungan** | https://restful-booker.herokuapp.com (demo publik) |
| **Test case terkait** | TC-CRT-05 |

## Langkah reproduksi

1. Kirim:
   ```http
   POST /booking
   Content-Type: application/json
   Accept: application/json

   {
     "firstname": "A", "lastname": "B",
     "totalprice": -100, "depositpaid": true,
     "bookingdates": { "checkin": "2026-11-01", "checkout": "2026-11-02" }
   }
   ```

## Hasil yang diharapkan

`400 Bad Request` dengan pesan bahwa `totalprice` harus nol atau lebih besar.

## Hasil aktual

`200 OK`; booking tersimpan dengan `"totalprice": -100`.

## Dampak

Nominal negatif merusak laporan pendapatan dan bisa disalahgunakan untuk membuat kredit atau pengembalian dana.

## Saran perbaikan

Validasi `totalprice >= 0` saat membuat dan mengubah (`POST`, `PUT`, `PATCH`).
