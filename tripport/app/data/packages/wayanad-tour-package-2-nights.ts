import type { TripPackage } from './types'
import { activity, commonFaq, day, image, meals, privateKeralaTransport, standardExclusions, standardImportantInformation, standardInclusions } from './shared'

const itinerary = {
  id: 'tp-kerala-013',
  slug: 'wayanad-tour-package-2-nights',
  title: 'Wayanad Nature Escape',
  subtitle: 'Three days in Kerala’s green highlands',
  status: 'published',
  packageType: 'private-tour',
  destination: {
    country: 'India',
    state: 'Kerala',
    locations: ['Kozhikode', 'Wayanad'],
  },
  duration: {
    days: 3,
    nights: 2,
  },
  summary: 'A short private break from Kozhikode into Wayanad’s misty hills, forests, lakes and heritage-rich landscapes.',
  description: 'Travel from Kozhikode into Wayanad for two restful nights surrounded by plantations and forested hills. This compact route combines a relaxed arrival with a full day of scenic local sightseeing.',
  highlights: [
    'Wayanad’s highland drives',
    'Pookode Lake',
    'Lakkidi viewpoint',
    'Kuruva Island',
    'Edakkal Caves area',
  ],
  suitableFor: ['Nature lovers', 'Families', 'Couples', 'Short holiday travellers'],
  images: {
    cover: image('/images/thekkady.jpg', 'Lush forest landscape in Kerala'),
    gallery: [
      image('/images/munnar-wide.jpg', 'Kerala highland scenery'),
      image('/images/thekkady.jpg', 'Forest and plantation landscape'),
      image('/images/kochi.jpg', 'Kerala waterfront'),
    ],
  },
  itinerary: [
    day(
      1,
      'Kozhikode to Wayanad',
      'Arrive at Kozhikode Airport or railway station and travel into Wayanad’s green highlands. Check into your hotel and enjoy the remainder of the day at leisure.',
      {
        image: image('/images/munnar-wide.jpg', 'Kerala highland road'),
        routeLegs: [
          {
            from: 'Kozhikode',
            to: 'Wayanad',
            distanceKm: 85,
            estimatedTravelTime: 'Around 3 hours',
            mode: 'Private road transfer',
          },
        ],
        activities: [
          activity('Hotel check-in and leisure', 'Settle in and enjoy an unhurried first evening in the hills.', 'Evening'),
        ],
        overnightAt: 'Wayanad',
      },
    ),
    day(
      2,
      'Wayanad sightseeing',
      'After breakfast, set out for a day among Wayanad’s lakes, viewpoints, forest landscapes and heritage sites. The exact order can be adapted to travel time and local conditions.',
      {
        image: image('/images/thekkady.jpg', 'Wayanad-like Kerala forest landscape'),
        activities: [
          activity('Pookode Lake', 'Spend time by Wayanad’s freshwater lake, surrounded by evergreen forest.', '1 hour'),
          activity('Lakkidi viewpoint', 'Take in sweeping views across the winding ghat road and surrounding hills.', '45 minutes'),
          activity('Kuruva Island', 'Explore the river island area when access and local conditions permit.', '1–2 hours'),
          activity('Edakkal Caves area', 'Visit Wayanad’s celebrated archaeological landscape, subject to local access conditions.', '1–2 hours'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Wayanad',
      },
    ),
    day(
      3,
      'Wayanad to Kozhikode departure',
      'After breakfast, check out and travel back to Kozhikode Airport or railway station for your onward journey.',
      {
        image: image('/images/kochi.jpg', 'Kerala city waterfront'),
        routeLegs: [
          {
            from: 'Wayanad',
            to: 'Kozhikode',
            distanceKm: 85,
            estimatedTravelTime: 'Around 3 hours',
            mode: 'Private road transfer',
          },
        ],
        meals: meals('Breakfast'),
      },
    ),
  ],
  accommodation: {
    category: 'Comfort nature stay',
    roomType: 'Standard room',
    occupancy: 'Twin or triple sharing',
    properties: [
      {
        location: 'Wayanad',
        nights: 2,
        hotelName: 'Selected hotel in Wayanad or similar',
        roomType: 'Standard room',
        mealPlan: 'Breakfast',
      },
    ],
  },
  transport: privateKeralaTransport(
    ['Kozhikode Airport', 'Kozhikode railway station'],
    ['Kozhikode Airport', 'Kozhikode railway station'],
    6,
  ),
  inclusions: standardInclusions,
  exclusions: standardExclusions,
  importantInformation: [
    ...standardImportantInformation,
    'Kuruva Island, Edakkal Caves and other nature attractions may have seasonal closures or local visitor limits.',
    'The sightseeing order can be adjusted to suit weather, road conditions and attraction opening hours.',
  ],
  contact: {
    callToAction: 'Plan your Wayanad escape',
    whatsappEnabled: true,
    enquiryEnabled: true,
  },
  faq: commonFaq,
  seo: {
    metaTitle: 'Wayanad Tour Package from Kozhikode | Tripport',
    metaDescription: 'A private 3-day Wayanad itinerary from Kozhikode with scenic highland drives, hotel accommodation and local sightseeing.',
    keywords: ['Wayanad tour package', 'Wayanad itinerary from Kozhikode', '2 nights Wayanad package', 'Wayanad sightseeing tour'],
  },
} satisfies TripPackage

export default itinerary
