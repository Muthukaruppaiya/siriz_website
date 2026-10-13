import { Fragment, type ElementType } from 'react'
import styles from './Motion.module.css'

type Props = {
  text: string
  as?: ElementType
  className?: string
}

export function SplitText({ text, as: Tag = 'h2', className }: Props) {
  return (
    <Tag className={className} data-split aria-label={text}>
      {text.split(' ').map((word, i, all) => (
        <Fragment key={i}>
          <span className={styles.wordMask} aria-hidden="true">
            <span className={styles.word} data-word>
              {word}
            </span>
          </span>
          {i < all.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}
