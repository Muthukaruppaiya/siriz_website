import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

let activeLenis: Lenis | null = null

export function scrollToY(y: number, immediate = false): void {
  if (activeLenis) {
    activeLenis.scrollTo(y, { duration: immediate ? 0 : 1.6, immediate })
  } else {
    window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' })
  }
}

export function scrollToElement(el: HTMLElement): void {
  if (activeLenis) activeLenis.scrollTo(el, { offset: -72, duration: 1.6 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

export function lockScroll(locked: boolean): void {
  document.documentElement.classList.toggle('scroll-locked', locked)
  if (locked) activeLenis?.stop()
  else activeLenis?.start()
}

export function useLenis(): void {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({
      lerp: 0.075,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.4,
      smoothWheel: true,
      anchors: { offset: -72 },
      autoRaf: false,
    })
    activeLenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      lenis.destroy()
      activeLenis = null
    }
  }, [reducedMotion])
}
