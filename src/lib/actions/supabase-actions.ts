'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// =====================================================
// SIGNER ACTIONS
// =====================================================

export async function getSigners() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('signers')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getActiveSigner() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('signers')
    .select('*')
    .eq('status', 'aktif')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function createSigner(formData: {
  nama_lengkap: string
  no_kegiatan: string
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('signers')
    .insert([formData])
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/admin/signers')
  return data
}

export async function updateSigner(id: string, formData: {
  nama_lengkap?: string
  no_kegiatan?: string
  status?: string
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('signers')
    .update(formData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/admin/signers')
  return data
}

// =====================================================
// CERTIFICATE ACTIONS
// =====================================================

export async function getCertificates() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('certificates')
    .select(`
      *,
      signer:signers(*)
    `)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export async function getCertificateById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('certificates')
    .select(`
      *,
      signer:signers(*)
    `)
    .eq('id', id)
    .single()
  
  if (error) throw error
  return data
}

export async function createCertificate(formData: {
  no_sertifikat: string
  nama_peserta: string
  nama_kegiatan: string
  tanggal_ditetapkan?: string
  pdf_url?: string
  signer_id?: string
  competency_units?: any[]
}) {
  const supabase = await createClient()
  
  // Clean up empty strings to null for PostgreSQL DATE fields
  const cleanedData = {
    ...formData,
    tanggal_ditetapkan: formData.tanggal_ditetapkan || null,
    signer_id: formData.signer_id || null,
    pdf_url: formData.pdf_url || '',
  }
  
  const { data, error } = await supabase
    .from('certificates')
    .insert([cleanedData])
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/admin/certificates')
  return data
}

export async function updateCertificate(id: string, formData: {
  no_sertifikat?: string
  nama_peserta?: string
  nama_kegiatan?: string
  tempat?: string
  tanggal?: string
  tanggal_ditetapkan?: string
  tanggal_cetak?: string
  pdf_url?: string
  signer_id?: string
  status?: string
  competency_units?: any[]
}) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('certificates')
    .update(formData)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  
  revalidatePath('/admin/certificates')
  return data
}

// =====================================================
// FILE UPLOAD ACTIONS
// =====================================================

export async function uploadPDF(file: File): Promise<string> {
  const supabase = await createClient()
  
  // Generate unique filename
  const timestamp = Date.now()
  const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  
  const { data, error } = await supabase.storage
    .from('certificates')
    .upload(filename, file, {
      contentType: 'application/pdf',
      upsert: false,
    })
  
  if (error) throw error
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('certificates')
    .getPublicUrl(data.path)
  
  return publicUrl
}
