'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t border-[var(--editable-border)] bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-[var(--editable-border)] bg-[linear-gradient(135deg,rgba(255,195,0,0.28)_0%,rgba(11,7,17,0.96)_45%,rgba(255,95,0,0.24)_100%)] p-8 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.9fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30">
                  <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
                </span>
                <span>
                  <span className="editable-display block text-3xl font-semibold leading-none">{SITE_CONFIG.name}</span>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">
                    Luxury editorial discovery
                  </span>
                </span>
              </Link>
              <p className="mt-5 max-w-md text-sm leading-7 text-[var(--slot4-muted-text)]">
                {globalContent.footer?.description || SITE_CONFIG.description}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--slot4-cream)]">Site</h3>
              <div className="mt-5 grid gap-3">
                {[['About', '/about'], ['Contact', '/contact'], ...(session ? [['Create', '/create']] : [['Login', '/login'], ['Sign up', '/signup']])].map(([label, href]) => (
                  <Link key={href} href={href} className="text-sm text-[var(--slot4-muted-text)] transition hover:text-white">
                    {label}
                  </Link>
                ))}
                {session ? (
                  <button type="button" onClick={logout} className="text-left text-sm text-[var(--slot4-muted-text)] transition hover:text-white">
                    Logout
                  </button>
                ) : null}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--slot4-cream)]">Highlights</h3>
              <div className="mt-5 grid gap-3 text-sm text-[var(--slot4-muted-text)]">
                <p>Curated visual discovery</p>
                <p>Profile-led storytelling</p>
                <p>Search-first editorial browsing</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-[var(--editable-border)] pt-6 text-xs font-medium uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)] sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {year} {SITE_CONFIG.name}</p>
          <p>{globalContent.footer?.bottomNote || 'Curated for polished public discovery.'}</p>
        </div>
      </div>
    </footer>
  )
}
