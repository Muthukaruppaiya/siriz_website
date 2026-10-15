import { spaces } from '../../data/company'
import { whatsappUrl } from '../../data/contact'
import { SectionHeading } from '../shared/SectionHeading'
import styles from './Spaces.module.css'

export function Spaces() {
  return (
    <section className={styles.section} data-curtain>
      <div className={styles.inner}>
        <div className={styles.head}>
          <SectionHeading
            tone="dark"
            eyebrow="What we design"
            title="Every room, one accountable studio."
            body="End-to-end interiors for every room in your home."
          />
        </div>

        <ul className={styles.grid} data-reveal-stagger>
          {spaces.map((space, i) => (
            <li key={space.id} className={styles.card}>
              <a
                href={whatsappUrl(`Hi Siriz, I would like to discuss ${space.title.toLowerCase()} for my home.`)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
                data-speed={i % 2 ? 70 : 20}
              >
                <div className={styles.media} data-skew>
                  <img src={space.image} alt="" loading="lazy" />
                </div>
                <div className={styles.meta}>
                  <span className={styles.index}>{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={styles.title}>{space.title}</h3>
                  <p className={styles.body}>{space.body}</p>
                  <span className={styles.cta} aria-hidden="true">
                    Enquire →
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
