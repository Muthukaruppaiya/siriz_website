import { useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const TRANSPARENT = 'rgba(0, 0, 0, 0)'

type Layer = {
  /** The element in the flow of `main`: the section, or the pin-spacer wrapping a pinned one. */
  box: HTMLElement
  section: HTMLElement
  /** Pinned by ScrollTrigger; it already holds still on its own and must keep the styles the pin sets. */
  pinned: boolean
}

/**
 * Stacks the page's top-level sections like cards. Each section scrolls until its content
 * ends, then holds still (background included) while the next section slides up over it.
 * Sections pinned by ScrollTrigger (marked `data-pinned`) only join the stacking order.
 */
export function useStackedSections(key: string): void {
  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    let layers: Layer[] = []
    let frame = 0

    const collect = (): Layer[] =>
      Array.from(main.children).flatMap((el): Layer[] => {
        if (!(el instanceof HTMLElement)) return []
        const isSpacer = el.classList.contains('pin-spacer')
        const section = (isSpacer ? el.firstElementChild : el) as HTMLElement | null
        if (!section || section.tagName !== 'SECTION') return []
        return [{ box: el, section, pinned: isSpacer || section.hasAttribute('data-pinned') }]
      })

    const place = () => {
      const vh = window.innerHeight
      layers.forEach(({ box, section, pinned }, i) => {
        const z = String(i + 1)
        if (pinned) {
          section.style.zIndex = z
          box.style.zIndex = z
          return
        }
        box.style.position = 'sticky'
        box.style.top = `${Math.min(0, vh - box.offsetHeight)}px`
        box.style.zIndex = z
      })
    }

    const resetLayer = ({ box, section }: Layer) => {
      box.style.position = ''
      box.style.top = ''
      box.style.zIndex = ''
      section.style.zIndex = ''
      if (section.dataset.stackBg) {
        section.style.backgroundColor = ''
        delete section.dataset.stackBg
      }
    }

    const sameLayers = (next: Layer[]) =>
      next.length === layers.length && next.every((l, i) => l.section === layers[i].section && l.box === layers[i].box)

    const build = () => {
      frame = 0
      const next = collect()
      if (sameLayers(next)) {
        place()
        return
      }
      layers.forEach(resetLayer)
      layers = next
      layers.forEach(({ section, pinned }) => {
        if (pinned) return
        const cs = getComputedStyle(section)
        if (cs.backgroundColor === TRANSPARENT && cs.backgroundImage === 'none') {
          section.style.backgroundColor = 'var(--color-bg)'
          section.dataset.stackBg = '1'
        }
      })
      resizeWatcher.disconnect()
      layers.forEach(({ box }) => resizeWatcher.observe(box))
      place()
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(build)
    }

    const resizeWatcher = new ResizeObserver(schedule)
    const childWatcher = new MutationObserver(schedule)
    childWatcher.observe(main, { childList: true })
    ScrollTrigger.addEventListener('refresh', schedule)
    window.addEventListener('resize', schedule)
    build()

    return () => {
      cancelAnimationFrame(frame)
      childWatcher.disconnect()
      resizeWatcher.disconnect()
      ScrollTrigger.removeEventListener('refresh', schedule)
      window.removeEventListener('resize', schedule)
      layers.forEach(resetLayer)
    }
  }, [key])
}
