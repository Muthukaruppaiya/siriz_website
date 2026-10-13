export type ProcessStep = {
  step: number
  title: string
  body: string
}

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Meet a designer',
    body: 'Plan your home with a Siriz designer.',
  },
  {
    step: 2,
    title: "Let's start designing",
    body: 'Shaped by your ideas and our architect’s suggestions.',
  },
  {
    step: 3,
    title: 'View designs in 3D',
    body: 'Review every design in 3D before we build.',
  },
  {
    step: 4,
    title: 'Plan',
    body: 'Production and execution are scheduled.',
  },
  {
    step: 5,
    title: 'Production at our factory',
    body: 'Your finalised materials are made in-house.',
  },
  {
    step: 6,
    title: 'Move in',
    body: 'No more waiting. Welcome to your dream home.',
  },
]
