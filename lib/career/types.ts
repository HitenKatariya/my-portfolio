export type CertificateRecord = {
  id: string
  title: string
  issuer: string
  hours: number | null
  category: string
  accent: string
  credentialUrl?: string
  pdfUrl?: string
}

export type AchievementRecord = {
  id: string
  title: string
  description: string
}
