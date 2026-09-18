interface AstNode {
  type?: string
  value?: string
  children?: unknown[]
}

function collectText(node: unknown, out: string[]) {
  if (!node || typeof node !== 'object') return

  const current = node as AstNode
  if (typeof current.value === 'string') out.push(current.value)

  if (Array.isArray(current.children)) {
    for (const child of current.children) collectText(child, out)
  }
}

/** 从 ContentRenderer 的 AST 中提取纯文本 */
export function extractText(body: unknown): string {
  const out: string[] = []
  collectText(body, out)
  return out.join(' ')
}

const CJK_PATTERN = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g

/** 估算阅读时长，中英文分别按 400 字/分、200 词/分计算 */
export function estimateReadingTime(body: unknown): string {
  const text = extractText(body)
  if (!text.trim()) return '1 分钟'

  const cjkCount = (text.match(CJK_PATTERN) ?? []).length
  const latinCount = (text.replace(CJK_PATTERN, ' ').match(/\S+/g) ?? []).length

  const minutes = Math.max(1, Math.ceil(cjkCount / 400 + latinCount / 200))
  return `${minutes} 分钟`
}

interface TocLink {
  id: string
  depth: number
  text: string
  children?: TocLink[]
}

export interface FlatTocEntry {
  id: string
  title: string
  depth: number
}

function flatten(links: TocLink[], out: FlatTocEntry[]) {
  for (const link of links) {
    if (link.id && link.text) {
      out.push({ id: link.id, title: link.text, depth: link.depth })
    }
    if (link.children?.length) flatten(link.children, out)
  }
}

/** 把 Content 的嵌套 toc 拍平成 [{ id, title, depth }] */
export function flattenToc(links?: TocLink[] | null): FlatTocEntry[] {
  const out: FlatTocEntry[] = []
  if (links?.length) flatten(links, out)
  return out
}
