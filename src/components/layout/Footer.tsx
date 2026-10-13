import { Link } from 'react-router-dom'
import { contact, whatsappUrl } from '../../data/contact'
import styles from './Footer.module.css'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.lead} data-reveal>
          <p className={styles.kicker}>Start your dream home</p>
          <a
            className={styles.bigLink}
            href={whatsappUrl('Hi Siriz, I would like to start my home interiors.')}
            target="_blank"
            rel="noopener noreferrer"
          >
            Let’s talk on WhatsApp
            <span className={styles.arrow} aria-hidden="true">
              →
            </span>
          </a>
        </div>

        <div className={styles.cols} data-reveal-stagger>
          <div>
            <p className={styles.label}>Explore</p>
            <ul className={styles.list}>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/portfolio">Portfolio</Link></li>
              <li><Link to="/packages">Packages</Link></li>
              <li><Link to="/tours">360 Tours</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className={styles.label}>Studio</p>
            <p className={styles.address}>
              {contact.legalName}
              <br />
              {contact.address.line1}
              <br />
              {contact.address.line2}
              <br />
              {contact.address.city}
            </p>
          </div>
          <div>
            <p className={styles.label}>Talk to us</p>
            <ul className={styles.list}>
              <li><a href={contact.phoneHref}>Call {contact.phone}</a></li>
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
                  WhatsApp {contact.whatsappDisplay}
                </a>
              </li>
              <li><a href={contact.emailHref}>{contact.email}</a></li>
            </ul>
          </div>
          <div>
            <p className={styles.label}>Follow</p>
            <ul className={styles.list}>
              <li>
                <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={contact.social.youtube} target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              </li>
              <li>
                <a href={contact.social.facebook} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className={styles.wordmark} aria-hidden="true">
        Siriz
      </p>

      <div className={styles.bottom}>
        <p>© {year} {contact.legalName}</p>
        <p>Turnkey interiors · Medavakkam, Chennai</p>
      </div>
    </footer>
  )
}
