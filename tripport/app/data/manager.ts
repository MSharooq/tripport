import type { PackageStatus, PackageType, TripPackage } from './packages/types'
import type { TravelGuide } from './travelGuides'
import type { Destination } from './destinations'
import type { Testimonial } from './testimonials'

export type ManagerRole = 'manager' | 'editor' | 'viewer'

export interface ManagerProfile {
  id: string
  email: string
  role: ManagerRole
}

export interface ManagedPackageRow {
  id: string
  slug: string
  title: string
  status: PackageStatus
  packageType: PackageType
  destinationState: string
  durationDays: number
  durationNights: number
  coverImage: string
  updatedAt: string
  data: TripPackage
}

export interface ManagedGuideRow {
  slug: string
  title: string
  status: PackageStatus
  coverImage: string
  updatedAt: string
  data: TravelGuide
}

export interface ManagedDestinationRow {
  slug: string
  name: string
  status: PackageStatus
  region: string
  idealNights: string
  coverImage: string
  updatedAt: string
  data: Destination
}

export interface ManagedTestimonialRow {
  id: string
  name: string
  status: PackageStatus
  rating: number
  featured: boolean
  image: string
  sortOrder: number
  updatedAt: string
  data: Testimonial
}

export type ContentValidationMode = 'draft' | 'published'

export interface ContentValidationIssue {
  id: string
  label: string
}

function hasText(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
}

function addIssue(issues: ContentValidationIssue[], id: string, label: string, valid: boolean) {
  if (!valid) issues.push({ id, label })
}

export function packageValidationIssues(document: TripPackage, mode: ContentValidationMode): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = []
  addIssue(issues, 'title', 'Package title', hasText(document.title))
  addIssue(issues, 'slug', 'URL slug', hasText(document.slug))

  if (mode === 'draft') return issues

  addIssue(issues, 'duration', 'Duration', Number.isFinite(document.duration.days) && document.duration.days > 0 && Number.isFinite(document.duration.nights) && document.duration.nights >= 0)
  addIssue(issues, 'destination', 'Destination state and at least one location', hasText(document.destination.state) && document.destination.locations.some(hasText))
  addIssue(issues, 'summary', 'Card summary', hasText(document.summary))
  addIssue(issues, 'description', 'Journey introduction', hasText(document.description))
  addIssue(issues, 'cover', 'Cover image', hasText(document.images.cover.url))
  addIssue(issues, 'itinerary', 'A title and description for every itinerary day', document.itinerary.length > 0 && document.itinerary.every(day => hasText(day.title) && hasText(day.description)))
  addIssue(issues, 'inclusions', 'At least one inclusion', document.inclusions.some(hasText))
  addIssue(issues, 'exclusions', 'At least one exclusion', document.exclusions.some(hasText))
  addIssue(issues, 'seo-title', 'SEO page title', hasText(document.seo.metaTitle))
  addIssue(issues, 'seo-description', 'SEO description', hasText(document.seo.metaDescription))
  return issues
}

export function guideValidationIssues(document: TravelGuide, mode: ContentValidationMode): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = []
  addIssue(issues, 'title', 'Guide title', hasText(document.title))
  addIssue(issues, 'slug', 'URL slug', hasText(document.slug))

  if (mode === 'draft') return issues

  addIssue(issues, 'category', 'Category', hasText(document.category))
  addIssue(issues, 'summary', 'Card summary', hasText(document.summary))
  addIssue(issues, 'intro', 'Guide introduction', hasText(document.intro))
  addIssue(issues, 'image', 'Cover image', hasText(document.image))
  addIssue(issues, 'article', 'A heading and paragraph in every guide section', document.sections.length > 0 && document.sections.every(section => hasText(section.heading) && section.paragraphs.some(hasText)))
  addIssue(issues, 'seo-title', 'SEO page title', hasText(document.seo.metaTitle))
  addIssue(issues, 'seo-description', 'SEO description', hasText(document.seo.metaDescription))
  return issues
}

