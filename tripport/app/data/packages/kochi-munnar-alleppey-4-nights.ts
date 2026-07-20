import type { TripPackage } from './types'
import { activity, commonFaq, day, image, meals, privateKeralaTransport, standardExclusions, standardImportantInformation, standardInclusions } from './shared'

const itinerary = {
  id: 'tp-kerala-002',
  slug: 'kochi-munnar-alleppey-4-nights',
  title: 'Kerala Essentials',
  subtitle: 'Heritage, hills and backwaters in one easy flow',
  status: 'published',
  packageType: 'private-tour',
  destination: { country: 'India', state: 'Kerala', locations: ['Kochi', 'Munnar', 'Alleppey'] },
  duration: { days: 5, nights: 4 },
  summary: 'An easy-paced first trip through heritage Kochi, the Western Ghats and Kerala’s famous backwaters.',
  description: 'A well-rounded introduction to Kerala, with a night in historic Kochi, two nights in Munnar’s tea country and a memorable houseboat finale.',
  highlights: ['Fort Kochi walk', 'Tea garden landscapes', 'Backwater cruise'],
  suitableFor: ['First-time Kerala visitors', 'Couples', 'Friends'],
  images: { cover: image('/images/hero.jpg', 'Kerala houseboat on calm waters'), gallery: [image('/images/kochi.jpg', 'Fort Kochi waterfront'), image('/images/munnar.jpg', 'Munnar tea estate'), image('/images/munnar-wide.jpg', 'Munnar hills')] },
  itinerary: [
    day(1, 'Arrive in Kochi', 'Arrive in Kochi, settle in and enjoy a quiet evening in Kerala’s historic port city.', { image: image('/images/kochi.jpg', 'Kochi waterfront'), activities: [activity('Fort Kochi orientation walk', 'A gentle introduction to the heritage quarter.', '1–2 hours')], meals: meals('Dinner'), overnightAt: 'Kochi' }),
    day(2, 'Kochi to Munnar', 'Drive through waterfalls and forested hills to Munnar. Check in and rest after the journey.', { image: image('/images/munnar.jpg', 'Munnar tea garden'), routeLegs: [{ from: 'Kochi', to: 'Munnar', distanceKm: 130, estimatedTravelTime: '4–5 hours', mode: 'Private road transfer' }], activities: [activity('Waterfall viewpoints', 'Short scenic pauses during the climb.', 'As time permits')], meals: meals('Breakfast', 'Dinner'), overnightAt: 'Munnar' }),
    day(3, 'Explore Munnar', 'Visit tea landscapes, viewpoints and local attractions at a comfortable pace, with time for a café or spa break.', { image: image('/images/munnar-wide.jpg', 'Munnar landscape'), activities: [activity('Eravikulam National Park area', 'Highland views and native grassland scenery.', '2–3 hours'), activity('Tea country circuit', 'Viewpoints and estate landscapes.', '2 hours')], optionalActivities: [{ title: 'Tea tasting session', duration: '1 hour', availabilityNote: 'Available on request' }], meals: meals('Breakfast', 'Dinner'), overnightAt: 'Munnar' }),
    day(4, 'Munnar to Alleppey', 'Travel to the backwaters for a houseboat cruise, local meals and sunset views.', { image: image('/images/hero.jpg', 'Houseboat in Alleppey'), routeLegs: [{ from: 'Munnar', to: 'Alleppey', distanceKm: 170, estimatedTravelTime: '5–6 hours', mode: 'Private road transfer' }], activities: [activity('Private houseboat cruise', 'A relaxed afternoon through Kerala’s waterways.', 'Afternoon')], meals: meals('Breakfast', 'Lunch', 'Dinner'), overnightAt: 'Alleppey houseboat' }),
    day(5, 'Alleppey · Departure', 'After breakfast, travel to Kochi for your onward journey.', { image: image('/images/kochi.jpg', 'Kochi skyline'), routeLegs: [{ from: 'Alleppey', to: 'Kochi', distanceKm: 80, estimatedTravelTime: '2–2.5 hours', mode: 'Private road transfer' }], meals: meals('Breakfast') }),
  ],
  accommodation: { category: 'Premium comfort stays', roomType: 'Standard double room', occupancy: '2 guests per room', properties: [{ location: 'Kochi', nights: 1, hotelName: 'Brunton Boatyard, Kochi', roomType: 'Garden view room', mealPlan: 'Breakfast' }, { location: 'Munnar', nights: 2, hotelName: 'Windermere Estate, Munnar', roomType: 'Garden room', mealPlan: 'Breakfast and dinner' }, { location: 'Alleppey', nights: 1, hotelName: 'Premium private houseboat', roomType: 'Private cabin', mealPlan: 'All meals' }] },
  transport: privateKeralaTransport(['Kochi airport', 'Kochi railway station'], ['Kochi airport', 'Kochi railway station']),
  inclusions: standardInclusions,
  exclusions: standardExclusions,
  importantInformation: standardImportantInformation,
  contact: { callToAction: 'Plan this Kerala journey', whatsappEnabled: true, enquiryEnabled: true },
  faq: commonFaq,
  seo: { metaTitle: 'Kerala Essentials: Kochi, Munnar & Alleppey | Tripport', metaDescription: 'A 5-day Kerala itinerary through Kochi, Munnar and Alleppey with heritage, hills and backwaters.', keywords: ['Kochi Munnar Alleppey itinerary', 'Kerala essentials tour', '5 day Kerala itinerary'] },
} satisfies TripPackage

export default itinerary
