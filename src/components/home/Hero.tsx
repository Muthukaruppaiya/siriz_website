import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contact, whatsappUrl } from '../../data/contact'
import { frameUrl, roomJourney } from '../../data/rooms'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { glideTo } from '../../hooks/useLenis'
import { SplitText } from '../motion/SplitText'
import { Button } from '../shared/Button'
import styles from './Hero.module.css'

gsap.registerPlugin(ScrollTrigger)

/** Timeline time each scene rests on screen, relative to a transition of 1. */
const HOLD = 0.8
/** Viewport heights of scroll per scene change. */
const SCROLL_PER_SCENE = 1.15
/** Seconds for the glide from one scene to the next. */
const GLIDE = 1
/** A pause this long between wheel events starts a new gesture; anything shorter is the same flick. */
const GESTURE_GAP_MS = 220
/** After a glide lands, weak trailing momentum from the same flick is ignored for this long. */
const COOLDOWN_MS = 450
/** Wheel deltas below this are the fading tail of trackpad momentum, never a fresh scroll. */
const MOMENTUM_DELTA = 8
/** Finger travel before a swipe counts as a scene change. */
const SWIPE_PX = 36
/** Quiet time after the last scroll frame before settling onto a scene (scrollbar drags, etc.). */
const SETTLE_MS = 160

const pad = (n: number) => String(n).padStart(2, '0')
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1)

const transitionAt = (i: number) => (i - 1) * (1 + HOLD) + HOLD

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  return reducedMotion ? <StaticScenes /> : <PinnedScenes />
}

