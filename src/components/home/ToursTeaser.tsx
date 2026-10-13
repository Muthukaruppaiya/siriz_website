import { Link } from 'react-router-dom'
import { tours } from '../../data/tours'
import { SectionHeading } from '../shared/SectionHeading'
import styles from './ToursTeaser.module.css'

export function ToursTeaser() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="Siriz 360° virtual tours"
          title="Walk through finished homes from anywhere."
          body="Step inside real Siriz handovers in full 360°."
        />
        <ul className={`${styles.grid} swipe-mobile`} data-reveal-stagger>
          {tours.map((tour) => (
            <li key={tour.id}>
              <Link to={`/tours?site=${tour.id}`} className={styles.card}>
                <div className={styles.media}>
                  <img src={tour.image} alt={`${tour.name} 360 tour preview`} loading="lazy" />
                  <span className={styles.badge} aria-hidden="true">
                    360°
                  </span>
                </div>
                <div className={styles.meta}>
                  <span className={styles.label}>{tour.label}</span>
                  <span className={styles.name}>{tour.name}</span>
                  <span className={styles.go} aria-hidden="true">
                    Enter tour →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
