import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { scrollToElement, scrollToY, useLenis } from '../../hooks/useLenis'
import { useScrollEffects } from '../../hooks/useScrollEffects'
import { Footer } from './Footer'
import { Header } from './Header'
import { WhatsAppFloat } from './WhatsAppFloat'
import styles from './Layout.module.css'

export function Layout() {
  useLenis()
  const { pathname, hash } = useLocation()
  useScrollEffects(pathname)

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        requestAnimationFrame(() => scrollToElement(el))
        return
      }
    }
    scrollToY(0, true)
  }, [pathname, hash])

  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main} key={pathname}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
