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

export function replaceImageLinks(markdown: string, mdPath = '') {
  // 使用正则表达式匹配图片地址
  const regex = /!\[.*?\]\((.*?)\)/g

  // 使用 replace 方法将相对路径替换为绝对路径
  const replacedString = markdown.replace(regex, (match, group) => {
    if (group.startsWith('http')) {
      return match // 如果是绝对路径则不做替换
    } else {
      console.log('mdPath + group', decodeURIComponent(mdPath + group))

      return match.replace(group, mdPath + group)
    }
  })

  return replacedString
}
