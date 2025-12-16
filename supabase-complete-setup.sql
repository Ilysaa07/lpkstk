-- =====================================================
-- COMPLETE DATABASE SETUP SCRIPT
-- Jalankan script ini 1x saja di Supabase SQL Editor
-- =====================================================

-- 1. Create signers table (simplified version - no longer used in form but kept for compatibility)
CREATE TABLE IF NOT EXISTS public.signers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_lengkap TEXT NOT NULL,
  no_kegiatan TEXT,
  status TEXT DEFAULT 'aktif',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create certificates table with all needed fields
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  no_sertifikat TEXT NOT NULL UNIQUE,
  nama_peserta TEXT NOT NULL,
  nama_kegiatan TEXT NOT NULL,
  tanggal_ditetapkan DATE,
  pdf_url TEXT DEFAULT '',
  signer_id UUID REFERENCES public.signers(id),
  status TEXT DEFAULT 'aktif',
  competency_units JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_certificates_no_sertifikat ON public.certificates(no_sertifikat);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON public.certificates(status);
CREATE INDEX IF NOT EXISTS idx_signers_status ON public.signers(status);
CREATE INDEX IF NOT EXISTS idx_certificates_competency_units ON public.certificates USING GIN (competency_units);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.signers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies for signers (allow public to read active signers)
CREATE POLICY "Allow public read access to active signers"
ON public.signers FOR SELECT
TO public
USING (status = 'aktif');

CREATE POLICY "Allow authenticated users full access to signers"
ON public.signers FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Create RLS Policies for certificates (allow public to read active certificates)
CREATE POLICY "Allow public read access to active certificates"
ON public.certificates FOR SELECT
TO public
USING (status = 'aktif');

CREATE POLICY "Allow authenticated users full access to certificates"
ON public.certificates FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Create Storage bucket 'certificates' (manual via Supabase dashboard)
-- 2. Set bucket to public
-- 3. Add storage policies for public read access
-- =====================================================
