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
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-8 py-8">
            <div className="flex items-center justify-center space-x-3">
              <img 
                src="/logo.svg" 
                alt="LPK Logo" 
                className="w-14 h-14"
                style={{filter: 'brightness(0) saturate(100%) invert(37%) sepia(93%) saturate(500%) hue-rotate(150deg) brightness(91%) contrast(101%)'}}
              />
              <h1 className="text-xl font-bold text-teal-700 uppercase tracking-wide">
                LPK Sertifikasi Tenaga Kerja
              </h1>
            </div>
          </div>
        </div>

        {/* Certificate Content */}
        <div className="max-w-5xl mx-auto px-8 py-12">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-teal-700 uppercase tracking-wide mb-3">
              Training
            </h2>
            <h2 className="text-5xl font-bold text-teal-700 uppercase tracking-wide mb-4">
              Certificate
            </h2>
            <p className="text-teal-600 font-semibold tracking-wider">
              {certificate.no_sertifikat}
            </p>
          </div>

          {/* Award Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-10 mb-8">
            <p className="text-gray-600 text-center mb-6 italic">Diberikan kepada</p>
            
            <h3 className="text-4xl font-bold text-teal-700 text-center mb-8 pb-4 border-b-2 border-teal-700">
              {certificate.nama_peserta}
            </h3>

            <p className="text-gray-700 text-center leading-relaxed mb-6">
              Atas partisipasinya sebagai:
            </p>

            <p className="text-gray-800 text-center font-medium leading-relaxed px-8">
              {certificate.nama_kegiatan}
            </p>

            <div className="mt-8 text-center">
              <p className="text-gray-600 text-sm">
                {certificate.tanggal_ditetapkan ? formatDate(certificate.tanggal_ditetapkan) : '-'}
              </p>
            </div>
          </div>

          {/* Competency Units Table */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden mb-8">
            <div className="bg-teal-700 px-8 py-4">
              <h4 className="text-xl font-bold text-white text-center">LIST UNIT KOMPETENSI</h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-teal-50 border-b-2 border-teal-600">
                    <th className="px-4 py-3 text-center text-sm font-bold text-teal-800 border-r border-teal-200" style={{width: '60px'}}>
                      No.
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-bold text-teal-800 border-r border-teal-200" style={{width: '200px'}}>
                      Kode Unit<br/>
                      <span className="text-xs font-normal text-gray-600">(Unit Code)</span>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-bold text-teal-800">
                      Judul Unit<br/>
                      <span className="text-xs font-normal text-gray-600">(Unit Title)</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competencyUnits.map((unit, index) => (
                    <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-4 py-3 text-center font-semibold text-gray-700 border-r border-gray-200">
                        {unit.no}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-sm text-teal-700 border-r border-gray-200">
                        {unit.kode_unit}
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {unit.judul_unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Validation Footer */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h5 className="text-lg font-bold text-teal-700">Sertifikat Terverifikasi</h5>
            </div>
            <p className="text-gray-600 text-center text-sm leading-relaxed">
              Sertifikat ini telah diverifikasi dan terdaftar secara resmi pada sistem<br/>
              Lembaga Pelatihan Kerja Sertifikasi Tenaga Kerja
            </p>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Diverifikasi pada: {new Date().toLocaleDateString('id-ID')} • {new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})} WIB
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-teal-700 text-white py-6 mt-12">
          <div className="max-w-5xl mx-auto px-8 text-center">
            <p className="text-sm">© 2024 LPK Sertifikasi Tenaga Kerja</p>
            <p className="text-xs text-teal-200 mt-1">Sistem Validasi Sertifikat Digital</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InvalidCertificate({ message = 'Sertifikat tidak valid atau tidak ditemukan' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        <div className="bg-red-600 px-8 py-4">
          <h3 className="text-xl font-bold text-white text-center">Validasi Gagal</h3>
        </div>
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-4">{message}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            Sertifikat tidak dapat diverifikasi. Silakan hubungi lembaga penerbit untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
    </div>
  )
}
