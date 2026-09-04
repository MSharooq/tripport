export type TestimonialSubmissionStatus = 'uploading' | 'pending' | 'approved' | 'rejected' | 'archived'
export type TestimonialSubmissionMediaType = 'image' | 'video'

export interface TestimonialSubmissionMedia {
  type: TestimonialSubmissionMediaType
  path: string
  fileName: string
  mimeType: string
  sizeBytes: number
  signedUrl?: string
}

export interface TestimonialSubmission {
  id: string
  status: TestimonialSubmissionStatus
  displayName: string
  email: string
  location: string
  title: string
  quote: string
  rating: number
  itinerarySlug: string
  media: TestimonialSubmissionMedia[]
  publicationConsent: boolean
  source: 'website'
  reviewerNote: string
  testimonialId?: string
  createdAt: string
  reviewedAt?: string
}

export interface TestimonialSubmissionAttachmentInput {
  type: TestimonialSubmissionMediaType
  fileName: string
  mimeType: string
  sizeBytes: number
}

export interface TestimonialSubmissionInput {
  displayName: string
  email: string
  location?: string
  title: string
  quote: string
  rating: number
  itinerarySlug?: string
  publicationConsent: boolean
  website?: string
  attachments?: TestimonialSubmissionAttachmentInput[]
}
