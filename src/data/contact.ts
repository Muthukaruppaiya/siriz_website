export const contact = {
  brand: 'Siriz Interiors',
  legalName: 'Siriz Interiors Pvt Ltd',
  tagline: 'Turnkey interiors for Chennai homes',
  phone: '+91 84384 23938',
  phoneHref: 'tel:+918438423938',
  whatsapp: '919384577177',
  whatsappDisplay: '+91 93845 77177',
  email: 'info@sirizinteriors.com',
  emailHref: 'mailto:info@sirizinteriors.com',
  address: {
    line1: '5th main road, Sivagami street',
    line2: 'Pearl Flora Building, Medavakkam',
    city: 'Chennai, Tamil Nadu 600100',
  },
  mapUrl: 'https://maps.app.goo.gl/48oasMs3wS6muE1JA',
  mapEmbed:
    'https://www.google.com/maps?q=Pearl+Flora+Building,+Sivagami+Street,+Medavakkam,+Chennai+600100&output=embed',
  yearsExperience: 11,
  social: {
    instagram: 'https://www.instagram.com/siriz_interiors',
    youtube: 'https://www.youtube.com/@siriz_interiors',
    facebook: 'https://www.facebook.com/SirizInteriorsPvtLtd',
  },
} as const

export const propertyTypes = ['1 BHK', '2 BHK', '3 BHK', '4 BHK / Duplex'] as const

export function whatsappUrl(message?: string): string {
  const text =
    message ?? "Hi Siriz Interiors, I'm interested in your interior designing."
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`
}
