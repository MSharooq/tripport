import { requireManager } from '~~/server/utils/supabase-content'
import { submissionRowMedia, testimonialSubmissionFromRow } from '~~/server/utils/testimonial-submissions'

const REVIEW_MEDIA_BUCKET = 'tripport-review-submissions'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'A review submission is required.' })

  const { client } = await requireManager(event)
  const { data, error } = await client
    .from('testimonial_submissions')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: 'We could not load that traveller submission.' })
  if (!data) throw createError({ statusCode: 404, statusMessage: 'That traveller submission no longer exists.' })

  const media = submissionRowMedia(data.media)
  const signed = await Promise.all(media.map(async (attachment) => {
    const { data: link, error: linkError } = await client.storage.from(REVIEW_MEDIA_BUCKET).createSignedUrl(attachment.path, 60 * 30)
    return linkError || !link ? null : [attachment.path, link.signedUrl] as const
  }))
  const signedMediaUrls = Object.fromEntries(signed.filter((entry): entry is readonly [string, string] => Boolean(entry)))

  return testimonialSubmissionFromRow(data, signedMediaUrls)
})
