import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-cursive" })

export const metadata: Metadata = {
  title: "FeelDiary - Write. Reflect. Feel.",
  description: "Your private journaling space with AI emotion analysis",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${dancingScript.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
