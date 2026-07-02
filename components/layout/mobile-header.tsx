import { Wallet } from 'lucide-react'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { SignOutButton } from '@/components/layout/sign-out-button'

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-background/80 px-4 py-3 backdrop-blur-lg lg:hidden">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm shadow-primary/30">
          <Wallet className="h-3.5 w-3.5" />
        </div>
        <span className="font-semibold">Finanzas</span>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <SignOutButton compact />
      </div>
    </header>
  )
}
