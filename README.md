# MediaKita — Website Media Berita (Headless)

Portal berita sederhana dengan arsitektur **headless-lite** (satu repo Next.js 16, frontend + API layer terpisah secara arsitektur), mengikuti PRD `PRD.docx`. Membaca referensi tampilan Tempo.co: hero 2/3 + 1/3, berita terpopuler, section berita per kategori, halaman baca berita dengan sidebar, sampai panel admin CRUD.

## Tech Stack

| Layer       | Teknologi                                     |
| ----------- | --------------------------------------------- |
| Frontend    | Next.js 16 (App Router) + React 19 + Tailwind CSS v4 |
| Backend/API | Next.js Route Handlers (`/api/*`)             |
| Database    | PostgreSQL via Prisma (lokal: SQLite untuk zero-setup) |
| Auth        | JWT manual (httpOnly cookie, bcryptjs)        |
| Upload      | `/api/upload` → disimpan di `public/uploads` (lokal) |

## Menjalankan

```bash
npm install
npm run db:migrate   # buat skema DB (SQLite di prisma/dev.db)
npm run db:seed      # isi data contoh (21 berita, 6 kategori, 4 user)
npm run dev          # buka http://localhost:3000
```

Script lain: `npm run build` (produksi), `npm run lint`, `npm run db:push`.

## Akun Demo

| Role   | Email               | Password  |
| ------ | ------------------- | --------- |
| Admin  | admin@mediakita.id  | admin123  |
| Penulis| andi@mediakita.id   | andi123   |
| Penulis| rani@mediakita.id   | rani123   |
| Reader | reader@mediakita.id | reader123 |

Admin login: `http://localhost:3000/admin/login`

## Struktur Halaman

```
User Side:
├── /                          Landing page (hero + terbaru + populer + per kategori)
├── /kategori/[slug]           Daftar berita per kategori (+ pagination)
├── /berita/[slug]             Detail artikel (isi, penulis, terkait, sidebar, CTA)
├── /search                    Pencarian judul berita (+ sort terbaru/terpopuler)
├── /login | /register | /reset-password
└── /...*                      Halaman 404

Admin Side:
├── /admin/login
├── /admin/berita              Daftar berita (filter status, edit, sembunyikan, hapus)
├── /admin/berita/tambah
└── /admin/berita/edit/[slug]
```

## API (headless)

Semua terpapar di `app/api/*` (Route Handlers):

- `GET /api/categories` — daftar kategori + jumlah berita
- `GET /api/articles` — list berita (query: `category`, `featured`, `popular`, `q`, `page`, `limit`, `all`+`status` untuk admin)
- `GET|POST|PUT|PATCH|DELETE /api/articles/[slug]` — detail & CRUD (POST/.../DELETE butuh role admin)
- `POST /api/auth/register|login|logout` , `GET /api/auth/me`, `POST /api/auth/reset-password`
- `POST /api/newsletter` — simpan email subscriber (dummy)
- `POST /api/upload` — upload gambar (admin)

Contoh penggunaan API dari luar:

```bash
curl http://localhost:3000/api/articles?category=teknologi
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" -d '{"email":"saya@email.com"}'
```

## Catatan Deployment (Vercel + Supabase/Neon)

1. Ganti provider di `prisma/schema.prisma` menjadi `postgresql` dan set `DATABASE_URL` di dashboard hosting.
2. Set `JWT_SECRET` (jangan commit `.env`).
3. Di Vercel: import repo → set environment variables → auto-deploy.
4. Upload gambar: untuk production bisa diganti Cloudinary (free tier) atau Supabase Storage; kode local disimpan di `public/uploads` (jangan di-commit, sudah di-`.gitignore`).

Frontend & API bisa di-deploy terpisah karena frontend mengonsumsi `/api/*` (ganti `NEXT_PUBLIC_APP_URL` untuk menunjuk backend lain).