import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './Motion.module.css'

type Props = {
  value: number
  suffix?: string
  className?: string
}

export function Counter({ value, suffix = '', className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = `${value}${suffix}`
      return
    }

    const state = { n: 0 }
    let tween: gsap.core.Tween | null = null
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        tween = gsap.to(state, {
          n: value,
          duration: 2.2,
          ease: 'expo.out',
          onUpdate: () => {
            el.textContent = `${Math.round(state.n)}${suffix}`
          },
        })
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      tween?.kill()
    }
  }, [value, suffix])

  return (
    <span ref={ref} className={`${styles.counter} ${className}`}>
      0{suffix}
    </span>
  )
}
