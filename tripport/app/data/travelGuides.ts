export interface GuideQuickFact {
  label: string
  value: string
}

export interface TravelGuide {
  slug: string
  category: string
  title: string
  summary: string
  intro: string
  image: string
  readTime: string
  quickLook: GuideQuickFact[]
  takeaways: string[]
  sections: Array<{
    heading: string
    lead?: string
    paragraphs: string[]
  }>
  relatedItinerarySlugs: string[]
  seo: {
    metaTitle: string
    metaDescription: string
  }
}

export const travelGuides: TravelGuide[] = [
  {
    slug: 'best-time-to-visit-kerala',
    category: 'Seasonality',
    title: 'Best time to visit Kerala',
    summary: 'How Kerala’s seasons shape the right destinations, experiences and pace for your trip.',
    intro: 'Kerala can work beautifully across the year. The key is choosing a route that respects the season, the traveller profile and the experiences that matter most.',
    image: 'munnar.jpg',
    readTime: '5 min read',
    quickLook: [{ label: 'Classic season', value: 'October–February' }, { label: 'Monsoon mood', value: 'June–September' }, { label: 'Best all-round mix', value: 'Hills + backwaters' }],
    takeaways: ['Choose cool-weather routes from October to February for the broadest sightseeing mix.', 'Use Munnar, Wayanad or coastal stays to balance warmer months.', 'Treat monsoon as a slower, greener style of Kerala rather than a compromise.'],
    sections: [
      { heading: 'October to February', lead: 'The classic Kerala window.', paragraphs: ['This is the most popular period for first-time Kerala journeys. The hill stations feel cool, days are comfortable for sightseeing and the backwaters are especially enjoyable.', 'It is also the period when preferred hotels and houseboats fill quickly. For holiday dates and festive weeks, plan early so the route can retain a sensible pace.'] },
      { heading: 'March to May', lead: 'Warm days, rewarding contrasts.', paragraphs: ['The plains and coast are warmer, but this is still a strong time for travellers happy to use the hills and slower resort stays well. Munnar and Wayanad give welcome relief from the heat.', 'Keep drives early where possible, build in relaxed afternoons and favour a route with generous hotel time rather than a packed sightseeing schedule.'] },
      { heading: 'June to September', lead: 'Kerala at its greenest.', paragraphs: ['Monsoon transforms the landscape. Waterfalls are dramatic, the air feels fresh and the state takes on a quieter, more atmospheric character.', 'This is ideal for travellers drawn to wellness, rain-washed views and unhurried stays. Build a little flexibility into the plan, especially for outdoor experiences.'] },
    ],
    relatedItinerarySlugs: ['classic-kerala-6-nights', 'kerala-beach-backwater-5-nights', 'wayanad-north-kerala-5-nights'],
    seo: { metaTitle: 'Best Time to Visit Kerala | Tripport Travel Guide', metaDescription: 'A practical guide to Kerala weather, seasons and the best route ideas for each time of year.' },
  },
  {
    slug: 'kerala-route-guide',
    category: 'Route planning',
    title: 'How many days are enough for Kerala?',
    summary: 'A practical way to build 3-, 5-, 7- and 10-night Kerala journeys.',
    intro: 'The best Kerala itinerary is rarely the longest one. It is the one that gives every stop enough time and keeps the drive days in proportion.',
    image: 'hero.jpg',
    readTime: '6 min read',
    quickLook: [{ label: 'Short break', value: '3–4 nights' }, { label: 'Classic circuit', value: '5–7 nights' }, { label: 'Unhurried trip', value: '8+ nights' }],
    takeaways: ['Two or three stops are usually enough for a short Kerala break.', 'A 6–7 night journey can include Kochi, Munnar, Thekkady and the backwaters without rushing.', 'Extra nights are better spent slowing down than adding destinations.'],
    sections: [
      { heading: 'Three to four nights', lead: 'Keep the route focused.', paragraphs: ['Choose two or three stops and avoid trying to cover the whole state. Kochi, Munnar and Alleppey is a dependable short route because each place offers a distinct change of scene.', 'Let the first and last days stay light. The trip will feel much better when arrival and departure transfers are not competing with a long list of sights.'] },
      { heading: 'Five to seven nights', lead: 'The classic Kerala rhythm.', paragraphs: ['This duration suits the familiar Kochi–Munnar–Thekkady–Alleppey flow. It gives room for two nights in Munnar, a forest or spice-country stop and a backwater finish.', 'Use the extra night to improve the experience of a place rather than to add another long transfer. A slower Munnar day or resort evening is often the difference between a checklist and a holiday.'] },
      { heading: 'Eight nights or more', lead: 'Choose a stronger finish.', paragraphs: ['With more time, add a beach stay, Wayanad or a slower Kumarakom retreat. The additional nights make it possible to include a more deliberate mix of landscape and rest.', 'Think about the arrival and departure airports before finalising the sequence. A route that starts in Kochi and ends in Thiruvananthapuram can save a needless return drive.'] },
    ],
    relatedItinerarySlugs: ['munnar-alleppey-3-nights', 'classic-kerala-6-nights', 'complete-kerala-7-nights'],
    seo: { metaTitle: 'How Many Days Are Enough for Kerala? | Tripport', metaDescription: 'Plan the right Kerala itinerary duration, from short 3-night escapes to slower 8-night journeys.' },
  },
  {
    slug: 'munnar-thekkady-alleppey',
    category: 'Classic route',
    title: 'Munnar, Thekkady and Alleppey: the classic Kerala flow',
    summary: 'When this popular combination works best and where to add breathing room.',
    intro: 'This route works because it naturally moves from cool tea country to spice country and the backwaters, with each stop offering a different Kerala mood.',
    image: 'thekkady.jpg',
    readTime: '5 min read',
    quickLook: [{ label: 'Ideal duration', value: '5–7 nights' }, { label: 'Best for', value: 'First Kerala trips' }, { label: 'Route mood', value: 'Hills to water' }],
    takeaways: ['Give Munnar two nights whenever the route allows it.', 'Use Thekkady as a one- or two-night change of pace, not just a sightseeing stop.', 'Finish in the backwaters to let the trip slow down naturally.'],
    sections: [
      { heading: 'Begin in Munnar', lead: 'Give the hills time to breathe.', paragraphs: ['The Kochi to Munnar drive is scenic but substantial, so the first evening should be left intentionally open. Two nights allow the next day to feel like a true Munnar experience rather than a quick loop of viewpoints.', 'Tea estates, lake views and highland roads work best with a relaxed pace. Keep one part of the day unplanned for the hotel, a café or a quiet view.'] },
      { heading: 'Use Thekkady for contrast', lead: 'A different kind of green.', paragraphs: ['Thekkady brings a forested, spice-country atmosphere after Munnar’s open hills. A plantation visit, cultural evening or nature-led experience is usually enough to make the stop feel distinct.', 'Avoid treating it as another full sightseeing day. The appeal lies in the change of ambience and the chance to stay somewhere more intimate.'] },
      { heading: 'End in Alleppey', lead: 'Let the water set the pace.', paragraphs: ['A houseboat night is a memorable finale when the group wants the immersive experience. For travellers who prefer more facilities, Kumarakom or an Alleppey resort offers a different take on the same landscape.', 'Arrive with enough time to actually enjoy the waterways. A late arrival makes the experience feel compressed.'] },
    ],
    relatedItinerarySlugs: ['munnar-thekkady-alleppey-5-nights', 'classic-kerala-6-nights', 'kerala-honeymoon-5-nights'],
    seo: { metaTitle: 'Munnar, Thekkady & Alleppey Route Guide | Tripport', metaDescription: 'How to plan Kerala’s classic Munnar, Thekkady and Alleppey route with the right pace and number of nights.' },
  },
  {
    slug: 'kerala-honeymoon-routes',
    category: 'Traveller type',
    title: 'Kerala honeymoon routes that feel personal',
    summary: 'Choosing the right mix of hills, backwaters and quiet coastal stays.',
    intro: 'For couples, the secret is less moving around and more giving the trip a sense of space. Great stays and unhurried moments matter more than an exhaustive list of stops.',
    image: 'varkala.jpg',
    readTime: '4 min read',
    quickLook: [{ label: 'Ideal duration', value: '5–7 nights' }, { label: 'Best mix', value: 'Hills + water' }, { label: 'Priority', value: 'Stay quality' }],
    takeaways: ['Choose three or four destinations, not a packed circuit.', 'Pair Munnar with a houseboat, Marari, Varkala or Kovalam for contrast.', 'Plan one or two meaningful private moments rather than filling every day.'],
    sections: [
      { heading: 'Keep the route intimate', lead: 'More space, fewer check-ins.', paragraphs: ['A honeymoon works best when the route leaves time to arrive, settle in and enjoy the hotel. Three or four destinations are usually enough for six or seven nights.', 'Choose your hotel nights first, then fit the drives around them. This naturally creates a more restorative rhythm.'] },
      { heading: 'Mix landscapes', lead: 'Contrast makes the trip memorable.', paragraphs: ['Munnar and the backwaters remain a beautiful combination: cool hills followed by quiet water. Add a coast stay if the trip has enough days and the couple wants a slower finale.', 'The landscape shift should feel intentional. Aim for a journey with a clear beginning, middle and soft landing.'] },
      { heading: 'Prioritise meaningful details', lead: 'Small moments carry the trip.', paragraphs: ['A private dinner, a thoughtful room category or a sunset cruise can matter more than another attraction. Keep the experiences personal and leave room for spontaneity.', 'The best romantic routes feel considered without feeling over-programmed.'] },
    ],
    relatedItinerarySlugs: ['kerala-honeymoon-5-nights', 'luxury-kerala-backwaters-6-nights', 'kerala-beach-backwater-5-nights'],
    seo: { metaTitle: 'Kerala Honeymoon Route Ideas | Tripport', metaDescription: 'Plan a relaxed Kerala honeymoon with the right mix of Munnar, backwaters and quiet coastal stays.' },
  },
  {
    slug: 'kerala-family-planning',
    category: 'Traveller type',
    title: 'Planning a family-friendly Kerala itinerary',
    summary: 'Pacing, drive times and experiences that work well for families.',
    intro: 'Families respond best to sensible drive times, room for rest and destinations with a clear variety of experiences. The smartest routes stay engaging without keeping everyone in motion.',
    image: 'kochi.jpg',
    readTime: '5 min read',
    quickLook: [{ label: 'Best duration', value: '6–8 nights' }, { label: 'Drive rhythm', value: 'One major transfer at a time' }, { label: 'Stay priority', value: 'Space + facilities' }],
    takeaways: ['Avoid stacking a long transfer and a full sightseeing programme on the same day.', 'Hotels with space, pools and gardens often matter more than an extra stop.', 'Keep one day or half day deliberately light for every few active days.'],
    sections: [
      { heading: 'Manage the transfers', lead: 'Make moving days easier.', paragraphs: ['Kerala’s landscapes change quickly, but the roads through the hills take time. Build in slower mornings and comfort stops, especially when travelling with younger children or grandparents.', 'The arrival day should be gentle. A calm first evening makes the rest of the trip feel much easier.'] },
      { heading: 'Choose stays with space', lead: 'The hotel is part of the holiday.', paragraphs: ['Family-friendly resorts, connected rooms and easy access to gardens or a pool can make a bigger difference than an additional sightseeing stop.', 'Ask early about room configuration, beds and luggage. It helps us match the right vehicle and stay from the beginning.'] },
      { heading: 'Leave some time unplanned', lead: 'The best memories are often unstructured.', paragraphs: ['A backwater sunset, a pool afternoon or an easy tea-garden walk can become the part everyone remembers. Keep the route flexible enough for the group’s energy on the day.', 'Choose a mix of gentle nature, local food and restful hotel time rather than a long activity list.'] },
    ],
    relatedItinerarySlugs: ['kerala-family-holiday-6-nights', 'classic-kerala-6-nights', 'complete-kerala-7-nights'],
    seo: { metaTitle: 'Planning a Family-Friendly Kerala Itinerary | Tripport', metaDescription: 'Practical advice for building a relaxed Kerala family holiday with smart drive times and suitable stays.' },
  },
  {
    slug: 'kerala-houseboat-guide',
    category: 'Experiences',
    title: 'How to plan a Kerala houseboat experience',
    summary: 'A decision guide for shaping an Alleppey or Kumarakom backwater stay.',
    intro: 'A houseboat can be one of Kerala’s most memorable experiences when it fits the pace, profile and expectations of the traveller.',
    image: 'hero.jpg',
    readTime: '4 min read',
    quickLook: [{ label: 'Ideal stay', value: 'One night' }, { label: 'Best setting', value: 'Private groups or couples' }, { label: 'Alternative', value: 'Lakefront resort' }],
    takeaways: ['An overnight houseboat works best when you can arrive in time for the afternoon cruise.', 'Discuss cabin type, route and meal preferences before confirming.', 'Choose a resort in Kumarakom or Alleppey when facilities and flexibility matter more.'],
    sections: [
      { heading: 'Overnight or day cruise?', lead: 'Choose the pace first.', paragraphs: ['An overnight houseboat works well for travellers who want to settle into the backwaters and slow down. It is especially suited to couples, families and small private groups.', 'A day cruise can be a better choice for larger groups or travellers who prefer to sleep in a resort with more facilities.'] },
      { heading: 'Set the right expectations', lead: 'A little planning makes a difference.', paragraphs: ['Cabin quality, arrival timing, route and meals all shape the experience. Discuss these before confirmation rather than treating every houseboat as interchangeable.', 'The most enjoyable stays begin early enough to spend the afternoon on the water, not simply to arrive in time for dinner.'] },
      { heading: 'Consider the alternatives', lead: 'Backwaters without a houseboat night.', paragraphs: ['Kumarakom and Alleppey resorts offer the same water-led atmosphere with more room, facilities and privacy. Pair a resort stay with a sunset cruise for a softer alternative.', 'This can be particularly appealing for families, wellness travellers or anyone who wants a more flexible evening.'] },
    ],
    relatedItinerarySlugs: ['munnar-alleppey-3-nights', 'kochi-munnar-alleppey-4-nights', 'classic-kerala-6-nights'],
    seo: { metaTitle: 'How to Plan a Kerala Houseboat Experience | Tripport', metaDescription: 'Understand overnight Kerala houseboats, day cruises and backwater resort alternatives before you plan.' },
  },
]

export function findTravelGuide(slug: string) {
  return travelGuides.find(guide => guide.slug === slug)
}
