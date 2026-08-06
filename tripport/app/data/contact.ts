function formatIndianMobileNumber(phoneNumber: string) {
  return `+91 ${phoneNumber.slice(0, 5)} ${phoneNumber.slice(5)}`
}

export const tripportContact = {
  countryCallingCode: '91',
  phoneNumber: '9633191900',
  email: 'b2b@tripport.in',
  location: 'Kochi, Kerala, India',

  get phoneDisplay() {
    return formatIndianMobileNumber(this.phoneNumber)
  },

  get phoneHref() {
    return `tel:+${this.countryCallingCode}${this.phoneNumber}`
  },

  get whatsappNumber() {
    return `${this.countryCallingCode}${this.phoneNumber}`
  },
}

export function getWhatsAppLink(message?: string) {
  const url = new URL(`https://wa.me/${tripportContact.whatsappNumber}`)

  if (message) url.searchParams.set('text', message)

  return url.toString()
}
