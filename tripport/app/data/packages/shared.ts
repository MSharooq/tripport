import type { Activity, CancellationPolicyItem, ImageAsset, Meal, PackageDay, Transport } from './types'

export const image = (url: string, alt: string): ImageAsset => ({ url, alt })

export function day(
  number: number,
  title: string,
  description: string,
  details: Omit<Partial<PackageDay>, 'day' | 'title' | 'description'> = {},
): PackageDay {
  return { day: number, title, description, ...details }
}

export const activity = (title: string, description?: string, duration?: string, included = true): Activity => ({
  title,
  description,
  duration,
  included,
})

export const meals = (...items: Meal[]) => items

export function privateKeralaTransport(pickupLocations: string[], dropLocations: string[], maximumGuests = 4): Transport {
  return {
    type: 'Private road transport',
    vehicle: maximumGuests <= 3 ? 'Air-conditioned sedan' : 'Air-conditioned premium MPV',
    minimumGuests: 1,
    maximumGuests,
    luggageCapacity: maximumGuests <= 3 ? '2 medium suitcases' : '4 medium suitcases',
    pickupLocations,
    dropLocations,
    driverIncluded: true,
    fuelIncluded: true,
    tollsAndParkingIncluded: true,
    vehicleNote: 'Vehicle category is confirmed against the final group size and luggage requirement.',
  }
}

export const standardInclusions = [
  'Accommodation in the named hotels and room categories',
  'Meals specifically listed in the itinerary',
  'Private air-conditioned transport for planned transfers and sightseeing',
  'Driver allowance, fuel, tolls, parking and applicable state taxes',
  'Experiences and entry fees only where marked as included',
]

export const standardExclusions = [
  'Flights, train tickets and travel to or from Kerala',
  'Meals, activities and entry fees not marked as included',
  'Travel insurance, medical costs and personal expenses',
  'Camera fees and optional experiences',
  'Costs arising from weather, road closures, strikes or other circumstances beyond our control',
]

export const standardImportantInformation = [
  'All services remain subject to availability until your booking is confirmed.',
  'Check-in and check-out times are set by each hotel; early check-in and late check-out are subject to availability.',
  'Sightseeing order can change to suit weather, local conditions, opening hours and the final travel dates.',
]

export const standardCancellationPolicy: CancellationPolicyItem[] = [
  { period: 'Before confirmation', note: 'Cancellation terms will be shared in writing with the final quotation before any payment is collected.' },
  { period: 'After confirmation', note: 'Any applicable charge depends on the cancellation rules of the confirmed hotels, transport and experiences.' },
]

export const standardTerms = [
  'This page is a sample itinerary. The final route, timings and services are confirmed in your written quotation.',
  'Hotel and experience reservations are made only after the itinerary and payment schedule are accepted.',
  'Tripport may suggest operationally equivalent alternatives if a confirmed service becomes unavailable.',
]

export const commonFaq = [
  { question: 'Are the hotels shown guaranteed?', answer: 'The named stays are the intended hotels for this sample. Your final confirmation will list the exact services reserved for your dates.' },
  { question: 'Can I choose my travel dates?', answer: 'Yes. Send an enquiry with your preferred dates and we will confirm what can be arranged for that period.' },
  { question: 'Are flights included?', answer: 'Flights and train tickets are not included unless they are specifically shown in your final quotation.' },
]
