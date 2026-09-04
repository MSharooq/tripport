import { createError, readBody } from 'h3'
import { useTripportServiceSupabase } from '~~/server/utils/supabase-service'
import { submissionRowMedia } from '~~/server/utils/testimonial-submissions'

const REVIEW_MEDIA_BUCKET = 'tripport-review-submissions'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ submissionId?: unknown }>(event)
  const id = typeof body?.submissionId === 'string' ? body.submissionId : ''
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Your review could not be completed. Please try again.' })
  }

  const client = useTripportServiceSupabase(event)
  const { data: submission, error: loadError } = await client
    .from('testimonial_submissions')
    .select('id, status, media')
    .eq('id', id)
    .maybeSingle()

  if (loadError || !submission) {
    throw createError({ statusCode: 404, statusMessage: 'We could not find that review. Please submit it again.' })
  }
  if (submission.status === 'pending') return { accepted: true }
  if (submission.status !== 'uploading') {
    throw createError({ statusCode: 400, statusMessage: 'This review can no longer be updated.' })
  }

  const media = submissionRowMedia(submission.media)
  const checks = await Promise.all(media.map((attachment) => client.storage.from(REVIEW_MEDIA_BUCKET).info(attachment.path)))
  if (checks.some(({ error, data }) => error || !data)) {
    throw createError({ statusCode: 400, statusMessage: 'One of the attachments did not finish uploading. Please try again.' })
  }

  const { error: updateError } = await client
    .from('testimonial_submissions')
    .update({ status: 'pending' })
    .eq('id', id)

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: 'We could not save your review. Please try again.' })
  }

  return { accepted: true }
})
