import { requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Guide slug is required.' })

  const { client } = await requireManager(event)
  const { error } = await client.from('travel_guides').update({ status: 'archived' }).eq('slug', slug)
  if (error) throw createError({ statusCode: 400, statusMessage: error.message })

  return { ok: true }
})
