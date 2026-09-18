/**
 * 内容路径工具
 *
 * Nuxt Content 生成的 `path` 形如 `/blog/articles/20260119_01`，
 * 这里统一转换成站点实际使用的路由。
 */

/** 取 `path` 的最后一段作为 slug */
export function contentSlug(path?: string | null): string {
  if (!path) return ''
  return path.split('/').pop()?.replace(/\.md$/, '') ?? ''
}

/**
 * 内容 path → 站点路由
 *
 * 本站约定：**集合名即路由段**（`articles` → `/articles/<slug>`），
 * 因此只凭集合名就能推出完整路由；slug 缺失时回退到该集合的列表页。
 *
 * @example contentPath('articles', '/blog/articles/001-foo') // '/articles/001-foo'
 */
export function contentPath(collection: string, path?: string | null): string {
  const slug = contentSlug(path)
  return slug ? `/${collection}/${slug}` : `/${collection}`
}

/** 按年份分组，用于归档列表 */
export function groupByYear<T extends { date?: string | null }>(
  items: T[],
): { year: number; list: T[] }[] {
  const groups = new Map<number, T[]>()

  for (const item of items) {
    const date = item.date ? new Date(item.date) : null
    const year = date && !Number.isNaN(date.getTime()) ? date.getFullYear() : 0
    const list = groups.get(year) ?? []
    list.push(item)
    groups.set(year, list)
  }

  return [...groups.entries()]
    .map(([year, list]) => ({ year, list }))
    .sort((a, b) => b.year - a.year)
}
