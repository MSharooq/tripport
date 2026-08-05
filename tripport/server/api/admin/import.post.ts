import { itineraries } from '~/data/itineraries'
import { destinations } from '~/data/destinations'
import { travelGuides } from '~/data/travelGuides'
import { destinationRowFromDocument, guideRowFromDocument, packageRowFromDocument, requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const { client, profile } = await requireManager(event)
  if (profile.role !== 'manager') {
    throw createError({ statusCode: 403, statusMessage: 'Only a manager can import the current Tripport content.' })
  }

  const { error: packageError } = await client
    .from('packages')
    .upsert(itineraries.map(packageRowFromDocument), { onConflict: 'id' })
  if (packageError) throw createError({ statusCode: 400, statusMessage: packageError.message })

  const { error: guideError } = await client
    .from('travel_guides')
    .upsert(travelGuides.map(guideRowFromDocument), { onConflict: 'slug' })
  if (guideError) throw createError({ statusCode: 400, statusMessage: guideError.message })

  const { error: destinationError } = await client
    .from('destinations')
    .upsert(destinations.map(destinationRowFromDocument), { onConflict: 'slug' })
  if (destinationError) throw createError({ statusCode: 400, statusMessage: destinationError.message })

  return { packages: itineraries.length, guides: travelGuides.length, destinations: destinations.length }
})
