import { Link } from 'react-router-dom'
import { SplitText } from '../motion/SplitText'
import styles from './PageHero.module.css'

type Props = {
  eyebrow: string
  title: string
  body?: string
  image: string
  crumb: string
}

export function PageHero({ eyebrow, title, body, image, crumb }: Props) {
  return (
    <section className={styles.hero}>
      <div className={styles.media} aria-hidden="true">
        <img src={image} alt="" data-parallax="8" className={styles.image} />
        <div className={styles.veil} />
      </div>
      <div className={styles.content} data-fade-out>
        <nav className={styles.crumbs} aria-label="Breadcrumb" data-reveal="fade">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{crumb}</span>
        </nav>
        <p className={styles.eyebrow} data-reveal="fade">
          {eyebrow}
        </p>
        <SplitText as="h1" text={title} className={styles.title} />
        {body ? (
          <p className={styles.body} data-reveal>
            {body}
          </p>
        ) : null}
      </div>
      <div className={styles.scrollCue} aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
