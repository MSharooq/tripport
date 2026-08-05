import { requireManager } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Testimonial ID is required.' })

  const { client } = await requireManager(event)
  const { data, error } = await client
    .from('testimonials')
    .select('id, name, status, rating, featured, image, sort_order, updated_at, data')
    .eq('id', id)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'Testimonial not found.' })

  return {
    id: data.id,
    name: data.name,
    status: data.status,
    rating: data.rating,
    featured: data.featured,
    image: data.image,
    sortOrder: data.sort_order,
    updatedAt: data.updated_at,
    data: data.data,
  }
})
