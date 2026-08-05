import { requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const { client } = await requireManager(event)
  const { data, error } = await client
    .from('travel_guides')
    .select('slug, title, status, cover_image, updated_at, data')
    .order('updated_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return (data ?? []).map(row => ({
    slug: row.slug,
    title: row.title,
    status: row.status,
    coverImage: row.cover_image,
    updatedAt: row.updated_at,
    data: row.data,
  }))
})
