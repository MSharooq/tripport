import type { PackageStatus } from './packages/types'
import type { ResponsiveImageVariants } from './images'

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
