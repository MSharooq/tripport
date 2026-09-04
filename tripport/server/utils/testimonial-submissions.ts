import type { H3Event } from 'h3'
import { createError, getHeader, setResponseHeader } from 'h3'
import type { TestimonialSubmission, TestimonialSubmissionAttachmentInput, TestimonialSubmissionInput, TestimonialSubmissionMedia, TestimonialSubmissionMediaType, TestimonialSubmissionStatus } from '~/data/testimonialSubmissions'

const IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const VIDEO_MIME_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime'])
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_VIDEO_BYTES = 25 * 1024 * 1024
const MAX_REVIEW_ATTEMPTS = 5
const REVIEW_ATTEMPT_WINDOW_MS = 60 * 60 * 1000
const attemptBuckets = new Map<string, { count: number, resetAt: number }>()

type SubmissionRow = {
  id: string
  status: string
  display_name: string
  email: string
  location: string
  title: string
  quote: string
  rating: number
  itinerary_slug: string
  media: unknown
  publication_consent: boolean
  source: string
  reviewer_note: string
  testimonial_id: string | null
  created_at: string
  reviewed_at: string | null
}

export type ValidatedReviewSubmission = Omit<TestimonialSubmissionInput, 'attachments' | 'location' | 'itinerarySlug' | 'website'> & {
  location: string
  itinerarySlug: string
  attachments: TestimonialSubmissionAttachmentInput[]
}

function cleanText(value: unknown, maximum: number) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maximum) : ''
}

function cleanReview(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/\r\n/g, '\n').slice(0, 3000) : ''
}

function cleanFileName(value: unknown) {
  const name = typeof value === 'string' ? value.trim() : ''
  return name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 100) || 'attachment'
}

function validAttachment(value: unknown): TestimonialSubmissionAttachmentInput | null {
  if (!value || typeof value !== 'object') return null
  const input = value as Record<string, unknown>
  const type = input.type === 'image' || input.type === 'video' ? input.type : null
  const mimeType = typeof input.mimeType === 'string' ? input.mimeType.toLowerCase() : ''
  const sizeBytes = typeof input.sizeBytes === 'number' ? input.sizeBytes : NaN
  if (!type || !Number.isFinite(sizeBytes) || sizeBytes <= 0) return null

  const allowed = type === 'image' ? IMAGE_MIME_TYPES : VIDEO_MIME_TYPES
  const maximum = type === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES
  if (!allowed.has(mimeType) || sizeBytes > maximum) return null

  return { type, mimeType, sizeBytes, fileName: cleanFileName(input.fileName) }
}

export function validateReviewSubmission(value: unknown): ValidatedReviewSubmission {
  if (!value || typeof value !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Please complete the review form.' })
  }

  const input = value as Record<string, unknown>
  const displayName = cleanText(input.displayName, 100)
  const email = cleanText(input.email, 254).toLowerCase()
  const location = cleanText(input.location, 100)
  const title = cleanText(input.title, 140)
  const quote = cleanReview(input.quote)
  const itinerarySlug = cleanText(input.itinerarySlug, 160)
  const rating = input.rating
  const publicationConsent = input.publicationConsent === true

  if (!displayName || !title || !quote || !publicationConsent) {
    throw createError({ statusCode: 400, statusMessage: 'Please complete every required review field.' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Enter a valid email address.' })
  }
  if (!Number.isInteger(rating) || (rating as number) < 1 || (rating as number) > 5) {
    throw createError({ statusCode: 400, statusMessage: 'Choose a rating between one and five stars.' })
  }

  const values = Array.isArray(input.attachments) ? input.attachments : []
  if (values.length > 2) {
    throw createError({ statusCode: 400, statusMessage: 'You can add one photo and one video.' })
  }
  const attachments = values.map(validAttachment)
  if (attachments.some((attachment) => !attachment)) {
    throw createError({ statusCode: 400, statusMessage: 'One of the selected files is not supported.' })
  }
  const typedAttachments = attachments as TestimonialSubmissionAttachmentInput[]
  if (new Set(typedAttachments.map((attachment) => attachment.type)).size !== typedAttachments.length) {
    throw createError({ statusCode: 400, statusMessage: 'Add no more than one photo and one video.' })
  }

  return { displayName, email, location, title, quote, itinerarySlug, rating: rating as number, publicationConsent, attachments: typedAttachments }
}

export function isHoneypotFilled(value: unknown) {
  return Boolean(cleanText(value, 200))
}

export function enforceReviewSubmissionRateLimit(event: H3Event) {
  const ip = getHeader(event, 'cf-connecting-ip') || getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const current = attemptBuckets.get(ip)
  const bucket = !current || current.resetAt <= now
    ? { count: 0, resetAt: now + REVIEW_ATTEMPT_WINDOW_MS }
    : current

  if (bucket.count >= MAX_REVIEW_ATTEMPTS) {
    setResponseHeader(event, 'Retry-After', Math.ceil((bucket.resetAt - now) / 1000))
    throw createError({ statusCode: 429, statusMessage: 'Please wait a little before submitting another review.' })
  }

  bucket.count += 1
  attemptBuckets.set(ip, bucket)
}

export function extensionForMimeType(mimeType: string) {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
  }
  return extensions[mimeType] || 'bin'
}

export function submissionMediaPath(id: string, attachment: TestimonialSubmissionAttachmentInput) {
  return `submissions/${id}/${attachment.type}.${extensionForMimeType(attachment.mimeType)}`
}

function isMediaType(value: unknown): value is TestimonialSubmissionMediaType {
  return value === 'image' || value === 'video'
}

function mediaFromUnknown(value: unknown): TestimonialSubmissionMedia[] {
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const media = item as Record<string, unknown>
    if (!isMediaType(media.type) || typeof media.path !== 'string' || typeof media.fileName !== 'string' || typeof media.mimeType !== 'string' || typeof media.sizeBytes !== 'number') return []
    return [{
      type: media.type,
      path: media.path,
      fileName: media.fileName,
      mimeType: media.mimeType,
      sizeBytes: media.sizeBytes,
    }]
  })
}

export function testimonialSubmissionFromRow(row: SubmissionRow, signedMediaUrls: Record<string, string> = {}): TestimonialSubmission {
  const media = mediaFromUnknown(row.media).map((item) => ({ ...item, signedUrl: signedMediaUrls[item.path] }))
  const status: TestimonialSubmissionStatus = ['uploading', 'pending', 'approved', 'rejected', 'archived'].includes(row.status)
    ? row.status as TestimonialSubmissionStatus
    : 'pending'

  return {
    id: row.id,
    status,
    displayName: row.display_name,
    email: row.email,
    location: row.location,
    title: row.title,
    quote: row.quote,
    rating: row.rating,
    itinerarySlug: row.itinerary_slug,
    media,
    publicationConsent: row.publication_consent,
    source: 'website',
    reviewerNote: row.reviewer_note,
    testimonialId: row.testimonial_id || undefined,
    createdAt: row.created_at,
    reviewedAt: row.reviewed_at || undefined,
  }
}

export function submissionRowMedia(value: unknown) {
  return mediaFromUnknown(value)
}
