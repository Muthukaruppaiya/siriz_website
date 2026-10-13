import type { CSSProperties, ReactNode } from 'react'
import styles from './Motion.module.css'

type Props = {
  children: ReactNode
  duration?: number
  gap?: string
  reverse?: boolean
  className?: string
}

export function Marquee({ children, duration = 40, gap = '1rem', reverse, className = '' }: Props) {
  const style = {
    '--marquee-duration': `${duration}s`,
    '--marquee-gap': gap,
  } as CSSProperties

  return (
    <div
      className={`${styles.marquee} ${reverse ? styles.marqueeReverse : ''} ${className}`}
      style={style}
    >
      <div className={styles.marqueeTrack}>
        <div className={styles.marqueeGroup}>{children}</div>
        <div className={styles.marqueeGroup} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  )
}
