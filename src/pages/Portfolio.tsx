import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  films,
  interiors,
  moodboard,
  portfolioTabs,
  projects,
  signature,
  youtubeHighlights,
  type GalleryImage,
  type PortfolioTab,
} from '../data/portfolio'
import { contact, whatsappUrl } from '../data/contact'
import { FinalCTA } from '../components/home/FinalCTA'
import { Button } from '../components/shared/Button'
import { Lightbox } from '../components/shared/Lightbox'
import { PageHero } from '../components/shared/PageHero'
import { useLocalReveal } from '../hooks/useLocalReveal'
import styles from './Page.module.css'

type Viewer = { images: GalleryImage[]; index: number; title: string } | null

const isTab = (v: string | null): v is PortfolioTab =>
  portfolioTabs.some((t) => t.id === v)

export function Portfolio() {
  const [params, setParams] = useSearchParams()
  const tabParam = params.get('tab')
  const tab: PortfolioTab = isTab(tabParam) ? tabParam : 'projects'
  const [viewer, setViewer] = useState<Viewer>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  useLocalReveal(panelRef, tab)

  const open = (images: GalleryImage[], index: number, title: string) =>
    setViewer({ images, index, title })

  const selectTab = (id: PortfolioTab) => {
    setParams(id === 'projects' ? {} : { tab: id }, { replace: true })
  }

  return (
    <>
      <PageHero
        crumb="Portfolio"
        eyebrow="Our work"
        title="Homes we have designed and delivered."
        body="Projects, Siriz Signature, mood boards, and build films."
        image="/images/signature/signature-02.webp"
      />

      <div className={styles.tabsBar}>
        <div className={styles.tabs} role="tablist" aria-label="Portfolio collections">
          {portfolioTabs.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ''}`}
              onClick={() => selectTab(t.id)}
            >
              {t.label}
              <span className={styles.tabCount}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      <section className={`${styles.section} ${styles.dark}`}>
        <div className={`${styles.wide} ${styles.panel}`} key={tab} ref={panelRef} role="tabpanel">
          {tab === 'projects' ? (
            <ul className={styles.projects}>
              {projects.map((p) => (
                <li key={p.id} className={styles.project} data-item>
                  <button
                    type="button"
                    className={styles.projectCover}
                    onClick={() => open(p.images, 0, `Project ${p.number}`)}
                    aria-label={`Open Project ${p.number} gallery`}
                  >
                    <img src={p.cover} alt={`Project ${p.number}: ${p.title}`} loading="lazy" />
                    <span className={styles.projectCount}>{p.images.length} photos</span>
                  </button>
                  <div className={styles.projectMeta}>
                    <span className={styles.projectNum}>{p.number}</span>
                    <h2>{p.title}</h2>
                    <p>{p.summary}</p>
                    <div className={styles.thumbs}>
                      {p.images.slice(1, 5).map((img, i) => (
                        <button
                          key={img.src}
                          type="button"
                          className={styles.thumb}
                          onClick={() => open(p.images, i + 1, `Project ${p.number}`)}
                          aria-label={img.alt}
                        >
                          <img src={img.src} alt="" loading="lazy" />
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      className={styles.textLink}
                      onClick={() => open(p.images, 0, `Project ${p.number}`)}
                    >
                      View all {p.images.length} photos <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {tab === 'signature' || tab === 'moodboard' || tab === 'interiors' ? (
            <Masonry
              images={tab === 'signature' ? signature : tab === 'moodboard' ? moodboard : interiors}
              title={portfolioTabs.find((t) => t.id === tab)?.label ?? ''}
              onOpen={open}
            />
          ) : null}

          {tab === 'films' ? (
            <>
              <ul className={styles.films}>
                {films.map((f) => (
                  <li key={f.id} className={styles.film} data-item>
                    <div className={styles.filmMedia}>
                      <video
                        src={f.src}
                        poster={f.poster}
                        muted
                        loop
                        playsInline
                        preload="none"
                        onMouseEnter={(e) => void e.currentTarget.play().catch(() => undefined)}
                        onMouseLeave={(e) => e.currentTarget.pause()}
                        onClick={(e) =>
                          e.currentTarget.paused
                            ? void e.currentTarget.play().catch(() => undefined)
                            : e.currentTarget.pause()
                        }
                      />
                    </div>
                    <p className={styles.filmTitle}>{f.title}</p>
                  </li>
                ))}
              </ul>
              <h2 className={styles.subhead} data-item>
                More on our YouTube channel
              </h2>
              <ul className={styles.films}>
                {youtubeHighlights.map((y, i) => (
                  <li key={y.id} className={styles.film} data-item>
                    <a href={y.href} target="_blank" rel="noopener noreferrer" className={styles.filmMedia}>
                      <img src={y.image} alt={`Siriz project video ${i + 1}`} loading="lazy" />
                      <span className={styles.play} aria-hidden="true">
                        <span>▶</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 'var(--space-6)' }} data-item>
                <Button href={contact.social.youtube} variant="secondary" target="_blank" rel="noopener noreferrer">
                  Watch on YouTube
                </Button>
              </div>
            </>
          ) : null}

          <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }} data-item>
            <Button
              href={whatsappUrl('Hi Siriz, I saw your portfolio and would like something similar for my home.')}
              variant="primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Discuss a similar design
            </Button>
          </div>
        </div>
      </section>

      <Lightbox
        images={viewer?.images ?? []}
        index={viewer ? viewer.index : null}
        onChange={(i) => setViewer((v) => (v && i !== null ? { ...v, index: i } : null))}
        title={viewer?.title}
      />

      <FinalCTA />
    </>
  )
}

function Masonry({
  images,
  title,
  onOpen,
}: {
  images: GalleryImage[]
  title: string
  onOpen: (images: GalleryImage[], index: number, title: string) => void
}) {
  return (
    <ul className={styles.masonry}>
      {images.map((img, i) => (
        <li key={img.src} className={styles.masonryItem} data-item>
          <button type="button" className={styles.masonryBtn} onClick={() => onOpen(images, i, title)}>
            <img src={img.src} alt={img.alt} loading="lazy" width={1600} height={904} />
          </button>
        </li>
      ))}
    </ul>
  )
}
