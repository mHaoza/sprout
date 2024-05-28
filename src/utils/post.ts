import data from '../../public/posts/data.json'
import type { PostData } from '@/types'

const { allPosts, tags, categories }: PostData = data
export {
  allPosts,
  tags,
  categories,
}
