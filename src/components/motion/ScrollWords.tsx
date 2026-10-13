import styles from './Motion.module.css'

type Props = {
  text: string
  className?: string
}

export function ScrollWords({ text, className }: Props) {
  return (
    <p className={className} data-words aria-label={text}>
      {text.split(' ').map((word, i) => (
        <span key={i} aria-hidden="true">
          <span className={styles.scrollWord} data-word>
            {word}
          </span>{' '}
        </span>
      ))}
    </p>
  )
}
