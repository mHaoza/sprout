import markdownIt from 'markdown-it'
import frontMatter from 'front-matter'

const md = markdownIt()

// 自定义插件：替换图片标记
md.renderer.rules.image = (tokens, idx) => {
  const token = tokens[idx]
  const src = token.attrGet('src')
  const alt = token.content

  return `<div class="custom-image" data-src="${src}" data-alt="${alt}" ></div>`
}

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
      return match.replace(group, mdPath + group).replace('./', '')
    }
  })

  return replacedString
}
