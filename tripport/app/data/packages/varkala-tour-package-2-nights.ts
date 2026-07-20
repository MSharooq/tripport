import type { TripPackage } from './types'
import { activity, commonFaq, day, image, meals, privateKeralaTransport, standardExclusions, standardImportantInformation, standardInclusions } from './shared'

const itinerary = {
  id: 'tp-kerala-012',
  slug: 'varkala-tour-package-2-nights',
  title: 'Varkala Cliffside Escape',
  subtitle: 'Three easy-going days by the Arabian Sea',
  status: 'published',
  packageType: 'private-tour',
  destination: {
    country: 'India',
    state: 'Kerala',
    locations: ['Thiruvananthapuram', 'Varkala'],
  },
  duration: {
    days: 3,
    nights: 2,
  },
  summary: 'A short coastal escape from Thiruvananthapuram, combining Varkala’s red cliffs, golden beaches, heritage and relaxed sea views.',
  description: 'Arrive in Thiruvananthapuram and travel north to Varkala for two unhurried nights beside the Arabian Sea. Explore the town’s cliffside beach, heritage landmarks and the beautiful meeting point of beach and backwater at Kappil.',
  highlights: [
    'Varkala cliff sunsets',
    'Papanasam Beach',
    'Janardhanaswamy Temple',
    'Sree Narayana Guru Samadhi',
    'Kappil beach and backwaters',
  ],
  suitableFor: ['Couples', 'Beach lovers', 'Short breaks', 'Friends and families'],
  images: {
    cover: image('/images/varkala.jpg', 'Varkala cliffs and the Arabian Sea'),
    gallery: [
      image('/images/beach.jpg', 'Kerala beach at sunset'),
      image('/images/varkala.jpg', 'Varkala cliff coastline'),
      image('/images/hero.jpg', 'Kerala backwater scenery'),
    ],
  },
  itinerary: [
    day(
      1,
      'Thiruvananthapuram to Varkala',
      'Arrive at Thiruvananthapuram Airport or railway station and travel north to Varkala. Check into your hotel, then keep the evening free for a beach walk, a swim or sunset from the cliff.',
      {
        image: image('/images/varkala.jpg', 'Varkala cliffs at sunset'),
        routeLegs: [
          {
            from: 'Thiruvananthapuram',
            to: 'Varkala',
            distanceKm: 45,
            estimatedTravelTime: 'Around 1 hour',
            mode: 'Private road transfer',
          },
        ],
        activities: [
          activity('Varkala cliff sunset', 'Take in the coastline from the clifftop as the day winds down.', 'Evening'),
          activity('Papanasam Beach time', 'Enjoy an easy first introduction to Varkala’s beach and sea air.', 'At leisure'),
        ],
        overnightAt: 'Varkala',
      },
    ),
    day(
      2,
      'Varkala sightseeing',
      'Spend the day exploring Varkala’s cultural and coastal landmarks at a relaxed pace, with time for the beach between stops.',
      {
        image: image('/images/varkala.jpg', 'Varkala beach and red cliffs'),
        activities: [
          activity('Janardhanaswamy Temple', 'Visit Varkala’s historic Vishnu temple, a long-standing local landmark.', '45 minutes'),
          activity('Papanasam Beach and Sree Narayana Guru Samadhi', 'Walk the beach and visit the nearby memorial dedicated to the philosopher and social reformer.', '1–2 hours'),
          activity('Kappil beach and backwaters', 'See the scenic meeting point of the Arabian Sea and calm backwaters.', '1–2 hours'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Varkala',
      },
    ),
    day(
      3,
      'Varkala to Thiruvananthapuram departure',
      'After breakfast, check out and travel to Thiruvananthapuram Airport or railway station for your onward journey.',
      {
        image: image('/images/beach.jpg', 'Kerala coast'),
        routeLegs: [
          {
            from: 'Varkala',
            to: 'Thiruvananthapuram',
            distanceKm: 45,
            estimatedTravelTime: 'Around 1 hour',
            mode: 'Private road transfer',
          },
        ],
        meals: meals('Breakfast'),
      },
    ),
  ],
  accommodation: {
    category: 'Comfort coastal stay',
    roomType: 'Standard room',
    occupancy: 'Twin or triple sharing',
    properties: [
      {
        location: 'Varkala',
        nights: 2,
        hotelName: 'Selected hotel in Varkala or similar',
        roomType: 'Standard room',
        mealPlan: 'Breakfast',
      },
    ],
  },
  transport: privateKeralaTransport(
    ['Thiruvananthapuram Airport', 'Thiruvananthapuram railway station'],
    ['Thiruvananthapuram Airport', 'Thiruvananthapuram railway station'],
    6,
  ),
  inclusions: standardInclusions,
  exclusions: standardExclusions,
  importantInformation: [
    ...standardImportantInformation,
    'Temple access and sightseeing availability are subject to local operating conditions and visitor guidelines.',
    'Beach and water activities are subject to weather and sea conditions.',
  ],
  contact: {
    callToAction: 'Plan your Varkala escape',
    whatsappEnabled: true,
    enquiryEnabled: true,
  },
  faq: commonFaq,
  seo: {
    metaTitle: 'Varkala Tour Package from Thiruvananthapuram | Tripport',
    metaDescription: 'A private 3-day Varkala itinerary from Thiruvananthapuram with beach time, cliff views, local sightseeing and hotel accommodation.',
    keywords: ['Varkala tour package', 'Varkala itinerary from Thiruvananthapuram', '2 nights Varkala package', 'Varkala beach holiday'],
  },
} satisfies TripPackage

export default itinerary
