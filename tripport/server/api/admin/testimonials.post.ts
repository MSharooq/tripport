import type { Testimonial } from '~/data/testimonials'
import { requireManager, testimonialRowFromDocument } from '~~/server/utils/supabase-content'

export default defineEventHandler(async (event) => {
  const document = await readBody<Testimonial>(event)
  const { client } = await requireManager(event)
  const row = testimonialRowFromDocument(document)
  const { data, error } = await client.from('testimonials').insert(row).select().single()

  if (error) throw createError({ statusCode: 400, statusMessage: error.message })
  return data
})
