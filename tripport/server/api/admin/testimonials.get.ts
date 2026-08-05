import { requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const { client } = await requireManager(event)
  const { data, error } = await client
    .from('testimonials')
    .select('id, name, status, rating, featured, image, sort_order, updated_at, data')
    .order('updated_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return (data ?? []).map(row => ({
    id: row.id,
    name: row.name,
    status: row.status,
    rating: row.rating,
    featured: row.featured,
    image: row.image,
    sortOrder: row.sort_order,
    updatedAt: row.updated_at,
    data: row.data,
  }))
})
