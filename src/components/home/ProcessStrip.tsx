import { processSteps } from '../../data/process'
import { SectionHeading } from '../shared/SectionHeading'
import styles from './ProcessStrip.module.css'

export function ProcessStrip() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <SectionHeading
          tone="dark"
          align="center"
          eyebrow="Work process"
          title="Six steps from first meeting to move-in."
          body="A clear path, so you always know what comes next."
        />

        <div className={styles.timeline}>
          <span className={styles.track} aria-hidden="true">
            <span className={styles.line} data-draw />
          </span>
          <ol className={styles.steps}>
          {processSteps.map((step) => (
            <li key={step.step} className={styles.step}>
              <span className={styles.node} aria-hidden="true" />
              <div className={styles.card} data-reveal={step.step % 2 ? 'left' : 'right'}>
                <span className={styles.num}>Step {String(step.step).padStart(2, '0')}</span>
                <h3 className={styles.title}>{step.title}</h3>
                <p className={styles.body}>{step.body}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
