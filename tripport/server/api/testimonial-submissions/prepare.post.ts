import { createError, readBody } from 'h3'
import type { TestimonialSubmissionInput } from '~/data/testimonialSubmissions'
import { useTripportServiceSupabase } from '~~/server/utils/supabase-service'
import { enforceReviewSubmissionRateLimit, isHoneypotFilled, submissionMediaPath, validateReviewSubmission } from '~~/server/utils/testimonial-submissions'

const REVIEW_MEDIA_BUCKET = 'tripport-review-submissions'

export default defineEventHandler(async (event) => {
  const body = await readBody<TestimonialSubmissionInput>(event)

  // Quietly accept bots that fill the hidden field, without storing data or
  // giving them a useful signal about the submission endpoint.
  if (isHoneypotFilled(body?.website)) return { accepted: true, uploads: [] }

  enforceReviewSubmissionRateLimit(event)
  const submission = validateReviewSubmission(body)
  const client = useTripportServiceSupabase(event)
  const id = crypto.randomUUID()
  const media = submission.attachments.map((attachment) => ({
    ...attachment,
    path: submissionMediaPath(id, attachment),
  }))

  const { error: insertError } = await client.from('testimonial_submissions').insert({
    id,
    status: media.length ? 'uploading' : 'pending',
    display_name: submission.displayName,
    email: submission.email,
    location: submission.location,
    title: submission.title,
    quote: submission.quote,
    rating: submission.rating,
    itinerary_slug: submission.itinerarySlug,
    media: media.map(({ path, ...attachment }) => ({ ...attachment, path })),
    publication_consent: submission.publicationConsent,
    source: 'website',
  })

  if (insertError) {
    throw createError({ statusCode: 500, statusMessage: 'We could not prepare your review. Please try again.' })
  }

  try {
    const uploads = await Promise.all(media.map(async (attachment) => {
      const { data, error } = await client.storage.from(REVIEW_MEDIA_BUCKET).createSignedUploadUrl(attachment.path)
      if (error || !data) throw new Error('Could not create a secure upload link.')
      return { type: attachment.type, path: attachment.path, token: data.token }
    }))

    return { accepted: true, submissionId: id, uploads, requiresCompletion: uploads.length > 0 }
  } catch {
    await client.from('testimonial_submissions').delete().eq('id', id)
    throw createError({ statusCode: 500, statusMessage: 'We could not prepare the attachments. Please try again.' })
  }
})
