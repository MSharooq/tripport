import { createError, readBody } from 'h3'
import { requireManager } from '~~/server/utils/supabase-content'
import { submissionRowMedia } from '~~/server/utils/testimonial-submissions'

const REVIEW_MEDIA_BUCKET = 'tripport-review-submissions'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'A review submission is required.' })

  const { client, profile } = await requireManager(event)
  if (profile.role !== 'manager') {
    throw createError({ statusCode: 403, statusMessage: 'Only a manager can reject traveller submissions.' })
  }

  const { data: row, error: loadError } = await client
    .from('testimonial_submissions')
    .select('id, status, media')
    .eq('id', id)
    .maybeSingle()
  if (loadError) throw createError({ statusCode: 500, statusMessage: 'We could not load that traveller submission.' })
  if (!row) throw createError({ statusCode: 404, statusMessage: 'That traveller submission no longer exists.' })
  if (!['pending', 'uploading'].includes(row.status)) {
    throw createError({ statusCode: 400, statusMessage: 'This traveller submission has already been reviewed.' })
  }

  const body = await readBody<{ note?: unknown }>(event)
  const reviewerNote = typeof body?.note === 'string' ? body.note.trim().slice(0, 1000) : ''
  const media = submissionRowMedia(row.media)
  if (media.length) await client.storage.from(REVIEW_MEDIA_BUCKET).remove(media.map((attachment) => attachment.path))

  const { error: updateError } = await client
    .from('testimonial_submissions')
    .update({
      status: 'rejected',
      reviewer_note: reviewerNote,
      reviewed_at: new Date().toISOString(),
      reviewed_by: profile.id,
    })
    .eq('id', id)

  if (updateError) throw createError({ statusCode: 500, statusMessage: 'We could not reject that traveller submission.' })
  return { rejected: true }
})
