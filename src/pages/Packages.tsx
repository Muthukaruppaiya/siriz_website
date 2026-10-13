import { packageFaqs, packages } from '../data/packages'
import { whatsappUrl } from '../data/contact'
import { FinalCTA } from '../components/home/FinalCTA'
import { ProcessStrip } from '../components/home/ProcessStrip'
import { Button } from '../components/shared/Button'
import { PageHero } from '../components/shared/PageHero'
import { SectionHeading } from '../components/shared/SectionHeading'
import styles from './Page.module.css'

const included = [
  { title: 'Free design consultation', body: 'Talk through your ideas at no cost.' },
  { title: '3D design preview', body: 'See every design before production.' },
  { title: 'Space planning', body: 'Functional layouts by our experts.' },
  { title: 'Factory production', body: 'Made at the Siriz factory.' },
  { title: '45-day guaranteed delivery', body: 'On time, every project.' },
  { title: '10-year warranty', body: 'Plus lifetime post-installation service.' },
]

export function Packages() {
  return (
    <>
      <PageHero
        crumb="Packages"
        eyebrow="Pricing plan"
        title="Packages with justified prices."
        body="Kitchens from ₹69,000, wardrobes from ₹1,00,000, full homes from ₹3,25,000."
        image="/images/moodboard/mood-07.webp"
      />

      <section className={`${styles.section} ${styles.light}`}>
        <div className={`${styles.wrap} ${styles.pkgRows}`}>
          {packages.map((pkg, i) => (
            <article key={pkg.id} className={styles.pkgRow}>
              <figure className={styles.pkgMedia} data-reveal-clip>
                <img src={pkg.image} alt={`${pkg.name} by Siriz Interiors`} loading="lazy" />
              </figure>
              <div className={styles.pkgMeta}>
                <span className={styles.pkgIndex} data-reveal="fade">
                  Package {String(i + 1).padStart(2, '0')}
                  {pkg.featured ? ' · Most chosen' : ''}
                </span>
                <h2 data-reveal>{pkg.name}</h2>
                <p className={styles.pkgPrice} data-reveal>
                  <small>{pkg.priceNote}</small>
                  {pkg.price}
                </p>
                <p className={styles.pkgDesc} data-reveal>
                  {pkg.description}
                </p>
                <ul className={styles.checks} data-reveal-stagger>
                  {pkg.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div data-reveal>
                  <Button
                    href={whatsappUrl(`Hi Siriz, I'm interested in the ${pkg.name} package (${pkg.price}).`)}
                    variant="dark"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get a {pkg.name.toLowerCase()} quote
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.wrap}>
          <SectionHeading
            eyebrow="Every package includes"
            title="The Siriz standard, whatever you choose."
          />
          <ul className={styles.included} data-reveal-stagger>
            {included.map((item) => (
              <li key={item.title} className={styles.includedItem}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ProcessStrip />

      <section className={`${styles.section} ${styles.light}`} style={{ paddingTop: 0 }}>
        <div className={`${styles.wrap} ${styles.split}`}>
          <div className={styles.sticky}>
            <SectionHeading
              tone="dark"
              eyebrow="Questions"
              title="Before you begin."
              body="Anything else? Ask us on WhatsApp and a designer will reply."
            />
          </div>
          <div className={styles.faq} data-reveal-stagger>
            {packageFaqs.map((f) => (
              <details key={f.q} className={styles.faqItem}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  )
}
