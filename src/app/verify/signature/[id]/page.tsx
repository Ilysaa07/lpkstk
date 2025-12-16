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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Validation Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mb-4 shadow-2xl animate-pulse">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            ✅ TANDA TANGAN TERVALIDASI
          </h1>
          <p className="text-blue-300 text-lg">Authorized Signature Verified</p>
        </div>

        {/* Signer Details Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
              <span className="text-4xl">✍️</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Signer Name */}
            <div className="text-center pb-4 border-b border-white/20">
              <p className="text-xs text-slate-300 mb-2">NAMA PENANDATANGAN</p>
              <p className="text-2xl font-bold text-white">{signer.nama_lengkap}</p>
            </div>

            {/* Activity Number */}
            <div className="text-center">
              <p className="text-xs text-slate-300 mb-2">NO. KEGIATAN</p>
              <p className="text-xl font-semibold text-white">{signer.no_kegiatan}</p>
            </div>
          </div>
        </div>

        {/* Official Statement */}
        <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur rounded-xl p-6 border-2 border-blue-400/50 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2">Pernyataan Resmi</h3>
              <p className="text-slate-200 text-sm leading-relaxed">
                "Tanda tangan ini adalah <span className="font-bold text-blue-300">sah dan terdaftar secara resmi</span> pada sistem Lembaga Sertifikasi. 
                Penandatangan yang bersangkutan memiliki kewenangan untuk menandatangani dokumen sertifikasi."
              </p>
            </div>
          </div>
        </div>

        {/* Validation Info */}
        <div className="bg-white/5 backdrop-blur rounded-xl p-6 border border-white/10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-2">Informasi Validasi</h3>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>• ID Validasi: <span className="font-mono text-xs">{signer.id}</span></li>
                <li>• Waktu Validasi: <span className="font-mono text-xs">{new Date().toLocaleString('id-ID')}</span></li>
                <li>• Status: <span className="text-blue-400 font-semibold">AKTIF & BERWENANG</span></li>
                <li>• Terdaftar Sejak: <span className="font-mono text-xs">{new Date(signer.created_at).toLocaleDateString('id-ID')}</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-slate-300 text-sm">Dilindungi dengan sistem keamanan tingkat tinggi</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function InvalidSignature({ message = 'Tanda tangan tidak valid atau tidak ditemukan' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6 border-4 border-red-500">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">❌ Validasi Gagal</h1>
        <p className="text-red-300 text-lg mb-8">{message}</p>
        <div className="bg-white/10 backdrop-blur rounded-xl p-6 border border-white/20">
          <p className="text-slate-300 text-sm">
            Tanda tangan ini mungkin sudah dicabut kewenangannya, tidak aktif, atau tidak terdaftar dalam sistem kami. 
            Silakan hubungi lembaga untuk verifikasi lebih lanjut.
          </p>
        </div>
      </div>
    </div>
  )
}
