-- =====================================================
-- MIGRATION: Add Certificate Enhancement Fields
-- Run this AFTER the initial schema setup
-- =====================================================

-- Add new columns to certificates table
ALTER TABLE public.certificates 
ADD COLUMN IF NOT EXISTS tanggal_ditetapkan DATE,
ADD COLUMN IF NOT EXISTS tanggal_cetak DATE,
ADD COLUMN IF NOT EXISTS competency_units JSONB DEFAULT '[]'::jsonb;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_certificates_competency_units ON public.certificates USING GIN (competency_units);

-- Example of competency_units structure:
-- [
--   {
--     "no": 1,
--     "kode_unit": "F.42PPT01.001.1",
--     "judul_unit": "Menerapkan Ketentuan K3 dan Lingkungan (K3L) Pengeboran Air Tanah"
--   },
--   {
--     "no": 2,
--     "kode_unit": "F.42PPT01.002.1",
--     "judul_unit": "Melaksanakan Mobilisasi dan Demobilisasi Peralatan Pengeboran"
--   }
-- ]
