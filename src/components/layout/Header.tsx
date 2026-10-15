import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { contact, whatsappUrl } from '../../data/contact'
import { lockScroll } from '../../hooks/useLenis'
import { Button } from '../shared/Button'
import styles from './Header.module.css'

const links = [
  { to: '/about', label: 'About' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/packages', label: 'Packages' },
  { to: '/tours', label: '360 Tours' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const { pathname } = useLocation()
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (next: boolean | ((v: boolean) => boolean)) =>
    setOpenOn((prev) => {
      const value = typeof next === 'function' ? next(prev === pathname) : next
      return value ? pathname : null
    })
  const headerRef = useRef<HTMLElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const openRef = useRef(open)

  useLayoutEffect(() => {
    const header = headerRef.current
    const bar = progressRef.current
    if (!header) return

    let anchorY = window.scrollY
    let anchorAt = performance.now()
    let frame = 0

    const update = () => {
      frame = 0
      const y = window.scrollY
      const now = performance.now()
      header.classList.toggle(styles.scrolled, y > 24)
      if (now - anchorAt > 90) {
        const delta = y - anchorY
        if (!openRef.current && y > 520 && delta > 16) header.classList.add(styles.hidden)
        if (openRef.current || delta < -16 || y < 140) header.classList.remove(styles.hidden)
        anchorY = y
        anchorAt = now
      }

      const max = document.documentElement.scrollHeight - window.innerHeight
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useLayoutEffect(() => {
    openRef.current = open
    if (open) headerRef.current?.classList.remove(styles.hidden)
  }, [open])

  useEffect(() => {
    lockScroll(open)
    return () => lockScroll(false)
  }, [open])

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label="Siriz Interiors home">
          <span className={styles.brandMark}>Siriz</span>
          <span className={styles.brandSub}>Interiors</span>
        </Link>

        <nav className={styles.navDesktop} aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.navText} data-text={link.label}>
                {link.label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href={contact.phoneHref} className={styles.phone}>
            {contact.phone}
          </a>
          <Button
            href={whatsappUrl('Hi Siriz, I would like a free design consultation.')}
            variant="primary"
            className={styles.cta}
            target="_blank"
            rel="noopener noreferrer"
          >
            Free consultation
          </Button>
          <button
            type="button"
            className={`${styles.menuBtn} ${open ? styles.menuBtnOpen : ''}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <span className={styles.progress} ref={progressRef} aria-hidden="true" />

      <div
        id="mobile-nav"
        className={`${styles.mobile} ${open ? styles.mobileOpen : ''}`}
        aria-hidden={!open}
      >
        <nav className={styles.mobileNav} aria-label="Mobile">
          <NavLink to="/" className={styles.mobileLink} end>
            <span className={styles.mobileIndex}>00</span>Home
          </NavLink>
          {links.map((link, i) => (
            <NavLink key={link.to} to={link.to} className={styles.mobileLink}>
              <span className={styles.mobileIndex}>{String(i + 1).padStart(2, '0')}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className={styles.mobileFoot}>
          <a href={contact.phoneHref}>{contact.phone}</a>
          <a href={contact.emailHref}>{contact.email}</a>
          <Button
            href={whatsappUrl()}
            variant="primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp Siriz
          </Button>
        </div>
      </div>
    </header>
  )
}
