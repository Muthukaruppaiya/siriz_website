export type PackageItem = {
  id: string
  name: string
  price: string
  priceNote: string
  description: string
  features: string[]
  image: string
  featured?: boolean
}

export const packages: PackageItem[] = [
  {
    id: 'modular-kitchen',
    name: 'Modular Kitchen',
    price: '₹69,000',
    priceNote: 'starting from',
    description:
      'Three layouts with components, accessories, and décor.',
    features: [
      '3 types of modular kitchen',
      '3 components of modular kitchen',
      'Kitchen accessories',
      'Décor',
    ],
    image: '/images/moodboard/mood-06.webp',
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    price: '₹1,00,000',
    priceNote: 'starting from',
    description:
      'Storage that fits your rooms, with your choice of doors.',
    features: [
      '3 types of wardrobe',
      '3 wardrobe accessories',
      '3 types of wardrobe doors',
      'Décor',
    ],
    image: '/images/gallery/interior-10.webp',
  },
  {
    id: 'full-home',
    name: 'Full Home Package',
    price: '₹3,25,000',
    priceNote: 'starting from',
    description:
      'Kitchen, living, bedroom, and décor as one turnkey plan.',
    features: ['Modular kitchen', 'Living room', 'Bedroom', 'Décor'],
    image: '/images/hero/hero-1.webp',
    featured: true,
  },
]

export const packageFaqs = [
  {
    q: 'How long does a turnkey project take?',
    a: 'We guarantee delivery within 45 days. Production and installation are scheduled up front once designs are finalised.',
  },
  {
    q: 'What warranty do I get?',
    a: 'Wooden work carries a 10-year warranty, and post-installation services continue for life.',
  },
  {
    q: 'Can I see the design before production starts?',
    a: 'Yes. Every design discussed with our team is shown to you in 3D before anything goes to the factory.',
  },
  {
    q: 'Which homes do you work on?',
    a: '1 BHK, 2 BHK, 3 BHK, and 4 BHK / duplex homes, plus individual rooms like kitchens and wardrobes.',
  },
  {
    q: 'Is the first consultation free?',
    a: 'Yes. Book a free online consultation and a designer will discuss your ideas, requirements, and initial concepts.',
  },
]
