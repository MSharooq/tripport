import type { Destination } from '~/data/destinations'
import { destinationRowFromDocument, requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const document = await readBody<Destination>(event)
  const { client } = await requireManager(event)
  const row = destinationRowFromDocument(document)
  const { data, error } = await client.from('destinations').insert(row).select().single()

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
})
