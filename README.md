# Dual QR Validation Certificate System 🔐

Sistem manajemen sertifikasi tenaga kerja dengan **dual QR code validation** untuk validasi sertifikat dan tanda tangan pejabat berwenang.

## 🎯 Fitur Utama

### Dual QR Code System
1. **QR Code Sertifikat** - Validasi keaslian sertifikat & akses PDF
2. **QR Code Tanda Tangan** - Validasi kewenangan penandatangan

### Admin Dashboard
- ✅ Manajemen data penandatangan (CRUD)
- ✅ Manajemen sertifikat dengan upload PDF
- ✅ Generate QR code otomatis (certificate + signature)
- ✅ Status management (aktif/nonaktif)
- ✅ Proteksi dengan authentication

### Public Validation Pages
- ✅ Halaman validasi sertifikat (`/verify/certificate/{id}`)
- ✅ Halaman validasi tanda tangan (`/verify/signature/{id}`)
- ✅ Trust-based UI dengan security indicators
- ✅ Real-time validation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Next.js Server Actions
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage (PDF files)
- **QR Generator**: qrcode library
- **Styling**: Tailwind CSS

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Supabase account (gratis di [supabase.com](https://supabase.com))

## 🚀 Setup Instructions

### 1. Clone & Install Dependencies

```bash
cd lpstk
npm install
```

### 2. Setup Supabase

1. Buat project baru di [Supabase Dashboard](https://app.supabase.com)
2. Jalankan SQL migration di **SQL Editor**:
   - Copy semua isi file `supabase-schema.sql`
   - Paste & jalankan di SQL Editor
3. Buat Storage Bucket:
   - Buka **Storage** di sidebar
   - Klik "New Bucket"
   - Name: `certificates`
   - Public: ✅ Yes
   - Allowed MIME types: `application/pdf`
   - File size limit: 10MB

4. Setup Storage Policies:
   - Klik bucket `certificates` → Policies
   - Add policies berikut:
   
   **Public Read Access**:
   ```sql
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'certificates');
   ```
   
   **Authenticated Write Access**:
   ```sql
   CREATE POLICY "Authenticated write access"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'certificates');
   ```

### 3. Environment Variables

Buat file `.env.local` di root project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Cara mendapatkan credentials:**
- Buka Supabase Dashboard → Project Settings → API
- Copy `URL` → paste ke `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public` key → paste ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Create Admin User

Di Supabase Dashboard:
1. Buka **Authentication** → Users
2. Klik "Add User" → "Create User"
3. Email: `admin@example.com`
4. Password: `your-secure-password`
5. Auto Confirm User: ✅ Yes

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### Admin Login
1. Buka `/login`
2. Login dengan credentials admin yang dibuat di Supabase
3. Akan redirect ke `/admin/certificates`

### Mengelola Penandatangan
1. Buka **Penandatangan** di admin dashboard
2. Klik "Tambah Penandatangan"
3. Isi form:
   - Nama Lengkap
   - Jabatan  
   - Lembaga
4. Sistem otomatis generate QR code untuk tanda tangan
5. Download QR code untuk dicetak di area tanda tangan sertifikat

### Mengelola Sertifikat
1. Buka **Sertifikat** di admin dashboard
2. Klik "Tambah Sertifikat"
3. Isi form:
   - No. Sertifikat (harus unik)
   - Nama Peserta
   - Nama Kegiatan
   - Tempat Pelaksanaan
   - Tanggal
   - Pilih Penandatangan
   - Upload PDF sertifikat (max 10MB)
4. Sistem generate 2 QR code:
   - QR Sertifikat → untuk validasi certificate
   - QR Tanda Tangan → untuk validasi signature
5. Download kedua QR code dan cetak di sertifikat

### Validasi Publik
1. Scan QR code dengan smartphone
2. Browser otomatis buka halaman validasi:
   - `/verify/certificate/{id}` → Menampilkan detail sertifikat + PDF
   - `/verify/signature/{id}` → Menampilkan detail penandatangan
3. Jika valid: Badge hijau ✅ + detail lengkap
4. Jika invalid: Badge merah ❌ + pesan error

## 🗂️ Project Structure

```
lpstk/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── certificates/    # Manajemen sertifikat
│   │   │   ├── signers/         # Manajemen penandatangan
│   │   │   └── layout.tsx       # Admin layout + nav
│   │   ├── login/               # Login page
│   │   ├── verify/
│   │   │   ├── certificate/[id] # Validasi sertifikat
│   │   │   └── signature/[id]   # Validasi tanda tangan
│   │   └── page.js              # Landing page
│   ├── lib/
│   │   ├── actions/
│   │   │   └── supabase-actions.ts  # Server Actions
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser client
│   │   │   └── server.ts        # Server client
│   │   └── utils/
│   │       └── qr-generator.ts  # QR utilities
│   └── middleware.ts            # Auth middleware
├── supabase-schema.sql          # Database schema
└── package.json
```

## 🔒 Security Features

- ✅ Row Level Security (RLS) di database
- ✅ Middleware protection untuk admin routes
- ✅ Supabase Authentication
- ✅ Unique certificate numbers
- ✅ Status-based validation (hanya tampilkan yang aktif)
- ✅ Secure PDF storage dengan public read access

## 🚢 Deployment (Vercel)

1. Push code ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Add Environment Variables di Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` → ganti dengan production URL
4. Deploy!

## 🐛 Troubleshooting

### "Could not find Supabase credentials"
- Pastikan file `.env.local` ada dan berisi credentials yang benar
- Restart dev server setelah update env variables

### "Access denied" saat upload PDF
- Cek apakah storage bucket `certificates` sudah dibuat
- Pastikan storage policies sudah dijalankan
- Cek di Supabase Dashboard → Storage → Policies

### "Invalid login credentials"
- Pastikan user sudah dibuat di Supabase Auth
- Check email & password yang digunakan
- Pastikan user di-confirm (auto confirm saat create)

### QR Code tidak generate
- Check browser console untuk error
- Pastikan `NEXT_PUBLIC_APP_URL` sudah di-set
- Cek koneksi internet

## 📄 License

MIT License - Lembaga Sertifikasi & Validasi Tenaga Kerja

## 👨‍💻 Developer Notes

- Built with ❤️ using Next.js 14 & Supabase
- QR codes generated with high error correction (Level H)
- PDF storage uses Supabase Storage buckets
- Authentication uses Supabase Auth with cookie-based sessions
- All validation pages are SSR for better SEO & performance
