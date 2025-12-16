import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function SignatureVerifyPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch signer data
  const { data: signer, error } = await supabase
    .from('signers')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !signer) {
    return <InvalidSignature />
  }

  // Check if signer is active
  if (signer.status !== 'aktif') {
    return <InvalidSignature message="Tanda tangan tidak aktif atau telah dicabut" />
  }

  // Fetch certificate to get the date
  const { data: certificate } = await supabase
    .from('certificates')
    .select('tanggal_ditetapkan')
    .eq('signer_id', id)
    .single()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  // Use certificate date if available, otherwise fallback to signer created_at
  const displayDate = certificate?.tanggal_ditetapkan 
    ? formatDate(certificate.tanggal_ditetapkan)
    : formatDate(signer.created_at)

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Top Border */}
        <div className="border-t-4 border-teal-600 mb-8"></div>

        {/* Logo Section */}
        <div className="text-center mb-8">
          <img 
            src="/logo.svg" 
            alt="LPK Logo" 
            className="w-32 h-32 mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-gray-700 uppercase tracking-wide mb-2">
            Lembaga Pelatihan Kerja
          </h1>
          <h2 className="text-lg font-semibold text-gray-600 uppercase">
            Sertifikasi Tenaga Kerja
          </h2>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-bold text-gray-700 uppercase tracking-wide">
            Penandatanganan Pelatihan Pelaksana Pekerjaan Juru Bor Air Tanah
          </h3>
        </div>

        {/* Signer Information */}
        <div className="mb-8 space-y-4">
          <div className="flex">
            <div className="w-36 flex justify-between pr-2">
              <span className="font-semibold text-gray-700">Nama</span>
              <span className="font-semibold text-gray-700">:</span>
            </div>
            <span className="text-gray-700">{signer.nama_lengkap}</span>
          </div>
          <div className="flex">
            <div className="w-36 flex justify-between pr-2">
              <span className="font-semibold text-gray-700">No Sertifikat</span>
              <span className="font-semibold text-gray-700">:</span>
            </div>
            <span className="text-blue-600">{signer.no_kegiatan}</span>
          </div>
        </div>

        {/* Statement */}
        <div className="mb-8">
          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            Dokumen ini sah, dan telah disetujui (ditandatangani secara elektronik) oleh <strong>{signer.nama_lengkap}</strong> selaku 
            <strong> Ketua LPK</strong> pada tanggal <strong>{displayDate}</strong>, 
            dan tercatat dalam database.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center border-t border-gray-300 pt-6">
          <p className="text-xs text-gray-500">
            © 2025 <span className="text-blue-600">LPK Sertifikasi Tenaga Kerja</span>. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

function InvalidSignature({ message = 'Tanda tangan tidak valid atau tidak ditemukan' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-red-50 rounded-xl border-2 border-red-200 p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">Validasi Gagal</h3>
          <p className="text-gray-700 mb-4">{message}</p>
          <p className="text-sm text-gray-600">
            Tanda tangan ini mungkin sudah dicabut kewenangannya, tidak aktif, atau tidak terdaftar dalam sistem kami.
          </p>
        </div>
      </div>
    </div>
  )
}