function PinnedScenes() {
  const rootRef = useRef<HTMLElement>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([])
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const goToRef = useRef<(i: number) => void>(() => undefined)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const count = roomJourney.length
    let current = 0
    let settleTimer = 0
    let direction = 1
    let gliding = false
    let glideFallback = 0
    let cooldownUntil = 0
    let scenePoints: number[] = []

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>('[data-scene]')
      const inners = layers.map((l) => l.querySelector('[data-inner]'))
      const medias = layers.map((l) => l.querySelector('[data-media]'))
      const dims = layers.map((l) => l.querySelector('[data-dim]'))
      const copies = gsap.utils.toArray<HTMLElement>('[data-copy]')
      const lines = copies.map((c) => c.querySelectorAll('[data-line]'))

      gsap.set(copies.slice(1), { autoAlpha: 0 })
      gsap.set(medias, { force3D: true })

      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      const labels = [0]

      for (let i = 1; i < count; i++) {
        const at = transitionAt(i)
        tl.to(lines[i - 1], { y: -56, autoAlpha: 0, stagger: 0.04, duration: 0.42, ease: 'power2.in' }, at)
          .set(copies[i - 1], { autoAlpha: 0 }, at + 0.45)
          .fromTo(layers[i], { yPercent: 100 }, { yPercent: 0, duration: 1, ease: 'power3.inOut' }, at)
          .fromTo(inners[i], { yPercent: -75 }, { yPercent: 0, duration: 1, ease: 'power3.inOut' }, at)
          .fromTo(medias[i], { scale: 1.2 }, { scale: 1.02, duration: 1.1, ease: 'power2.out' }, at)
          .to(medias[i - 1], { scale: 1.1, yPercent: -12, duration: 1, ease: 'power2.in' }, at)
          .to(dims[i - 1], { opacity: 0.85, duration: 1 }, at)
          .set(copies[i], { autoAlpha: 1 }, at + 0.45)
          .fromTo(
            lines[i],
            { y: 72, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.55, ease: 'power3.out' },
            at + 0.48,
          )
        labels.push(at + 1 + HOLD / 2)
      }
      tl.to({}, { duration: HOLD }, transitionAt(count - 1) + 1)

      scenePoints = labels.map((t) => t / tl.duration())

      const settle = () => {
        const st = triggerRef.current
        if (!st || gliding) return
        const y = window.scrollY
        if (y <= st.start + 1 || y >= st.end - 1) return
        const ys = scenePoints.map((p) => st.start + p * (st.end - st.start))
        const target =
          direction > 0
            ? (ys.find((v) => v >= y - 2) ?? st.end)
            : ([...ys].reverse().find((v) => v <= y + 2) ?? st.start)
        if (Math.abs(target - y) < 2) return
        glideTo(target, 0.7)
      }

      const update = (self: ScrollTrigger) => {
        if (self.direction) direction = self.direction
        const t = self.progress * tl.duration()
        let next = 0
        for (let i = 1; i < count; i++) if (t >= transitionAt(i) + 0.5) next = i
        if (next !== current) {
          current = next
          setActive(next)
        }
        fillRefs.current.forEach((el, i) => {
          if (!el) return
          const from = i === 0 ? 0 : transitionAt(i) + 0.5
          const to = i === count - 1 ? tl.duration() : transitionAt(i + 1) + 0.5
          el.style.transform = `scaleX(${clamp01((t - from) / (to - from))})`
        })
        window.clearTimeout(settleTimer)
        settleTimer = window.setTimeout(settle, SETTLE_MS)
      }

      triggerRef.current = ScrollTrigger.create({
        animation: tl,
        trigger: root,
        start: 'top top',
        end: () => `+=${window.innerHeight * (count - 1) * SCROLL_PER_SCENE}`,
        pin: true,
        scrub: 0.35,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 3,
        onUpdate: update,
      })
    }, root)

    ScrollTrigger.sort()
    ScrollTrigger.refresh()

    const glide = (y: number) => {
      gliding = true
      window.clearTimeout(settleTimer)
      window.clearTimeout(glideFallback)
      const done = () => {
        if (!gliding) return
        gliding = false
        cooldownUntil = performance.now() + COOLDOWN_MS
        window.clearTimeout(glideFallback)
      }
      glideFallback = window.setTimeout(done, GLIDE * 1000 + 400)
      glideTo(y, GLIDE, { lock: true, onComplete: done })
    }

    /** The pinned stage, plus the screen just below it so one scroll up returns to the last scene. */
    const inRange = () => {
      const st = triggerRef.current
      return !!st && window.scrollY >= st.start - 1 && window.scrollY <= st.end + root.offsetHeight + 1
    }

    /**
     * Where one step in `dir` lands: the next scene, or past the stage from the last one.
     * Null when the step has nowhere to go, so the page scrolls normally instead.
     */
    const stepTarget = (dir: number): number | null => {
      const st = triggerRef.current
      if (!st || !inRange()) return null
      const y = window.scrollY
      const ys = scenePoints.map((p) => st.start + p * (st.end - st.start))
      const target =
        dir > 0
          ? (ys.find((v) => v > y + 4) ?? st.end + root.offsetHeight)
          : [...ys].reverse().find((v) => v < y - 4)
      return target !== undefined && Math.abs(target - y) > 4 ? target : null
    }

    const step = (dir: number): boolean => {
      if (gliding) return false
      const target = stepTarget(dir)
      if (target === null) return false
      glide(target)
      return true
    }

    goToRef.current = (i: number) => {
      const st = triggerRef.current
      if (!st || gliding) return
      glide(i < count ? st.start + scenePoints[i] * (st.end - st.start) : st.end + root.offsetHeight)
    }

    let lastWheel = 0
    let wheelConsumed = false
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      const now = performance.now()
      const paused = now - lastWheel > GESTURE_GAP_MS
      lastWheel = now
      const strong = Math.abs(e.deltaY) >= MOMENTUM_DELTA
      if (paused && (strong || now >= cooldownUntil)) wheelConsumed = false
      if (!inRange() && !gliding) return
      if (gliding || wheelConsumed) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
      if (!strong && now < cooldownUntil) {
        e.preventDefault()
        return
      }
      if (Math.abs(e.deltaY) < 2) return
      if (step(Math.sign(e.deltaY))) {
        wheelConsumed = true
        e.preventDefault()
        e.stopPropagation()
      }
    }

    let touchY = 0
    let touchOwned: boolean | null = null
    let touchStepped = false
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
      touchOwned = null
      touchStepped = false
    }
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) return
      const dy = touchY - e.touches[0].clientY
      if (touchOwned === null) {
        if (Math.abs(dy) < 4) return
        touchOwned = gliding || stepTarget(Math.sign(dy)) !== null
      }
      if (!touchOwned) return
      if (e.cancelable) e.preventDefault()
      if (!touchStepped && Math.abs(dy) > SWIPE_PX) touchStepped = step(Math.sign(dy))
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      const keys: Record<string, number> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, ' ': e.shiftKey ? -1 : 1 }
      const dir = keys[e.key]
      if (!dir || (e.key === ' ' && target?.closest('button, a'))) return
      if (gliding && inRange()) {
        e.preventDefault()
        return
      }
      if (step(dir)) e.preventDefault()
    }

    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKey)

    const [first, ...rest] = videoRefs.current
    const preloadRest = () =>
      rest.forEach((video) => {
        if (video && video.preload !== 'auto') {
          video.preload = 'auto'
          video.load()
        }
      })
    if (first && first.readyState >= 3) preloadRest()
    else first?.addEventListener('canplay', preloadRest, { once: true })

    return () => {
      window.removeEventListener('wheel', onWheel, { capture: true })
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(settleTimer)
      window.clearTimeout(glideFallback)
      first?.removeEventListener('canplay', preloadRest)
      ctx.revert()
      triggerRef.current = null
    }
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return
      if (i === active) {
        if (video.ended) video.currentTime = 0
        void video.play().catch(() => undefined)
      } else {
        video.pause()
      }
    })
  }, [active])

  const goTo = (i: number) => goToRef.current(i)

  const last = active === roomJourney.length - 1

  return (
    <section className={styles.hero} ref={rootRef} aria-label="Siriz Interiors rooms" data-pinned>
      {roomJourney.map((room, i) => (
        <div key={room.id} className={styles.scene} data-scene aria-hidden={i !== active}>
          <div className={styles.inner} data-inner>
            <div className={styles.media} data-media>
              <video
                ref={(el) => {
                  videoRefs.current[i] = el
                }}
                className={styles.video}
                src={room.videoSrc}
                poster={frameUrl(room, 0)}
                autoPlay={i === 0}
                muted
                playsInline
                preload={i === 0 ? 'auto' : 'metadata'}
              />
            </div>
          </div>
          <div className={styles.dim} data-dim />
        </div>
      ))}
      <div className={styles.veil} aria-hidden="true" />

      <div className={styles.copyWrap}>
        {roomJourney.map((room, i) => (
          <div key={room.id} className={styles.copy} data-copy aria-hidden={i !== active}>
            <SceneCopy index={i} />
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <nav className={styles.rail} aria-label="Rooms">
          {roomJourney.map((room, i) => (
            <button
              key={room.id}
              type="button"
              className={`${styles.chapter} ${i === active ? styles.chapterActive : ''}`}
              onClick={() => goTo(i)}
              aria-current={i === active ? 'step' : undefined}
            >
              <span className={styles.chapterLabel}>
                <span className={styles.chapterNum}>{pad(i + 1)}</span>
                <span className={styles.chapterName}>{room.name}</span>
              </span>
              <span className={styles.chapterTrack}>
                <span
                  className={styles.chapterFill}
                  ref={(el) => {
                    fillRefs.current[i] = el
                  }}
                />
              </span>
            </button>
          ))}
        </nav>
        <button type="button" className={styles.next} onClick={() => goTo(active + 1)}>
          <span className={styles.nextLabel} key={active}>
            {last ? 'Continue' : `Next · ${roomJourney[active + 1].name}`}
          </span>
          <span className={styles.scrollLine} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

function SceneCopy({ index }: { index: number }) {
  const room = roomJourney[index]

  const bigIndex = (
    <div data-line className={styles.bigIndex} aria-hidden="true">
      {pad(index + 1)}
    </div>
  )

  if (index === 0) {
    return (
      <>
        {bigIndex}
        <div data-line>
          <p className={styles.kicker} data-reveal="fade">
            <span className={styles.dot} aria-hidden="true" />
            Chennai · {contact.yearsExperience} years of turnkey interiors
          </p>
        </div>
        <div data-line>
          <SplitText as="h1" text="We design your dream home." className={styles.title} />
        </div>
        <div data-line>
          <p className={styles.support} data-reveal>
            Turnkey interiors for Chennai homes, delivered in 45 days with a 10-year warranty.
          </p>
        </div>
        <div data-line>
          <div className={styles.ctas} data-reveal>
            <Button
              href={whatsappUrl('Hi Siriz, I want a free design consultation.')}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book free consultation
            </Button>
            <Button to="/portfolio" variant="secondary">
              Explore our work
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {bigIndex}
      <div data-line>
        <p className={styles.kicker}>
          <span className={styles.dot} aria-hidden="true" />
          {pad(index + 1)} / {pad(roomJourney.length)} · {room.name}
        </p>
      </div>
      <div data-line>
        <h2 className={styles.roomTitle}>{room.title}</h2>
      </div>
      <div data-line>
        <p className={styles.support}>{room.body}</p>
      </div>
      <div data-line>
        <div className={styles.ctas}>
          <Button
            href={whatsappUrl(`Hi Siriz, I would like to discuss my ${room.name.toLowerCase()} design.`)}
            variant="primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Plan my {room.name.toLowerCase()}
          </Button>
        </div>
      </div>
    </>
  )
}

function StaticScenes() {
  return (
    <>
      {roomJourney.map((room, i) => (
        <section key={room.id} className={`${styles.hero} ${styles.static}`} aria-label={room.name}>
          <div className={styles.scene}>
            <div className={styles.media}>
              <img className={styles.video} src={frameUrl(room, room.frameCount - 1)} alt="" />
            </div>
          </div>
          <div className={styles.veil} aria-hidden="true" />
          <div className={styles.copyWrap}>
            <div className={styles.copy}>
              <SceneCopy index={i} />
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
