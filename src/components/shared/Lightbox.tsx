import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { GalleryImage } from '../../data/portfolio'
import { lockScroll } from '../../hooks/useLenis'
import styles from './Lightbox.module.css'

type Props = {
  images: GalleryImage[]
  index: number | null
  onChange: (index: number | null) => void
  title?: string
}

export function Lightbox({ images, index, onChange, title }: Props) {
  const open = index !== null
  const total = images.length

  const step = useCallback(
    (dir: number) => {
      if (index === null) return
      onChange((index + dir + total) % total)
    },
    [index, total, onChange],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null)
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    lockScroll(true)
    window.addEventListener('keydown', onKey)
    return () => {
      lockScroll(false)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onChange, step])

  if (!open) return null
  const current = images[index]

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Image viewer'}
      onClick={() => onChange(null)}
    >
      <div className={styles.top}>
        <p className={styles.title}>{title}</p>
        <p className={styles.count}>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>
        <button type="button" className={styles.close} onClick={() => onChange(null)} aria-label="Close">
          ✕
        </button>
      </div>

      <figure className={styles.figure} onClick={(e) => e.stopPropagation()}>
        <img key={current.src} src={current.src} alt={current.alt} className={styles.image} />
      </figure>

      {total > 1 ? (
        <>
          <button
            type="button"
            className={`${styles.nav} ${styles.prev}`}
            onClick={(e) => {
              e.stopPropagation()
              step(-1)
            }}
            aria-label="Previous image"
          >
            ←
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.next}`}
            onClick={(e) => {
              e.stopPropagation()
              step(1)
            }}
            aria-label="Next image"
          >
            →
          </button>
          <div className={styles.thumbs} onClick={(e) => e.stopPropagation()}>
            {images.map((img, i) => (
              <button
                key={img.src}
                type="button"
                className={`${styles.thumb} ${i === index ? styles.thumbActive : ''}`}
                onClick={() => onChange(i)}
                aria-label={`Show image ${i + 1}`}
              >
                <img src={img.src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>,
    document.body,
  )
}
