import type { PackageStatus } from './packages/types'
import type { ResponsiveImageVariants } from './images'

export interface TestimonialStoryMedia {
  type: 'image' | 'video'
  url: string
  alt?: string
}

export interface Testimonial {
  id: string
  status: PackageStatus
  name: string
  location: string
  travellerType: string
  title: string
  quote: string
  rating: number
  image?: string
  /** Responsive WebP sources for the traveller image, when available. */
  imageVariants?: ResponsiveImageVariants
  imageWidth?: number
  imageHeight?: number
  /** Optional traveller-supplied photo or video, shown with the review. */
  storyMedia?: TestimonialStoryMedia[]
  itinerarySlug?: string
  permissionConfirmed: boolean
  featured: boolean
  sortOrder: number
}

// Testimonials deliberately start empty. Add only genuine traveller feedback
// through Tripport Manager before publishing it to the website.
export const testimonials: Testimonial[] = []

export function testimonialImageSource(image?: string) {
  if (!image) return ''
  return image.startsWith('http') || image.startsWith('/') ? image : `/images/${image}`
}
