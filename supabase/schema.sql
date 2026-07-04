-- ============================================================
-- Quatrolympic 19 — Moments page
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabel utama untuk menyimpan data momen
create table if not exists public.moments (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  image_url text not null,
  day text not null check (day in ('Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Closing')),
  caption text not null default '',
  created_at timestamptz not null default now()
);

-- Index biar filter by day & sort terbaru cepat
create index if not exists moments_day_idx on public.moments (day);
create index if not exists moments_created_at_idx on public.moments (created_at desc);

-- 2. Aktifkan Row Level Security
alter table public.moments enable row level security;

-- 3. Policy: siapa saja (tanpa login) boleh BACA semua momen
create policy "Public can read moments"
  on public.moments
  for select
  to anon
  using (true);

-- 4. Policy: siapa saja (tanpa login) boleh UPLOAD momen baru
--    (insert-only — tidak ada policy update/delete untuk anon,
--    jadi orang tidak bisa mengedit/menghapus punya orang lain)
create policy "Public can insert moments"
  on public.moments
  for insert
  to anon
  with check (
    char_length(username) between 1 and 60
    and char_length(caption) <= 300
  );

-- 5. Aktifkan Realtime supaya foto baru langsung muncul
--    di layar semua orang yang lagi buka halaman (tanpa refresh)
alter publication supabase_realtime add table public.moments;

-- ============================================================
-- 6. Storage bucket untuk foto
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'moments',
  'moments',
  true, -- public bucket, biar foto bisa langsung ditampilkan pakai URL
  10485760, -- batas 10 MB per file (aman di bawah limit 50MB free tier Supabase)
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 7. Policy storage: siapa saja boleh upload ke bucket "moments"
create policy "Public can upload to moments bucket"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'moments');

-- 8. Policy storage: siapa saja boleh melihat/mengunduh file di bucket "moments"
create policy "Public can view moments bucket"
  on storage.objects
  for select
  to anon
  using (bucket_id = 'moments');
