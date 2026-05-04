import type { Metadata } from "next"
import { Public_Sans, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { TopBar } from "@/components/TopBar"
import { InstallPrompt } from "@/components/InstallPrompt"
import { ThemeProvider } from "@/components/ThemeProvider"

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Diamantes VIP — Acompañantes en Chile",
  description: "Directorio de acompañantes exclusivas en Chile",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Diamantes VIP",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "theme-color": "#221d1d",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${publicSans.variable} ${cormorant.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#221d1d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Diamantes VIP" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-foreground" suppressHydrationWarning>
        <ThemeProvider>
          <TopBar />
          <Header />
          {children}
          <Footer />
          <InstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  )
}
