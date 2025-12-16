# 🚀 Quick Setup Guide

Panduan cepat untuk menjalankan sistem Dual QR Validation.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Setup Supabase

### 2.1 Create Supabase Project
1. Kunjungi [supabase.com](https://supabase.com)
2. Sign up / Login
3. Klik "New Project"
4. Isi:
   - Name: `certificate-validation`
   - Database Password: (simpan password ini!)
   - Region: pilih yang terdekat
5. Tunggu ~2 menit hingga project ready

### 2.2 Run Database Migration
1. Di Supabase Dashboard, klik **SQL Editor** (sidebar kiri)
2. Klik "New Query"
3. Copy SEMUA isi file `supabase-schema.sql` dari project
4. Paste ke SQL Editor
5. Klik "Run" atau tekan `Ctrl+Enter`
6. Pastikan muncul "Success. No rows returned"

### 2.3 Create Storage Bucket
1. Klik **Storage** di sidebar
2. Klik "Create a new bucket"
3. Bucket name: `certificates`
4. Public bucket: **✅ CENTANG INI** (penting!)
5. Klik "Create bucket"

### 2.4 Setup Storage Policies
1. Klik bucket `certificates` yang baru dibuat
2. Klik tab "Policies"
3. Klik "New Policy"
4. Pilih template "Allow public read access"
5. Klik "Review" lalu "Save Policy"

## Step 3: Get Supabase Credentials

1. Klik **⚙️ Settings** di sidebar (paling bawah)
2. Klik **API**
3. Di bagian "Project URL":
   - Copy URL → simpan sementara
4. Di bagian "Project API keys":
   - Cari yang bertuliskan `anon` `public`
   - Klik "Copy" → simpan sementara

## Step 4: Create Environment File

1. Di root folder project, buat file baru: `.env.local`
2. Isi dengan:

```env
NEXT_PUBLIC_SUPABASE_URL=paste_url_dari_step_3
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_anon_key_dari_step_3
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Contoh:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Save file

## Step 5: Create Admin User

1. Di Supabase Dashboard, klik **🔒 Authentication** (sidebar)
2. Klik **Users**
3. Klik "Add User" → "Create new user"
4. Isi:
   - Email: `admin@lpstk.com` (atau email pilihan Anda)
   - Password: `Admin123!` (atau password pilihan Anda)
   - Auto Confirm User: **✅ CENTANG INI**
5. Klik "Create User"
6. **PENTING:** Simpan email & password ini untuk login!

## Step 6: Run Application

```bash
npm run dev
```

Terminal akan menampilkan:
```
✓ Ready in 2.3s
○ Local:   http://localhost:3000
```

## Step 7: Login & Test

1. Buka browser: [http://localhost:3000](http://localhost:3000)
2. Klik "Admin Dashboard" atau buka [http://localhost:3000/login](http://localhost:3000/login)
3. Login dengan:
   - Email: yang dibuat di Step 5
   - Password: yang dibuat di Step 5
4. Setelah login, Anda akan masuk ke Admin Dashboard

## ✅ Checklist Setup Sukses

- [ ] Dependencies ter-install (`npm install` sukses)
- [ ] Supabase project dibuat
- [ ] Database migration dijalankan (SQL schema)
- [ ] Storage bucket `certificates` dibuat & public
- [ ] File `.env.local` dibuat dengan credentials yang benar
- [ ] Admin user dibuat di Supabase Auth
- [ ] Dev server berjalan (`npm run dev`)
- [ ] Bisa login ke admin dashboard

## 🎯 Testing Flow

### Test 1: Tambah Penandatangan
1. Di admin dashboard, klik tab "Penandatangan"
2. Klik "Tambah Penandatangan"
3. Isi form:
   - Nama: `Dr. Ahmad Fauzi, M.Si`
   - Jabatan: `Kepala Lembaga`
   - Lembaga: `Lembaga Sertifikasi Tenaga Kerja`
4. Klik "Simpan"
5. Lihat card penandatangan muncul
6. Klik "📱 Lihat QR" → QR code muncul
7. Screenshot QR code untuk test nanti

### Test 2: Tambah Sertifikat
1. Klik tab "Sertifikat"
2. Klik "Tambah Sertifikat"
3. Isi form:
   - No. Sertifikat: `CERT-2024-001`
   - Nama Peserta: `John Doe`
   - Nama Kegiatan: `Pelatihan Web Development 2024`
   - Tempat: `Jakarta`
   - Tanggal: pilih tanggal hari ini
   - Penandatangan: pilih yang tadi dibuat
4. Upload PDF (buat PDF dummy dulu atau pakai PDF apapun)
5. Klik "Simpan & Generate QR"
6. Lihat sertifikat muncul di tabel
7. Klik "📱" di kolom Aksi
8. Modal muncul dengan 2 QR code:
   - QR Sertifikat
   - QR Tanda Tangan
9. Download kedua QR code

### Test 3: Validasi QR Code
1. Scan QR Sertifikat dengan smartphone ATAU
2. Klik kanan QR code → "Open image in new tab"
3. Copy URL dari QR code
4. Paste di browser
5. Halaman validasi muncul dengan:
   - ✅ Badge hijau "SERTIFIKAT TERVALIDASI"
   - Detail sertifikat lengkap
   - Tombol download PDF

6. Ulangi untuk QR Tanda Tangan:
7. Halaman validasi tanda tangan muncul dengan:
   - ✅ Badge hijau "TANDA TANGAN TERVALIDASI"
   - Detail penandatangan
   - Pernyataan resmi

## 🐛 Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL is required"
- File `.env.local` belum dibuat atau salah nama
- Pastikan file ada di root project (sejajar dengan `package.json`)
- Restart dev server setelah buat `.env.local`

### Error saat upload PDF: "Access denied"
- Storage bucket belum dibuat
- Bucket tidak di-set sebagai public
- Storage policies belum ditambahkan

### Login gagal: "Invalid login credentials"
- Email/password salah
- User belum di-confirm di Supabase
- Cek di Supabase Dashboard → Authentication → Users

### QR Code tidak keluar
- Cek browser console (F12) untuk error
- Pastikan library `qrcode` ter-install
- Pastikan `NEXT_PUBLIC_APP_URL` ada di `.env.local`

## 📞 Need Help?

Jika mengalami masalah:
1. Check console browser (F12 → Console tab)
2. Check terminal untuk error messages
3. Pastikan semua step di atas sudah diikuti
4. Verifikasi file `.env.local` sudah benar

## 🎉 Success!

Jika semua test berhasil, sistem siap digunakan!

Next steps:
- Customize branding/logo
- Add more signers
- Start creating certificates
- Deploy to production (lihat README.md)
