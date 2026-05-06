import type { Metadata } from "next"
import { Public_Sans, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { TopBar } from "@/components/TopBar"
import { InstallPrompt } from "@/components/InstallPrompt"

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
  title: {
    default: "Diamantes VIP - Acompanantes y scort en Chile",
    template: "%s | Diamantes VIP",
  },
  description:
    "Directorio de acompanantes y scort en Chile. Encuentra perfiles verificados, ciudades y servicios en Diamantes VIP.",
  keywords: [
    "scort",
    "acompanante",
    "acompanantes",
    "escort",
    "escort chile",
    "acompanantes chile",
    "diamantes vip",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Diamantes VIP - Acompanantes y scort en Chile",
    description:
      "Directorio de acompanantes y scort en Chile con perfiles verificados y busqueda por ciudad.",
    url: "/",
    siteName: "Diamantes VIP",
    locale: "es_CL",
    type: "website",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
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
        <link rel="apple-touch-icon" href="/favicon.jpeg" />
        <link rel="icon" type="image/jpeg" href="/favicon.jpeg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-foreground">
        <TopBar />
        <Header />
        {children}
        <Footer />
        <InstallPrompt />
      </body>
    </html>
  )
}
