import { requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const { client } = await requireManager(event)
  const { data, error } = await client
    .from('destinations')
    .select('slug, name, status, region, ideal_nights, cover_image, updated_at, data')
    .order('updated_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return (data ?? []).map(row => ({
    slug: row.slug,
    name: row.name,
    status: row.status,
    region: row.region,
    idealNights: row.ideal_nights,
    coverImage: row.cover_image,
    updatedAt: row.updated_at,
    data: row.data,
  }))
})
