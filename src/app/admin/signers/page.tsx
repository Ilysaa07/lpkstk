'use client'

import { useState, useEffect } from 'react'
import { getSigners, createSigner, updateSigner } from '@/lib/actions/supabase-actions'
import { generateSignatureQR } from '@/lib/utils/qr-generator'

interface Signer {
  id: string
  nama_lengkap: string
  no_kegiatan: string
  status: string
  created_at: string
}

export default function SignersPage() {
  const [signers, setSigners] = useState<Signer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    no_kegiatan: '',
  })
  const [selectedSigner, setSelectedSigner] = useState<Signer | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadSigners()
  }, [])

  const loadSigners = async () => {
    try {
      const data = await getSigners()
      setSigners(data)
    } catch (error) {
      console.error('Error loading signers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await createSigner(formData)
      setFormData({ nama_lengkap: '', no_kegiatan: '' })
      setShowForm(false)
      await loadSigners()
    } catch (error) {
      console.error('Error creating signer:', error)
      alert('Gagal membuat penandatangan')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusToggle = async (signer: Signer) => {
    try {
      const newStatus = signer.status === 'aktif' ? 'nonaktif' : 'aktif'
      await updateSigner(signer.id, { status: newStatus })
      await loadSigners()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const showQR = async (signer: Signer) => {
    try {
      const qr = await generateSignatureQR(signer.id)
      setQrCode(qr)
      setSelectedSigner(signer)
    } catch (error) {
      console.error('Error generating QR:', error)
    }
  }

  const downloadQR = () => {
    if (!qrCode || !selectedSigner) return
    
    const link = document.createElement('a')
    link.download = `qr-signature-${selectedSigner.nama_lengkap}.png`
    link.href = qrCode
    link.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manajemen Penandatangan</h1>
          <p className="text-slate-600 mt-1">Kelola data penandatangan sertifikat</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          {showForm ? '✕ Tutup' : '+ Tambah Penandatangan'}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Tambah Penandatangan Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                value={formData.nama_lengkap}
                onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-white"
                placeholder="Dr. John Doe, M.Si"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                No. Kegiatan *
              </label>
              <input
                type="text"
                value={formData.no_kegiatan}
                onChange={(e) => setFormData({ ...formData, no_kegiatan: e.target.value })}
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 bg-white"
                placeholder="KEGIATAN-2024-001"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition-all disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Signers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {signers.map((signer) => (
          <div
            key={signer.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">{signer.nama_lengkap}</h3>
                <p className="text-sm text-slate-600 mt-1">No. Kegiatan: {signer.no_kegiatan}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  signer.status === 'aktif'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {signer.status.toUpperCase()}
              </span>
            </div>

            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => showQR(signer)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg text-sm font-medium transition-all"
              >
                📱 Lihat QR
              </button>
              <button
                onClick={() => handleStatusToggle(signer)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  signer.status === 'aktif'
                    ? 'bg-red-50 hover:bg-red-100 text-red-600'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                }`}
              >
                {signer.status === 'aktif' ? '🚫 Nonaktifkan' : '✓ Aktifkan'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {signers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">✍️</div>
          <h3 className="text-xl font-semibold text-slate-700">Belum ada penandatangan</h3>
          <p className="text-slate-500 mt-2">Klik tombol "Tambah Penandatangan" untuk memulai</p>
        </div>
      )}

      {/* QR Code Modal */}
      {qrCode && selectedSigner && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => { setQrCode(null); setSelectedSigner(null); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-2">QR Code Tanda Tangan</h3>
            <p className="text-slate-600 mb-2">{selectedSigner.nama_lengkap}</p>
            <p className="text-sm text-slate-500 mb-6">No. Kegiatan: {selectedSigner.no_kegiatan}</p>
            
            <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 p-6 rounded-xl mb-6">
              <img src={qrCode} alt="QR Code" className="w-full h-auto" />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>URL Validasi:</strong><br />
                {process.env.NEXT_PUBLIC_APP_URL}/verifikasi/tanda-tangan/{selectedSigner.id}
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={downloadQR}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all"
              >
                💾 Download QR
              </button>
              <button
                onClick={() => { setQrCode(null); setSelectedSigner(null); }}
                className="px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
