import { asset } from '../lib/asset'
import { contact } from './contact'

export type GalleryImage = {
  src: string
  alt: string
}

export type Project = {
  id: string
  number: string
  title: string
  summary: string
  cover: string
  images: GalleryImage[]
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1)
const pad = (n: number) => String(n).padStart(2, '0')

function projectImages(project: number, count: number, label: string): GalleryImage[] {
  return range(count).map((i) => ({
    src: asset(`/images/projects/p${project}-${pad(i)}.webp`),
    alt: `${label}, view ${i}`,
  }))
}

export const projects: Project[] = [
  {
    id: 'project-01',
    number: '01',
    title: 'Full home, warm modern',
    summary: 'Bedrooms, kitchen, living and dining with layered ceiling lighting throughout.',
    cover: asset('/images/projects/p1-04.webp'),
    images: projectImages(1, 11, 'Project 01'),
  },
  {
    id: 'project-02',
    number: '02',
    title: 'Feature walls and textures',
    summary: 'Stone cladding, patterned wallpaper, and an open kitchen with dining.',
    cover: asset('/images/projects/p2-02.webp'),
    images: projectImages(2, 6, 'Project 02'),
  },
  {
    id: 'project-03',
    number: '03',
    title: 'Bright family apartment',
    summary: 'Clean white living spaces, display units, and a calm master bedroom.',
    cover: asset('/images/projects/p3-02.webp'),
    images: projectImages(3, 6, 'Project 03'),
  },
  {
    id: 'project-04',
    number: '04',
    title: 'Colour-led kitchen and pooja',
    summary: 'A yellow-accent modular kitchen, carved pooja door, and media walls.',
    cover: asset('/images/projects/p4-05.webp'),
    images: projectImages(4, 9, 'Project 04'),
  },
  {
    id: 'project-05',
    number: '05',
    title: 'Contemporary residence',
    summary: 'Dark accent walls, a bar-style kitchen, and entertainment-ready living.',
    cover: asset('/images/projects/p5-03.webp'),
    images: projectImages(5, 11, 'Project 05'),
  },
]

export const signature: GalleryImage[] = range(13).map((i) => ({
  src: asset(`/images/signature/signature-${pad(i)}.webp`),
  alt: `Siriz Signature luxury interior ${i}`,
}))

export const moodboard: GalleryImage[] = range(16).map((i) => ({
  src: asset(`/images/moodboard/mood-${pad(i)}.webp`),
  alt: `Siriz mood board design ${i}`,
}))

export const interiors: GalleryImage[] = range(10).map((i) => ({
  src: asset(`/images/gallery/interior-${pad(i)}.webp`),
  alt: `Siriz interior gallery ${i}`,
}))

export const films = [
  { id: 'living', title: 'Living hall build', src: asset('/video/living-hall.mp4'), poster: asset('/frames/living/0120.webp') },
  { id: 'kitchen', title: 'Modular kitchen build', src: asset('/video/kitchen.mp4'), poster: asset('/frames/kitchen/0120.webp') },
  { id: 'bedroom', title: 'Bedroom build', src: asset('/video/bedroom.mp4'), poster: asset('/frames/bedroom/0120.webp') },
  { id: 'balcony', title: 'Balcony build', src: asset('/video/balcony.mp4'), poster: asset('/frames/balcony/0120.webp') },
]

export const youtubeHighlights = range(4).map((i) => ({
  id: `yt-${i}`,
  image: asset(`/images/videos/thumb-${i}.webp`),
  href: contact.social.youtube,
}))

export const portfolioTabs = [
  { id: 'projects', label: 'Projects', count: projects.length },
  { id: 'signature', label: 'Siriz Signature', count: signature.length },
  { id: 'moodboard', label: 'Mood board', count: moodboard.length },
  { id: 'interiors', label: 'Interiors', count: interiors.length },
  { id: 'films', label: 'Films', count: films.length + youtubeHighlights.length },
] as const

export type PortfolioTab = (typeof portfolioTabs)[number]['id']
