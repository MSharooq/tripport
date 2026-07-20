import type { TripPackage } from './types'
import { activity, commonFaq, day, image, meals, privateKeralaTransport, standardExclusions, standardImportantInformation, standardInclusions } from './shared'

const itinerary = {
  id: 'tp-kerala-009', slug: 'wayanad-north-kerala-5-nights', title: 'Wayanad & North Kerala', subtitle: 'Forest highlands and the Malabar coast', status: 'published', packageType: 'private-tour',
  destination: { country: 'India', state: 'Kerala', locations: ['Kozhikode', 'Wayanad', 'Bekal'] }, duration: { days: 6, nights: 5 },
  summary: 'A quieter northern route through forested highlands, local culture and the Arabian Sea coast.', description: 'Take the less-travelled road through Wayanad’s plantations and viewpoints, then head to Bekal for sea air, an iconic fort and a slower pace.',
  highlights: ['Wayanad forests', 'Waterfalls and viewpoints', 'Malabar flavours', 'Bekal Fort'], suitableFor: ['Nature lovers', 'Repeat Kerala visitors', 'Couples'],
  images: { cover: image('/images/thekkady.jpg', 'Lush Kerala forest landscape'), gallery: [image('/images/munnar-wide.jpg', 'Kerala highland landscape'), image('/images/beach.jpg', 'Kerala coast'), image('/images/kochi.jpg', 'Kerala city waterfront')] },
  itinerary: [
    day(1, 'Arrive in Kozhikode · Wayanad', 'Arrive in Kozhikode and travel to Wayanad’s green highlands. Evening at leisure.', { image: image('/images/munnar-wide.jpg', 'Kerala highlands'), routeLegs: [{ from: 'Kozhikode', to: 'Wayanad', distanceKm: 85, estimatedTravelTime: '3–3.5 hours', mode: 'Private road transfer' }], meals: meals('Dinner'), overnightAt: 'Wayanad' }),
    day(2, 'Wayanad landscapes', 'Explore plantations, viewpoints and waterfalls at a pace that suits the season.', { image: image('/images/thekkady.jpg', 'Green forested landscape'), activities: [activity('Wayanad viewpoint circuit', 'A scenic route through plantations and elevated lookouts.', 'Half day'), activity('Waterfall visit', 'An easy seasonal nature stop.', '1–2 hours')], meals: meals('Breakfast', 'Dinner'), overnightAt: 'Wayanad' }),
    day(3, 'A slower day in Wayanad', 'Keep the day flexible for a local walk, a heritage site or unhurried resort time.', { image: image('/images/thekkady.jpg', 'Wayanad greenery'), activities: [activity('Resort and plantation time', 'A restful day in the highlands.', 'At leisure')], optionalActivities: [{ title: 'Guided nature walk', duration: '2 hours', availabilityNote: 'Available on request' }], meals: meals('Breakfast', 'Dinner'), overnightAt: 'Wayanad' }),
    day(4, 'Wayanad to Bekal', 'Travel west to the coast and settle into Bekal, where the fort meets the Arabian Sea.', { image: image('/images/beach.jpg', 'Bekal coast'), routeLegs: [{ from: 'Wayanad', to: 'Bekal', distanceKm: 170, estimatedTravelTime: '5–5.5 hours', mode: 'Private road transfer' }], meals: meals('Breakfast', 'Dinner'), overnightAt: 'Bekal' }),
    day(5, 'Bekal at leisure', 'Enjoy beach time, a fort visit or a relaxed day by the resort.', { image: image('/images/beach.jpg', 'Kerala beach'), activities: [activity('Bekal Fort visit', 'Explore the sea-facing fort and its coastal views.', '1–2 hours')], meals: meals('Breakfast', 'Dinner'), overnightAt: 'Bekal' }),
    day(6, 'Bekal · Departure', 'Travel onward to the airport or railway station for departure.', { image: image('/images/kochi.jpg', 'Kerala waterfront'), routeLegs: [{ from: 'Bekal', to: 'Mangaluru airport', distanceKm: 70, estimatedTravelTime: '2 hours', mode: 'Private road transfer' }], meals: meals('Breakfast') }),
  ],
  accommodation: { category: 'Premium nature stays', roomType: 'Standard double room', occupancy: '2 guests per room', properties: [{ location: 'Wayanad', nights: 3, hotelName: 'Vythiri Resort, Wayanad', roomType: 'Forest room', mealPlan: 'Breakfast and dinner' }, { location: 'Bekal', nights: 2, hotelName: 'Taj Bekal Resort & Spa', roomType: 'Garden view room', mealPlan: 'Breakfast and dinner' }] },
  transport: privateKeralaTransport(['Kozhikode airport', 'Kozhikode railway station'], ['Mangaluru airport', 'Kasaragod railway station']), inclusions: standardInclusions, exclusions: standardExclusions, importantInformation: standardImportantInformation,
  contact: { callToAction: 'Enquire about this journey', whatsappEnabled: true, enquiryEnabled: true }, faq: commonFaq,
  seo: { metaTitle: 'Wayanad & North Kerala 6-Day Itinerary | Tripport', metaDescription: 'A quieter 6-day Kerala itinerary through Wayanad’s highlands and the relaxed coast of Bekal.', keywords: ['Wayanad Bekal itinerary', 'North Kerala tour', '6 day Kerala itinerary'] },
} satisfies TripPackage

export default itinerary
