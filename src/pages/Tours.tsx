import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { tours } from '../data/tours'
import { whatsappUrl } from '../data/contact'
import { scrollToY } from '../hooks/useLenis'
import { FinalCTA } from '../components/home/FinalCTA'
import { Button } from '../components/shared/Button'
import { PageHero } from '../components/shared/PageHero'
import { SectionHeading } from '../components/shared/SectionHeading'
import styles from './Page.module.css'

export function Tours() {
  const [params, setParams] = useSearchParams()
  const current = tours.find((t) => t.id === params.get('site')) ?? tours[0]
  const [loaded, setLoaded] = useState<string | null>(null)

  const select = (id: string) => {
    setParams({ site: id }, { replace: true })
    setLoaded(null)
  }

  return (
    <>
      <PageHero
        crumb="360 Tours"
        eyebrow="Siriz Interiors 360° VTour"
        title="Step inside finished homes."
        body="Real Siriz handovers in 360°. Drag to look around."
        image="/images/tours/tour-1.webp"
      />

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={`${styles.wide} ${styles.viewer}`}>
          <div className={styles.viewerTabs} role="tablist" aria-label="Tour sites" data-reveal="fade">
            {tours.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={t.id === current.id}
                className={`${styles.tab} ${t.id === current.id ? styles.tabActive : ''}`}
                onClick={() => select(t.id)}
              >
                {t.label} · {t.name}
              </button>
            ))}
          </div>

          <div className={styles.viewerFrame} data-reveal="scale">
            {loaded === current.id ? (
              <iframe
                src={current.href}
                title={`${current.name} 360 virtual tour`}
                allow="fullscreen; gyroscope; accelerometer; xr-spatial-tracking"
                allowFullScreen
              />
            ) : (
              <button
                type="button"
                className={styles.viewerPoster}
                onClick={() => setLoaded(current.id)}
                aria-label={`Start ${current.name} 360 tour`}
              >
                <img src={current.image} alt="" key={current.image} />
                <span className={styles.viewerStart}>
                  <strong>360°</strong>
                  <span>Start the tour</span>
                </span>
              </button>
            )}
          </div>

          <div className={styles.viewerFoot}>
            <div>
              <h2>
                {current.name} <span style={{ color: 'var(--color-brass)' }}>· {current.label}</span>
              </h2>
              <p className="desktop-only">Best experienced full screen.</p>
            </div>
            <Button href={current.href} variant="secondary" target="_blank" rel="noopener noreferrer">
              Open full screen
            </Button>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.elevated}`}>
        <div className={styles.wide}>
          <SectionHeading
            eyebrow="All sites"
            title="Four homes, every corner."
            body="Pick a site to load it in the viewer above."
          />
          <ul className={styles.films} data-reveal-stagger>
            {tours.map((t) => (
              <li key={t.id} className={styles.film}>
                <button
                  type="button"
                  className={styles.filmMedia}
                  onClick={() => {
                    select(t.id)
                    scrollToY(0)
                  }}
                  aria-label={`Load ${t.name} tour`}
                >
                  <img src={t.image} alt={`${t.name} 360 preview`} loading="lazy" />
                  <span className={styles.play} aria-hidden="true">
                    <span>360°</span>
                  </span>
                </button>
                <p className={styles.filmTitle}>
                  {t.label} · {t.name}
                </p>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 'var(--space-7)' }} data-reveal>
            <Button
              href={whatsappUrl('Hi Siriz, I explored your 360 tours and would like a site visit.')}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a live site walkthrough
            </Button>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
