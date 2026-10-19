# Tes API dengan Postman

Collection: `RestfulBooker.postman_collection.json` - 22 request dan 41 assertion di folder regression.

## Struktur folder

| Folder | Tujuan | Hasil yang diharapkan |
|---|---|---|
| 0. Health | `GET /ping` | Lulus |
| 1. Auth | Login (menyimpan `token`), login negatif | Lulus |
| 2. Booking - Create | Create valid (menyimpan `bookingId`), tanpa header, field hilang, field opsional | Lulus |
| 3. Booking - Read | Get by id dengan pengecekan JSON schema, kasus 404, daftar, filter | Lulus |
| 4. Booking - Update | PUT / PATCH dengan dan tanpa token | Lulus |
| 5. Booking - Delete | Hapus, pastikan sudah hilang, hapus dua kali | Lulus |
| 6. Data-driven | Membuat satu booking untuk setiap baris di `data/bookings.csv` | Lulus |
| 7. Known defects | Memeriksa perilaku yang **seharusnya** untuk BUG-001..006, dikelompokkan per modul (7.1 Auth, 7.2 Booking - Create) | **Gagal dengan sengaja** (mendokumentasikan bug) |

Folder 0-5 berbagi state (`token`, `bookingId`) dan harus dijalankan berurutan.

Setiap request di folder 7 diberi nama `TC-xxx | BUG-xxx ...`, jadi mencari ID test case (misalnya `TC-CRT-05`) akan menemukannya di sini. `TC-AUTH-02` muncul dua kali dengan sengaja: di folder 1 ia memeriksa perilaku API saat ini (200, tanpa token) supaya regression suite tetap hijau, dan di folder 7 ia memeriksa perilaku yang seharusnya (401), yang gagal dan mendokumentasikan BUG-006.

Nama request dan pesan assertion di collection memakai bahasa Inggris, sesuai kebiasaan di Postman. ID test case-nya sama dengan yang ada di `1-test-scenario/test-cases.csv`.

## Yang diperlihatkan oleh tes ini

- Variabel collection dan chaining (token dan id dioper antar request)
- File environment untuk base URL dan kredensial
- Assertion status, body, schema (`jsonSchema`), dan waktu respons
- Kasus positif, negatif, dan keamanan (token hilang atau tidak valid)
- Data-driven testing dengan file CSV
- Memisahkan regression test yang stabil dari defect yang sudah diketahui supaya CI tetap bermakna
- Setiap request bisa dikirim sendiri-sendiri: skrip di level collection otomatis login atau membuat booking kalau `token` atau `bookingId` masih kosong

## Menjalankan di Postman

Import collection dan `environments/public-demo.postman_environment.json`, pilih environment-nya, lalu jalankan collection (folder 0-5). Environment tidak wajib: collection punya nilai bawaan untuk `baseUrl`, `username`, dan `password`.

## Menjalankan dari command line

```bash
npm install
npm run test:api          # regression suite + laporan HTML di 2-postman/reports/
npm run test:api:data     # folder data-driven dengan bookings.csv
npm run test:api:defects  # known defect (akan melaporkan kegagalan, memang disengaja)
```

Kredensial demo publik di file environment adalah kredensial yang dipublikasikan oleh pembuat API-nya, bukan rahasia.
