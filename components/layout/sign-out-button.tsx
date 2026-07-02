'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleSignOut = () => {
    startTransition(async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.replace('/login')
      router.refresh()
    })
  }

  if (compact) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Cerrar sesión"
        onClick={handleSignOut}
        disabled={isPending}
      >
        <LogOut className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      disabled={isPending}
      className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
      {isPending ? 'Saliendo...' : 'Cerrar sesión'}
    </Button>
  )
}
