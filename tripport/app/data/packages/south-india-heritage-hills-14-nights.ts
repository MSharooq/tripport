import type { TripPackage } from './types'
import { activity, day, image, meals, standardImportantInformation } from './shared'

const inclusions = [
  'Fourteen nights of accommodation in the selected hotels or similar properties on twin or triple sharing basis.',
  'Breakfast at the hotels.',
  'Private air-conditioned vehicle for the planned airport transfers, intercity travel and sightseeing.',
  'Driver allowance, fuel, tolls, parking and applicable road taxes for the planned route.',
  'Meet-and-assist on arrival in Chennai.',
]

const exclusions = [
  'Flights, trains and other travel to or from the tour unless specifically included in your final quotation.',
  'Monument entry fees, camera fees, guide services and activities unless specifically included.',
  'Lunches, dinners, beverages, travel insurance, tips and personal expenses.',
  'Additional vehicle use or sightseeing outside the confirmed itinerary.',
  'Costs arising from weather, road closures, strikes or other circumstances beyond our control.',
]

const itinerary = {
  id: 'tp-south-014',
  slug: 'south-india-heritage-hills-14-nights',
  title: 'South India Heritage & Hills Grand Tour',
  subtitle: 'Temples, colonial towns, highlands and royal cities from Chennai to Bengaluru',
  status: 'published',
  packageType: 'private-tour',
  destination: {
    country: 'India',
    state: 'Tamil Nadu · Karnataka',
    locations: ['Chennai', 'Mamallapuram', 'Puducherry', 'Thanjavur', 'Madurai', 'Kodaikanal', 'Ooty', 'Mysuru', 'Bengaluru'],
  },
  duration: {
    days: 15,
    nights: 14,
  },
  summary: 'A richly paced South India circuit from Chennai to Bengaluru, combining Pallava and Chola heritage, French-influenced Puducherry, temple cities and the cool hill stations of Kodaikanal and Ooty.',
  description: 'Travel across Tamil Nadu and Karnataka on an immersive 15-day private journey. Begin on the Bay of Bengal, trace centuries of temple architecture and living culture, then trade the plains for the tea gardens, lakes and mountain air of the southern highlands before finishing in Bengaluru.',
  highlights: [
    'UNESCO monuments of Mamallapuram',
    'Puducherry’s French Quarter and Auroville',
    'Brihadeeswarar Temple in Thanjavur',
    'Meenakshi Temple in Madurai',
    'Kodaikanal and Ooty hill stations',
    'Mysore Palace and Bengaluru gardens',
  ],
  suitableFor: ['Culture and history lovers', 'Couples', 'Families', 'First-time South India travellers'],
  images: {
    cover: image('/images/munnar-wide.jpg', 'Lush South Indian hill landscape'),
    gallery: [
      image('/images/beach.jpg', 'South India coastline'),
      image('/images/thekkady.jpg', 'South Indian forested highlands'),
      image('/images/kochi.jpg', 'Historic Indian city waterfront'),
    ],
  },
  itinerary: [
    day(
      1,
      'Chennai to Mamallapuram',
      'Arrive at Chennai Airport and meet your driver. Continue south along the coast to Mamallapuram, check in and keep the rest of the day at leisure.',
      {
        image: image('/images/beach.jpg', 'Bay of Bengal coastline'),
        routeLegs: [{ from: 'Chennai', to: 'Mamallapuram', distanceKm: 65, estimatedTravelTime: 'Around 1.5 hours', mode: 'Private road transfer' }],
        activities: [activity('Arrival and coastal leisure', 'Settle into your hotel and enjoy an easy first evening by the Bay of Bengal.', 'At leisure')],
        overnightAt: 'Mamallapuram',
      },
    ),
    day(
      2,
      'Mamallapuram sightseeing',
      'Explore Mamallapuram, the former Pallava port city known for its extraordinary stone carvings and UNESCO-listed monuments along the Bay of Bengal.',
      {
        image: image('/images/beach.jpg', 'Mamallapuram-like coastal setting'),
        activities: [
          activity('Shore Temple', 'Visit the sea-facing temple complex and its celebrated Pallava-era architecture.', '1 hour'),
          activity('Arjuna’s Penance and rock-cut monuments', 'Explore the monumental reliefs, mandapams and rathas that define the town.', '2–3 hours'),
          activity('Covelong beach and local coastal stops', 'Enjoy the coast and nearby sights at a comfortable pace.', 'As time permits'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Mamallapuram',
      },
    ),
    day(
      3,
      'Mamallapuram to Puducherry',
      'After breakfast, travel south along the coast to Puducherry. Check in and enjoy the rest of the day at leisure.',
      {
        image: image('/images/varkala.jpg', 'South India coastal promenade'),
        routeLegs: [{ from: 'Mamallapuram', to: 'Puducherry', distanceKm: 115, estimatedTravelTime: 'Around 2.5 hours', mode: 'Private road transfer' }],
        meals: meals('Breakfast'),
        overnightAt: 'Puducherry',
      },
    ),
    day(
      4,
      'Puducherry sightseeing',
      'Discover the distinctive French and Tamil character of Puducherry, from its colonial streets to spiritual and cultural landmarks.',
      {
        image: image('/images/kochi.jpg', 'Historic Indian waterfront architecture'),
        activities: [
          activity('French Quarter walk', 'Explore colonial-era streets, heritage buildings and the promenade.', '1–2 hours'),
          activity('Sri Aurobindo Ashram', 'Visit one of the city’s best-known spiritual institutions.', '45 minutes'),
          activity('Auroville', 'Spend time at the experimental township and its surrounding cultural spaces.', '2–3 hours'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Puducherry',
      },
    ),
    day(
      5,
      'Puducherry to Thanjavur',
      'Leave Puducherry after breakfast and travel inland to Thanjavur, the historic heartland of the Chola dynasty. Check in and enjoy a relaxed evening.',
      {
        image: image('/images/thekkady.jpg', 'South Indian countryside'),
        routeLegs: [{ from: 'Puducherry', to: 'Thanjavur', distanceKm: 180, estimatedTravelTime: 'Around 3.5 hours', mode: 'Private road transfer' }],
        meals: meals('Breakfast'),
        overnightAt: 'Thanjavur',
      },
    ),
    day(
      6,
      'Thanjavur heritage sightseeing',
      'Spend the day discovering Thanjavur’s Chola-era architecture, art and scholarship, centred on one of South India’s greatest temples.',
      {
        image: image('/images/kochi.jpg', 'South Indian heritage city scene'),
        activities: [
          activity('Brihadeeswarar Temple', 'Visit the magnificent UNESCO-listed Chola temple, completed in the 11th century.', '1–2 hours'),
          activity('Thanjavur Palace and Art Gallery', 'Explore the royal complex and its collection of South Indian art.', '1–2 hours'),
          activity('Saraswathi Mahal Library area', 'See a landmark associated with the region’s long literary and scholarly tradition.', '45 minutes'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Thanjavur',
      },
    ),
    day(
      7,
      'Thanjavur to Madurai',
      'After breakfast, travel south to Madurai, one of India’s oldest continuously inhabited cities. Check in and keep the evening free.',
      {
        image: image('/images/thekkady.jpg', 'Tamil Nadu countryside'),
        routeLegs: [{ from: 'Thanjavur', to: 'Madurai', distanceKm: 180, estimatedTravelTime: 'Around 3.5 hours', mode: 'Private road transfer' }],
        meals: meals('Breakfast'),
        overnightAt: 'Madurai',
      },
    ),
    day(
      8,
      'Madurai sightseeing',
      'Explore the temple city of Madurai, long associated with Tamil learning, trade and the Pandyan kingdom.',
      {
        image: image('/images/kochi.jpg', 'Historic Indian city'),
        activities: [
          activity('Meenakshi Amman Temple', 'Discover Madurai’s remarkable temple complex and its richly detailed gopurams.', '1–2 hours'),
          activity('Thirumalai Nayakkar Mahal', 'Visit the 17th-century palace known for its grand columns and arches.', '1 hour'),
          activity('Gandhi Memorial Museum or local heritage stop', 'Add a cultural stop suited to the day’s pace and local opening hours.', '1 hour'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Madurai',
      },
    ),
    day(
      9,
      'Madurai to Kodaikanal',
      'Travel up into the Palani Hills to Kodaikanal. Check in and take the rest of the day to settle into the cooler mountain air.',
      {
        image: image('/images/munnar.jpg', 'South Indian hill country'),
        routeLegs: [{ from: 'Madurai', to: 'Kodaikanal', distanceKm: 125, estimatedTravelTime: 'Around 3.5 hours', mode: 'Private road transfer' }],
        meals: meals('Breakfast'),
        overnightAt: 'Kodaikanal',
      },
    ),
    day(
      10,
      'Kodaikanal sightseeing',
      'Enjoy a day among Kodaikanal’s wooded slopes, lake views, gardens and striking rock formations.',
      {
        image: image('/images/munnar-wide.jpg', 'Misty mountain landscape'),
        activities: [
          activity('Kodaikanal Lake and Bryant Park', 'Enjoy the lakefront and the town’s much-loved landscaped gardens.', '1–2 hours'),
          activity('Coaker’s Walk', 'Take an easy scenic walk with views across the hills.', '1 hour'),
          activity('Pillar Rocks and Green Valley View', 'Visit two of Kodaikanal’s most dramatic natural viewpoints.', '1–2 hours'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Kodaikanal',
      },
    ),
    day(
      11,
      'Kodaikanal to Ooty',
      'Leave early after breakfast for the scenic drive to Ooty in the Nilgiris. Check in and enjoy a quiet evening after the longer journey.',
      {
        image: image('/images/munnar-wide.jpg', 'South Indian mountain roads'),
        routeLegs: [{ from: 'Kodaikanal', to: 'Ooty', distanceKm: 275, estimatedTravelTime: 'Around 7 hours', mode: 'Private road transfer' }],
        meals: meals('Breakfast'),
        overnightAt: 'Ooty',
      },
    ),
    day(
      12,
      'Ooty sightseeing',
      'Explore Ooty, the Queen of Hill Stations, where tea gardens, forested slopes and open grasslands define the Nilgiri landscape.',
      {
        image: image('/images/munnar.jpg', 'Tea-covered hill landscape'),
        activities: [
          activity('Government Botanical Garden', 'Explore Ooty’s classic landscaped garden and its varied plant collections.', '1–2 hours'),
          activity('Ooty Lake and Rose Garden', 'Enjoy two of the hill station’s most popular relaxed stops.', '1–2 hours'),
          activity('Doddabetta Peak', 'Visit a high viewpoint across the Nilgiri hills, subject to weather.', '1 hour'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Ooty',
      },
    ),
    day(
      13,
      'Ooty to Mysuru',
      'After breakfast, travel north to Mysuru. Check in, then explore the city’s royal and cultural landmarks in the afternoon.',
      {
        image: image('/images/kochi.jpg', 'South Indian heritage city'),
        routeLegs: [{ from: 'Ooty', to: 'Mysuru', distanceKm: 165, estimatedTravelTime: 'Around 4.5 hours', mode: 'Private road transfer' }],
        activities: [
          activity('Mysore Palace', 'Visit the grand palace of the Wodeyar dynasty.', '1–2 hours'),
          activity('Chamundi Hills or Brindavan Gardens', 'Choose a scenic city viewpoint or evening garden visit to suit timing.', '1–2 hours'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Mysuru',
      },
    ),
    day(
      14,
      'Mysuru to Bengaluru',
      'Travel to Bengaluru after breakfast. In the afternoon, explore the garden city’s civic landmarks, museums and green spaces.',
      {
        image: image('/images/kochi.jpg', 'Indian city waterfront'),
        routeLegs: [{ from: 'Mysuru', to: 'Bengaluru', distanceKm: 150, estimatedTravelTime: 'Around 3.5 hours', mode: 'Private road transfer' }],
        activities: [
          activity('Lalbagh Botanical Garden', 'Visit one of Bengaluru’s best-known green spaces.', '1–2 hours'),
          activity('Vidhana Soudha and Cubbon Park', 'See the city’s landmark civic architecture and neighbouring park.', '1 hour'),
          activity('Museum or heritage stop', 'Add a cultural stop according to opening hours and your preferred pace.', '1 hour'),
        ],
        meals: meals('Breakfast'),
        overnightAt: 'Bengaluru',
      },
    ),
    day(
      15,
      'Bengaluru departure',
      'After breakfast, check out and transfer to Bengaluru Airport for your onward journey.',
      {
        image: image('/images/kochi.jpg', 'Indian city departure'),
        routeLegs: [{ from: 'Bengaluru', to: 'Bengaluru Airport', distanceKm: 35, estimatedTravelTime: 'Around 1–1.5 hours', mode: 'Private road transfer' }],
        meals: meals('Breakfast'),
      },
    ),
  ],
  accommodation: {
    category: 'Comfort heritage and hill stays',
    roomType: 'Standard room',
    occupancy: 'Twin or triple sharing',
    properties: [
      { location: 'Mamallapuram', nights: 2, hotelName: 'Selected hotel in Mamallapuram or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Puducherry', nights: 2, hotelName: 'Selected hotel in Puducherry or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Thanjavur', nights: 2, hotelName: 'Selected hotel in Thanjavur or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Madurai', nights: 2, hotelName: 'Selected hotel in Madurai or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Kodaikanal', nights: 2, hotelName: 'Selected hotel in Kodaikanal or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Ooty', nights: 2, hotelName: 'Selected hotel in Ooty or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Mysuru', nights: 1, hotelName: 'Selected hotel in Mysuru or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
      { location: 'Bengaluru', nights: 1, hotelName: 'Selected hotel in Bengaluru or similar', roomType: 'Standard room', mealPlan: 'Breakfast' },
    ],
    hotelNote: 'Exact hotels are confirmed against your travel dates and preferred room category.',
  },
  transport: {
    type: 'Private intercity road transport',
    vehicle: 'Air-conditioned sedan, premium MPV or tempo traveller selected for the confirmed group size and luggage',
    minimumGuests: 1,
    maximumGuests: 12,
    luggageCapacity: 'Confirmed against the final vehicle category and group size',
    pickupLocations: ['Chennai Airport', 'Chennai railway station'],
    dropLocations: ['Bengaluru Airport', 'Bengaluru city'],
    driverIncluded: true,
    fuelIncluded: true,
    tollsAndParkingIncluded: true,
    vehicleNote: 'The same vehicle is planned for the full route, with comfortable rest stops on longer travel days.',
  },
  inclusions,
  exclusions,
  importantInformation: [
    ...standardImportantInformation,
    'This is a long overland route; the Kodaikanal to Ooty drive is approximately seven hours before comfort stops.',
    'Temple, monument, museum and garden visits are subject to local opening hours, visitor rules and seasonal conditions.',
    'The sightseeing order may be adjusted to make the most of local traffic, weather and operating hours.',
  ],
  contact: {
    callToAction: 'Plan your South India journey',
    whatsappEnabled: true,
    enquiryEnabled: true,
  },
  faq: [
    { question: 'Can this route start in Bengaluru instead?', answer: 'Yes. Send an enquiry with your preferred arrival and departure cities, and we can tailor the journey accordingly.' },
    { question: 'Are the hotels shown guaranteed?', answer: 'The listed stays indicate the planned standard. Your final confirmation will include the exact hotels secured for your travel dates.' },
    { question: 'Are monument entry fees included?', answer: 'Entry fees are not included unless they are specifically listed in your final written quotation.' },
  ],
  seo: {
    metaTitle: '15-Day South India Heritage & Hill Stations Tour | Tripport',
    metaDescription: 'A 15-day private South India journey from Chennai to Bengaluru through Mamallapuram, Puducherry, Thanjavur, Madurai, Kodaikanal, Ooty and Mysuru.',
    keywords: ['South India tour package', 'Chennai to Bengaluru itinerary', 'Tamil Nadu Karnataka tour', 'South India heritage tour', 'Ooty Kodaikanal Mysore itinerary'],
  },
} satisfies TripPackage

export default itinerary
