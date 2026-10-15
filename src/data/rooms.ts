import { asset } from '../lib/asset'
export type RoomJourneyItem = {
  id: string
  name: string
  title: string
  body: string
  videoSrc: string
  /** Folder under public/ holding 0001.webp … NNNN.webp */
  framesPath: string
  frameCount: number
}

const FRAME_COUNT = 120

export function frameUrl(room: RoomJourneyItem, index: number): string {
  return `${room.framesPath}/${String(index + 1).padStart(4, '0')}.webp`
}

export const buildStages = [
  { at: 0, label: 'Bare shell' },
  { at: 0.1, label: 'Design & planning' },
  { at: 0.45, label: 'Installation' },
  { at: 0.85, label: 'Handover' },
] as const

export const roomJourney: RoomJourneyItem[] = [
  {
    id: 'living',
    name: 'Living',
    title: 'Gathering spaces with quiet presence',
    body: 'From bare plaster to warm materials and measured light.',
    videoSrc: asset('/video/living-hall.mp4'),
    framesPath: asset('/frames/living'),
    frameCount: FRAME_COUNT,
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    title: 'Modular kitchens built for real cooking',
    body: 'Walnut, stone, and soft-close storage, from ₹69,000.',
    videoSrc: asset('/video/kitchen.mp4'),
    framesPath: asset('/frames/kitchen'),
    frameCount: FRAME_COUNT,
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    title: 'Rest rooms tuned to your routine',
    body: 'Wardrobes and lighting, built at our factory, fitted on site.',
    videoSrc: asset('/video/bedroom.mp4'),
    framesPath: asset('/frames/bedroom'),
    frameCount: FRAME_COUNT,
  },
  {
    id: 'balcony',
    name: 'Balcony',
    title: 'Outdoor edges that extend the home',
    body: 'Seating, planting, and evening light in the same 45-day plan.',
    videoSrc: asset('/video/balcony.mp4'),
    framesPath: asset('/frames/balcony'),
    frameCount: FRAME_COUNT,
  },
]
