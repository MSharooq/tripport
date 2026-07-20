import type { TripPackage } from './types'
import { activity, day, image, meals, standardImportantInformation } from './shared'

const inclusions = [
  'Nine nights of accommodation in the selected hotels, resort stays and houseboat, or similar properties, on twin or triple sharing basis.',
  'Breakfast at the hotels and all meals during the overnight houseboat stay.',
  'Private air-conditioned vehicle for the planned airport transfers, intercity travel and sightseeing.',
  'Driver allowance, fuel, tolls, parking and applicable road taxes for the planned route.',
  'Meet-and-assist on arrival in Kochi.',
]

const exclusions = [
  'Flights, trains and other travel to or from the tour unless specifically included in your final quotation.',
  'Monument entry fees, camera fees, guide services and activities unless specifically included.',
  'Lunches, dinners and beverages outside the houseboat stay, travel insurance, tips and personal expenses.',
  'Additional vehicle use or sightseeing outside the confirmed itinerary.',
  'Costs arising from weather, road closures, strikes or other circumstances beyond our control.',
]

const itinerary = {
  id: 'tp-south-015',
  slug: 'kerala-tamil-nadu-coast-temples-9-nights',
  title: 'Kerala, Temples & Southern Coast',
  subtitle: 'A ten-day journey from Kochi’s hills to the backwaters',
  status: 'published',
  packageType: 'private-tour',
  destination: {
    country: 'India',
    state: 'Kerala · Tamil Nadu',
    locations: ['Kochi', 'Munnar', 'Thekkady', 'Madurai', 'Rameswaram', 'Kanyakumari', 'Kovalam', 'Alleppey'],
  },
  duration: {
    days: 10,
    nights: 9,
  },
  summary: 'A varied South India journey through Munnar’s tea hills, Periyar’s forests, Tamil Nadu temple towns, Kanyakumari’s coastline and an overnight Alleppey houseboat cruise.',
  description: 'Begin in Kochi and travel through Kerala and Tamil Nadu on a private ten-day route full of changing landscapes. Follow tea-covered hills and spice country to the historic cities of Madurai and Rameswaram, reach the southern tip of India, then slow down on Kovalam’s coast and Alleppey’s backwaters.',
  highlights: [
    'Munnar tea country and viewpoints',
    'Thekkady and Periyar landscapes',
    'Meenakshi Temple in Madurai',
    'Rameswaram and Kanyakumari heritage',
    'Kovalam beach time',
    'Overnight Alleppey houseboat cruise',
  ],
  suitableFor: ['Families', 'Couples', 'Culture and nature lovers', 'First-time South India travellers'],
  images: {
    cover: image('/images/hero.jpg', 'Kerala backwater houseboat'),
    gallery: [
      image('/images/munnar.jpg', 'Tea-covered Munnar hills'),
      image('/images/thekkady.jpg', 'Kerala forest landscape'),
      image('/images/varkala.jpg', 'Kerala coastline'),
      image('/images/hero.jpg', 'Backwaters of Alleppey'),
    ],
  },
  itinerary: [
    day(
      1,
      'Kochi to Munnar',
      'Arrive at Kochi Airport or Ernakulam railway station and travel into the Western Ghats. Pause at waterfalls and scenic viewpoints before checking into your Munnar hotel.',
      {
        image: image('/images/munnar.jpg', 'Scenic drive through Munnar hills'),
        routeLegs: [{ from: 'Kochi', to: 'Munnar', estimatedTravelTime: 'Around 4 hours', mode: 'Private road transfer' }],
        activities: [activity('Waterfall and scenic stops', 'Pause at natural viewpoints and waterfalls on the drive into the hills.', 'As time permits')],
        overnightAt: 'Munnar',
      },
    ),
    day(
      2,
      'Munnar sightseeing',
      'Spend the day exploring Munnar’s mountain lakes, viewpoints and tea-covered landscapes, with time in the Rajamalai area later in the day.',
      {
        image: image('/images/munnar-wide.jpg', 'Munnar highland landscape'),
        activities: [
          activity('Mattupetty Dam', 'Visit the reservoir surrounded by hills and plantations.', '1 hour'),
          activity('Kundala Lake', 'Enjoy a calm mountain lake and the surrounding scenery.', '1 hour'),
          activity('Echo Point', 'Stop at the popular lakeside viewpoint.', '45 minutes'),
          activity('Rajamalai and Eravikulam area', 'Explore the highland landscape where Nilgiri tahr may be seen.', 'Afternoon'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Munnar',
      },
    ),
    day(
      3,
      'Munnar to Thekkady',
      'After breakfast, travel to Thekkady and check into your hotel. Spend the afternoon getting to know the forested landscape around Periyar.',
      {
        image: image('/images/thekkady.jpg', 'Thekkady forest landscape'),
        routeLegs: [{ from: 'Munnar', to: 'Thekkady', estimatedTravelTime: 'Around 4 hours', mode: 'Private road transfer' }],
        activities: [activity('Thekkady orientation', 'Enjoy the forest-edge setting and keep the evening at leisure.', 'At leisure')],
        optionalActivities: [
          { title: 'Periyar Lake boat ride', duration: '1–2 hours', availabilityNote: 'Available on request, subject to forest department operations.' },
          { title: 'Spice plantation visit', duration: '1 hour', availabilityNote: 'Available on request.' },
          { title: 'Elephant experience', duration: 'Varies', availabilityNote: 'Available on request.' },
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Thekkady',
      },
    ),
    day(
      4,
      'Thekkady to Madurai',
      'Leave Thekkady after breakfast and travel to Madurai. In the afternoon, explore this ancient temple city on the banks of the Vaigai River.',
      {
        image: image('/images/kochi.jpg', 'Historic South Indian city'),
        routeLegs: [{ from: 'Thekkady', to: 'Madurai', estimatedTravelTime: 'Around 4–4.5 hours', mode: 'Private road transfer' }],
        activities: [activity('Meenakshi Amman Temple', 'Visit Madurai’s celebrated temple complex and its richly detailed gopurams.', '1–2 hours')],
        meals: meals('Breakfast'),
        overnightAt: 'Madurai',
      },
    ),
    day(
      5,
      'Madurai to Rameswaram',
      'After breakfast, travel east to Rameswaram. Check in and spend the day exploring the temple town and its nearby coastal landmarks.',
      {
        image: image('/images/beach.jpg', 'Southern Indian coast'),
        routeLegs: [{ from: 'Madurai', to: 'Rameswaram', estimatedTravelTime: 'Around 4 hours', mode: 'Private road transfer' }],
        activities: [
          activity('Ramanathaswamy Temple', 'Visit one of India’s most important pilgrimage temples, subject to local visitor guidelines.', '1–2 hours'),
          activity('Rameswaram local sights', 'Add nearby coastal and heritage stops to suit the available time.', 'As time permits'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Rameswaram',
      },
    ),
    day(
      6,
      'Rameswaram to Kanyakumari',
      'Set out after breakfast for the southern tip of the Indian subcontinent. On arrival in Kanyakumari, visit local landmarks and enjoy the evening sunset over the sea.',
      {
        image: image('/images/varkala.jpg', 'India’s southern coastline'),
        routeLegs: [{ from: 'Rameswaram', to: 'Kanyakumari', estimatedTravelTime: 'Around 7 hours', mode: 'Private road transfer' }],
        activities: [
          activity('Vivekananda Rock Memorial area', 'Take in the landmark coastal setting associated with Swami Vivekananda.', '1–2 hours'),
          activity('Kanyakumari sunset', 'Watch the evening light over the meeting point of the seas.', 'Evening'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Kanyakumari',
      },
    ),
    day(
      7,
      'Kanyakumari to Kovalam',
      'After breakfast, travel north to Kovalam and check into your beach hotel. Keep the evening free for a sunset walk or time by the sea.',
      {
        image: image('/images/beach.jpg', 'Kovalam-style beach scene'),
        routeLegs: [{ from: 'Kanyakumari', to: 'Kovalam', estimatedTravelTime: 'Around 3 hours', mode: 'Private road transfer' }],
        activities: [activity('Kovalam beach time', 'Enjoy an unhurried evening beside the Arabian Sea.', 'At leisure')],
        meals: meals('Breakfast'),
        overnightAt: 'Kovalam',
      },
    ),
    day(
      8,
      'Thiruvananthapuram sightseeing',
      'After breakfast, explore Thiruvananthapuram’s cultural institutions, heritage sites and green spaces before returning to Kovalam for the night.',
      {
        image: image('/images/kochi.jpg', 'Kerala city waterfront'),
        routeLegs: [{ from: 'Kovalam', to: 'Thiruvananthapuram', estimatedTravelTime: 'Around 45 minutes each way', mode: 'Private road transfer' }],
        activities: [
          activity('Sree Padmanabhaswamy Temple area', 'See one of the city’s most significant heritage landmarks, subject to entry rules.', '1 hour'),
          activity('Napier Museum and Sree Chitra Art Gallery', 'Visit the city’s well-known cultural institutions, subject to opening hours.', '1–2 hours'),
          activity('Thiruvananthapuram Zoo', 'Add the zoological garden if it suits your preferred pace.', '1–2 hours'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Kovalam',
      },
    ),
    day(
      9,
      'Kovalam to Alleppey houseboat',
      'Travel to Alleppey after breakfast and board your traditionally styled private houseboat. Cruise through canals, paddy fields, coconut groves and village waterways, with meals served on board.',
      {
        image: image('/images/hero.jpg', 'Kerala houseboat on the backwaters'),
        routeLegs: [{ from: 'Kovalam', to: 'Alleppey', estimatedTravelTime: 'Around 4.5–5 hours', mode: 'Private road transfer' }],
        activities: [activity('Overnight backwater cruise', 'Settle into the rhythm of the canals and enjoy the changing views from the houseboat.', 'Afternoon and evening')],
        meals: meals('Breakfast', 'Lunch', 'Dinner'),
        overnightAt: 'Alleppey houseboat',
      },
    ),
    day(
      10,
      'Alleppey to Kochi departure',
      'Enjoy breakfast on the houseboat, then disembark and transfer to Kochi Airport or Ernakulam railway station for your onward journey.',
      {
        image: image('/images/kochi.jpg', 'Kochi harbour'),
        routeLegs: [{ from: 'Alleppey', to: 'Kochi', estimatedTravelTime: 'Around 2–2.5 hours', mode: 'Private road transfer' }],
        meals: meals('Breakfast'),
      },
    ),
  ],
  accommodation: {
    category: 'Comfort hotels, beach stay and private houseboat',
    roomType: 'Standard room or private houseboat cabin',
    occupancy: 'Twin or triple sharing',
    properties: [
      { location: 'Munnar', nights: 2, hotelName: 'Selected hotel in Munnar or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Thekkady', nights: 1, hotelName: 'Selected hotel in Thekkady or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Madurai', nights: 1, hotelName: 'Selected hotel in Madurai or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Rameswaram', nights: 1, hotelName: 'Selected hotel in Rameswaram or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Kanyakumari', nights: 1, hotelName: 'Selected hotel in Kanyakumari or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Kovalam', nights: 2, hotelName: 'Selected beach hotel in Kovalam or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Alleppey', nights: 1, hotelName: 'Private houseboat', roomType: 'Private cabin', mealPlan: 'Breakfast, lunch and dinner' },
    ],
    hotelNote: 'Exact hotels and houseboat are confirmed against your travel dates and preferred room category.',
  },
  transport: {
    type: 'Private intercity road transport',
    vehicle: 'Air-conditioned sedan, premium MPV or tempo traveller selected for the confirmed group size and luggage',
    minimumGuests: 1,
    maximumGuests: 12,
    luggageCapacity: 'Confirmed against the final vehicle category and group size',
    pickupLocations: ['Kochi Airport', 'Ernakulam railway station'],
    dropLocations: ['Kochi Airport', 'Ernakulam railway station'],
    driverIncluded: true,
    fuelIncluded: true,
    tollsAndParkingIncluded: true,
    vehicleNote: 'The vehicle is selected for the confirmed group size, luggage and final route.',
  },
  inclusions,
  exclusions,
  importantInformation: [
    ...standardImportantInformation,
    'Periyar activities, temple access, museum visits and wildlife sightings are subject to local operating conditions and visitor rules.',
    'The Rameswaram to Kanyakumari drive is a longer travel day; comfortable rest stops are planned en route.',
    'Houseboat boarding, cruise timing and route are subject to local backwater conditions and operational schedules.',
  ],
  contact: {
    callToAction: 'Plan your South India journey',
    whatsappEnabled: true,
    enquiryEnabled: true,
  },
  faq: [
    { question: 'Are the Thekkady activities included?', answer: 'The forest and lake activities listed as optional can be arranged on request, subject to availability and local operating conditions.' },
    { question: 'What meals are included on the houseboat?', answer: 'Breakfast, lunch and dinner are served during the planned overnight houseboat cruise.' },
    { question: 'Can this itinerary be adjusted?', answer: 'Yes. Send an enquiry with your preferred dates, group size and travel style, and we will shape the final route around them.' },
  ],
  seo: {
    metaTitle: '10-Day Kerala & Tamil Nadu Tour Itinerary | Tripport',
    metaDescription: 'A 10-day private journey through Munnar, Thekkady, Madurai, Rameswaram, Kanyakumari, Kovalam and Alleppey backwaters.',
    keywords: ['Kerala Tamil Nadu tour package', 'Munnar Thekkady Madurai itinerary', 'Rameswaram Kanyakumari Kovalam tour', 'Alleppey houseboat itinerary'],
  },
} satisfies TripPackage

export default itinerary
