export type EnquiryType = 'package' | 'planning'

export interface EnquiryContext {
  itineraryTitle?: string
  enquiryType?: EnquiryType
  travelMonth?: string
  travellers?: number
}

export function useEnquiry() {
  const isEnquiryOpen = useState('tripport-enquiry-open', () => false)
  const selectedItinerary = useState('tripport-selected-itinerary', () => '')
  const enquiryContext = useState<EnquiryContext>('tripport-enquiry-context', () => ({
    enquiryType: 'planning',
    travellers: 2,
  }))

  function openEnquiry(input: string | EnquiryContext = '') {
    const context = typeof input === 'string'
      ? {
          itineraryTitle: input,
          enquiryType: input ? 'package' as const : 'planning' as const,
          travellers: 2,
        }
      : {
          enquiryType: input.itineraryTitle ? 'package' as const : 'planning' as const,
          travellers: 2,
          ...input,
        }

    selectedItinerary.value = context.itineraryTitle ?? ''
    enquiryContext.value = context
    isEnquiryOpen.value = true
  }

  function closeEnquiry() {
    isEnquiryOpen.value = false
  }

  return { isEnquiryOpen, selectedItinerary, enquiryContext, openEnquiry, closeEnquiry }
}
