import type { TripPackage } from "./types";
import {
  activity,
  commonFaq,
  day,
  image,
  meals,
  privateKeralaTransport,
  standardExclusions,
  standardImportantInformation,
  standardInclusions,
} from "./shared";

const itinerary = {
  id: "tp-kerala-004",
  slug: "classic-kerala-6-nights",
  title: "Classic Kerala",
  subtitle: "The places first-time Kerala visitors love most",
  status: "published",
  packageType: "private-tour",
  destination: {
    country: "India",
    state: "Kerala",
    locations: ["Kochi", "Munnar", "Thekkady", "Kumarakom", "Alleppey"],
  },
  duration: { days: 7, nights: 6 },
  summary:
    "A complete first-time Kerala journey designed around the state’s most-loved landscapes and experiences.",
  description:
    "A generous week through the heritage, hills, forested spice country and backwaters that make Kerala feel so varied.",
  highlights: [
    "Colonial Kochi",
    "Munnar tea estates",
    "Periyar experiences",
    "Kumarakom and Alleppey",
  ],
  suitableFor: ["First-time Kerala visitors", "Couples", "Families"],
  images: {
    cover: image("/images/munnar-wide.jpg", "Munnar hills in Kerala"),
    gallery: [
      image("/images/kochi.jpg", "Kochi waterfront"),
      image("/images/munnar.jpg", "Tea gardens"),
      image("/images/thekkady.jpg", "Thekkady forest"),
      image("/images/hero.jpg", "Kerala backwaters"),
    ],
  },
  itinerary: [
    day(
      1,
      "Arrive in Kochi",
      "Arrive in Kochi and settle into your hotel. Explore Fort Kochi’s waterfront in the evening if time allows.",
      {
        image: image("/images/kochi.jpg", "Kochi waterfront"),
        activities: [
          activity(
            "Fort Kochi walk",
            "A gentle first look at the heritage neighbourhood.",
            "1–2 hours",
          ),
        ],
        meals: meals("Dinner"),
        overnightAt: "Kochi",
      },
    ),
    day(
      2,
      "Kochi to Munnar",
      "Leave the coast behind and travel into the Western Ghats, with waterfall and spice-garden stops along the way.",
      {
        image: image("/images/munnar.jpg", "Munnar tea gardens"),
        routeLegs: [
          {
            from: "Kochi",
            to: "Munnar",
            distanceKm: 130,
            estimatedTravelTime: "4–5 hours",
            mode: "Private road transfer",
          },
        ],
        activities: [
          activity(
            "Waterfall viewpoints",
            "Comfort stops on the scenic road.",
            "As time permits",
          ),
        ],
        meals: meals("Breakfast", "Dinner"),
        overnightAt: "Munnar",
      },
    ),
    day(
      3,
      "Munnar sightseeing",
      "Enjoy tea country, scenic viewpoints and the relaxed cool-climate rhythm of Munnar.",
      {
        image: image("/images/munnar-wide.jpg", "Munnar landscapes"),
        activities: [
          activity(
            "Eravikulam National Park area",
            "Highland scenery and viewpoints.",
            "2–3 hours",
          ),
          activity(
            "Tea garden circuit",
            "Estate landscapes and local stops.",
            "2 hours",
          ),
        ],
        meals: meals("Breakfast", "Dinner"),
        overnightAt: "Munnar",
      },
    ),
    day(
      4,
      "Munnar to Thekkady",
      "Journey through the hills to Thekkady and spend the evening surrounded by Kerala’s spice-country landscape.",
      {
        image: image("/images/thekkady.jpg", "Thekkady forest"),
        routeLegs: [
          {
            from: "Munnar",
            to: "Thekkady",
            distanceKm: 95,
            estimatedTravelTime: "3–4 hours",
            mode: "Private road transfer",
          },
        ],
        activities: [
          activity(
            "Spice plantation walk",
            "A relaxed, guided local experience.",
            "1 hour",
          ),
        ],
        meals: meals("Breakfast", "Dinner"),
        overnightAt: "Thekkady",
      },
    ),
    day(
      5,
      "Thekkady to Kumarakom",
      "Travel to Vembanad Lake for a peaceful resort stay and a quieter backwater experience.",
      {
        image: image("/images/hero.jpg", "Kerala backwater resort"),
        routeLegs: [
          {
            from: "Thekkady",
            to: "Kumarakom",
            distanceKm: 125,
            estimatedTravelTime: "4–4.5 hours",
            mode: "Private road transfer",
          },
        ],
        activities: [
          activity(
            "Sunset by Vembanad Lake",
            "A restful evening at the resort.",
            "At leisure",
          ),
        ],
        meals: meals("Breakfast", "Dinner"),
        overnightAt: "Kumarakom",
      },
    ),
    day(
      6,
      "Kumarakom to Alleppey",
      "Continue to Alleppey for a sunset cruise and an overnight stay on the canals.",
      {
        image: image("/images/hero.jpg", "Alleppey houseboat"),
        routeLegs: [
          {
            from: "Kumarakom",
            to: "Alleppey",
            distanceKm: 35,
            estimatedTravelTime: "1–1.5 hours",
            mode: "Private road transfer",
          },
        ],
        activities: [
          activity(
            "Private houseboat cruise",
            "Cruise among the canals and village waterways.",
            "Afternoon",
          ),
        ],
        meals: meals("Breakfast", "Lunch", "Dinner"),
        overnightAt: "Alleppey houseboat",
      },
    ),
    day(
      7,
      "Alleppey · Departure",
      "After breakfast, travel onward to Kochi for departure.",
      {
        image: image("/images/kochi.jpg", "Kochi harbour"),
        routeLegs: [
          {
            from: "Alleppey",
            to: "Kochi",
            distanceKm: 80,
            estimatedTravelTime: "2–2.5 hours",
            mode: "Private road transfer",
          },
        ],
        meals: meals("Breakfast"),
      },
    ),
  ],
  accommodation: {
    category: "Premium comfort stays",
    roomType: "Standard double room",
    occupancy: "2 guests per room",
    properties: [
      {
        location: "Kochi",
        nights: 1,
        hotelName: "Brunton Boatyard, Kochi",
        roomType: "Garden view room",
        mealPlan: "Breakfast",
      },
      {
        location: "Munnar",
        nights: 2,
        hotelName: "Fragrant Nature, Munnar",
        roomType: "Valley view room",
        mealPlan: "Breakfast and dinner",
      },
      {
        location: "Thekkady",
        nights: 1,
        hotelName: "Spice Village, Thekkady",
        roomType: "Garden room",
        mealPlan: "Breakfast and dinner",
      },
      {
        location: "Kumarakom",
        nights: 1,
        hotelName: "Coconut Lagoon, Kumarakom",
        roomType: "Heritage bungalow",
        mealPlan: "Breakfast and dinner",
      },
      {
        location: "Alleppey",
        nights: 1,
        hotelName: "Premium private houseboat",
        roomType: "Private cabin",
        mealPlan: "All meals",
      },
    ],
  },
  transport: privateKeralaTransport(
    ["Kochi airport", "Kochi railway station"],
    ["Kochi airport", "Kochi railway station"],
  ),
  inclusions: standardInclusions,
  exclusions: standardExclusions,
  importantInformation: standardImportantInformation,
  contact: {
    callToAction: "Plan this Kerala journey",
    whatsappEnabled: true,
    enquiryEnabled: true,
  },
  faq: commonFaq,
  seo: {
    metaTitle: "Classic Kerala: 7-Day Kochi to Alleppey Itinerary | Tripport",
    metaDescription:
      "A classic 7-day Kerala route through Kochi, Munnar, Thekkady, Kumarakom and Alleppey.",
    keywords: [
      "classic Kerala itinerary",
      "7 day Kerala itinerary",
      "Kochi Munnar Thekkady Alleppey tour",
    ],
  },
} satisfies TripPackage;

export default itinerary;
