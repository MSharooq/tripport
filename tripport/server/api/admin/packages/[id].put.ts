import type { TripPackage } from '~/data/packages/types'
import { packageRowFromDocument, requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const document = await readBody<TripPackage>(event)
  if (!id || document.id !== id) throw createError({ statusCode: 400, statusMessage: 'Package ID does not match.' })

  const { client } = await requireManager(event)
  const row = packageRowFromDocument(document)
  const { data, error } = await client.from('packages').update(row).eq('id', id).select().single()

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
})
