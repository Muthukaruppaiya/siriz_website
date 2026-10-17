import { useLayoutEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

let activeLenis: Lenis | null = null
let lockedY = 0
let isLocked = false

export function scrollToY(y: number, immediate = false): void {
  if (activeLenis) {
    activeLenis.scrollTo(y, { duration: immediate ? 0 : 1.15, immediate, force: true })
  } else {
    window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' })
  }
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

type GlideOptions = {
  /** Ignore wheel and touch input until the glide lands. */
  lock?: boolean
  onComplete?: () => void
}

/** Eased scroll that starts and lands softly; used for moving between scenes. */
export function glideTo(y: number, duration = 0.9, { lock = false, onComplete }: GlideOptions = {}): void {
  if (activeLenis) {
    activeLenis.scrollTo(y, { duration, easing: easeInOutCubic, force: true, lock, onComplete: () => onComplete?.() })
  } else {
    window.scrollTo({ top: y, behavior: 'smooth' })
    if (onComplete) window.setTimeout(onComplete, duration * 1000)
  }
}

export function scrollToElement(el: HTMLElement): void {
  if (activeLenis) activeLenis.scrollTo(el, { offset: -72, duration: 1.15, force: true })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function lockScroll(locked: boolean): void {
  if (locked) {
    if (!isLocked) lockedY = window.scrollY
    isLocked = true
    document.documentElement.classList.add('scroll-locked')
    activeLenis?.stop()
    return
  }
  if (!isLocked) return
  isLocked = false
  document.documentElement.classList.remove('scroll-locked')
  activeLenis?.start()
  if (Math.abs(window.scrollY - lockedY) > 1) {
    if (activeLenis) activeLenis.scrollTo(lockedY, { immediate: true, force: true })
    else window.scrollTo(0, lockedY)
  }
}

export function useLenis(): void {
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (reducedMotion) return

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.9,
      smoothWheel: true,
      anchors: { offset: -72 },
      autoRaf: false,
      stopInertiaOnNavigate: true,
    })
    activeLenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const refresh = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(refresh)
      gsap.ticker.remove(ticker)
      lenis.destroy()
      if (activeLenis === lenis) activeLenis = null
    }
  }, [reducedMotion])
}
