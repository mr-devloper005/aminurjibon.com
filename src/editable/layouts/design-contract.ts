import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#09060f',
  '--slot4-page-text': '#f6ead7',
  '--slot4-panel-bg': '#130a19',
  '--slot4-surface-bg': '#120916',
  '--slot4-muted-text': 'rgba(255, 212, 0, 0.72)',
  '--slot4-soft-muted-text': 'rgba(255, 212, 0, 0.48)',
  '--slot4-accent': '#ff8c00',
  '--slot4-accent-fill': '#ffc300',
  '--slot4-accent-soft': 'rgba(255, 140, 0, 0.14)',
  '--slot4-on-accent': '#fff7ef',
  '--slot4-dark-bg': '#050308',
  '--slot4-dark-text': '#fff7ef',
  '--slot4-media-bg': '#221027',
  '--slot4-cream': '#ffd400',
  '--slot4-warm': '#160a15',
  '--slot4-lavender': '#1b0d25',
  '--slot4-gray': '#130d18',
  '--slot4-body-gradient':
    'radial-gradient(circle at top left, rgba(255,195,0,0.22), transparent 28%), radial-gradient(circle at top right, rgba(255,95,0,0.24), transparent 30%), linear-gradient(180deg, #09060f 0%, #0d0711 36%, #09060f 100%)',
  '--editable-page-bg': '#09060f',
  '--editable-page-text': '#f6ead7',
  '--editable-container': '1680px',
  '--editable-border': 'rgba(255, 212, 0, 0.12)',
  '--editable-nav-bg': 'rgba(7, 5, 10, 0.94)',
  '--editable-nav-text': '#fff7ef',
  '--editable-nav-active': '#ffd400',
  '--editable-nav-active-text': '#09060f',
  '--editable-cta-bg': 'linear-gradient(135deg, #ffd400 0%, #ff8c00 55%, #ff5f00 100%)',
  '--editable-cta-text': '#fff7ef',
  '--editable-search-bg': '#0c0810',
  '--editable-footer-bg': '#07050a',
  '--editable-footer-text': '#fff2df',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-cream)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_12px_40px_rgba(0,0,0,0.28)]',
  shadowStrong: 'shadow-[0_30px_90px_rgba(0,0,0,0.42)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(5,3,8,0.08),rgba(5,3,8,0.88))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[240px] shrink-0 snap-start sm:w-[280px]',
  },
  type: {
    eyebrow: 'text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--slot4-cream)]',
    heroTitle: 'text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl lg:text-[4.75rem]',
    sectionTitle: 'text-3xl font-semibold tracking-[-0.04em] sm:text-4xl lg:text-[3.2rem]',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-[28px] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[28px] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[32px] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffd400_0%,#ff8c00_55%,#ff5f00_100%)] px-6 py-3 text-sm font-bold tracking-[0.01em] text-[#2b1400] transition duration-300 hover:scale-[1.02] hover:brightness-105 active:scale-[0.99]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/5 px-6 py-3 text-sm font-bold tracking-[0.01em] text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-cream)]/45 hover:bg-white/10',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-bold text-[var(--slot4-on-accent)] transition duration-300 hover:scale-[1.02] hover:brightness-105 active:scale-[0.99]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[24px] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_64px_rgba(0,0,0,0.4)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Keep all editable redesign work inside src/editable so routing and data logic stay intact.',
  'Build the homepage like an image-led editorial discovery surface with strong hero search and mixed card rhythms.',
  'Preserve postHref() and real feed data for every dynamic link.',
  'Use multiple card silhouettes so featured, compact, horizontal, list, and image-first blocks all feel distinct.',
  'Prefer dark premium surfaces, bright editorial accents, and polished mobile spacing over generic blog layouts.',
] as const
