import type { Destination } from '~/data/destinations'
import { destinationRowFromDocument, requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const document = await readBody<Destination>(event)
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Destination slug is required.' })

  const { client } = await requireManager(event)
  const row = destinationRowFromDocument(document)
  const { data, error } = await client.from('destinations').update(row).eq('slug', slug).select().single()

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
})
