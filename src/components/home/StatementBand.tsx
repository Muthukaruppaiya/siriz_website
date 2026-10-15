import styles from './StatementBand.module.css'

const rows = [
  ['Design', 'Produce', 'Install', 'Handover'],
  ['45 days', '10-year warranty', 'Own factory', 'Chennai'],
]

export function StatementBand() {
  return (
    <section className={styles.band} aria-label="Design, produce, install, handover in 45 days">
      {rows.map((words, r) => (
        <div key={r} className={styles.row} aria-hidden="true">
          <p className={`${styles.line} ${r ? styles.outline : ''}`} data-scroll-x={r ? 22 : -22}>
            {[...words, ...words, ...words].map((word, i) => (
              <span key={i} className={styles.item}>
                {word}
                <span className={styles.mark} />
              </span>
            ))}
          </p>
        </div>
      ))}
    </section>
  )
}