export function destinationValidationIssues(document: Destination, mode: ContentValidationMode): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = []
  addIssue(issues, 'name', 'Destination name', hasText(document.name))
  addIssue(issues, 'slug', 'URL slug', hasText(document.slug))

  if (mode === 'draft') return issues

  addIssue(issues, 'region', 'Region', hasText(document.region))
  addIssue(issues, 'ideal-nights', 'Ideal stay', hasText(document.idealNights))
  addIssue(issues, 'summary', 'Card summary', hasText(document.summary))
  addIssue(issues, 'introduction', 'Destination introduction', hasText(document.introduction))
  addIssue(issues, 'image', 'Cover image', hasText(document.image))
  addIssue(issues, 'seo-title', 'SEO page title', hasText(document.seo.metaTitle))
  addIssue(issues, 'seo-description', 'SEO description', hasText(document.seo.metaDescription))
  return issues
}

export function testimonialValidationIssues(document: Testimonial, mode: ContentValidationMode): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = []
  addIssue(issues, 'name', 'Traveller name', hasText(document.name))

  if (mode === 'draft') return issues

  addIssue(issues, 'title', 'Review title', hasText(document.title))
  addIssue(issues, 'quote', 'Review text', hasText(document.quote))
  addIssue(issues, 'rating', 'Rating', Number.isInteger(document.rating) && document.rating >= 1 && document.rating <= 5)
  addIssue(issues, 'permission', 'Permission to publish the review', document.permissionConfirmed === true)
  return issues
}

export function validationMessage(contentName: string, issues: ContentValidationIssue[], action: 'save' | 'publish') {
  const labels = issues.map(issue => issue.label).join(', ')
  return action === 'publish'
    ? `Complete the highlighted required fields before publishing this ${contentName}: ${labels}.`
    : `Add ${labels} before saving this ${contentName} as a draft.`
}

export function createContentId(prefix: 'package' | 'guide' | 'testimonial') {
  return `${prefix}-${crypto.randomUUID()}`
}

export function createPackageDraft(): TripPackage {
  return {
    id: createContentId('package'),
    slug: '',
    title: '',
    subtitle: '',
    status: 'draft',
    packageType: 'private-tour',
    destination: { country: 'India', state: 'Kerala', locations: [] },
    duration: { days: 1, nights: 0 },
    summary: '',
    description: '',
    highlights: [],
    suitableFor: [],
    images: { cover: { url: '', alt: '' }, gallery: [] },
    itinerary: [
      {
        day: 1,
        title: '',
        description: '',
        routeLegs: [],
        activities: [],
        optionalActivities: [],
        meals: [],
        overnightAt: '',
      },
    ],
    accommodation: {
      category: '',
      roomType: '',
      occupancy: '',
      properties: [],
      hotelNote: '',
    },
    transport: {
      type: 'Private road transport',
      vehicle: '',
      pickupLocations: [],
      dropLocations: [],
      driverIncluded: true,
      fuelIncluded: true,
      tollsAndParkingIncluded: true,
      vehicleNote: '',
    },
    inclusions: [],
    exclusions: [],
    importantInformation: [],
    cancellationExceptions: [],
    additionalTerms: [],
    contact: { callToAction: 'Enquire about this journey', whatsappEnabled: true, enquiryEnabled: true },
    faq: [],
    seo: { metaTitle: '', metaDescription: '', keywords: [] },
  }
}

export function createGuideDraft(): TravelGuide {
  return {
    slug: '',
    status: 'draft',
    category: 'Travel planning',
    title: '',
    summary: '',
    intro: '',
    image: '',
    readTime: '4 min read',
    quickLook: [],
    takeaways: [],
    sections: [{ heading: '', lead: '', paragraphs: [''] }],
    relatedItinerarySlugs: [],
    seo: { metaTitle: '', metaDescription: '' },
  }
}

export function createDestinationDraft(): Destination {
  return {
    slug: '',
    status: 'draft',
    name: '',
    region: '',
    state: 'Kerala',
    country: 'India',
    summary: '',
    introduction: '',
    idealNights: '',
    image: '',
    imageAlt: '',
    gallery: [],
    highlights: [],
    bestFor: [],
    facts: [],
    relatedItinerarySlugs: [],
    seo: { metaTitle: '', metaDescription: '' },
  }
}

export function createTestimonialDraft(): Testimonial {
  return {
    id: createContentId('testimonial'),
    status: 'draft',
    name: '',
    location: '',
    travellerType: '',
    title: '',
    quote: '',
    rating: 5,
    image: '',
    itinerarySlug: '',
    permissionConfirmed: false,
    featured: true,
    sortOrder: 0,
  }
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function createCopySlug(value: string) {
  const base = toSlug(value) || 'untitled'
  return `${base}-copy-${crypto.randomUUID().slice(0, 8)}`
}
