import { requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Package ID is required.' })

  const { client } = await requireManager(event)
  const { error } = await client.from('packages').update({ status: 'archived' }).eq('id', id)
  if (error) throw createError({ statusCode: 400, statusMessage: error.message })

  return { ok: true }
})
