import markdownIt from 'markdown-it'
import frontMatter from 'front-matter'

const md = markdownIt()

export function parseMarkdown<T = any>(text: string): { params: Partial<T>, html: string } {
  if (!text) {
    return { params: {}, html: '' }
  }

  const frontMatterResult = frontMatter<T>(text)
  const html = md.render(frontMatterResult.body)

  return { params: frontMatterResult.attributes, html }
}
