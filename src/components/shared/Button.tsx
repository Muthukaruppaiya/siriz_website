import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'
import { Link } from 'react-router-dom'
import styles from './Button.module.css'

type Variant = 'primary' | 'secondary' | 'dark' | 'ghostLight'

type Common = {
  children: ReactNode
  variant?: Variant
  className?: string
}

type ButtonAsButton = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; to?: undefined }

type ButtonAsAnchor = Common &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: undefined }

type ButtonAsRouterLink = Common & {
  to: string
  href?: undefined
}

export type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsRouterLink

const variantClass: Record<Variant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  dark: styles.dark,
  ghostLight: styles.ghostLight,
}

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', className = '' } = props
  const classes = `${styles.btn} ${variantClass[variant]} ${className}`.trim()

  if ('to' in props && props.to) {
    const { to, children: _c, variant: _v, className: _cl, ...rest } = props
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href) {
    const { href, children: _c, variant: _v, className: _cl, ...rest } = props
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }

  const {
    children: _c,
    variant: _v,
    className: _cl,
    ...rest
  } = props as ButtonAsButton

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
