import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import { createError } from 'h3'

/**
 * Server-only client for workflows that must never expose private review
 * submissions or storage credentials to a site visitor.
 */
export function useTripportServiceSupabase(event: H3Event) {
  const config = useRuntimeConfig(event)
  const url = config.public.supabaseUrl
  const key = config.supabaseServiceRoleKey

  if (!url || !key) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Review sharing is being prepared. Please try again shortly.',
    })
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
