import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Fade-up reveal for `[data-item]` children of `ref`, re-run whenever `key` changes. */
export function useLocalReveal(ref: RefObject<HTMLElement | null>, key: unknown): void {
  useLayoutEffect(() => {
    const root = ref.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-item]', root)
      gsap.set(items, { autoAlpha: 0, y: 40 })
      ScrollTrigger.batch(items, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: 'expo.out',
            stagger: 0.08,
            overwrite: true,
          }),
      })
    }, root)

    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 100)
    return () => {
      window.clearTimeout(timer)
      ctx.revert()
    }
  }, [ref, key])
}
