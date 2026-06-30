import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Cormorant Garamond', Georgia, serif"
const BODY = "'Manrope', system-ui, sans-serif"

const base = {
  dark: true,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#09060f',
  surface: 'rgba(18, 9, 22, 0.88)',
  raised: '#1a1020',
  text: '#fff4e2',
  muted: 'rgba(255, 212, 0, 0.72)',
  line: 'rgba(255, 212, 0, 0.14)',
  accent: '#ff8c00',
  accentSoft: 'rgba(255, 140, 0, 0.16)',
  onAccent: '#fff7ef',
  glow: 'rgba(255, 195, 0, 0.22)',
  radius: '1.5rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Editorial', note: 'Long-form features, timely notes, and polished reads.' },
  listing: { ...base, kicker: 'Directory', note: 'A refined collection of businesses, studios, and services.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Offers, opportunities, and notices with a premium storefront feel.' },
  image: { ...base, kicker: 'Gallery', note: 'Visual discovery with immersive presentation and rich image surfaces.' },
  sbm: { ...base, kicker: 'Curated', note: 'Saved resources and references arranged like an editorial index.' },
  pdf: { ...base, kicker: 'Library', note: 'Documents and downloadable resources presented like a private collection.' },
  profile: { ...base, kicker: 'Profiles', note: 'People, brands, and makers framed through polished profile storytelling.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': '#ffc300',
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
