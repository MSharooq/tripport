import { requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Destination slug is required.' })

  const { client } = await requireManager(event)
  const { data, error } = await client
    .from('destinations')
    .select('slug, name, status, region, ideal_nights, cover_image, updated_at, data')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Destination not found.' })

  return {
    slug: data.slug,
    name: data.name,
    status: data.status,
    region: data.region,
    idealNights: data.ideal_nights,
    coverImage: data.cover_image,
    updatedAt: data.updated_at,
    data: data.data,
  }
})
