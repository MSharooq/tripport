import type { TripPackage } from './types'
import { activity, commonFaq, day, image, meals, privateKeralaTransport, standardImportantInformation } from './shared'

const inclusions = [
  'Two nights of accommodation in the selected hotel or a similar property on twin or triple sharing basis.',
  'Breakfast at the hotel.',
  'Pickup and drop from Kochi Airport, Ernakulam railway station or a nearby bus stand.',
  'Transfers and sightseeing in an AC Sedan for 2 guests, AC Innova for 4 to 6 guests, or AC Tempo Traveller for 8 to 12 guests.',
  'Hindi or English-speaking driver-cum-guide.',
  'Vehicle fuel, tolls, parking charges and driver allowance.',
]

const exclusions = [
  'Flight, train and bus tickets unless specifically mentioned.',
  'Entrance fees, camera fees and guide charges unless specifically mentioned.',
  'Portage, tips, insurance, mineral water, alcoholic and non-alcoholic beverages, telephone charges and personal expenses.',
  'Additional vehicle usage not specified in the itinerary.',
  'Expenses arising from natural calamities, political protests or unforeseen events.',
  'Additional expenses caused by increases in taxes or fuel costs before or during the trip.',
  'Anything not specifically mentioned under inclusions.',
]

const itinerary = {
  id: 'tp-kerala-011',
  slug: 'munnar-tour-package-2-nights',
  title: 'Munnar Escape',
  subtitle: "A refreshing three-day journey through Kerala's tea country",
  status: 'published',
  packageType: 'private-tour',
  destination: {
    country: 'India',
    state: 'Kerala',
    locations: ['Kochi', 'Munnar'],
  },
  duration: {
    days: 3,
    nights: 2,
  },
  summary: "A short private Munnar holiday featuring scenic mountain drives, waterfalls, tea-covered landscapes and the hill station's best-known attractions.",
  description: 'Travel from Kochi into the Western Ghats for two relaxing nights in Munnar, with private transfers and a full day of local sightseeing.',
  highlights: [
    'Scenic Kochi to Munnar drive',
    'Waterfall and nature stops',
    'Mattupetty Dam and Kundala Lake',
    'Echo Point',
    'Rajamalai and Eravikulam National Park area',
  ],
  suitableFor: [
    'Couples',
    'Families',
    'First-time Kerala visitors',
    'Short holiday travellers',
  ],
  images: {
    cover: image('/images/munnar-wide.jpg', 'Munnar hills and tea estates'),
    gallery: [
      image('/images/munnar.jpg', 'Tea gardens in Munnar'),
      image('/images/munnar-wide.jpg', 'Mountain landscapes in Munnar'),
      image('/images/kochi.jpg', 'Kochi waterfront'),
    ],
  },
  itinerary: [
    day(
      1,
      'Kochi to Munnar',
      'Meet your driver at Kochi Airport or Ernakulam railway station and travel to Munnar. Enjoy waterfall views and scenic nature stops along the way before checking into your hotel.',
      {
        image: image('/images/munnar.jpg', 'Scenic road to Munnar'),
        routeLegs: [
          {
            from: 'Kochi',
            to: 'Munnar',
            distanceKm: 130,
            estimatedTravelTime: 'Around 4 hours',
            mode: 'Private road transfer',
          },
        ],
        activities: [
          activity(
            'Waterfall and scenic stops',
            'Pause at natural viewpoints and waterfalls along the route to Munnar.',
            'As time permits',
          ),
          activity(
            'Hotel check-in and leisure',
            'Check into the hotel and relax for the remainder of the day.',
            'Evening',
          ),
        ],
        overnightAt: 'Munnar',
      },
    ),
    day(
      2,
      'Munnar sightseeing',
      "After breakfast, explore Munnar's lakes, viewpoints and highland landscapes. Continue to the Rajamalai area in the afternoon, where Nilgiri tahr may be spotted.",
      {
        image: image('/images/munnar-wide.jpg', 'Munnar highland landscapes'),
        activities: [
          activity(
            'Mattupetty Dam',
            "Visit one of Munnar's best-known reservoirs, surrounded by hills and plantations.",
            '1 hour',
          ),
          activity(
            'Kundala Lake',
            'Enjoy the peaceful lake and surrounding mountain scenery.',
            '1 hour',
          ),
          activity(
            'Echo Point',
            'Stop at the popular viewpoint known for its natural echo and lakeside landscape.',
            '45 minutes',
          ),
          activity(
            'Rajamalai and Eravikulam National Park area',
            'Explore the protected highland landscape and look for the endangered Nilgiri tahr.',
            'Afternoon',
          ),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Munnar',
      },
    ),
    day(
      3,
      'Munnar to Kochi departure',
      'After breakfast, check out from the hotel and travel to Kochi Airport or Ernakulam railway station for your onward journey.',
      {
        image: image('/images/kochi.jpg', 'Kochi harbour'),
        routeLegs: [
          {
            from: 'Munnar',
            to: 'Kochi',
            distanceKm: 130,
            estimatedTravelTime: 'Around 4 hours',
            mode: 'Private road transfer',
          },
        ],
        meals: meals('Breakfast'),
      },
    ),
  ],
  accommodation: {
    category: 'Comfort hotel stay',
    roomType: 'Standard room',
    occupancy: 'Twin or triple sharing',
    properties: [
      {
        location: 'Munnar',
        nights: 2,
        hotelName: 'Selected hotel in Munnar or similar',
        roomType: 'Standard room',
        mealPlan: 'Breakfast',
      },
    ],
  },
  transport: {
    ...privateKeralaTransport(
      ['Kochi Airport', 'Ernakulam railway station', 'Kochi bus stand'],
      ['Kochi Airport', 'Ernakulam railway station', 'Kochi bus stand'],
      12,
    ),
    vehicle: 'AC Sedan for 2 guests, AC Innova for 4 to 6 guests, or AC Tempo Traveller for 8 to 12 guests',
    vehicleNote: 'Vehicle will be assigned according to the confirmed group size. A Hindi or English-speaking driver-cum-guide is included.',
  },
  inclusions,
  exclusions,
  importantInformation: [
    ...standardImportantInformation,
    'Twenty-five percent of the total package cost is required for hotel confirmation.',
    'An additional twenty-five percent must be paid on or before 30 days before the travel date.',
    'The remaining fifty percent must be settled on or before arrival.',
    'Hotel confirmation is subject to availability. A similar-category property may be provided when the listed hotel is unavailable.',
    'Nilgiri tahr sightings are subject to natural conditions and cannot be guaranteed.',
    'Sightseeing is subject to weather, traffic and attraction operating conditions.',
  ],
  contact: {
    callToAction: 'Plan your Munnar escape',
    whatsappEnabled: true,
    enquiryEnabled: true,
  },
  faq: commonFaq,
  seo: {
    metaTitle: '2 Nights 3 Days Munnar Tour Package from Kochi | Tripport',
    metaDescription: 'Explore Munnar on a private 3-day tour from Kochi with hotel accommodation, breakfast, private transfers and local sightseeing.',
    keywords: [
      '2 nights 3 days Munnar package',
      'Munnar tour package from Kochi',
      'Munnar private tour',
      'Munnar sightseeing package',
    ],
  },
} satisfies TripPackage

export default itinerary
