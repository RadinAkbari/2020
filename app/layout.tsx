import type React from "react"
import type { Metadata } from "next"
import { Vazirmatn } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const vazirMatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazir-matn",
  display: "swap",
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`font-sans ${vazirMatn.variable}`}>
        <Suspense fallback={<div className="min-h-screen bg-black" />}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
