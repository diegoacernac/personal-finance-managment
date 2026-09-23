import { cache } from 'react'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// One client per request: every query in the same render shares it.
export const createClient = cache(async () => {
  const cookiesStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookiesStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookiesStore.set(name, value, options)
            )
          } catch {
            // called from a server component;
          }
        },
      },
    }
  )
})

// The proxy already refreshed the session, so reading the verified JWT claims is
// enough here and avoids another network call to Supabase Auth.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) return null
  return { id: data.claims.sub, email: data.claims.email as string | undefined }
})
