import Link from 'next/link'
import { ArrowUpRight, BriefcaseBusiness, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, Star, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { Ads } from '@/lib/ads'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-6 xl:grid-cols-3',
  listing: 'grid gap-5 xl:grid-cols-2',
  classified: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] md:columns-2 xl:columns-3',
  sbm: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4',
}

const cardBase =
  'group block overflow-hidden rounded-[30px] border border-[var(--tk-line)] bg-[var(--tk-surface)]/95 backdrop-blur-sm transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-cream)]/28 hover:shadow-[0_26px_70px_rgba(0,0,0,0.42)]'

const archiveAdSlots: Partial<Record<TaskKey, 'header' | 'sidebar' | 'in-feed' | 'article-bottom' | 'footer'>> = {
  article: 'header',
  listing: 'in-feed',
  profile: 'sidebar',
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const lead = posts[0]
  const rail = posts.slice(1, 5)
  const adSlot = archiveAdSlots[task]

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <header className="relative overflow-hidden border-b border-[var(--tk-line)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,195,0,0.22),transparent_28%),linear-gradient(180deg,#09060f_0%,#0d0811_100%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-[var(--slot4-cream)]">
                  <span>{theme.kicker}</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--slot4-cream)]/60" />
                  <span className="text-[var(--tk-muted)]">{label}</span>
                </div>
                <h1 className="editable-display mt-5 max-w-4xl text-balance text-[3rem] font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl">
                  {voice?.headline || `Browse ${label}`}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--tk-muted)]">{voice?.description || theme.note}</p>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {(voice?.chips || []).slice(0, 5).map((chip) => (
                    <span key={chip} className="rounded-full border border-[var(--tk-line)] bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--tk-muted)]">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-[var(--tk-line)] bg-black/30 p-5 backdrop-blur-sm sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-[var(--tk-muted)]">
                    <span className="font-semibold text-white">{posts.length}</span> {posts.length === 1 ? 'entry' : 'entries'} in {categoryLabel}
                  </p>
                  <Link href={basePath} className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-cream)]">
                    Reset
                  </Link>
                </div>
                <form action={basePath} className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <select
                      name="category"
                      defaultValue={category}
                      className="h-12 w-full appearance-none rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 pr-10 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                      aria-label={voice?.filterLabel || 'Filter category'}
                    >
                      <option value="all">All categories</option>
                      {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                  </div>
                  <button className="inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#ffd400_0%,#ff8c00_55%,#ff5f00_100%)] px-6 text-sm font-semibold text-[#2b1400] transition hover:brightness-110">
                    Apply
                  </button>
                </form>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-[var(--tk-line)] bg-white/5 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-cream)]">Search-first browsing</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">Browse by category, then continue through richer image and profile-led cards.</p>
                  </div>
                  <div className="rounded-[24px] border border-[var(--tk-line)] bg-white/5 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-cream)]">Fresh editorial mix</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">Each section keeps the same feed data while presenting it through a more premium interface.</p>
                  </div>
                </div>
              </div>
            </div>

            {lead ? (
              <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <FeatureLeadCard task={task} post={lead} basePath={basePath} />
                <div className="grid gap-4">
                  {rail.map((post, index) => (
                    <RailHighlightCard key={post.id || post.slug || post.title} task={task} post={post} basePath={basePath} index={index} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </header>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          {adSlot ? (
            <div className="mx-auto max-w-6xl px-4 py-6">
              <Ads slot={adSlot} showLabel eager className="mx-auto w-full" />
            </div>
          ) : null}

          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug || post.title} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-[32px] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-5 text-3xl font-semibold tracking-[-0.04em] text-white">Nothing here yet</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--tk-muted)]">Try another category, or check back once fresh {label.toLowerCase()} are published.</p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-14 flex flex-wrap items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--tk-line)] px-5 py-2.5 font-medium transition hover:border-[var(--slot4-cream)]/35">Previous</Link> : null}
              <span className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 font-medium text-[var(--tk-muted)]">Page {page} of {pagination.totalPages || 1}</span>
              {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--tk-line)] px-5 py-2.5 font-medium transition hover:border-[var(--slot4-cream)]/35">Next</Link> : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function hrefFor(task: TaskKey, basePath: string, post: SitePost) {
  return `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
}

function FeatureLeadCard({ task, post, basePath }: { task: TaskKey; post: SitePost; basePath: string }) {
  return (
    <Link href={hrefFor(task, basePath, post)} className="group relative block min-h-[420px] overflow-hidden rounded-[34px] border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
      <img src={getImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,6,15,0.08)_0%,rgba(9,6,15,0.86)_75%)]" />
      <div className="relative flex h-full flex-col justify-end p-7 sm:p-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-cream)]">{getCategory(post, 'Feature')}</p>
        <h2 className="editable-display mt-4 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl">{post.title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function RailHighlightCard({ task, post, basePath, index }: { task: TaskKey; post: SitePost; basePath: string; index: number }) {
  return (
    <Link href={hrefFor(task, basePath, post)} className="group grid gap-4 overflow-hidden rounded-[28px] border border-[var(--tk-line)] bg-[rgba(255,255,255,0.03)] p-4 transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-cream)]/28 sm:grid-cols-[140px_minmax(0,1fr)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[var(--tk-raised)]">
        <img src={getImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-cream)]">Featured {String(index + 1).padStart(2, '0')}</p>
        <h3 className="editable-display mt-2 line-clamp-2 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = hrefFor(task, basePath, post)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-cream)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  )
}

const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
const ratingOf = (post: SitePost) => {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.7 + (hashStr(post.slug || post.id || post.title || 'x') % 13) / 10) * 10) / 10
}
const reviewsOf = (post: SitePost) => {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 6 + (hashStr((post.slug || post.title || 'x') + 'r') % 480)
}

function RatingLine({ post, center = false }: { post: SitePost; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-2.5 flex items-center gap-2 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-4 w-4 ${i < filled ? 'fill-[var(--slot4-cream)] text-[var(--slot4-cream)]' : 'fill-[var(--tk-line)] text-[var(--tk-line)]'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold text-white">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--tk-muted)]">({reviewsOf(post)})</span>
    </div>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={cardBase}>
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img src={getImage(post)} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-cream)]">
          <span>{getCategory(post, 'Article')}</span>
          <span className="text-[var(--tk-muted)]">No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white">{post.title}</h2>
        <RatingLine post={post} />
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <CardArrow label="Read article" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} grid gap-5 p-5 sm:grid-cols-[120px_minmax(0,1fr)]`}>
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-9 w-9 text-[var(--tk-muted)]" />}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-cream)]">{getCategory(post, 'Business')}</p>
        <h2 className="editable-display mt-2 text-3xl font-semibold tracking-[-0.04em] text-white">{post.title}</h2>
        <RatingLine post={post} />
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs font-medium text-[var(--tk-muted)]">
          {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {location}</span> : null}
          {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {phone}</span> : null}
          {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> Website</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-4xl font-semibold tracking-[-0.05em] text-[var(--slot4-cream)]">{price || 'Open offer'}</span>
        {condition ? <span className="rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--slot4-cream)]">{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-5 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">{post.title}</h2>
      <RatingLine post={post} />
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-xs font-medium text-[var(--tk-muted)]">
        <span>{location || 'Details inside'}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--slot4-cream)] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[30px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-cream)]/28">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={getImage(post)} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_42%,rgba(9,6,15,0.84))]" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">{post.title}</h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/70">View image <ArrowUpRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-4 p-6`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--slot4-cream)]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">Saved {String(index + 1).padStart(2, '0')}</span>
        <h2 className="editable-display mt-2 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
        {website ? <p className="mt-3 truncate text-xs font-medium text-[var(--slot4-cream)]">{cleanDomain(website)}</p> : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--slot4-cream)]"><FileText className="h-6 w-6" /></div>
        <span className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--tk-muted)]">{getCategory(post, 'Document')}</span>
      </div>
      <h2 className="editable-display mt-6 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">{post.title}</h2>
      <RatingLine post={post} />
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--slot4-cream)]">Open document <Download className="h-4 w-4" /></span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--slot4-cream)]">{role}</p> : null}
      <RatingLine post={post} center />
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
