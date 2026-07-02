import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SidebarNav } from '@/components/layout/sidebar-nav'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { MobileHeader } from '@/components/layout/mobile-header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="flex min-h-screen bg-muted/30">
      <SidebarNav userEmail={user.email} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 pb-24 lg:pb-0">
          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}
