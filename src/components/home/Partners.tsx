import { builderClients, materialPartners } from '../../data/company'
import { Marquee } from '../motion/Marquee'
import styles from './Partners.module.css'

export function Partners() {
  return (
    <section className={styles.section} aria-label="Clients and material partners">
      <div className={styles.row}>
        <p className={styles.label} data-reveal="fade">
          Trusted by builders
        </p>
        <Marquee duration={30} gap="1rem">
          {builderClients.map((src) => (
            <span key={src} className={styles.logo}>
              <img src={src} alt="" loading="lazy" />
            </span>
          ))}
        </Marquee>
      </div>
      <div className={styles.row}>
        <p className={styles.label} data-reveal="fade">
          Materials we build with
        </p>
        <Marquee duration={45} gap="1rem" reverse>
          {materialPartners.map((src) => (
            <span key={src} className={styles.logo}>
              <img src={src} alt="" loading="lazy" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
