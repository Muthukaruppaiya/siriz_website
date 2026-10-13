import { contact } from '../../data/contact'
import { ConsultForm } from '../shared/ConsultForm'
import { SectionHeading } from '../shared/SectionHeading'
import styles from './FinalCTA.module.css'

export function FinalCTA() {
  return (
    <section className={styles.section} id="consult">
      <div className={styles.bg} aria-hidden="true">
        <img src="/images/signature/signature-03.webp" alt="" data-parallax="10" />
      </div>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <SectionHeading
            eyebrow="Meet a designer"
            title="Book your free online consultation."
            body="Share your ideas and we'll reply with initial concepts and practical advice."
          />
          <ul className={styles.points} data-reveal-stagger>
            <li>Initial design concepts for your space</li>
            <li>Practical advice from {contact.yearsExperience} years of turnkey work</li>
            <li>Clear package pricing, no obligation</li>
          </ul>
          <div className={styles.direct} data-reveal>
            <span>Prefer to talk?</span>
            <a href={contact.phoneHref}>{contact.phone}</a>
          </div>
        </div>
        <div className={styles.formWrap} data-reveal="right">
          <ConsultForm />
        </div>
      </div>
    </section>
  )
}
