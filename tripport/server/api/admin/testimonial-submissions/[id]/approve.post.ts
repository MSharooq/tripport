import { createError } from 'h3'
import type { Testimonial, TestimonialStoryMedia } from '~/data/testimonials'
import { requireManager, testimonialRowFromDocument } from '~~/server/utils/supabase-content'
import { extensionForMimeType, submissionRowMedia, testimonialSubmissionFromRow } from '~~/server/utils/testimonial-submissions'

const REVIEW_MEDIA_BUCKET = 'tripport-review-submissions'
const PUBLIC_MEDIA_BUCKET = 'tripport-media'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'A review submission is required.' })

  const { client, profile } = await requireManager(event)
  if (profile.role !== 'manager') {
    throw createError({ statusCode: 403, statusMessage: 'Only a manager can approve traveller submissions.' })
  }

  const { data: row, error: loadError } = await client
    .from('testimonial_submissions')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (loadError) throw createError({ statusCode: 500, statusMessage: 'We could not load that traveller submission.' })
  if (!row) throw createError({ statusCode: 404, statusMessage: 'That traveller submission no longer exists.' })
  if (row.status !== 'pending') {
    throw createError({ statusCode: 400, statusMessage: 'Only pending traveller submissions can be approved.' })
  }

  const submission = testimonialSubmissionFromRow(row)
  const testimonialId = `testimonial-${crypto.randomUUID()}`
  const copiedPaths: string[] = []
  const storyMedia: TestimonialStoryMedia[] = []

  try {
    for (const attachment of submissionRowMedia(row.media)) {
      const path = `testimonials/${testimonialId}/traveller-${attachment.type}.${extensionForMimeType(attachment.mimeType)}`
      const { error } = await client.storage.from(REVIEW_MEDIA_BUCKET).copy(attachment.path, path, { destinationBucket: PUBLIC_MEDIA_BUCKET })
      if (error) throw new Error('Could not prepare a traveller attachment for publishing.')
      copiedPaths.push(path)
      const { data } = client.storage.from(PUBLIC_MEDIA_BUCKET).getPublicUrl(path)
      storyMedia.push({
        type: attachment.type,
        url: data.publicUrl,
        alt: attachment.type === 'image' ? `Travel photo shared by ${submission.displayName}` : `Travel video shared by ${submission.displayName}`,
      })
    }

    const testimonial: Testimonial = {
      id: testimonialId,
      status: 'draft',
      name: submission.displayName,
      location: submission.location,
      travellerType: '',
      title: submission.title,
      quote: submission.quote,
      rating: submission.rating,
      image: '',
      storyMedia,
      itinerarySlug: submission.itinerarySlug,
      permissionConfirmed: submission.publicationConsent,
      featured: false,
      sortOrder: 0,
    }

    const { error: insertError } = await client.from('testimonials').insert(testimonialRowFromDocument(testimonial))
    if (insertError) throw new Error('Could not create the testimonial draft.')

    const { error: updateError } = await client
      .from('testimonial_submissions')
      .update({
        status: 'approved',
        testimonial_id: testimonialId,
        reviewed_at: new Date().toISOString(),
        reviewed_by: profile.id,
      })
      .eq('id', id)
    if (updateError) throw new Error('Could not mark the traveller submission as approved.')

    return { testimonialId }
  } catch (error) {
    if (copiedPaths.length) await client.storage.from(PUBLIC_MEDIA_BUCKET).remove(copiedPaths)
    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'We could not approve that traveller submission.',
    })
  }
})
