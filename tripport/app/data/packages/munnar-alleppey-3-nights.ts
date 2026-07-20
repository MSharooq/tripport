import type { TripPackage } from './types'
import { activity, commonFaq, day, image, meals, privateKeralaTransport, standardExclusions, standardImportantInformation, standardInclusions } from './shared'

const itinerary = {
  id: 'tp-kerala-001',
  slug: 'munnar-alleppey-3-nights',
  title: 'Munnar & Backwaters Escape',
  subtitle: 'Tea country and a slow night on the water',
  status: 'published',
  packageType: 'private-tour',
  destination: { country: 'India', state: 'Kerala', locations: ['Kochi', 'Munnar', 'Alleppey'] },
  duration: { days: 4, nights: 3 },
  summary: 'A compact Kerala introduction pairing misty tea country with an overnight backwater experience.',
  description: 'Begin in Kochi, climb into the Western Ghats and end among the calm canals of Alleppey. This route balances scenic drives with enough time to settle into each place.',
  highlights: ['Munnar tea country', 'Waterfalls and viewpoints', 'Alleppey houseboat stay'],
  suitableFor: ['First-time Kerala visitors', 'Couples', 'Short breaks'],
  images: {
    cover: image('/images/munnar.jpg', 'Tea-covered hills in Munnar'),
    gallery: [image('/images/munnar-wide.jpg', 'Munnar mountain landscape'), image('/images/hero.jpg', 'Kerala backwaters'), image('/images/kochi.jpg', 'Kochi waterfront')],
  },
  itinerary: [
    day(1, 'Arrive in Kochi · Drive to Munnar', 'Meet your driver in Kochi and begin the scenic climb into the Western Ghats. Settle into Munnar and keep the evening free to relax.', { image: image('/images/munnar.jpg', 'Munnar hill road'), routeLegs: [{ from: 'Kochi', to: 'Munnar', distanceKm: 130, estimatedTravelTime: '4–5 hours', mode: 'Private road transfer' }], activities: [activity('Waterfall and spice garden pauses', 'Short comfort stops on the way into the hills.', 'As time permits')], meals: meals('Dinner'), overnightAt: 'Munnar' }),
    day(2, 'Munnar at a gentle pace', 'Spend the day among tea gardens, viewpoints and cool mountain air, with time to enjoy your stay.', { image: image('/images/munnar-wide.jpg', 'View across Munnar tea hills'), activities: [activity('Tea garden viewpoints', 'A relaxed morning among Munnar’s signature landscapes.', '2–3 hours'), activity('Mattupetty and Echo Point', 'Lakeside views and an easy local sightseeing circuit.', '2 hours')], optionalActivities: [{ title: 'Tea museum visit', duration: '1 hour', availabilityNote: 'Available on request' }], meals: meals('Breakfast', 'Dinner'), overnightAt: 'Munnar' }),
    day(3, 'Munnar to Alleppey', 'Travel down from the hills to Alleppey. Board your houseboat and enjoy a slow sunset on the water.', { image: image('/images/hero.jpg', 'Houseboat on Kerala backwaters'), routeLegs: [{ from: 'Munnar', to: 'Alleppey', distanceKm: 170, estimatedTravelTime: '5–6 hours', mode: 'Private road transfer' }], activities: [activity('Backwater cruise', 'Settle in as the houseboat moves through canals and village waterways.', 'Afternoon', true)], meals: meals('Breakfast', 'Lunch', 'Dinner'), overnightAt: 'Alleppey houseboat' }),
    day(4, 'Alleppey · Departure', 'Enjoy breakfast by the backwaters before your onward transfer to Kochi.', { image: image('/images/kochi.jpg', 'Kochi harbour'), routeLegs: [{ from: 'Alleppey', to: 'Kochi', distanceKm: 80, estimatedTravelTime: '2–2.5 hours', mode: 'Private road transfer' }], meals: meals('Breakfast') }),
  ],
  accommodation: { category: 'Comfort boutique stays', roomType: 'Standard double room', occupancy: '2 guests per room', properties: [{ location: 'Munnar', nights: 2, hotelName: 'The Tall Trees, Munnar', roomType: 'Standard cottage', mealPlan: 'Breakfast and dinner' }, { location: 'Alleppey', nights: 1, hotelName: 'Premium private houseboat', roomType: 'Private cabin', mealPlan: 'All meals' }] },
  transport: privateKeralaTransport(['Kochi airport', 'Kochi railway station'], ['Kochi airport', 'Kochi railway station']),
  inclusions: standardInclusions,
  exclusions: standardExclusions,
  importantInformation: standardImportantInformation,
  contact: { callToAction: 'Enquire about this journey', whatsappEnabled: true, enquiryEnabled: true },
  faq: commonFaq,
  seo: { metaTitle: 'Munnar & Alleppey 4-Day Kerala Itinerary | Tripport', metaDescription: 'Explore Munnar tea country and Alleppey backwaters on a relaxed 4-day Kerala itinerary.', keywords: ['Munnar Alleppey itinerary', '4 day Kerala itinerary', 'Kerala houseboat tour'] },
} satisfies TripPackage

export default itinerary
