import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contact, whatsappUrl } from '../../data/contact'
import { frameUrl, roomJourney } from '../../data/rooms'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { scrollToY } from '../../hooks/useLenis'
import { SplitText } from '../motion/SplitText'
import { Button } from '../shared/Button'
import styles from './Hero.module.css'

gsap.registerPlugin(ScrollTrigger)

/** Timeline time each scene rests on screen, relative to a transition of 1. */
const HOLD = 0.8
/** Viewport heights of scroll per scene change. */
const SCROLL_PER_SCENE = 1.15

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
  const timeRef = useRef<{ labels: number[]; duration: number }>({ labels: [], duration: 1 })
  const [active, setActive] = useState(0)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const count = roomJourney.length
    let current = 0

    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>('[data-scene]')
      const medias = layers.map((l) => l.querySelector('[data-media]'))
      const dims = layers.map((l) => l.querySelector('[data-dim]'))
      const copies = gsap.utils.toArray<HTMLElement>('[data-copy]')
      const lines = copies.map((c) => c.querySelectorAll('[data-line]'))

      gsap.set(copies.slice(1), { autoAlpha: 0 })

      const tl = gsap.timeline({ defaults: { ease: 'none' } })
      const labels = [0]

      for (let i = 1; i < count; i++) {
        const at = transitionAt(i)
        tl.to(lines[i - 1], { y: -48, autoAlpha: 0, stagger: 0.04, duration: 0.4, ease: 'power2.in' }, at)
          .set(copies[i - 1], { autoAlpha: 0 }, at + 0.45)
          .fromTo(
            layers[i],
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power2.inOut' },
            at,
          )
          .fromTo(medias[i], { scale: 1.28, yPercent: 10 }, { scale: 1.02, yPercent: 0, duration: 1, ease: 'power2.out' }, at)
          .to(medias[i - 1], { scale: 1.14, yPercent: -8, duration: 1, ease: 'power2.in' }, at)
          .to(dims[i - 1], { opacity: 0.75, duration: 1 }, at)
          .set(copies[i], { autoAlpha: 1 }, at + 0.45)
          .fromTo(
            lines[i],
            { y: 64, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.5, ease: 'power3.out' },
            at + 0.5,
          )
        labels.push(at + 1 + HOLD / 2)
      }
      tl.to({}, { duration: HOLD }, transitionAt(count - 1) + 1)
      timeRef.current = { labels, duration: tl.duration() }

      const snapPoints = [...labels.map((t) => t / tl.duration()), 1]
      const nearest = gsap.utils.snap(snapPoints)
      const snapTo = (value: number, self?: ScrollTrigger) => {
        const closest = nearest(value)
        if (Math.abs(value - closest) < 0.035) return closest
        const forward = (self?.direction ?? 1) > 0
        return forward
          ? (snapPoints.find((p) => p > value) ?? 1)
          : ([...snapPoints].reverse().find((p) => p < value) ?? 0)
      }

      const update = (self: ScrollTrigger) => {
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
      }

      triggerRef.current = ScrollTrigger.create({
        animation: tl,
        trigger: root,
        start: 'top top',
        end: () => `+=${window.innerHeight * (count - 1) * SCROLL_PER_SCENE}`,
        pin: true,
        scrub: 0.9,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 3,
        snap: {
          snapTo,
          inertia: false,
          duration: { min: 0.35, max: 0.9 },
          delay: 0.12,
          ease: 'power2.inOut',
        },
        onUpdate: update,
      })
    }, root)

    ScrollTrigger.sort()
    ScrollTrigger.refresh()

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

  const goTo = (i: number) => {
    const st = triggerRef.current
    if (!st) return
    const { labels, duration } = timeRef.current
    scrollToY(st.start + (st.end - st.start) * (labels[i] / duration))
  }

  return (
    <section className={styles.hero} ref={rootRef} aria-label="Siriz Interiors rooms">
      {roomJourney.map((room, i) => (
        <div key={room.id} className={styles.scene} data-scene aria-hidden={i !== active}>
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
        <div className={styles.scroll} aria-hidden="true">
          <span>Scroll</span>
          <span className={styles.scrollLine} />
        </div>
      </div>
    </section>
  )
}

function SceneCopy({ index }: { index: number }) {
  const room = roomJourney[index]

  if (index === 0) {
    return (
      <>
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
