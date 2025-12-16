-- =====================================================
-- DUAL QR VALIDATION CERTIFICATE SYSTEM
-- Database Schema for Supabase PostgreSQL
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: signers
-- Stores authorized signers/officials
-- =====================================================
CREATE TABLE IF NOT EXISTS public.signers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    jabatan TEXT NOT NULL,
    lembaga TEXT NOT NULL,
    status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- TABLE: certificates
-- Stores certificate records with PDF and signer
-- =====================================================
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    no_sertifikat TEXT NOT NULL UNIQUE,
    nama_peserta TEXT NOT NULL,
    nama_kegiatan TEXT NOT NULL,
    tempat TEXT NOT NULL,
    tanggal DATE NOT NULL,
    pdf_url TEXT NOT NULL,
    signer_id UUID REFERENCES public.signers(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_certificates_no_sertifikat ON public.certificates(no_sertifikat);
CREATE INDEX IF NOT EXISTS idx_certificates_signer_id ON public.certificates(signer_id);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON public.certificates(status);
CREATE INDEX IF NOT EXISTS idx_signers_status ON public.signers(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on both tables
ALTER TABLE public.signers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Signers Policies
-- Public: can view only active signers
CREATE POLICY "Public can view active signers"
    ON public.signers
    FOR SELECT
    USING (status = 'aktif');

-- Authenticated: full access to all signers
CREATE POLICY "Authenticated users have full access to signers"
    ON public.signers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Certificates Policies
-- Public: can view only active certificates
CREATE POLICY "Public can view active certificates"
    ON public.certificates
    FOR SELECT
    USING (status = 'aktif');

-- Authenticated: full access to all certificates
CREATE POLICY "Authenticated users have full access to certificates"
    ON public.certificates
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- =====================================================
-- STORAGE BUCKET SETUP
-- Run this in Supabase Dashboard > Storage
-- =====================================================
-- Bucket name: 'certificates'
-- Public bucket: Yes
-- File size limit: 10MB
-- Allowed MIME types: application/pdf

-- Storage Policies (apply in Supabase Dashboard):
-- 1. Public read access:
--    Policy name: "Public read access"
--    Allowed operations: SELECT
--    Policy definition: true
--
-- 2. Authenticated write access:
--    Policy name: "Authenticated write access"
--    Allowed operations: INSERT
--    Policy definition: auth.role() = 'authenticated'
--
-- 3. Authenticated update/delete:
--    Policy name: "Authenticated full access"
--    Allowed operations: UPDATE, DELETE
--    Policy definition: auth.role() = 'authenticated'
