import { requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const { client } = await requireManager(event)
  const { data, error } = await client
    .from('packages')
    .select('id, slug, title, status, package_type, destination_state, duration_days, duration_nights, cover_image, updated_at, data')
    .order('updated_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return (data ?? []).map(row => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    status: row.status,
    packageType: row.package_type,
    destinationState: row.destination_state,
    durationDays: row.duration_days,
    durationNights: row.duration_nights,
    coverImage: row.cover_image,
    updatedAt: row.updated_at,
    data: row.data,
  }))
})
