import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contact, whatsappUrl } from '../../data/contact'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { SplitText } from '../motion/SplitText'
import { Button } from '../shared/Button'
import styles from './Hero.module.css'

gsap.registerPlugin(ScrollTrigger)

const slides = [
  { kicker: 'Welcome to Siriz Interiors', line: 'Design your dream home interior with us' },
  { kicker: 'Interior design & décor', line: 'Experience the elegance and comfort' },
  { kicker: 'Customized home style', line: 'Custom-made designs, décor, and furniture' },
]

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const [slide, setSlide] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const id = window.setInterval(() => setSlide((s) => (s + 1) % slides.length), 5000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (reducedMotion || !rootRef.current || !mediaRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(mediaRef.current, {
        scale: 1.18,
        yPercent: 12,
        filter: 'brightness(0.45)',
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section className={styles.hero} ref={rootRef} aria-label="Siriz Interiors">
      <div className={styles.media} ref={mediaRef} aria-hidden="true">
        <video
          className={styles.video}
          src="/video/living-hall.mp4"
          poster="/frames/living/0120.webp"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
      <div className={styles.veil} aria-hidden="true" />

      <div className={styles.content} data-fade-out>
        <p className={styles.kicker} data-reveal="fade">
          <span className={styles.dot} aria-hidden="true" />
          Chennai · {contact.yearsExperience} years of turnkey interiors
        </p>
        <SplitText as="h1" text="We design your dream home." className={styles.title} />
        <p className={styles.support} data-reveal>
          Turnkey interiors for Chennai homes, delivered in 45 days with a
          10-year warranty.
        </p>
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

      <div className={styles.bottom} data-fade-out>
        <div className={styles.slides} aria-live="polite">
          {slides.map((s, i) => (
            <div
              key={s.kicker}
              className={`${styles.slide} ${i === slide ? styles.slideActive : ''}`}
              aria-hidden={i !== slide}
            >
              <p className={styles.slideKicker}>{s.kicker}</p>
              <p className={styles.slideLine}>{s.line}</p>
            </div>
          ))}
          <div className={styles.dots}>
            {slides.map((s, i) => (
              <button
                key={s.kicker}
                type="button"
                className={`${styles.dotBtn} ${i === slide ? styles.dotBtnActive : ''}`}
                onClick={() => setSlide(i)}
                aria-label={`Show message ${i + 1}`}
              >
                <span />
              </button>
            ))}
          </div>
        </div>
        <a href="#story" className={styles.scroll}>
          <span>Scroll</span>
          <span className={styles.scrollLine} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
