# BUG-004 - Harga bukan angka dan format tanggal salah diam-diam rusak

| | |
|---|---|
| **Severity / Prioritas** | Major / P1 |
| **Status** | Terbuka |
| **Lingkungan** | https://restful-booker.herokuapp.com (demo publik) |
| **Test case terkait** | TC-CRT-08, TC-CRT-09 |

## Langkah reproduksi

**Kasus A - tipe data salah**
1. `POST /booking` dengan `"totalprice": "abc"` dan data lain yang valid.

**Kasus B - format tanggal salah**
1. `POST /booking` dengan `"checkin": "not-a-date"` dan data lain yang valid.

## Hasil yang diharapkan

`400 Bad Request` yang menjelaskan field yang tidak valid.

## Hasil aktual

Keduanya mengembalikan `200 OK` dan datanya rusak tanpa pemberitahuan:

| Input | Nilai yang tersimpan |
|---|---|
| `"totalprice": "abc"` | `"totalprice": null` |
| `"checkin": "not-a-date"` | `"checkin": "0NaN-aN-aN"` |

## Dampak

Data rusak secara diam-diam: pemanggil mengira booking sudah tersimpan dengan benar. Laporan dan logika tanggal di hilir menerima `null` atau tanggal yang tidak bisa dibaca.

## Saran perbaikan

Validasi tipe data dan format tanggal ISO-8601 (`YYYY-MM-DD`) sebelum menyimpan, lalu kembalikan pesan error per field.
