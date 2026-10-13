import { frameUrl, type RoomJourneyItem } from '../../data/rooms'

const CONCURRENCY = 6

function coarseToFine(count: number): number[] {
  const order = [0, count - 1]
  const seen = new Set(order)
  for (const step of [24, 12, 6, 3, 1]) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i)
        order.push(i)
      }
    }
  }
  return order
}

export class FrameSequence {
  private frames: (HTMLImageElement | null)[][]
  private queue: { room: number; frame: number }[] = []
  private inFlight = 0
  private destroyed = false
  private rooms: RoomJourneyItem[]
  private onLoad: () => void

  constructor(rooms: RoomJourneyItem[], onLoad: () => void) {
    this.rooms = rooms
    this.onLoad = onLoad
    this.frames = rooms.map((room) => new Array(room.frameCount).fill(null))

    // First frame of every room up front so room-to-room transitions never flash empty.
    rooms.forEach((_, room) => this.queue.push({ room, frame: 0 }))
    rooms.forEach((room, index) => {
      coarseToFine(room.frameCount)
        .filter((frame) => frame !== 0)
        .forEach((frame) => this.queue.push({ room: index, frame }))
    })
  }

  start(): void {
    this.pump()
  }

  exact(room: number, frame: number): HTMLImageElement | null {
    return this.frames[room]?.[frame] ?? null
  }

  nearest(room: number, frame: number): HTMLImageElement | null {
    const list = this.frames[room]
    if (!list) return null
    if (list[frame]) return list[frame]
    for (let d = 1; d < list.length; d++) {
      const before = frame - d >= 0 ? list[frame - d] : null
      if (before) return before
      const after = frame + d < list.length ? list[frame + d] : null
      if (after) return after
    }
    return null
  }

  destroy(): void {
    this.destroyed = true
    this.queue = []
  }

  private pump(): void {
    while (!this.destroyed && this.inFlight < CONCURRENCY && this.queue.length) {
      const { room, frame } = this.queue.shift()!
      this.inFlight++

      const img = new Image()
      img.decoding = 'async'
      img.src = frameUrl(this.rooms[room], frame)
      img
        .decode()
        .then(() => {
          if (this.destroyed) return
          this.frames[room][frame] = img
          this.onLoad()
        })
        .catch(() => undefined)
        .finally(() => {
          this.inFlight--
          this.pump()
        })
    }
  }
}
