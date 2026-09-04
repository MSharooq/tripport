import { requireManager } from '~~/server/utils/supabase-content'
import { testimonialSubmissionFromRow } from '~~/server/utils/testimonial-submissions'

export default defineEventHandler(async (event) => {
  const { client } = await requireManager(event)
  const { data, error } = await client
    .from('testimonial_submissions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: 'We could not load traveller submissions.' })
  return (data ?? []).map((row) => testimonialSubmissionFromRow(row))
})
