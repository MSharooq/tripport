export function useEnquiry() {
  const isEnquiryOpen = useState('tripport-enquiry-open', () => false)
  const selectedItinerary = useState('tripport-selected-itinerary', () => '')

  function openEnquiry(itineraryTitle = '') {
    selectedItinerary.value = itineraryTitle
    isEnquiryOpen.value = true
  }

  function closeEnquiry() {
    isEnquiryOpen.value = false
  }

  return { isEnquiryOpen, selectedItinerary, openEnquiry, closeEnquiry }
}
