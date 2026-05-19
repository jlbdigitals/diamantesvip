'use client'

import { usePathname } from 'next/navigation'

export function TopBar() {
  const pathname = usePathname()

  if (pathname === '/') return null

  return (
    <div className="bg-rose text-brand overflow-hidden w-full">
      <div className="relative flex items-center h-8 max-w-[100vw]">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          <span className="text-xs font-semibold tracking-[0.12em] uppercase">
            ✨ Nuevas escorts verificadas esta semana — Santiago, Viña, Concepción
          </span>
          <span className="text-[10px] text-accent">·</span>
          <span className="text-xs font-semibold tracking-[0.12em] uppercase">
            📸 Sube tus fotos y recibe más visitas
          </span>
          <span className="text-[10px] text-accent">·</span>
          <span className="text-xs font-semibold tracking-[0.12em] uppercase">
            💎 Las más exclusivas de Chile
          </span>
          <span className="text-[10px] text-accent">·</span>
          <span className="text-xs font-semibold tracking-[0.12em] uppercase">
            ✨ Nuevas escorts verificadas esta semana — Santiago, Viña, Concepción
          </span>
          <span className="text-[10px] text-accent">·</span>
          <span className="text-xs font-semibold tracking-[0.12em] uppercase">
            📸 Sube tus fotos y recibe más visitas
          </span>
          <span className="text-[10px] text-accent">·</span>
          <span className="text-xs font-semibold tracking-[0.12em] uppercase">
            💎 Las más exclusivas de Chile
          </span>
        </div>
      </div>
    </div>
  )
}
