'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { TopBar } from '@/components/TopBar'
import { InstallPrompt } from '@/components/InstallPrompt'

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLanding = pathname === '/'

  if (isLanding) {
    return <>{children}</>
  }

  return (
    <>
      <TopBar />
      <Header />
      {children}
      <Footer />
      <InstallPrompt />
    </>
  )
}
