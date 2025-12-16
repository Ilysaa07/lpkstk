import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LPK Sertifikasi Tenaga Kerja",
  description: "Lembaga Pelatihan Kerja - Sertifikasi Tenaga Kerja. Validasi dan verifikasi sertifikat resmi.",
  openGraph: {
    title: "LPK Sertifikasi Tenaga Kerja",
    description: "Lembaga Pelatihan Kerja - Sertifikasi Tenaga Kerja. Validasi dan verifikasi sertifikat resmi.",
    images: ['/logo.svg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "LPK Sertifikasi Tenaga Kerja",
    description: "Lembaga Pelatihan Kerja - Sertifikasi Tenaga Kerja. Validasi dan verifikasi sertifikat resmi.",
    images: ['/logo.svg'],
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
