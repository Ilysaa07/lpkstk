import QRCode from 'qrcode'

/**
 * Generate QR code as Data URL for certificate validation
 * @param certificateId - UUID of the certificate
 * @returns Promise<string> - Data URL of QR code image
 */
export async function generateCertificateQR(certificateId: string): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = `${appUrl}/verify/certificate/${certificateId}`
  
  return await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 2,
  })
}

/**
 * Generate QR code as Data URL for signature validation
 * @param signerId - UUID of the signer
 * @returns Promise<string> - Data URL of QR code image
 */
export async function generateSignatureQR(signerId: string): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const url = `${appUrl}/verify/signature/${signerId}`
  
  return await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 2,
  })
}

/**
 * Generate QR code as SVG string
 * @param url - URL to encode in QR code
 * @returns Promise<string> - SVG string
 */
export async function generateQRSVG(url: string): Promise<string> {
  return await QRCode.toString(url, {
    type: 'svg',
    errorCorrectionLevel: 'H',
  })
}
