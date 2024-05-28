import fs from 'node:fs'
import path from 'node:path'
import frontMatter from 'front-matter'

/** 递归读取文件夹内所有md文件 */
function readFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      readFiles(filePath, fileList)
    } else if (path.extname(file) === '.md') {
      fileList.push(filePath)
    }
  })
  return fileList
}

/** 解析MD文件中的YAML数据 */
function parseMdFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { attributes, body } = frontMatter(fileContent)
  return { attributes, body }
}

/** 提取MD文件中的第一段内容 */
function extractFirstParagraph(content) {
  // 去除选中的图片、表格等数据
  const cleanContent = content.replace(/!\[.*?\]\(.*?\)|\|.*?\|/g, '')

  // 分割成段落
  const paragraphs = cleanContent.split('\n\n')

  return paragraphs[0].trim()
}

/** 读取文件夹内所有md文件，并解析其YAML数据 */
function processMDFiles(folderPath) {
  const mdFiles = readFiles(folderPath)

  // 解析MD文件
  const postFileDataList = mdFiles.map((filePath) => {
    const { attributes, body } = parseMdFile(filePath)
    return {
      fileName: path.basename(filePath),
      filePath: filePath.split(path.sep).join('/').replace('public', ''),
      data: { ...attributes, description: attributes.description || extractFirstParagraph(body) },
    }
  })

  // 处理标签和分类
  const tags = []
  const categories = []
  postFileDataList.forEach((mdData) => {
    const { data } = mdData
    data.tags?.forEach((tag) => {
      if (!tags.includes(tag)) {
        tags.push(tag)
      }
    })
    if (data.category && !categories.includes(data.category)) {
      categories.push(data.category)
    }
  })

  return { allPosts: postFileDataList, tags, categories }
}

export function getPostsList() {
  const data = processMDFiles('./public/posts')
  fs.writeFileSync('./public/posts/data.json', JSON.stringify(data, null, 2))
  console.log('#posts data generated successfully#')
}
