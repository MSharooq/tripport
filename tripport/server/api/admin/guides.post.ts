import type { TravelGuide } from '~/data/travelGuides'
import { guideRowFromDocument, requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const document = await readBody<TravelGuide>(event)
  const { client } = await requireManager(event)
  const row = guideRowFromDocument(document)
  const { data, error } = await client.from('travel_guides').insert(row).select().single()

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
})
