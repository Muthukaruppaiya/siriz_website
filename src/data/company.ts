import { asset } from '../lib/asset'
export const aboutStory = [
  'With 11 years of experience, Siriz Interiors consistently exceeds expectations, bringing a unique touch to every home we design.',
  'Our design services meet international standards, turning a blank space into one that reflects your style.',
  'Our team plans, designs, and builds top-quality interiors, leaving admirable work everywhere we go.',
]

export const individuality =
  'Transparent pricing, customized designs, and flawless output are our keywords.'

export const coreValues = [
  {
    title: 'Creativity and innovation',
    body: 'Fresh ideas in every space we touch.',
  },
  {
    title: 'Transparent pricing',
    body: 'Clear packages and honest quotes.',
  },
  {
    title: 'Customized designs',
    body: 'Designed around the way you live.',
  },
  {
    title: 'Flawless output',
    body: 'Quality materials, factory-made, expertly fitted.',
  },
]

export const whySiriz = [
  {
    title: 'Justified pricing',
    body: 'Quality interiors at some of the most competitive prices in the market.',
  },
  {
    title: '10 years of warranty',
    body: 'On wooden work, with lifetime post-installation services.',
  },
  {
    title: 'Customer-friendly experience',
    body: 'Personal assistance based on your requirements.',
  },
  {
    title: '45 days guaranteed delivery',
    body: 'On-time delivery for every project.',
  },
  {
    title: 'Innovation+',
    body: 'Unique designs with innovative ideas.',
  },
  {
    title: 'Space planning designs',
    body: 'Functional layouts executed by our experts.',
  },
  {
    title: 'Own factory production',
    body: 'Consistent quality and reliable timelines.',
  },
  {
    title: 'Post-installation services',
    body: 'Lifetime service after you move in.',
  },
]

export const stats = [
  { value: 11, suffix: '', label: 'Years of experience' },
  { value: 600, suffix: '+', label: 'Happy clients' },
  { value: 45, suffix: '', label: 'Days guaranteed delivery' },
  { value: 10, suffix: '', label: 'Years of warranty' },
]

export const spaces = [
  {
    id: 'kitchen',
    title: 'Modular kitchens',
    body: 'Sleek, efficient, made for modern living.',
    image: asset('/images/moodboard/mood-05.webp'),
  },
  {
    id: 'living',
    title: 'Living rooms',
    body: 'Welcoming spaces for family and guests.',
    image: asset('/images/moodboard/mood-02.webp'),
  },
  {
    id: 'bedroom',
    title: 'Bedrooms',
    body: 'Serene retreats for true relaxation.',
    image: asset('/images/moodboard/mood-11.webp'),
  },
  {
    id: 'dining',
    title: 'Dining rooms',
    body: 'Elegant spaces that elevate every meal.',
    image: asset('/images/hero/hero-2.webp'),
  },
  {
    id: 'kids',
    title: 'Kids’ rooms',
    body: 'Playful, safe spaces to grow in.',
    image: asset('/images/gallery/interior-10.webp'),
  },
  {
    id: 'study',
    title: 'Study rooms',
    body: 'Clutter-free corners for focus.',
    image: asset('/images/projects/p3-01.webp'),
  },
  {
    id: 'pooja',
    title: 'Pooja units',
    body: 'Carved and lit for daily rituals.',
    image: asset('/images/moodboard/mood-10.webp'),
  },
  {
    id: 'balcony',
    title: 'Balconies',
    body: 'Cozy corners for leisure.',
    image: asset('/frames/balcony/0120.webp'),
  },
]

export const certificates = [
  { id: 'c1', image: asset('/images/certificates/certificate-1.webp'), caption: 'Award ceremony' },
  { id: 'c2', image: asset('/images/certificates/certificate-2.webp'), caption: 'Certificate of recognition' },
  { id: 'c4', image: asset('/images/certificates/certificate-4.webp'), caption: 'Excellence trophy' },
  { id: 'c5', image: asset('/images/certificates/certificate-5.webp'), caption: 'Certificate of recognition' },
]

export const materialPartners = [
  'b-01', 'b-02', 'b-03', 'b-04', 'b-05', 'b-06', 'b-07',
  'b-08', 'b-09', 'b-10', 'b-11', 'b-12', 'b-13',
].map((id) => asset(`/images/clients/${id}.webp`))

export const builderClients = ['new-1', 'new-2', 'new-3', 'new-4', 'new-5', 'new-6'].map(
  (id) => asset(`/images/clients/${id}.webp`),
)
