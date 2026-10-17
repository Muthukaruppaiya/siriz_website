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
 *   data-skew              leans with scroll velocity, settles when scrolling stops
 *   data-speed="60"        drifts ±N px against the scroll (desktop only)
 *   data-focus             brightens and settles as it reaches the middle of the viewport
 *   data-scroll-x="-25"    slides horizontally by N% while its parent crosses the viewport
 *   data-marquee           CSS marquee speeds up with scroll and reverses when scrolling up
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
        gsap.set(words, { yPercent: 120, rotate: 8, transformOrigin: '0% 100%' })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 90%',
          once: true,
          onEnter: () =>
            gsap.to(words, {
              yPercent: 0,
              rotate: 0,
              duration: 1.3,
              ease: 'expo.out',
              stagger: 0.045,
            }),
        })
      })

      gsap.utils.toArray<HTMLElement>('[data-focus]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.35, x: compact ? 0 : 24 },
          {
            opacity: 1,
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              end: 'top 72%',
              scrub: 0.4,
            },
          },
        )
      })

      gsap.utils.toArray<HTMLElement>('[data-scroll-x]').forEach((el) => {
        const amount = Number(el.dataset.scrollX) || -20
        gsap.fromTo(
          el,
          { xPercent: amount > 0 ? -amount : 0 },
          {
            xPercent: amount > 0 ? 0 : amount,
            ease: 'none',
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          },
        )
      })

      if (!compact) {
        gsap.utils.toArray<HTMLElement>('[data-speed]').forEach((el) => {
          const amount = Number(el.dataset.speed) || 40
          gsap.fromTo(
            el,
            { y: amount },
            {
              y: -amount,
              ease: 'none',
              scrollTrigger: {
                trigger: el.closest('section') ?? el,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.4,
              },
            },
          )
        })
      }

      const skewTargets = gsap.utils.toArray<HTMLElement>('[data-skew]')
      const marqueeAnims = gsap.utils
        .toArray<HTMLElement>('[data-marquee]')
        .flatMap((el) => el.getAnimations())
      if (skewTargets.length || marqueeAnims.length) {
        const setSkew = skewTargets.length ? gsap.quickSetter(skewTargets, 'skewY', 'deg') : null
        const clampSkew = gsap.utils.clamp(compact ? -1.5 : -3, compact ? 1.5 : 3)
        const motion = { skew: 0, rate: 1 }
        const apply = () => {
          setSkew?.(motion.skew)
          marqueeAnims.forEach((anim) => {
            anim.playbackRate = motion.rate
          })
        }
        gsap.set(skewTargets, { transformOrigin: 'center center', force3D: true })
        ScrollTrigger.create({
          onUpdate: (self) => {
            const velocity = self.getVelocity()
            const skew = clampSkew(velocity / -320)
            const rate = (1 + Math.min(Math.abs(velocity) / 350, 5)) * (self.direction < 0 ? -1 : 1)
            if (Math.abs(skew) > Math.abs(motion.skew) || Math.abs(rate) > Math.abs(motion.rate)) {
              motion.skew = skew
              motion.rate = rate
              gsap.to(motion, {
                skew: 0,
                rate: self.direction < 0 ? -1 : 1,
                duration: 0.9,
                ease: 'power3.out',
                overwrite: true,
                onUpdate: apply,
              })
            }
          },
        })
      }

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
    const timer = window.setTimeout(refresh, 800)
    window.addEventListener('load', refresh)

    let lastHeight = document.body.scrollHeight
    let resizeTimer = 0
    const heightWatcher = new ResizeObserver(() => {
      const height = document.body.scrollHeight
      if (Math.abs(height - lastHeight) < 2) return
      lastHeight = height
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(refresh, 200)
    })
    heightWatcher.observe(document.body)

    return () => {
      heightWatcher.disconnect()
      window.clearTimeout(resizeTimer)
      window.clearTimeout(timer)
      window.removeEventListener('load', refresh)
      ctx.revert()
      document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((el) =>
        el.getAnimations().forEach((anim) => {
          anim.playbackRate = 1
        }),
      )
    }
  }, [key, reducedMotion])
}
