'use client'

import { createClient } from '@/lib/supabase/client'
import { Wallet } from 'lucide-react'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -right-24 -bottom-32 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="animate-in fade-in zoom-in-95 w-full max-w-sm space-y-6 rounded-2xl border bg-card p-8 shadow-xl shadow-primary/10 duration-500">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-md shadow-primary/30">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Finanzas</h1>
            <p className="text-sm text-muted-foreground">Inicia sesión para continuar</p>
          </div>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
        >
          Continuar con Google
        </button>
      </div>
    </div>
  )
}
