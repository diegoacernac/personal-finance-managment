'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, Wallet, PieChart, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Resumen', icon: LayoutDashboard },
  { href: '/transacciones', label: 'Movs.', icon: Receipt },
  { href: '/presupuestos', label: 'Límites', icon: Wallet },
  { href: '/reportes', label: 'Reportes', icon: PieChart },
  { href: '/configuracion', label: 'Config', icon: SlidersHorizontal },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t bg-background/80 backdrop-blur-lg lg:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition-colors',
              active ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className={cn('h-5 w-5 transition-transform', active && 'scale-110')} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
