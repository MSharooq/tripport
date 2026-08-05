import { destinations } from '~/data/destinations'
import { destinationRowFromDocument, requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const { client, profile } = await requireManager(event)
  if (profile.role !== 'manager') {
    throw createError({ statusCode: 403, statusMessage: 'Only a manager can import the current destination content.' })
  }

  const { error } = await client
    .from('destinations')
    .upsert(destinations.map(destinationRowFromDocument), { onConflict: 'slug', ignoreDuplicates: true })

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })

  return { destinations: destinations.length }
})
