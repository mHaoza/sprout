/**
 * 内容路径工具
 *
 * Nuxt Content 生成的 `path` 形如 `/blog/articles/20260119_01`，
 * 这里统一转换成站点实际使用的路由。
 */
export function contentSlug(path?: string | null): string {
  if (!path) return ''
  return path.split('/').pop()?.replace(/\.md$/, '') ?? ''
}

/** 文章（articles 集合）→ `/post/<slug>` */
export function articlePath(path?: string | null): string {
  const slug = contentSlug(path)
  return slug ? `/post/${slug}` : '/'
}

/** 更多（more 集合）→ `/more/<slug>` */
export function morePath(path?: string | null): string {
  const slug = contentSlug(path)
  return slug ? `/more/${slug}` : '/more'
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
