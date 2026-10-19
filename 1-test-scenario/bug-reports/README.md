# Laporan Bug

Defect yang ditemukan saat menguji Restful-Booker. Semuanya direproduksi pada API yang sungguhan; folder Postman **7. Known defects** berisi pengecekan otomatis untuk BUG-001 sampai BUG-004 dan BUG-006.

| ID | Judul | Severity | Prioritas | Status |
|---|---|---|---|---|
| [BUG-001](BUG-001-negative-price.md) | Booking menerima `totalprice` negatif | Major | P1 | Terbuka |
| [BUG-002](BUG-002-checkout-before-checkin.md) | Booking menerima tanggal checkout lebih awal dari checkin | Major | P1 | Terbuka |
| BUG-003 | Booking menerima `firstname` kosong | Minor | P2 | Terbuka |
| [BUG-004](BUG-004-invalid-types-and-dates.md) | Harga bukan angka dan format tanggal salah diam-diam rusak (`null`, `0NaN-aN-aN`) | Major | P1 | Terbuka |
| [BUG-005](BUG-005-missing-fields-500.md) | Field wajib yang hilang menyebabkan `500 Internal Server Error`, bukan `400` | Major | P1 | Terbuka |
| [BUG-006](BUG-006-failed-login-200.md) | Login gagal mengembalikan `200 OK`, bukan `401` | Minor | P2 | Terbuka |
| BUG-007 | Status code hapus tidak konsisten: berhasil mengembalikan `201`, hapus ulang mengembalikan `405` (seharusnya `204`/`200` dan `404`) | Minor | P3 | Terbuka |

**BUG-003 reproduksi (satu baris):** `POST /booking` dengan `"firstname": ""` -> `200 OK`, booking tersimpan dengan nama kosong.

**BUG-007 reproduksi (satu baris):** `DELETE /booking/{id}` dengan token valid -> `201 Created`; permintaan yang sama diulang -> `405 Method Not Allowed`.

## Template laporan

```
ID:
Judul:
Lingkungan:
Severity / Prioritas:
Prasyarat:
Langkah reproduksi:
Hasil yang diharapkan:
Hasil aktual:
Bukti (request / response):
Dampak:
Saran perbaikan:
```
