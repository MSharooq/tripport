import type { TripPackage } from '~/data/packages/types'
import { packageRowFromDocument, requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const document = await readBody<TripPackage>(event)
  const { client } = await requireManager(event)
  const row = packageRowFromDocument(document)
  const { data, error } = await client.from('packages').insert(row).select().single()

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
})
