import Link from 'next/link'

export default function HomePage() {
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
          </div>
        </div>
      </nav>

      {/* Hero Section - Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center mb-8">
            <img 
              src="/logo.svg" 
              alt="LPK Logo" 
              className="w-32 h-32 sm:w-40 sm:h-40"
            />
          </div>
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Sistem Validasi Sertifikat
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Lembaga Sertifikasi & Validasi Tenaga Kerja dengan Dual QR Code Validation
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 mb-4 shadow-sm">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-slate-700 text-sm font-medium">Sistem Terenkripsi & Aman</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2025 Lembaga Sertifikasi & Validasi Tenaga Kerja. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
