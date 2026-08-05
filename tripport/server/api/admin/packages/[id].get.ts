import { requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Package ID is required.' })

  const { client } = await requireManager(event)
  const { data, error } = await client
    .from('packages')
    .select('id, slug, title, status, package_type, destination_state, duration_days, duration_nights, cover_image, updated_at, data')
    .eq('id', id)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Package not found.' })

  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    status: data.status,
    packageType: data.package_type,
    destinationState: data.destination_state,
    durationDays: data.duration_days,
    durationNights: data.duration_nights,
    coverImage: data.cover_image,
    updatedAt: data.updated_at,
    data: data.data,
  }
})
