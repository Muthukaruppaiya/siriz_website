import { asset } from '../lib/asset'
import { useState } from 'react'
import {
  aboutStory,
  certificates,
  coreValues,
  individuality,
  stats,
} from '../data/company'
import { contact } from '../data/contact'
import { FinalCTA } from '../components/home/FinalCTA'
import { Partners } from '../components/home/Partners'
import { Testimonials } from '../components/home/Testimonials'
import { WhySiriz } from '../components/home/WhySiriz'
import { Counter } from '../components/motion/Counter'
import { ScrollWords } from '../components/motion/ScrollWords'
import { Lightbox } from '../components/shared/Lightbox'
import { PageHero } from '../components/shared/PageHero'
import { SectionHeading } from '../components/shared/SectionHeading'
import styles from './Page.module.css'

const certImages = certificates.map((c) => ({ src: c.image, alt: c.caption }))

export function About() {
  const [cert, setCert] = useState<number | null>(null)

  return (
    <>
      <PageHero
        crumb="About"
        eyebrow={`${contact.yearsExperience} years · Medavakkam, Chennai`}
        title="We design your dream home."
        body="One Chennai team for design, production, and installation."
        image={asset('/images/hero/hero-1.webp')}
      />

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={`${styles.wrap} ${styles.split}`}>
          <div className={styles.sticky}>
            <SectionHeading eyebrow="Our story" title="Blank space, transformed into yours." />
          </div>
          <div className={styles.prose}>
            {aboutStory.map((p, i) => (
              <p key={p} className={i === 2 ? 'desktop-only' : undefined} data-reveal>
                {p}
              </p>
            ))}
            <ScrollWords text={individuality} className={styles.statement} />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.light}`}>
        <div className={`${styles.wrap} ${styles.office}`}>
          <figure className={styles.officeMedia} data-reveal-clip data-skew>
            <img src={asset('/images/about/about.webp')} alt="Siriz Interiors studio interior" loading="lazy" />
          </figure>
          <div className={styles.officeMeta}>
            <SectionHeading tone="dark" eyebrow="Chennai office" title="Visit the studio." />
            <p data-reveal>
              {contact.legalName}
              <br />
              {contact.address.line1}, {contact.address.line2}
              <br />
              {contact.address.city}
            </p>
            <p data-reveal>
              Meet the designers, see material samples, and review your home in 3D.
            </p>
          </div>
        </div>
        <div className={styles.wrap} style={{ marginTop: 'var(--space-9)' }}>
          <div className={styles.stats} data-reveal-stagger>
            {stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <Counter value={s.value} suffix={s.suffix} className={styles.statValue} />
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.wrap}>
          <SectionHeading
            eyebrow="Core values"
            title="The foundation of everything we do."
            body="What guides every Siriz home."
          />
          <ul className={styles.values} data-reveal-stagger>
            {coreValues.map((v, i) => (
              <li key={v.title} className={styles.value}>
                <span className={styles.valueNum}>{String(i + 1).padStart(2, '0')}</span>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <WhySiriz />

      <section className={`${styles.section} ${styles.elevated}`}>
        <div className={styles.wrap}>
          <SectionHeading
            eyebrow="Recognition"
            title="Awarded for design and execution."
            body="Certificates and honours received by Siriz Interiors."
          />
          <ul className={styles.certs} data-reveal-stagger>
            {certificates.map((c, i) => (
              <li key={c.id}>
                <button type="button" className={styles.cert} onClick={() => setCert(i)}>
                  <span className={styles.certMedia}>
                    <img src={c.image} alt={c.caption} loading="lazy" />
                  </span>
                  <span className={styles.certCaption}>{c.caption}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <Lightbox images={certImages} index={cert} onChange={setCert} title="Recognition" />
      </section>

      <Testimonials />
      <Partners />
      <FinalCTA />
    </>
  )
}
