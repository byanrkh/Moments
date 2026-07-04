# Moments — Quatrolympic 19

Halaman upload foto momen tanpa login, buat subdomain `moments.quatrolympic.com`.
Next.js 14 (App Router) + Tailwind CSS + Supabase (Database + Storage + Realtime).

## Struktur file

```
moments-quatrolympic/
├── app/
│   ├── layout.tsx        # font + metadata
│   ├── page.tsx          # halaman utama: hero, filter, grid, tombol upload
│   └── globals.css
├── components/
│   ├── DayFilter.tsx     # pill filter Semua/Day 1-5/Closing
│   ├── MomentCard.tsx    # kartu foto ala polaroid
│   └── UploadModal.tsx   # form upload (username, foto, hari, caption)
├── lib/
│   └── supabase.ts       # koneksi Supabase + tipe data
├── supabase/
│   └── schema.sql        # SQL: tabel, RLS policy, storage bucket
├── .env.local.example
├── tailwind.config.ts
└── package.json
```

## 1. Setup Supabase (5 menit)

1. Buka [supabase.com](https://supabase.com) → bikin project baru (atau pakai project yang udah ada punya web utama, tapi disarankan bikin project baru khusus buat "moments" biar kuota storage-nya kepisah dan gampang dipantau).
2. Masuk ke **SQL Editor** di dashboard Supabase.
3. Copy-paste seluruh isi file `supabase/schema.sql` di project ini, lalu klik **Run**.
   - Ini otomatis bikin tabel `moments`, mengaktifkan Row Level Security dengan policy "siapa saja boleh baca & upload tanpa login", bikin storage bucket `moments` yang public, dan mengaktifkan Realtime.
4. Ke **Project Settings → API**, copy `Project URL` dan `anon public key`.

## 2. Setup project di PC kamu

```bash
# 1. Taruh folder moments-quatrolympic ini di mana pun, lalu masuk ke dalamnya
cd moments-quatrolympic

# 2. Install dependencies
npm install

# 3. Bikin file .env.local dari contohnya
cp .env.local.example .env.local
```

Buka `.env.local`, isi dengan URL dan anon key dari Supabase tadi:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

```bash
# 4. Jalankan di local
npm run dev
```

Buka `http://localhost:3000` — coba upload foto, cek juga di Supabase Dashboard → Table Editor → `moments` apakah datanya masuk, dan di Storage → bucket `moments` apakah fotonya kesimpan.

## 3. Deploy ke subdomain moments.quatrolympic.com

Karena ini project terpisah dari web utama, cara paling gampang pakai Vercel:

1. Push folder `moments-quatrolympic` ini ke repo GitHub baru (terpisah dari repo web utama).
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → import repo tersebut.
3. Di step **Environment Variables**, masukkan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` yang sama seperti di `.env.local`.
4. Klik **Deploy**.
5. Setelah deploy selesai, ke **Project Settings → Domains** di Vercel, tambahkan domain `moments.quatrolympic.com`.
6. Vercel akan kasih kamu record CNAME (biasanya `cname.vercel-dns.com`). Masuk ke pengaturan DNS domain `quatrolympic.com` kamu (di Cloudflare/Niagahoster/dsb), tambahkan:
   - Type: `CNAME`
   - Name: `moments`
   - Value: (sesuai yang diberikan Vercel)
7. Tunggu propagasi DNS (biasanya 5-30 menit), lalu `moments.quatrolympic.com` sudah live.

> Kalau ternyata kamu maunya digabung jadi satu project Next.js dengan web utama (bukan deployment terpisah), tinggal bilang — file-file di atas gampang dipindah jadi route `/moments` atau pakai Next.js `middleware.ts` untuk rewrite berdasarkan subdomain dalam satu deployment.

## 4. Soal kapasitas Supabase (biar gak kaget)

Per Juli 2026, **Supabase Free Tier**:

| Kuota | Batas |
|---|---|
| File storage total | 1 GB |
| Ukuran maksimal per file | 50 MB (di project ini dibatasi 10 MB lewat `file_size_limit` di bucket + validasi di form, biar hemat) |
| Database | 500 MB (lebih dari cukup, tabel `moments` cuma nyimpen teks+URL, bukan file gambarnya) |
| Bandwidth keluar (egress) | 5 GB/bulan |

**Perkiraan jumlah foto yang muat di 1 GB:**
- Foto dari HP modern biasanya 2-5 MB per file (JPEG hasil kompresi kamera/Instagram) → muat sekitar **200-500 foto**.
- Kalau orang upload foto mentah tanpa kompresi (bisa 8-10 MB) → muat sekitar **100-125 foto**.
- Kalau butuh lebih banyak dari itu, upgrade ke **Supabase Pro ($25/bulan)** yang kasih 100 GB storage (bisa nyimpen ribuan foto), atau lebih murah lagi: tinggal aktifkan kompresi gambar di sisi browser sebelum upload (bisa gua tambahin kalau mau, biar 1 foto rata-rata jadi <500KB — otomatis 1GB bisa muat 2000+ foto).

Bandwidth 5GB/bulan juga perlu diperhatikan kalau event-nya ramai dan banyak yang buka galeri (tiap kali orang buka halaman & lihat foto, itu masuk hitungan egress). Untuk event beberapa hari dengan traffic sedang, ini biasanya masih aman.

## Catatan keamanan

- Tidak ada login, tapi RLS policy dibuat **insert-only** untuk publik — artinya orang bisa nambah foto baru, tapi **tidak bisa** mengedit atau menghapus foto orang lain lewat aplikasi ini.
- Kalau nanti butuh moderasi (hapus foto yang gak pantas), lakukan lewat Supabase Dashboard langsung (Table Editor untuk hapus baris, Storage untuk hapus file), atau bilang ke gua nanti gua bikinin halaman admin sederhana dengan password.
