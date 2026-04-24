import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Hiten Katariya — Cloud & Full Stack",
  description:
    "Portfolio of Hiten Katariya: MERN stack, AI/ML systems, cloud architecture, certifications, and selected projects with API-backed content.",
  openGraph: {
    title: "Hiten Katariya — Cloud Engineer & Full Stack Developer",
    description: "Full portfolio with premium UI, projects, certifications, and scalable Next.js architecture.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`${GeistSans.className} antialiased transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="portfolio-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
