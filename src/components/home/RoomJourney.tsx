import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { buildStages, frameUrl, roomJourney } from '../../data/rooms'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { scrollToY } from '../../hooks/useLenis'
import { SectionHeading } from '../shared/SectionHeading'
import { FrameSequence } from './frameSequence'
import styles from './RoomJourney.module.css'

gsap.registerPlugin(ScrollTrigger)

/** Share of each room's scroll spent on the split-door reveal into the next room. */
const TRANSITION = 0.18
/** Viewport heights of scroll per room. */
const SCROLL_PER_ROOM = 1.7

const pad = (n: number) => String(n).padStart(2, '0')
const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1)
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

function stageLabel(build: number): string {
  let label: string = buildStages[0].label
  for (const stage of buildStages) if (build >= stage.at) label = stage.label
  return label
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  zoom: number,
) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * zoom
  const dw = img.naturalWidth * scale
  const dh = img.naturalHeight * scale
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
}

export function RoomJourney() {
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useMediaQuery('(max-width: 899px)')
  const mode = reducedMotion ? 'static' : isMobile ? 'mobile' : 'scrub'

  return (
    <section id="rooms" className={styles.section}>
      <JourneyIntro />
      {mode === 'scrub' ? (
        <ScrubStage />
      ) : (
        <StackedRooms animated={mode === 'mobile'} />
      )}
    </section>
  )
}

function JourneyIntro() {
  return (
    <div className={styles.intro}>
      <SectionHeading
        eyebrow="Walk the home"
        title="From bare shell to handover."
        body="Scroll to build four rooms the Siriz way."
      />
    </div>
  )
}

