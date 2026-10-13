export type TourItem = {
  id: string
  name: string
  label: string
  href: string
  image: string
}

const base = 'https://sirizinteriors.com/siriz-Interiors-360-vtour'

export const tours: TourItem[] = [
  {
    id: 'alpha',
    name: 'Alpha',
    label: 'Site 01',
    href: `${base}/site-1/index.htm`,
    image: '/images/tours/tour-1.webp',
  },
  {
    id: 'radiance-pride-2',
    name: 'Radiance Pride',
    label: 'Site 02',
    href: `${base}/site-2/index.htm`,
    image: '/images/tours/tour-2.webp',
  },
  {
    id: 'celesta',
    name: 'Celesta',
    label: 'Site 03',
    href: `${base}/site-3/index.htm`,
    image: '/images/tours/tour-3.webp',
  },
  {
    id: 'radiance-pride-1',
    name: 'Radiance Pride',
    label: 'Site 04',
    href: `${base}/site-4/index.htm`,
    image: '/images/tours/tour-4.webp',
  },
]
