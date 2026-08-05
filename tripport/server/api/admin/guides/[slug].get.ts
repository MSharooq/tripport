import { requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Guide slug is required.' })

  const { client } = await requireManager(event)
  const { data, error } = await client
    .from('travel_guides')
    .select('slug, title, status, cover_image, updated_at, data')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Travel guide not found.' })

  return { slug: data.slug, title: data.title, status: data.status, coverImage: data.cover_image, updatedAt: data.updated_at, data: data.data }
})
