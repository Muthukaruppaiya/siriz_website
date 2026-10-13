import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Site-wide scroll choreography driven by data attributes:
 *   data-reveal            fade up on enter ("fade" | "left" | "right" | "scale" variants)
 *   data-reveal-stagger    children fade up in sequence
 *   data-reveal-clip       media wipes open from the bottom, inner img/video settles from zoom
 *   data-split             words rise from a mask (rendered by <SplitText>)
 *   data-words             words brighten as the paragraph scrolls through (rendered by <ScrollWords>)
 *   data-parallax="12"     drifts by ±N% while its parent crosses the viewport
 *   data-fade-out          fades and lifts away as it scrolls off the top
 *   data-draw              scaleY 0 → 1 while its parent scrolls (timeline lines)
 */
export function useScrollEffects(key: string): void {
  const reducedMotion = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (reducedMotion) return

    const compact = window.matchMedia('(max-width: 899px)').matches
    const ctx = gsap.context(() => {
      const offsets: Record<string, gsap.TweenVars> = compact
        ? { up: { y: 32 }, fade: {}, left: { y: 32 }, right: { y: 32 }, scale: { scale: 0.96 } }
        : {
            up: { y: 56 },
            fade: {},
            left: { x: -56 },
            right: { x: 56 },
            scale: { scale: 0.94 },
          }

      const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]')
      reveals.forEach((el) => {
        gsap.set(el, { autoAlpha: 0, ...offsets[el.dataset.reveal || 'up'] })
      })
      ScrollTrigger.batch(reveals, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 1.3,
            ease: 'expo.out',
            stagger: 0.12,
            overwrite: true,
          }),
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal-stagger]').forEach((group) => {
        const items = Array.from(group.children)
        gsap.set(items, { autoAlpha: 0, y: compact ? 28 : 48 })
        ScrollTrigger.create({
          trigger: group,
          start: 'top 88%',
          once: true,
          onEnter: () =>
            gsap.to(items, {
              autoAlpha: 1,
              y: 0,
              duration: 1.2,
              ease: 'expo.out',
              stagger: 0.09,
            }),
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-reveal-clip]').forEach((el) => {
        const media = el.querySelector('img, video')
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        })
        tl.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' },
        )
        if (media) {
          tl.fromTo(
            media,
            { scale: 1.3 },
            { scale: 1, duration: 1.9, ease: 'expo.out' },
            0,
          )
        }
      })

      gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
        const words = el.querySelectorAll('[data-word]')
        gsap.set(words, { yPercent: 110 })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () =>
            gsap.to(words, {
              yPercent: 0,
              duration: 1.2,
              ease: 'expo.out',
              stagger: 0.035,
            }),
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-words]').forEach((el) => {
        gsap.fromTo(
          el.querySelectorAll('[data-word]'),
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              end: 'bottom 45%',
              scrub: 0.8,
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        const amount = Number(el.dataset.parallax) || 10
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-fade-out]').forEach((el) => {
        gsap.to(el, {
          autoAlpha: 0,
          y: -90,
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: 'top top',
            end: 'bottom 25%',
            scrub: true,
          },
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-draw]').forEach((el) => {
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: 0.6,
            },
          },
        )
      })
    })

    const refresh = () => ScrollTrigger.refresh()
    const timer = window.setTimeout(refresh, 600)
    window.addEventListener('load', refresh)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [key, reducedMotion])
}
