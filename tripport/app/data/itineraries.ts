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

export interface Destination {
  slug: string
  name: string
  region: string
  summary: string
  idealNights: string
  image: string
  published: boolean
}

export const destinations: Destination[] = [
  { slug: 'kochi', name: 'Kochi', region: 'Central Kerala', summary: 'A layered port city of heritage streets, contemporary culture and excellent flight connections.', idealNights: '1–2 nights', image: 'kochi.jpg', published: true },
  { slug: 'munnar', name: 'Munnar', region: 'Idukki', summary: 'Rolling tea estates, cool mountain air and scenic drives through the Western Ghats.', idealNights: '2 nights', image: 'munnar.jpg', published: true },
  { slug: 'thekkady', name: 'Thekkady', region: 'Idukki', summary: 'Kerala’s spice country and gateway to the forests and wildlife experiences of Periyar.', idealNights: '1–2 nights', image: 'thekkady.jpg', published: true },
  { slug: 'alleppey', name: 'Alleppey', region: 'Alappuzha', summary: 'The heart of Kerala’s backwaters, known for houseboats, canals and slow village life.', idealNights: '1 night', image: 'hero.jpg', published: true },
  { slug: 'kumarakom', name: 'Kumarakom', region: 'Kottayam', summary: 'A peaceful resort destination on Vembanad Lake with birdlife and backwater experiences.', idealNights: '1–2 nights', image: 'hero.jpg', published: true },
  { slug: 'wayanad', name: 'Wayanad', region: 'North Kerala', summary: 'A green highland district of forests, plantations, waterfalls and prehistoric heritage.', idealNights: '2–3 nights', image: 'munnar-wide.jpg', published: true },
  { slug: 'varkala', name: 'Varkala', region: 'Thiruvananthapuram', summary: 'A distinctive beach town where red laterite cliffs rise above the Arabian Sea.', idealNights: '2 nights', image: 'varkala.jpg', published: true },
  { slug: 'kovalam', name: 'Kovalam', region: 'Thiruvananthapuram', summary: 'An established seaside stop with crescent beaches and easy access to the state capital.', idealNights: '2 nights', image: 'beach.jpg', published: true },
  { slug: 'athirappilly', name: 'Athirappilly', region: 'Thrissur', summary: 'A dramatic waterfall and forest landscape that works well as a stop near Kochi.', idealNights: '1 night', image: 'thekkady.jpg', published: true },
  { slug: 'bekal', name: 'Bekal', region: 'Kasaragod', summary: 'A serene North Kerala coast anchored by a landmark seaside fort and uncrowded beaches.', idealNights: '2 nights', image: 'beach.jpg', published: true },
]
