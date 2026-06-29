import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Hiten Katariya — GitHub AI Context",
  description:
    "Explore Hiten Katariya's GitHub repositories with AI-generated context, metadata, and downloadable reports.",
  openGraph: {
    title: "Hiten Katariya — GitHub AI Context Dashboard",
    description: "AI-powered repository analysis and context generation.",
    type: "website",
  },
}

export default function GithubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
