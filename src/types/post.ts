export interface PostInfo {
  title?: string
  date?: string
  category?: string
  tags?: string[]
  description?: string
}

export interface PostFileData {
  fileName: string
  filePath: string
  data: PostInfo
}

export interface PostData {
  allPosts: PostFileData[]
  categories: string[]
  tags: string[]
}
