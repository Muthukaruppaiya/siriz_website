import { asset } from '../../lib/asset'
import { Link } from 'react-router-dom'
import { aboutStory, individuality, stats } from '../../data/company'
import { Counter } from '../motion/Counter'
import { ScrollWords } from '../motion/ScrollWords'
import styles from './StoryIntro.module.css'

export function StoryIntro() {
  return (
    <section id="story" className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.eyebrow} data-reveal="fade">
          <span aria-hidden="true" /> About Siriz
        </p>
        <ScrollWords text={individuality} className={styles.statement} />

        <div className={styles.grid}>
          <figure className={styles.figure} data-reveal-clip>
            <img
              src={asset('/images/about/about.webp')}
              alt="The Siriz Interiors studio"
              loading="lazy"
              className={styles.image}
            />
            <figcaption className={styles.caption}>Medavakkam studio, Chennai</figcaption>
          </figure>

          <div className={styles.copy}>
            <p className={styles.lead} data-reveal>
              {aboutStory[0]}
            </p>
            <p className={`${styles.body} desktop-only`} data-reveal>
              {aboutStory[1]}
            </p>
            <Link to="/about" className={styles.link} data-reveal>
              Our story
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <ul className={styles.stats} data-reveal-stagger>
          {stats.map((s) => (
            <li key={s.label} className={styles.stat}>
              <Counter value={s.value} suffix={s.suffix} className={styles.statValue} />
              <span className={styles.statLabel}>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
