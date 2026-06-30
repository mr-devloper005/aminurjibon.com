'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Grid3X3, LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const hiddenTasks = new Set(['image', 'profile'])

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && !hiddenTasks.has(task.key)).map((task) => ({ label: task.label, href: task.route })),
    []
  )

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-xl">
      <div className="border-b border-white/5 bg-[linear-gradient(90deg,#ffd400_0%,#ff8c00_52%,#ff5f00_100%)]">
        <div className="mx-auto flex max-w-[var(--editable-container)] items-center justify-center gap-4 px-4 py-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-white/90">{globalContent.nav?.tagline || SITE_CONFIG.tagline}</p>
          <Link href="/" className="hidden rounded-full border border-white/60 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10 sm:inline-flex">
            Start exploring
          </Link>
        </div>
      </div>

      <nav className="mx-auto flex min-h-[80px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-black/40">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="editable-display block max-w-[220px] truncate text-2xl font-semibold leading-none text-white">{SITE_CONFIG.name}</span>
            <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-muted-text)]">
              Curated discovery and business stories
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {navItems.slice(0, 6).map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  active
                    ? 'bg-white text-[#09060f]'
                    : 'text-[var(--slot4-muted-text)] hover:bg-white/8 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <form action="/search" className="mx-auto hidden min-w-0 flex-1 lg:flex">
          <label className="flex h-12 w-full items-center gap-3 rounded-2xl border border-[var(--editable-border)] bg-black/35 px-4 text-sm">
            <Grid3X3 className="h-4 w-4 shrink-0 text-[var(--slot4-cream)]" />
            <input
              name="q"
              type="search"
              placeholder="Search articles, services, listings, and ideas"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[var(--slot4-muted-text)]"
            />
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-white">Search</span>
          </label>
        </form>

        <div className="ml-auto flex items-center gap-2">
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffd400_0%,#ff8c00_55%,#ff5f00_100%)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#2b1400] transition hover:brightness-110 sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Create
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-full border border-[var(--editable-border)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] transition hover:text-white sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-muted-text)] transition hover:bg-white/8 hover:text-white sm:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" /> Login
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#09060f] transition hover:bg-[var(--slot4-cream)] sm:inline-flex"
              >
                <UserPlus className="h-3.5 w-3.5" /> Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-[var(--editable-border)] bg-black/35 p-2.5 xl:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[#08060a] px-4 py-5 xl:hidden">
          <form action="/search" className="mb-5 flex items-center gap-3 rounded-2xl border border-[var(--editable-border)] bg-black/35 px-4 py-3">
            <Search className="h-4 w-4 text-[var(--slot4-cream)]" />
            <input
              name="q"
              type="search"
              placeholder="Search posts"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-muted-text)]"
            />
          </form>
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, ...navItems, { label: 'Contact', href: '/contact' }, ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                    active
                      ? 'bg-white text-[#09060f]'
                      : 'border border-[var(--editable-border)] text-[var(--slot4-muted-text)] hover:border-white/20 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </header>
  )
}
