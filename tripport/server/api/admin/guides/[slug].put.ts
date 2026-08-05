import type { TravelGuide } from '~/data/travelGuides'
import { guideRowFromDocument, requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const document = await readBody<TravelGuide>(event)
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Guide slug is required.' })

  const { client } = await requireManager(event)
  const row = guideRowFromDocument(document)
  const { data, error } = await client.from('travel_guides').update(row).eq('slug', slug).select().single()

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
})
