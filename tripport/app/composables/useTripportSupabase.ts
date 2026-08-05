import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

export function useTripportSupabase() {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const key = config.public.supabasePublishableKey

  if (!url || !key || import.meta.server) return null

  if (!browserClient) {
    browserClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }

  return browserClient
}

export function isSupabaseConfigured() {
  const config = useRuntimeConfig()
  return Boolean(config.public.supabaseUrl && config.public.supabasePublishableKey)
}
