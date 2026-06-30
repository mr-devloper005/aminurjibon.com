import Link from 'next/link'
import {
  ArrowRight,
  Bookmark,
  Building2,
  ChevronRight,
  FileText,
  Grid2X2,
  Image as ImageIcon,
  Search,
  Sparkles,
  UserRound,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import { getPostTaskKey, type HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Grid2X2,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: FileText,
  profile: UserRound,
}
const hiddenTasks = new Set<TaskKey>(['image', 'profile'])

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function getExcerpt(post?: SitePost | null, limit = 160) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null, fallback = 'Feature') {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || fallback
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function displayPosts(posts: SitePost[], timeSections: HomeTimeSection[]) {
  return dedupePosts(
    [...posts, ...timeSections.flatMap((section) => section.posts)].filter((post) => {
      const task = getPostTaskKey(post)
      return !task || !hiddenTasks.has(task as TaskKey)
    })
  )
}

function FeaturedCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group relative block min-h-[500px] overflow-hidden rounded-[36px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
      <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,6,10,0.06)_0%,rgba(8,6,10,0.88)_75%)]" />
      <div className="relative flex h-full flex-col justify-end p-8 sm:p-10">
        <span className="inline-flex w-fit rounded-full border border-white/15 bg-black/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--slot4-cream)]">
          Featured collection
        </span>
        <h2 className="editable-display mt-6 max-w-3xl text-4xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
          {post.title}
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">{getExcerpt(post, 210)}</p>
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-white">
          Open feature <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function CompactCard({ post, href, label }: { post: SitePost; href: string; label: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[28px] border border-[var(--editable-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] p-4 transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-cream)]/30">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-cream)]">{label}</p>
      <h3 className="editable-display mt-2 line-clamp-2 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">{post.title}</h3>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 92)}</p>
    </Link>
  )
}

