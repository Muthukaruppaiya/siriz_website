/** Prefix public paths with Vite's base (needed for GitHub Pages project sites). */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
