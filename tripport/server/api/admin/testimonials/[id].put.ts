import type { Testimonial } from '~/data/testimonials'
import { requireManager, testimonialRowFromDocument } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const document = await readBody<Testimonial>(event)
  if (!id || document.id !== id) throw createError({ statusCode: 400, statusMessage: 'Testimonial ID does not match.' })

  const { client } = await requireManager(event)
  const row = testimonialRowFromDocument(document)
  const { data, error } = await client.from('testimonials').update(row).eq('id', id).select().single()

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
})
