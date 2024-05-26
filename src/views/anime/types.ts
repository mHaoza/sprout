export interface AnimeCollectionsResponse {
  total: number
  limit: number
  offset: number
  data: UserSubjectCollection[]
}

export interface UserSubjectCollection {
  subject_id: number
  subject_type: SubjectType
  rate: number
  type: CollectionType
  comment: string | null
  tags: string[]
  /** 看到的集数 */
  ep_status: number
  vol_status: number
  updated_at: string
  private: boolean
  subject: SlimSubject
}

export interface SlimSubject {
  id: number
  type: SubjectType
  name: string
  name_cn: string
  short_summary: string
  date: string
  images: { large: string, common: string, medium: string, small: string, grid: string }
  /** 书籍条目的册数 */
  volumes: number
  /** 话数 */
  eps: number
  /** 收藏人数 */
  collection_total: number
  /** 评分 */
  score: number
  /** 前 10 个 tag */
  tags: { name: string, count: number }[]
}

/** 类型 1 为 书籍   2 为 动画   3 为 音乐   4 为 游戏   6 为 三次元、 */
type SubjectType = 1 | 2 | 3 | 4 | 6
/** 收藏类型 1: 想看 2: 看过 3: 在看 4: 搁置 5: 抛弃 */
type CollectionType = 1 | 2 | 3 | 4 | 5
