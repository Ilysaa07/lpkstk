-- =====================================================
-- MIGRATION: Update Signers Table Structure
-- Change from jabatan/lembaga to no_kegiatan
-- =====================================================

-- Rename nama to nama_lengkap
ALTER TABLE public.signers 
RENAME COLUMN nama TO nama_lengkap;

-- Drop old columns
ALTER TABLE public.signers 
DROP COLUMN IF EXISTS jabatan,
DROP COLUMN IF EXISTS lembaga;

-- Add new column
ALTER TABLE public.signers 
ADD COLUMN IF NOT EXISTS no_kegiatan TEXT;

-- Update existing data (optional - set default value if needed)
-- UPDATE public.signers SET no_kegiatan = 'KEGIATAN-001' WHERE no_kegiatan IS NULL;
