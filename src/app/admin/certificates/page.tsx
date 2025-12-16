'use client'

import { useState, useEffect } from 'react'
import { getCertificates, createCertificate, updateCertificate } from '@/lib/actions/supabase-actions'
import { generateCertificateQR } from '@/lib/utils/qr-generator'
import { DEFAULT_COMPETENCY_UNITS } from '@/lib/data/default-competency-units'

interface CompetencyUnit {
  no: number
  kode_unit: string
  judul_unit: string
}

interface Certificate {
  id: string
  no_sertifikat: string
  nama_peserta: string
  nama_kegiatan: string
  tanggal_ditetapkan?: string
  pdf_url: string
  status: string
  created_at: string
  competency_units?: CompetencyUnit[]
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    no_sertifikat: '',
    nama_peserta: '',
    nama_kegiatan: '',
    tanggal_ditetapkan: '',
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const certsData = await getCertificates()
      setCertificates(certsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await createCertificate({
        ...formData,
        pdf_url: '',
        signer_id: '',
        competency_units: DEFAULT_COMPETENCY_UNITS,
      })
      setFormData({
        no_sertifikat: '',
        nama_peserta: '',
        nama_kegiatan: '',
        tanggal_ditetapkan: '',
      })
      setShowForm(false)
      await loadData()
    } catch (error) {
      console.error('Error creating certificate:', error)
      alert('Gagal membuat sertifikat. Pastikan nomor sertifikat unik.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusToggle = async (cert: Certificate) => {
    try {
      const newStatus = cert.status === 'aktif' ? 'nonaktif' : 'aktif'
      await updateCertificate(cert.id, { status: newStatus })
      await loadData()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const showQR = async (cert: Certificate) => {
    try {
      const qr = await generateCertificateQR(cert.id)
      setQrCode(qr)
      setSelectedCert(cert)
    } catch (error) {
      console.error('Error generating QR:', error)
    }
  }

  const downloadQR = () => {
    if (!qrCode || !selectedCert) return
    
    const link = document.createElement('a')
    link.download = `qr-certificate-${selectedCert.no_sertifikat}.png`
    link.href = qrCode
    link.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#047fa7]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#047fa7] to-[#0694c4] rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Manajemen Sertifikat</h1>
            <p className="text-white/80 mt-1">Kelola sertifikat dan generate QR code validasi</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-white text-[#047fa7] font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {showForm ? '✕ Tutup' : '+ Tambah Sertifikat'}
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800">Tambah Sertifikat Baru</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  No. Sertifikat *
                </label>
                <input
                  type="text"
                  value={formData.no_sertifikat}
                  onChange={(e) => setFormData({ ...formData, no_sertifikat: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#047fa7] focus:border-transparent text-slate-900 bg-white"
                  placeholder="No. 219/lpk-stk/xii/2025"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nama Peserta *
                </label>
                <input
                  type="text"
                  value={formData.nama_peserta}
                  onChange={(e) => setFormData({ ...formData, nama_peserta: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#047fa7] focus:border-transparent text-slate-900 bg-white"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Kegiatan Sertifikasi *
              </label>
              <input
                type="text"
                value={formData.nama_kegiatan}
                onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#047fa7] focus:border-transparent text-slate-900 bg-white"
                placeholder="Pelatihan & Sertifikasi Tenaga Kerja 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tanggal Ditetapkan *
              </label>
              <input
                type="date"
                value={formData.tanggal_ditetapkan}
                onChange={(e) => setFormData({ ...formData, tanggal_ditetapkan: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#047fa7] focus:border-transparent text-slate-900 bg-white"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>ℹ️ Informasi:</strong> Unit kompetensi akan otomatis ditambahkan (12 unit standar).
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setFormData({
                    no_sertifikat: '',
                    nama_peserta: '',
                    nama_kegiatan: '',
                    tanggal_ditetapkan: '',
                  })
                }}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-gradient-to-r from-[#047fa7] to-[#0694c4] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Menyimpan...' : 'Simpan & Generate QR'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Certificates Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-700 to-slate-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">No. Sertifikat</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Peserta</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Kegiatan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal Ditetapkan</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-semibold text-slate-800">
                      {cert.no_sertifikat}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{cert.nama_peserta}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                    {cert.nama_kegiatan}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {cert.tanggal_ditetapkan ? new Date(cert.tanggal_ditetapkan).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cert.status === 'aktif'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {cert.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => showQR(cert)}
                        className="p-2 bg-[#047fa7] hover:bg-[#036589] text-white rounded-lg transition-all"
                        title="Lihat QR Code"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleStatusToggle(cert)}
                        className={`p-2 rounded-lg transition-all ${
                          cert.status === 'aktif'
                            ? 'bg-red-50 hover:bg-red-100 text-red-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                        }`}
                        title={cert.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {cert.status === 'aktif' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {certificates.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📜</div>
            <h3 className="text-xl font-semibold text-slate-700">Belum ada sertifikat</h3>
            <p className="text-slate-500 mt-2">Klik tombol "Tambah Sertifikat" untuk memulai</p>
          </div>
        )}
      </div>

      {/* QR Code Modal */}
      {qrCode && selectedCert && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => { setQrCode(null); setSelectedCert(null); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#047fa7] to-[#0694c4] px-6 py-4">
              <h3 className="text-2xl font-bold text-white">QR Code Sertifikat</h3>
              <p className="text-white/80 mt-1">
                No: <span className="font-mono font-bold">{selectedCert.no_sertifikat}</span>
              </p>
            </div>
            
            <div className="p-8">
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-xl mb-6 border-2 border-[#047fa7]/20">
                <img src={qrCode} alt="QR Code" className="w-full h-auto" />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>URL Validasi:</strong><br />
                  <span className="font-mono text-xs break-all">
                    {process.env.NEXT_PUBLIC_APP_URL}/verifikasi/sertifikat/{selectedCert.id}
                  </span>
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={downloadQR}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#047fa7] to-[#0694c4] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  💾 Download QR
                </button>
                <button
                  onClick={() => { setQrCode(null); setSelectedCert(null); }}
                  className="px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