function HorizontalCard({ post, href, accent }: { post: SitePost; href: string; accent: string }) {
  return (
    <Link href={href} className="group grid gap-5 overflow-hidden rounded-[28px] border border-[var(--editable-border)] bg-[rgba(255,255,255,0.03)] p-4 transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-cream)]/30 sm:grid-cols-[240px_minmax(0,1fr)]">
      <div className="relative aspect-[5/4] overflow-hidden rounded-[22px] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      </div>
      <div className="min-w-0 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em]" style={{ color: accent }}>{categoryOf(post)}</p>
        <h3 className="editable-display mt-3 line-clamp-2 text-3xl font-semibold leading-[0.96] tracking-[-0.04em] text-white">{post.title}</h3>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getExcerpt(post, 150)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white">
          View details <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function EditorialListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex gap-4 border-b border-[var(--editable-border)] py-5 last:border-b-0">
      <span className="editable-display text-3xl font-semibold leading-none text-[var(--slot4-cream)]/65">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{categoryOf(post, 'Story')}</p>
        <h3 className="editable-display mt-2 line-clamp-2 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white transition group-hover:text-[var(--slot4-cream)]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 110)}</p>
      </div>
    </Link>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[30px] border border-[var(--editable-border)] bg-[rgba(255,255,255,0.03)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-cream)]/30">
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      </div>
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-cream)]">{categoryOf(post)}</p>
        <h3 className="editable-display mt-2 line-clamp-2 text-2xl font-semibold leading-tight tracking-[-0.04em] text-white">{post.title}</h3>
      </div>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = displayPosts(posts, timeSections)
  const featured = pool[0]
  const rightCards = pool.slice(1, 4)
  const imageCards = pool.slice(4, 9)
  const categories = SITE_CONFIG.tasks.filter((task) => task.enabled && !hiddenTasks.has(task.key as TaskKey)).slice(0, 6)

  return (
    <section className="overflow-hidden border-b border-[var(--editable-border)] bg-[radial-gradient(circle_at_top,rgba(255,195,0,0.24),transparent_28%),linear-gradient(180deg,#0a0710_0%,#0c0812_58%,#09060f_100%)]">
      <div className={`${container} py-10 sm:py-12 lg:py-16`}>
        <div className="rounded-[34px] border border-[var(--editable-border)] bg-black/25 p-4 backdrop-blur-sm sm:p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-white/90">Search, browse, and shape a visual point of view across curated image and profile content.</p>
            <h1 className="editable-display mx-auto mt-8 max-w-4xl text-balance text-5xl font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-6xl lg:text-[5.2rem]">
              Search, edit, make it yours across a polished discovery archive
            </h1>
          </div>

          <form action="/search" className="mx-auto mt-8 flex w-full max-w-4xl flex-col overflow-hidden rounded-[26px] border border-white/12 bg-black/70 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.4)] sm:flex-row sm:items-center sm:gap-3">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white sm:min-w-[180px]">
              <Grid2X2 className="h-4 w-4 text-[var(--slot4-cream)]" />
              <span>All</span>
            </div>
            <div className="mt-3 flex flex-1 items-center gap-3 sm:mt-0">
              <Search className="h-5 w-5 shrink-0 text-[var(--slot4-cream)]" />
              <input
                name="q"
                placeholder="Search our image, profile, and editorial collection"
                className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/55"
              />
            </div>
            <button className="mt-3 rounded-full border border-white px-6 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#09060f] sm:mt-0">
              Search
            </button>
          </form>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#09060f]">AI Studio</span>
            <span className="px-5 py-3 text-sm font-semibold text-white/80">Change color</span>
            <span className="px-5 py-3 text-sm font-semibold text-white/80">Refine mood</span>
            <span className="px-5 py-3 text-sm font-semibold text-white/80">Animate stills</span>
            <span className="px-5 py-3 text-sm font-semibold text-white/80">Type to edit</span>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            {featured ? <FeaturedCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} /> : null}
            <div className="grid gap-5">
              {rightCards.map((post, index) => (
                <CompactCard
                  key={post.id || post.slug || post.title}
                  post={post}
                  href={postHref(primaryTask, post, primaryRoute)}
                  label={index === 0 ? 'Editor pick' : index === 1 ? 'New arrival' : 'Profile note'}
                />
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {imageCards.map((post) => (
              <ImageFirstCard key={post.id || post.slug || post.title} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            {categories.map((task) => {
              const Icon = taskIcon[task.key] || FileText
              return (
                <Link
                  key={task.key}
                  href={task.route}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-[var(--slot4-cream)]/35 hover:bg-white/10"
                >
                  <Icon className="h-4 w-4 text-[var(--slot4-cream)]" />
                  {task.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = displayPosts(posts, timeSections).slice(0, 4)
  if (!pool.length) return null

  return (
    <section className="bg-[var(--slot4-dark-bg)]">
      <div className={`${container} py-14 sm:py-16`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-cream)]">Curated collections</p>
            <h2 className="editable-display mt-3 text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl">
              Editorial rows designed for image-led discovery
            </h2>
          </div>
          <Link href={primaryRoute} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-cream)]">
            View archive <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-5 xl:grid-cols-4">
          {pool.map((post, index) => (
            <HorizontalCard
              key={post.id || post.slug || post.title}
              post={post}
              href={postHref(primaryTask, post, primaryRoute)}
              accent={index % 2 === 0 ? '#ffd400' : '#ff8c00'}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = displayPosts(posts, timeSections)
  const lead = pool[4] || pool[0]
  const list = pool.slice(5, 10)
  const gallery = pool.slice(10, 14)
  if (!lead) return null

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-14 sm:py-16`}>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[34px] border border-[var(--editable-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 sm:p-6">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-cream)]">
              <Sparkles className="h-4 w-4" /> Featured spotlight
            </div>
            <div className="mt-5">
              <FeaturedCard post={lead} href={postHref(primaryTask, lead, primaryRoute)} />
            </div>
          </div>

          <div className="grid gap-8">
            <div className="rounded-[34px] border border-[var(--editable-border)] bg-[rgba(255,255,255,0.03)] p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Editorial index</p>
              <h2 className="editable-display mt-3 text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white">A fast way to move through the latest highlights</h2>
              <div className="mt-4">
                {list.map((post, index) => (
                  <EditorialListCard key={post.id || post.slug || post.title} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {gallery.map((post) => (
                <ImageFirstCard key={post.id || post.slug || post.title} post={post} href={postHref(primaryTask, post, primaryRoute)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const sectionCopy: Record<string, { eyebrow: string; title: string; description: string }> = {
  spotlight: {
    eyebrow: 'This week',
    title: 'Freshly published visual and profile stories',
    description: 'Recent additions arranged in a polished editorial mix.',
  },
  browse: {
    eyebrow: 'Trending',
    title: 'Popular discovery paths for business-minded visitors',
    description: 'Use these sections to jump into topics with momentum.',
  },
  index: {
    eyebrow: 'Archive',
    title: 'Evergreen picks worth revisiting',
    description: 'Older entries that still support discovery and trust.',
  },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || {
          eyebrow: 'Discover',
          title: 'More to explore',
          description: 'Continue browsing the archive.',
        }
        return (
          <section key={section.key} className={index % 2 === 0 ? 'bg-[var(--slot4-dark-bg)]' : 'bg-[var(--slot4-page-bg)]'}>
            <div className={`${container} py-14 sm:py-16`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-3xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--slot4-cream)]">{copy.eyebrow}</p>
                  <h2 className="editable-display mt-3 text-4xl font-semibold leading-[0.96] tracking-[-0.05em] text-white sm:text-5xl">{copy.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-[var(--slot4-muted-text)]">{copy.description}</p>
                </div>
                <Link href={section.href || primaryRoute} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-cream)]">
                  See all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="grid gap-5 sm:grid-cols-2">
                  {section.posts.slice(0, 4).map((post) => (
                    <ImageFirstCard key={post.id || post.slug || post.title} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  ))}
                </div>
                <div className="rounded-[32px] border border-[var(--editable-border)] bg-[rgba(255,255,255,0.03)] p-6">
                  {section.posts.slice(4, 8).map((post, itemIndex) => (
                    <EditorialListCard key={post.id || post.slug || post.title} post={post} href={postHref(primaryTask, post, primaryRoute)} index={itemIndex} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} pb-16 sm:pb-20`}>
        <div className="overflow-hidden rounded-[36px] border border-[var(--editable-border)] bg-[linear-gradient(135deg,rgba(255,212,0,0.92)_0%,rgba(255,140,0,0.88)_52%,rgba(255,95,0,0.82)_100%)] px-6 py-12 text-center sm:px-10 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80">Create and connect</p>
          <h2 className="editable-display mx-auto mt-4 max-w-3xl text-4xl font-semibold leading-[0.95] tracking-[-0.05em] text-white sm:text-5xl">
            Present your next profile, image collection, or business story with a more refined stage.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            Keep discovery flowing across visuals, public profiles, and polished content sections without changing how the platform works behind the scenes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/create" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#09060f] transition hover:bg-[var(--slot4-cream)]">
              Create a post
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
