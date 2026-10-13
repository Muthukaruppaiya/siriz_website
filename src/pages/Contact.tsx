import { contact, whatsappUrl } from '../data/contact'
import { ConsultForm } from '../components/shared/ConsultForm'
import { PageHero } from '../components/shared/PageHero'
import { SectionHeading } from '../components/shared/SectionHeading'
import styles from './Page.module.css'

export function Contact() {
  return (
    <>
      <PageHero
        crumb="Contact"
        eyebrow="Get in touch"
        title="Let’s plan your home."
        body="WhatsApp is the fastest way to reach a designer."
        image="/images/projects/p5-01.webp"
      />

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={styles.wide}>
          <ul className={styles.contactCards} data-reveal-stagger>
            <li>
              <a className={styles.contactCard} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                <span className={styles.contactLabel}>WhatsApp</span>
                <span className={styles.contactValue}>{contact.whatsappDisplay}</span>
                <span className={styles.contactHint}>Fastest reply from a designer</span>
              </a>
            </li>
            <li>
              <a className={styles.contactCard} href={contact.phoneHref}>
                <span className={styles.contactLabel}>Call</span>
                <span className={styles.contactValue}>{contact.phone}</span>
                <span className={styles.contactHint}>Speak to the studio</span>
              </a>
            </li>
            <li>
              <a className={styles.contactCard} href={contact.emailHref}>
                <span className={styles.contactLabel}>Email</span>
                <span className={styles.contactValue}>{contact.email}</span>
                <span className={styles.contactHint}>Share plans and floor layouts</span>
              </a>
            </li>
            <li>
              <a className={styles.contactCard} href={contact.mapUrl} target="_blank" rel="noopener noreferrer">
                <span className={styles.contactLabel}>Visit</span>
                <span className={styles.contactValue}>Pearl Flora Building, Medavakkam</span>
                <span className={styles.contactHint}>{contact.address.line1}, {contact.address.city}</span>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className={`${styles.section} ${styles.light}`}>
        <div className={`${styles.wrap} ${styles.split}`}>
          <div>
            <SectionHeading
              tone="dark"
              eyebrow="Free consultation"
              title="Tell us about your home."
              body="Share a few details and we'll reply on WhatsApp."
            />
            <div className={styles.map} data-reveal>
              <iframe
                src={contact.mapEmbed}
                title="Siriz Interiors on Google Maps"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className={styles.social} data-reveal>
              <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href={contact.social.youtube} target="_blank" rel="noopener noreferrer">YouTube</a>
              <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
            </div>
          </div>
          <div className={styles.formPanel} data-reveal="right">
            <ConsultForm tone="light" />
          </div>
        </div>
      </section>
    </>
  )
}
