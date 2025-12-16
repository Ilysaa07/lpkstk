import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DEFAULT_COMPETENCY_UNITS } from '@/lib/data/default-competency-units'

interface PageProps {
  params: Promise<{ id: string }>
}

interface CompetencyUnit {
  no: number
  kode_unit: string
  judul_unit: string
}

export default async function CertificateVerifyPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch certificate data
  const { data: certificate, error } = await supabase
    .from('certificates')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !certificate) {
    return <InvalidCertificate />
  }

  // Check if certificate is active
  if (certificate.status !== 'aktif') {
    return <InvalidCertificate message="Sertifikat tidak aktif atau telah dicabut" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // Use competency units from database or default
  const competencyUnits: CompetencyUnit[] = certificate.competency_units || DEFAULT_COMPETENCY_UNITS

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Trust Indicators Bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            <span className="font-medium">Terverifikasi Resmi</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
            </svg>
            <span className="font-medium">Koneksi Aman (SSL)</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
              <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
            </svg>
            <span className="font-medium">Database Real-Time</span>
          </div>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <img 
                src="/logo.svg" 
                alt="LPK Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10"
                style={{filter: 'brightness(0) saturate(100%) invert(37%) sepia(93%) saturate(500%) hue-rotate(150deg) brightness(91%) contrast(101%)'}}
              />
              <div>
                <h1 className="text-base sm:text-lg font-bold text-[#047fa7]">LPK Sertifikasi Tenaga Kerja</h1>
                <p className="text-[10px] sm:text-xs text-slate-500">Sistem Verifikasi Sertifikat Resmi</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-50 px-3 sm:px-4 py-2 rounded-lg border border-emerald-200">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-medium text-emerald-700">Verified</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Verification Status Banner */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-emerald-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Sertifikat Terverifikasi</h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1">Data sertifikat berikut telah divalidasi dalam sistem kami</p>
            </div>
            <div className="text-center sm:text-right">
              <p className="text-xs text-slate-500">Verification ID</p>
              <p className="text-xs sm:text-sm font-mono text-slate-700 mt-1 break-all">{id.substring(0, 12)}...</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Certificate Details Card */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="bg-[#00a26b] px-4 sm:px-6 py-4 rounded-t-xl">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Detail Sertifikat</h3>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Nomor Sertifikat</label>
                    <p className="mt-1 text-sm sm:text-base font-mono font-semibold text-slate-900 bg-slate-50 px-3 py-2 rounded border border-slate-200 break-all">
                      {certificate.no_sertifikat}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tanggal Ditetapkan</label>
                    <p className="mt-1 text-sm sm:text-base text-slate-700 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                      {certificate.tanggal_ditetapkan ? formatDate(certificate.tanggal_ditetapkan) : '-'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Nama Pemegang Sertifikat</label>
                  <p className="mt-1 text-lg sm:text-xl font-bold text-slate-900">{certificate.nama_peserta}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Program Sertifikasi</label>
                  <p className="mt-1 text-sm sm:text-base text-slate-700">{certificate.nama_kegiatan}</p>
                </div>
              </div>
            </div>

            {/* Competency Units Table */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="bg-[#00a26b] px-4 sm:px-6 py-4 rounded-t-xl">
                <h3 className="text-lg sm:text-xl font-semibold text-white">Unit Kompetensi</h3>
                <p className="text-xs sm:text-sm text-white/80 mt-1">Daftar kompetensi yang telah dikuasai</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b-2 border-slate-200">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-12 sm:w-16">No</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-32 sm:w-48">Kode Unit</th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Judul Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {competencyUnits.map((unit, index) => (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-500">{unit.no}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono text-slate-700">{unit.kode_unit}</td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-700">{unit.judul_unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Verification Info Card */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 sm:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <svg className="w-5 h-5 text-[#047fa7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="font-semibold text-slate-900">Informasi Verifikasi</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <div>
                    <p className="text-slate-500">Status</p>
                    <p className="font-medium text-emerald-600 mt-1">Aktif & Terverifikasi</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-4 h-4 text-slate-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                  <div>
                    <p className="text-slate-500">Waktu Verifikasi</p>
                    <p className="font-medium text-slate-700 mt-1">
                      {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                      <br className="sm:hidden"/>
                      <span className="sm:inline"> • </span>
                      {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-4 sm:p-6 text-white">
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <h4 className="font-semibold">Keamanan Terjamin</h4>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Data sertifikat dilindungi dengan enkripsi tingkat militer dan sistem keamanan berlapis. 
                Verifikasi real-time dari database resmi terenkripsi.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                  </svg>
                  <span>256-bit SSL Encryption</span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 p-4 sm:p-6">
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <h4 className="font-semibold text-blue-900">Validitas Resmi</h4>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Terdaftar resmi di database LPK</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Terverifikasi secara otomatis</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-0.5">✓</span>
                  <span>Dapat divalidasi kapan saja</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function InvalidCertificate({ message = 'Sertifikat tidak valid atau tidak ditemukan' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Verifikasi Gagal</h3>
            </div>
          </div>
          <div className="p-6">
            <p className="text-slate-700 mb-4">{message}</p>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="text-sm text-slate-600 leading-relaxed">
                Sertifikat tidak dapat diverifikasi. Silakan periksa kembali atau hubungi lembaga penerbit untuk informasi lebih lanjut.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
