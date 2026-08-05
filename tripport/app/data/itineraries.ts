import type { TripPackage } from './packages/types'
import munnarAlleppey from './packages/munnar-alleppey-3-nights'
import keralaEssentials from './packages/kochi-munnar-alleppey-4-nights'
import hillsWildlife from './packages/munnar-thekkady-alleppey-5-nights'
import classicKerala from './packages/classic-kerala-6-nights'
import completeKerala from './packages/complete-kerala-7-nights'
import romanticKerala from './packages/kerala-honeymoon-5-nights'
import familyKerala from './packages/kerala-family-holiday-6-nights'
import luxuryKerala from './packages/luxury-kerala-backwaters-6-nights'
import wayanadNorthKerala from './packages/wayanad-north-kerala-5-nights'
import beachBackwater from './packages/kerala-beach-backwater-5-nights'
import munnarEscape from './packages/munnar-escape-2-nights'
import varkalaEscape from './packages/varkala-tour-package-2-nights'
import wayanadEscape from './packages/wayanad-tour-package-2-nights'
import southIndiaGrandTour from './packages/south-india-heritage-hills-14-nights'
import keralaTamilNaduCoastTour from './packages/kerala-tamil-nadu-coast-temples-9-nights'

export { destinations } from './destinations'
export type { Destination } from './destinations'

export type { PackageType, TripPackage as Itinerary } from './packages/types'
export { packageTypeLabel, packageTypes, packageDuration } from './packages/types'
export { standardCancellationPolicy, standardTerms } from './packages/shared'

// One self-contained TypeScript file lives in app/data/packages for every itinerary.
// This index is deliberately only the published-site collection.
export const itineraries: TripPackage[] = [
  munnarAlleppey,
  keralaEssentials,
  hillsWildlife,
  classicKerala,
  completeKerala,
  romanticKerala,
  familyKerala,
  luxuryKerala,
  wayanadNorthKerala,
  beachBackwater,
  munnarEscape,
  varkalaEscape,
  wayanadEscape,
  southIndiaGrandTour,
  keralaTamilNaduCoastTour,
]
