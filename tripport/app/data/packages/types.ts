import type { ResponsiveImageVariants } from '~/data/images'

export const packageTypes = ['private-tour', 'family-holiday', 'honeymoon', 'group-tour', 'fixed-departure'] as const

export type PackageStatus = 'draft' | 'published' | 'archived'
export type PackageType = typeof packageTypes[number]
export type Meal = 'Breakfast' | 'Lunch' | 'Dinner'

export interface ImageAsset {
  url: string
  alt: string
  /** Optional responsive WebP sources created by Tripport Manager. */
  variants?: ResponsiveImageVariants
  width?: number
  height?: number
}

export interface RouteLeg {
  from: string
  to: string
  distanceKm?: number
  estimatedTravelTime?: string
  mode?: string
  note?: string
}

export interface Activity {
  title: string
  description?: string
  duration?: string
  included?: boolean
}

export interface OptionalActivity {
  title: string
  description?: string
  duration?: string
  availabilityNote?: string
}

export interface PackageDay {
  day: number
  title: string
  description: string
  image?: ImageAsset
  routeLegs?: RouteLeg[]
  activities?: Activity[]
  optionalActivities?: OptionalActivity[]
  meals?: Meal[]
  overnightAt?: string
}

export interface AccommodationProperty {
  location: string
  nights: number
  hotelName: string
  roomType: string
  mealPlan: string
}

export interface Accommodation {
  category: string
  roomType: string
  occupancy: string
  properties: AccommodationProperty[]
  hotelNote?: string
}

export interface Transport {
  type: string
  vehicle: string
  minimumGuests?: number
  maximumGuests?: number
  luggageCapacity?: string
  pickupLocations: string[]
  dropLocations: string[]
  driverIncluded?: boolean
  fuelIncluded?: boolean
  tollsAndParkingIncluded?: boolean
  vehicleNote?: string
}

export interface CancellationPolicyItem {
  period: string
  cancellationChargePercent?: number
  note?: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface TripPackage {
  id: string
  slug: string
  title: string
  subtitle?: string
  status: PackageStatus
  packageType: PackageType
  destination: {
    country: string
    state: string
    locations: string[]
  }
  duration: {
    days: number
    nights: number
  }
  summary: string
  description: string
  highlights?: string[]
  suitableFor?: string[]
  images: {
    cover: ImageAsset
    gallery?: ImageAsset[]
  }
  itinerary: PackageDay[]
  accommodation?: Accommodation
  transport?: Transport
  inclusions: string[]
  exclusions: string[]
  importantInformation?: string[]
  cancellationExceptions?: CancellationPolicyItem[]
  additionalTerms?: string[]
  contact: {
    callToAction: string
    whatsappEnabled: boolean
    enquiryEnabled: boolean
  }
  faq?: FaqItem[]
  seo: {
    metaTitle: string
    metaDescription: string
    keywords?: string[]
  }
}

export function packageTypeLabel(type: PackageType) {
  return {
    'private-tour': 'Private tour',
    'family-holiday': 'Family holiday',
    honeymoon: 'Honeymoon',
    'group-tour': 'Group tour',
    'fixed-departure': 'Fixed departure',
  }[type]
}

export function packageDuration(duration: TripPackage['duration']) {
  return `${duration.days} days / ${duration.nights} nights`
}
