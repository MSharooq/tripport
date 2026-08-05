import type { PackageStatus } from './packages/types'
import type { ResponsiveImageVariants } from './images'

export interface DestinationFact {
  label: string
  value: string
}

export interface DestinationImage {
  url: string
  alt: string
  variants?: ResponsiveImageVariants
  width?: number
  height?: number
}

export interface Destination {
  slug: string
  status: PackageStatus
  name: string
  region: string
  state: string
  country: string
  summary: string
  introduction: string
  idealNights: string
  image: string
  imageAlt?: string
  /** Responsive WebP sources for the cover, when it was uploaded in Manager. */
  imageVariants?: ResponsiveImageVariants
  imageWidth?: number
  imageHeight?: number
  gallery?: DestinationImage[]
  highlights: string[]
  bestFor: string[]
  facts: DestinationFact[]
  relatedItinerarySlugs: string[]
  seo: {
    metaTitle: string
    metaDescription: string
  }
}

export function destinationImageSource(image: string) {
  return image.startsWith('http') || image.startsWith('/') ? image : `/images/${image}`
}

function destination(input: Omit<Destination, 'status' | 'state' | 'country'> & Partial<Pick<Destination, 'status' | 'state' | 'country'>>): Destination {
  return {
    status: 'published',
    state: 'Kerala',
    country: 'India',
    ...input,
  }
}