function ScrubStage() {
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const meterFillRef = useRef<HTMLSpanElement>(null)
  const percentRef = useRef<HTMLSpanElement>(null)
  const stageLabelRef = useRef<HTMLSpanElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const chapterFillRefs = useRef<(HTMLSpanElement | null)[]>([])
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const progressRef = useRef(0)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!stage || !canvas || !ctx) return

    const count = roomJourney.length
    let rafId = 0
    let lastLabel = ''
    let lastPercent = -1

    const draw = () => {
      rafId = 0
      const p = progressRef.current
      const seg = Math.min(p * count, count - 0.0001)
      const idx = Math.floor(seg)
      const local = seg - idx
      const isLast = idx === count - 1
      const playEnd = isLast ? 1 : 1 - TRANSITION
      const build = clamp01(local / playEnd)
      const room = roomJourney[idx]
      const w = canvas.width
      const h = canvas.height

      ctx.fillStyle = '#1a1612'
      ctx.fillRect(0, 0, w, h)

      const framePos = build * (room.frameCount - 1)
      const f0 = Math.floor(framePos)
      const f1 = Math.min(f0 + 1, room.frameCount - 1)
      const mix = framePos - f0
      const zoom = 1.1 - 0.1 * easeOutCubic(build)
      const a = sequence.exact(idx, f0)
      const b = sequence.exact(idx, f1)
      if (a && b && mix > 0.01) {
        drawCover(ctx, a, w, h, zoom)
        ctx.globalAlpha = mix
        drawCover(ctx, b, w, h, zoom)
        ctx.globalAlpha = 1
      } else {
        const current = sequence.nearest(idx, Math.round(framePos))
        if (current) drawCover(ctx, current, w, h, zoom)
      }

      let reveal = 0
      if (!isLast && local > playEnd) {
        reveal = easeInOutCubic((local - playEnd) / TRANSITION)
        const half = (w / 2) * reveal
        const left = w / 2 - half
        const right = w / 2 + half

        ctx.fillStyle = `rgba(26, 22, 18, ${0.55 * reveal})`
        ctx.fillRect(0, 0, w, h)

        const next = sequence.nearest(idx + 1, 0)
        if (next) {
          ctx.save()
          ctx.beginPath()
          ctx.rect(left, 0, right - left, h)
          ctx.clip()
          drawCover(ctx, next, w, h, 1.22 - 0.12 * reveal)
          ctx.restore()
        }

        const seam = Math.max(1.5, w / 1100)
        ctx.fillStyle = `rgba(212, 184, 150, ${1 - reveal * 0.6})`
        ctx.fillRect(left - seam / 2, 0, seam, h)
        ctx.fillRect(right - seam / 2, 0, seam, h)
      }

      const shown = reveal > 0.5 ? idx + 1 : idx
      if (shown !== activeRef.current) {
        activeRef.current = shown
        setActive(shown)
      }

      const shownBuild = shown === idx ? build : 0
      if (meterFillRef.current) {
        meterFillRef.current.style.transform = `scaleX(${shownBuild})`
      }
      const percent = Math.round(shownBuild * 100)
      if (percent !== lastPercent && percentRef.current) {
        lastPercent = percent
        percentRef.current.textContent = `${pad(percent)}%`
      }
      const label = stageLabel(shownBuild)
      if (label !== lastLabel && stageLabelRef.current) {
        lastLabel = label
        stageLabelRef.current.textContent = label
      }
      chapterFillRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `scaleY(${clamp01(seg - i)})`
      })
      if (hintRef.current) {
        hintRef.current.style.opacity = String(1 - clamp01(p * 40))
      }
    }

    const requestDraw = () => {
      if (!rafId) rafId = requestAnimationFrame(draw)
    }

    const sequence = new FrameSequence(roomJourney, requestDraw)

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.35)
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'medium'
      requestDraw()
    }
    resize()
    window.addEventListener('resize', resize)

    const proxy = { p: 0 }
    const gsapCtx = gsap.context(() => {
      const tween = gsap.to(proxy, {
        p: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${window.innerHeight * count * SCROLL_PER_ROOM}`,
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: 2,
        },
        onUpdate: () => {
          progressRef.current = proxy.p
          requestDraw()
        },
      })
      triggerRef.current = tween.scrollTrigger ?? null
    }, stage)
    ScrollTrigger.sort()
    ScrollTrigger.refresh()

    sequence.start()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafId)
      sequence.destroy()
      gsapCtx.revert()
      triggerRef.current = null
    }
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const blocks = stage.querySelectorAll<HTMLElement>('[data-copy]')

    blocks.forEach((block, i) => {
      const lines = block.querySelectorAll('[data-line]')
      gsap.killTweensOf([block, ...lines])
      if (i === active) {
        gsap.set(block, { autoAlpha: 1 })
        gsap.fromTo(
          lines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.08,
            ease: 'power4.out',
          },
        )
      } else {
        gsap.to(block, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' })
      }
    })
  }, [active])

  const goTo = (i: number) => {
    const st = triggerRef.current
    if (!st) return
    const y = st.start + ((st.end - st.start) * i) / roomJourney.length + 2
    scrollToY(y)
  }

  return (
    <div className={styles.stage} ref={stageRef}>
      <canvas className={styles.canvas} ref={canvasRef} aria-hidden="true" />
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <p className={styles.bigIndex} aria-hidden="true" key={active}>
        {pad(active + 1)}
      </p>

      <div className={styles.copyWrap}>
        {roomJourney.map((room, i) => (
          <div
            key={room.id}
            className={styles.copy}
            data-copy
            aria-hidden={i !== active}
          >
            <div className={styles.mask}>
              <p className={styles.roomEyebrow} data-line>
                {pad(i + 1)} / {pad(roomJourney.length)} · {room.name}
              </p>
            </div>
            <div className={styles.mask}>
              <h3 className={styles.roomTitle} data-line>
                {room.title}
              </h3>
            </div>
            <div className={styles.mask}>
              <p className={styles.roomBody} data-line>
                {room.body}
              </p>
            </div>
          </div>
        ))}

        <div className={styles.meter}>
          <div className={styles.meterHead}>
            <span className={styles.meterLabel}>Build progress</span>
            <span className={styles.meterStage} ref={stageLabelRef}>
              {buildStages[0].label}
            </span>
            <span className={styles.meterPercent} ref={percentRef}>
              00%
            </span>
          </div>
          <div className={styles.meterTrack}>
            <span className={styles.meterFill} ref={meterFillRef} />
            {buildStages.slice(1).map((s) => (
              <span
                key={s.label}
                className={styles.meterTick}
                style={{ left: `${s.at * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      <nav className={styles.rail} aria-label="Rooms">
        {roomJourney.map((room, i) => (
          <button
            key={room.id}
            type="button"
            className={`${styles.chapter} ${i === active ? styles.chapterActive : ''}`}
            onClick={() => goTo(i)}
            aria-current={i === active ? 'step' : undefined}
          >
            <span className={styles.chapterTrack}>
              <span
                className={styles.chapterFill}
                ref={(el) => {
                  chapterFillRefs.current[i] = el
                }}
              />
            </span>
            <span className={styles.chapterNum}>{pad(i + 1)}</span>
            <span className={styles.chapterName}>{room.name}</span>
          </button>
        ))}
      </nav>

      <div className={styles.hint} ref={hintRef} aria-hidden="true">
        <span>Scroll to build</span>
        <span className={styles.hintLine} />
      </div>
    </div>
  )
}

function StackedRooms({ animated }: { animated: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !animated) return

    const videos = root.querySelectorAll('video')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement
          if (entry.isIntersecting) void video.play().catch(() => undefined)
          else video.pause()
        })
      },
      { threshold: 0.4 },
    )
    videos.forEach((v) => observer.observe(v))

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-card]').forEach((card) => {
        const media = card.querySelector('[data-card-media]')
        const lines = card.querySelectorAll('[data-line]')
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: 'top 82%' },
        })
        tl.fromTo(
          media,
          { clipPath: 'inset(14% 10% 14% 10%)', scale: 1.08 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            duration: 1.2,
            ease: 'power3.inOut',
          },
        ).fromTo(
          lines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power4.out',
          },
          '-=0.6',
        )
      })
    }, root)

    return () => {
      observer.disconnect()
      ctx.revert()
    }
  }, [animated])

  return (
    <div className={styles.stack} ref={rootRef}>
      {roomJourney.map((room, i) => (
        <article key={room.id} className={styles.card} data-card>
          <div className={styles.cardMedia} data-card-media>
            {animated ? (
              <video
                src={room.videoSrc}
                poster={frameUrl(room, 0)}
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src={frameUrl(room, room.frameCount - 1)}
                alt={`${room.name}: bare shell beside the finished Siriz interior`}
                loading="lazy"
              />
            )}
            <span className={styles.cardBadge}>Shell → Handover</span>
          </div>
          <div className={styles.cardCopy}>
            <div className={styles.mask}>
              <p className={styles.roomEyebrow} data-line>
                {pad(i + 1)} / {pad(roomJourney.length)} · {room.name}
              </p>
            </div>
            <div className={styles.mask}>
              <h3 className={styles.roomTitle} data-line>
                {room.title}
              </h3>
            </div>
            <div className={styles.mask}>
              <p className={styles.roomBody} data-line>
                {room.body}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
