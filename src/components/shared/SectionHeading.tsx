import { SplitText } from '../motion/SplitText'
import styles from './SectionHeading.module.css'

type Props = {
  eyebrow?: string
  title: string
  body?: string
  align?: 'left' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
  tone = 'light',
  className = '',
}: Props) {
  return (
    <header className={`${styles.wrap} ${styles[align]} ${styles[tone]} ${className}`}>
      {eyebrow ? (
        <p className={styles.eyebrow} data-reveal="fade">
          <span className={styles.rule} aria-hidden="true" />
          {eyebrow}
        </p>
      ) : null}
      <SplitText text={title} className={styles.title} />
      {body ? (
        <p className={styles.body} data-reveal>
          {body}
        </p>
      ) : null}
    </header>
  )
}
