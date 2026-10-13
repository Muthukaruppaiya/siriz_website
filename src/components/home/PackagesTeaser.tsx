import { packages } from '../../data/packages'
import { whatsappUrl } from '../../data/contact'
import { Button } from '../shared/Button'
import { SectionHeading } from '../shared/SectionHeading'
import styles from './PackagesTeaser.module.css'

export function PackagesTeaser() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <SectionHeading
            eyebrow="Pricing plan"
            title="Clear packages. Justified prices."
            body="Starting prices, tailored to your layout and materials."
          />
          <Button to="/packages" variant="secondary">
            Compare packages
          </Button>
        </div>

        <ul className={`${styles.grid} swipe-mobile`} data-reveal-stagger>
          {packages.map((pkg) => (
            <li key={pkg.id} className={`${styles.card} ${pkg.featured ? styles.featured : ''}`}>
              <div className={styles.media}>
                <img src={pkg.image} alt="" loading="lazy" />
                {pkg.featured ? <span className={styles.badge}>Most chosen</span> : null}
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{pkg.name}</h3>
                <p className={styles.note}>{pkg.priceNote}</p>
                <p className={styles.price}>{pkg.price}</p>
                <ul className={styles.features}>
                  {pkg.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Button
                  href={whatsappUrl(`Hi Siriz, I'm interested in the ${pkg.name} package.`)}
                  variant={pkg.featured ? 'primary' : 'secondary'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get a quote
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
