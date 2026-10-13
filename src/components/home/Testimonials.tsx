import { testimonials } from '../../data/testimonials'
import { Marquee } from '../motion/Marquee'
import { SectionHeading } from '../shared/SectionHeading'
import styles from './Testimonials.module.css'

function QuoteCard({ name, quote }: { name: string; quote: string }) {
  return (
    <figure className={styles.card}>
      <span className={styles.stars} aria-label="Five stars">
        ★★★★★
      </span>
      <blockquote className={styles.quote}>“{quote}”</blockquote>
      <figcaption className={styles.name}>
        <span className={styles.avatar} aria-hidden="true">
          {name.charAt(0)}
        </span>
        {name}
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
  const half = Math.ceil(testimonials.length / 2)
  const rowA = testimonials.slice(0, half)
  const rowB = testimonials.slice(half)

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <SectionHeading
          align="center"
          eyebrow="What clients say"
          title="600+ happy clients across Chennai."
          body="Punctuality, quality, and value, in our clients' own words."
        />
      </div>
      <div className={styles.rows} data-reveal="fade">
        <Marquee duration={60} gap="1.25rem">
          {rowA.map((t) => (
            <QuoteCard key={t.id} name={t.name} quote={t.quote} />
          ))}
        </Marquee>
        <Marquee duration={55} gap="1.25rem" reverse>
          {rowB.map((t) => (
            <QuoteCard key={t.id} name={t.name} quote={t.quote} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
