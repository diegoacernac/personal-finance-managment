'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Receipt, PieChart, Wallet, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { SignOutButton } from '@/components/layout/sign-out-button'

const links = [
  { href: '/', label: 'Resumen', icon: LayoutDashboard },
  { href: '/transacciones', label: 'Transacciones', icon: Receipt },
  { href: '/presupuestos', label: 'Presupuestos', icon: Wallet },
  { href: '/reportes', label: 'Reportes', icon: PieChart },
  { href: '/configuracion', label: 'Configuración', icon: SlidersHorizontal },
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SidebarNav({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-sidebar lg:flex">
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm shadow-primary/30">
          <Wallet className="h-4 w-4" />
        </div>
        <span className="text-lg font-semibold">Finanzas</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {active && (
                <span className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-primary" />
              )}
              <Icon className={cn('h-4 w-4 transition-transform', active && 'scale-110')} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-3">
        <div className="mb-2 flex items-center justify-between gap-2 px-1">
          {userEmail && (
            <span className="truncate text-xs text-muted-foreground" title={userEmail}>
              {userEmail}
            </span>
          )}
          <ThemeToggle />
        </div>
        <SignOutButton />
      </div>
    </aside>
  )
}
