import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Grid2X2, Search, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { Ads } from '@/lib/ads'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3
const hiddenTasks = new Set(['image', 'profile'])

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => (typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : '')
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? (content.images.find((item) => typeof item === 'string') as string | undefined) : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (derivedTask && hiddenTasks.has(derivedTask)) return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 5 === 0

  return (
    <Link
      href={href}
      className={`group block overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]/95 shadow-[0_24px_80px_rgba(0,0,0,0.32)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-cream)]/28 hover:shadow-[0_28px_84px_rgba(0,0,0,0.4)] ${strong ? 'md:col-span-2' : ''}`}
    >
      {image ? (
        <div className={`relative overflow-hidden bg-black ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-black">{taskLabel}</span>
        </div>
      ) : null}
      <div className="p-5 sm:p-6">
        {!image ? <span className="rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-black">{taskLabel}</span> : null}
        <h2 className="editable-display mt-4 line-clamp-3 text-3xl font-semibold leading-[0.95] tracking-[-0.05em] text-white">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 text-sm font-semibold leading-7 text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-cream)] opacity-70 group-hover:opacity-100">
          Open result <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
    ? []
    : SITE_CONFIG.tasks.filter((item) => item.enabled && !hiddenTasks.has(item.key)).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled && !hiddenTasks.has(item.key))

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="overflow-hidden border-b border-[var(--editable-border)] bg-[radial-gradient(circle_at_top,rgba(255,195,0,0.24),transparent_28%),linear-gradient(180deg,#0a0710_0%,#0c0812_58%,#09060f_100%)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
            <div className="rounded-[34px] border border-[var(--editable-border)] bg-black/25 p-4 backdrop-blur-sm sm:p-6">
              <div className="text-center">
                <p className="text-sm font-medium text-white/90">Search across articles, business listings, and public content with the same editorial discovery flow as the homepage.</p>
                <h1 className="editable-display mx-auto mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl lg:text-[5rem]">
                  {pagesContent.search.hero.title}
                </h1>
                <p className="mx-auto mt-6 max-w-3xl text-base font-semibold leading-8 text-[var(--slot4-muted-text)]">{pagesContent.search.hero.description}</p>
              </div>

              <form action="/search" className="mx-auto mt-8 flex w-full max-w-5xl flex-col overflow-hidden rounded-[26px] border border-white/12 bg-black/70 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
                <input type="hidden" name="master" value="1" />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white sm:min-w-[180px]">
                    <Grid2X2 className="h-4 w-4 text-[var(--slot4-cream)]" />
                    <span>All</span>
                  </div>
                  <label className="flex flex-1 items-center gap-3">
                    <Search className="h-5 w-5 shrink-0 text-[var(--slot4-cream)]" />
                    <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/55" />
                  </label>
                  <button className="rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#09060f]" type="submit">
                    Search
                  </button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/5 px-4 py-3">
                    <Filter className="h-4 w-4 text-[var(--slot4-cream)]" />
                    <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/45" />
                  </label>
                  <select name="task" defaultValue={task} className="rounded-full border border-[var(--editable-border)] bg-white/5 px-4 py-3 text-sm font-semibold text-white outline-none">
                    <option value="">All content types</option>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                </div>
              </form>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <span className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#09060f]">Search studio</span>
                <span className="px-5 py-3 text-sm font-semibold text-white/80">Articles</span>
                <span className="px-5 py-3 text-sm font-semibold text-white/80">Businesses</span>
                <span className="px-5 py-3 text-sm font-semibold text-white/80">Bookmarks</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 rounded-[2.5rem] border border-[var(--editable-border)] bg-[rgba(255,255,255,0.03)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.25)] backdrop-blur md:grid-cols-[0.8fr_1.2fr] lg:p-10">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--slot4-cream)] opacity-75">{pagesContent.search.hero.badge}</p>
              <h2 className="editable-display mt-5 text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl">
                Search results shaped like the homepage experience
              </h2>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 text-[var(--slot4-muted-text)]">
                Move through the archive with the same image-led cards, dark editorial surfaces, and refined spacing used across the landing page.
              </p>
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-cream)]">
                <Sparkles className="h-4 w-4" /> {results.length} curated matches
              </div>
            </div>
            <div className="self-end rounded-[2rem] border border-[var(--editable-border)] bg-black/20 p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-[var(--editable-border)] bg-white/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-cream)]">Keyword</p>
                  <p className="mt-2 text-lg font-semibold text-white">{query || 'Browsing all content'}</p>
                </div>
                <div className="rounded-[24px] border border-[var(--editable-border)] bg-white/5 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-cream)]">Filter</p>
                  <p className="mt-2 text-lg font-semibold text-white">{category || task || 'All categories and types'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--slot4-cream)]/70">{results.length} results</p>
              <h2 className="editable-display mt-2 text-4xl font-semibold tracking-[-0.05em] text-white">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/5 px-5 py-3 text-sm font-black text-white transition hover:border-[var(--slot4-cream)]/35 hover:bg-white/10">
              Browse latest <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mx-auto max-w-6xl px-4 py-6">
            <Ads slot="footer" showLabel eager className="mx-auto w-full" />
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug || post.title} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-dashed border-[var(--editable-border)] bg-[rgba(255,255,255,0.03)] p-10 text-center">
              <p className="editable-display text-3xl font-semibold tracking-[-0.04em] text-white">No matching posts found.</p>
              <p className="mt-3 text-sm font-semibold text-[var(--slot4-muted-text)]">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
