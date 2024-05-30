import data from '../../data/posts.json'
import type { PostData } from '@/types'

const { allPosts, tags, categories }: PostData = data
export {
  allPosts,
  tags,
  categories,
}