export const destinations: Destination[] = [
  destination({
    slug: 'kochi', name: 'Kochi', region: 'Central Kerala', idealNights: '1–2 nights', image: 'kochi.jpg', imageAlt: 'Kochi waterfront and historic streets',
    summary: 'A layered port city of heritage streets, contemporary culture and excellent flight connections.',
    introduction: 'Kochi makes a relaxed opening or closing stop for a Kerala journey. Its old harbour neighbourhoods, cafés, galleries and easy airport access give the route a sense of place before the landscape changes.',
    highlights: ['Fort Kochi’s heritage streets and waterfront', 'Cafés, galleries and local dining', 'Easy arrival and departure connections'],
    bestFor: ['First-time Kerala journeys', 'Culture-led stays', 'Routes beginning or ending by air'],
    facts: [{ label: 'Best for', value: 'Heritage + culture' }, { label: 'Ideal stay', value: '1–2 nights' }, { label: 'Combine with', value: 'Munnar or Alleppey' }],
    relatedItinerarySlugs: ['munnar-alleppey-3-nights', 'kochi-munnar-alleppey-4-nights', 'classic-kerala-6-nights'],
    seo: { metaTitle: 'Kochi Travel Guide | Tripport', metaDescription: 'Plan a Kerala journey with Kochi’s heritage streets, culture and convenient flight connections.' },
  }),
  destination({
    slug: 'munnar', name: 'Munnar', region: 'Idukki', idealNights: '2 nights', image: 'munnar.jpg', imageAlt: 'Munnar tea plantations in the Western Ghats',
    summary: 'Rolling tea estates, cool mountain air and scenic drives through the Western Ghats.',
    introduction: 'Munnar is Kerala’s classic hill-country pause: tea-covered slopes, cooler air and a slower pace after the coast or city. It works best with enough time to settle in rather than treating it as a quick sightseeing loop.',
    highlights: ['Tea estate landscapes and mountain roads', 'Mattupetty, Kundala and Echo Point', 'Cool-weather resort stays'],
    bestFor: ['Honeymoons', 'First Kerala trips', 'Travellers who enjoy nature and scenic drives'],
    facts: [{ label: 'Best for', value: 'Hills + tea country' }, { label: 'Ideal stay', value: '2 nights' }, { label: 'Combine with', value: 'Kochi or Thekkady' }],
    relatedItinerarySlugs: ['munnar-alleppey-3-nights', 'munnar-thekkady-alleppey-5-nights', 'kerala-honeymoon-5-nights'],
    seo: { metaTitle: 'Munnar Travel Guide | Tripport', metaDescription: 'Discover how Munnar’s tea estates, scenic drives and cool mountain air fit into a Kerala journey.' },
  }),
  destination({
    slug: 'thekkady', name: 'Thekkady', region: 'Idukki', idealNights: '1–2 nights', image: 'thekkady.jpg', imageAlt: 'Thekkady forest and spice country',
    summary: 'Kerala’s spice country and gateway to the forests and wildlife experiences of Periyar.',
    introduction: 'Thekkady brings a more forested, intimate contrast after Munnar. It suits journeys that want spice-country atmosphere, a nature-led experience and a change of rhythm before the backwaters.',
    highlights: ['Periyar’s forest setting', 'Spice plantation experiences', 'Culture and nature-led evenings'],
    bestFor: ['Classic Kerala circuits', 'Nature lovers', 'Travellers seeking a quieter hill stop'],
    facts: [{ label: 'Best for', value: 'Forest + spice country' }, { label: 'Ideal stay', value: '1–2 nights' }, { label: 'Combine with', value: 'Munnar and Alleppey' }],
    relatedItinerarySlugs: ['munnar-thekkady-alleppey-5-nights', 'classic-kerala-6-nights', 'complete-kerala-7-nights'],
    seo: { metaTitle: 'Thekkady Travel Guide | Tripport', metaDescription: 'See how Thekkady’s spice country and Periyar forest experiences fit into a Kerala itinerary.' },
  }),
  destination({
    slug: 'alleppey', name: 'Alleppey', region: 'Alappuzha', idealNights: '1 night', image: 'hero.jpg', imageAlt: 'Alleppey backwaters and a traditional houseboat',
    summary: 'The heart of Kerala’s backwaters, known for houseboats, canals and slow village life.',
    introduction: 'Alleppey is where a Kerala route slows down. An overnight houseboat or backwater resort stay brings water, village scenery and an unhurried final rhythm to journeys from the hills.',
    highlights: ['Private houseboat experiences', 'Canals, coconut groves and village life', 'A gentle backwater finale'],
    bestFor: ['Couples', 'Families', 'First-time Kerala journeys'],
    facts: [{ label: 'Best for', value: 'Backwaters + houseboats' }, { label: 'Ideal stay', value: '1 night' }, { label: 'Combine with', value: 'Munnar or Thekkady' }],
    relatedItinerarySlugs: ['munnar-alleppey-3-nights', 'kochi-munnar-alleppey-4-nights', 'kerala-beach-backwater-5-nights'],
    seo: { metaTitle: 'Alleppey Travel Guide | Tripport', metaDescription: 'Plan an Alleppey backwater stay, from houseboat experiences to relaxed Kerala itinerary ideas.' },
  }),
  destination({
    slug: 'kumarakom', name: 'Kumarakom', region: 'Kottayam', idealNights: '1–2 nights', image: 'hero.jpg', imageAlt: 'Kumarakom lakefront and Kerala backwaters',
    summary: 'A peaceful resort destination on Vembanad Lake with birdlife and backwater experiences.',
    introduction: 'Kumarakom offers a quieter, more resort-led way to experience Kerala’s backwaters. It is an excellent choice when comfort, space and a slower lakefront setting matter as much as a houseboat night.',
    highlights: ['Lakefront resort stays', 'Birdlife and sunset water views', 'Relaxed backwater experiences'],
    bestFor: ['Luxury stays', 'Families', 'Travellers who prefer a resort over a houseboat night'],
    facts: [{ label: 'Best for', value: 'Lakefront stays' }, { label: 'Ideal stay', value: '1–2 nights' }, { label: 'Combine with', value: 'Munnar or Kochi' }],
    relatedItinerarySlugs: ['luxury-kerala-backwaters-6-nights', 'kerala-family-holiday-6-nights'],
    seo: { metaTitle: 'Kumarakom Travel Guide | Tripport', metaDescription: 'Discover Kumarakom’s lakefront resorts, calm backwaters and relaxed Kerala travel rhythm.' },
  }),
  destination({
    slug: 'wayanad', name: 'Wayanad', region: 'North Kerala', idealNights: '2–3 nights', image: 'munnar-wide.jpg', imageAlt: 'Wayanad’s lush hills and forest landscape',
    summary: 'A green highland district of forests, plantations, waterfalls and prehistoric heritage.',
    introduction: 'Wayanad is a slower, wilder hill-country choice for travellers who want forested landscapes, plantation stays and more time outdoors. It works beautifully as part of a North Kerala route.',
    highlights: ['Forest, plantation and waterfall landscapes', 'Pookode Lake, Edakkal and Kuruva options', 'Nature-led resort stays'],
    bestFor: ['Nature lovers', 'Families', 'North Kerala itineraries'],
    facts: [{ label: 'Best for', value: 'Nature + highlands' }, { label: 'Ideal stay', value: '2–3 nights' }, { label: 'Combine with', value: 'Kozhikode or Bekal' }],
    relatedItinerarySlugs: ['wayanad-tour-package-2-nights', 'wayanad-north-kerala-5-nights'],
    seo: { metaTitle: 'Wayanad Travel Guide | Tripport', metaDescription: 'Plan a Wayanad escape with Kerala’s forests, plantations, waterfalls and relaxed hill stays.' },
  }),
  destination({
    slug: 'varkala', name: 'Varkala', region: 'Thiruvananthapuram', idealNights: '2 nights', image: 'varkala.jpg', imageAlt: 'Varkala cliffs above the Arabian Sea',
    summary: 'A distinctive beach town where red laterite cliffs rise above the Arabian Sea.',
    introduction: 'Varkala combines a relaxed beach atmosphere with one of Kerala’s most distinctive coastal landscapes. It suits a slower finale with cliff walks, sunset views and time by the sea.',
    highlights: ['Clifftop sea views and cafés', 'Papanasam Beach', 'Easygoing coastal stays'],
    bestFor: ['Couples', 'Beach breaks', 'Kerala routes ending in the south'],
    facts: [{ label: 'Best for', value: 'Cliffs + beach' }, { label: 'Ideal stay', value: '2 nights' }, { label: 'Combine with', value: 'Kovalam or Trivandrum' }],
    relatedItinerarySlugs: ['varkala-tour-package-2-nights', 'kerala-beach-backwater-5-nights'],
    seo: { metaTitle: 'Varkala Travel Guide | Tripport', metaDescription: 'Explore Varkala’s cliffside beaches, sunsets and laid-back coastal stays in Kerala.' },
  }),
  destination({
    slug: 'kovalam', name: 'Kovalam', region: 'Thiruvananthapuram', idealNights: '2 nights', image: 'beach.jpg', imageAlt: 'Kovalam’s crescent beach on the Kerala coast',
    summary: 'An established seaside stop with crescent beaches and easy access to the state capital.',
    introduction: 'Kovalam is a familiar and convenient coastal stay for routes that finish near Thiruvananthapuram. It offers a beach setting, practical connectivity and relaxed resort time after a longer circuit.',
    highlights: ['Crescent beaches and sea views', 'Convenient access to Trivandrum', 'Relaxed resort stays'],
    bestFor: ['Families', 'South Kerala routes', 'Beach-focused final nights'],
    facts: [{ label: 'Best for', value: 'Beach + convenience' }, { label: 'Ideal stay', value: '2 nights' }, { label: 'Combine with', value: 'Kanyakumari or Varkala' }],
    relatedItinerarySlugs: ['kerala-beach-backwater-5-nights', 'complete-kerala-7-nights'],
    seo: { metaTitle: 'Kovalam Travel Guide | Tripport', metaDescription: 'Plan a Kovalam beach stay with easy access to Thiruvananthapuram and South Kerala routes.' },
  }),
  destination({
    slug: 'athirappilly', name: 'Athirappilly', region: 'Thrissur', idealNights: '1 night', image: 'thekkady.jpg', imageAlt: 'Athirappilly waterfall surrounded by forest',
    summary: 'A dramatic waterfall and forest landscape that works well as a stop near Kochi.',
    introduction: 'Athirappilly adds a dramatic forest-and-waterfall contrast close to Kochi. It works best as a short nature-led stop rather than a packed sightseeing base.',
    highlights: ['Athirappilly and Vazhachal waterfalls', 'Forest-edge scenery', 'A nature stop near Kochi'],
    bestFor: ['Short Kerala breaks', 'Nature lovers', 'Routes with a Kochi arrival or departure'],
    facts: [{ label: 'Best for', value: 'Waterfalls + forest' }, { label: 'Ideal stay', value: '1 night' }, { label: 'Combine with', value: 'Kochi or Munnar' }],
    relatedItinerarySlugs: ['kochi-munnar-alleppey-4-nights'],
    seo: { metaTitle: 'Athirappilly Travel Guide | Tripport', metaDescription: 'Explore Athirappilly’s waterfalls and forest landscapes as part of a Kerala itinerary.' },
  }),
  destination({
    slug: 'bekal', name: 'Bekal', region: 'Kasaragod', idealNights: '2 nights', image: 'beach.jpg', imageAlt: 'Bekal coast and seaside fort in North Kerala',
    summary: 'A serene North Kerala coast anchored by a landmark seaside fort and uncrowded beaches.',
    introduction: 'Bekal offers a quieter coastal escape in North Kerala, where fort views, beach resorts and an unhurried pace sit naturally alongside a Wayanad or Kozhikode route.',
    highlights: ['Bekal Fort and sea views', 'Uncrowded North Kerala beaches', 'Relaxed coastal resorts'],
    bestFor: ['North Kerala itineraries', 'Couples', 'Travellers seeking a quieter coast'],
    facts: [{ label: 'Best for', value: 'Quiet coast + fort' }, { label: 'Ideal stay', value: '2 nights' }, { label: 'Combine with', value: 'Wayanad or Kozhikode' }],
    relatedItinerarySlugs: ['wayanad-north-kerala-5-nights'],
    seo: { metaTitle: 'Bekal Travel Guide | Tripport', metaDescription: 'Plan a quieter North Kerala coastal stay around Bekal Fort, beaches and relaxed resorts.' },
  }),
]

export function findDestination(slug: string) {
  return destinations.find(destination => destination.slug === slug)
}
