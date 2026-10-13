import { whySiriz } from '../../data/company'
import { SectionHeading } from '../shared/SectionHeading'
import styles from './WhySiriz.module.css'

export function WhySiriz() {
  return (
    <section className={styles.section}>
      <div className={styles.bg} aria-hidden="true">
        <img src="/images/projects/p1-03.webp" alt="" data-parallax="10" />
      </div>
      <div className={styles.inner}>
        <div className={styles.sticky}>
          <SectionHeading
            eyebrow="Why Siriz Interiors"
            title="“We design your dream home, the excellence of interior.”"
            body="Planning, production, and fit-out under one roof, through to post-installation care."
          />
        </div>
        <ol className={styles.list}>
          {whySiriz.map((item, i) => (
            <li key={item.title} className={styles.item} data-reveal>
              <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.body}>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
