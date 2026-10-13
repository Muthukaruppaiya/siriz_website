import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { signature } from '../../data/portfolio'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { Lightbox } from '../shared/Lightbox'
import { SectionHeading } from '../shared/SectionHeading'
import styles from './SignatureScroll.module.css'

gsap.registerPlugin(ScrollTrigger)

export function SignatureScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLUListElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const [viewing, setViewing] = useState<number | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 900px)')
  const pinned = isDesktop && !reducedMotion

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!pinned || !section || !track) return

    const distance = () => track.scrollWidth - window.innerWidth + window.innerWidth * 0.08

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })

      gsap.utils.toArray<HTMLElement>('[data-sig-img]').forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })
    }, section)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [pinned])

  return (
    <section className={`${styles.section} ${pinned ? styles.pinned : ''}`} ref={sectionRef}>
      <div className={styles.head}>
        <SectionHeading
          eyebrow="Siriz Signature"
          title="Our luxury line, in marble, brass, and velvet."
          body="Statement stone, sculpted lighting, and bespoke furniture."
        />
        <p className={styles.hint} aria-hidden="true">
          {pinned ? 'Keep scrolling' : 'Swipe'} <span>→</span>
        </p>
      </div>

      <ul className={styles.track} ref={trackRef}>
        {signature.map((img, i) => (
          <li key={img.src} className={`${styles.item} ${i % 3 === 1 ? styles.tall : ''}`}>
            <button
              type="button"
              className={styles.card}
              onClick={() => setViewing(i)}
              aria-label={`Open ${img.alt}`}
            >
              <span className={styles.frame}>
                <img src={img.src} alt={img.alt} loading="lazy" data-sig-img />
              </span>
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.progress} aria-hidden="true">
        <span ref={barRef} />
      </div>

      <Lightbox
        images={signature}
        index={viewing}
        onChange={setViewing}
        title="Siriz Signature"
      />
    </section>
  )
}
