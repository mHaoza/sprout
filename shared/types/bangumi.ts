/** 收藏类型 */
export enum CollectionType {
  /** 想看 */
  WantToWatch = 1,
  /** 看过 */
  Watched = 2,
  /** 在看 */
  Watching = 3,
  /** 搁置 */
  OnHold = 4,
  /** 抛弃 */
  Dropped = 5,
}

/** 科目类型 */
export enum SubjectType {
  /** 书籍 */
  Book = 1,
  /** 动画 */
  Anime = 2,
  /** 音乐 */
  Music = 3,
  /** 游戏 */
  Game = 4,
  /** 三次元 */
  Real = 6,
}

export interface UserSubjectCollection {
  updated_at: string
  comment?: string | null
  tags: string[]
  subject: SlimSubject
  subject_id: number
  vol_status: number
  /** 用户观看的集数 */
  ep_status: number
  /** 科目类型 */
  subject_type: SubjectType
  /** 收藏类型 */
  type: CollectionType
  rate: 0
  private: false
}

export interface SlimSubject {
  /** 开播日期 */
  date: string
  /** 图片信息 */
  images: { small: string; grid: string; large: string; medium: string; common: string }
  /** 名称 */
  name: string
  /** 名称(中文简体) */
  name_cn: string
  /** 简介 */
  short_summary: string
  tags: { name: string; count: number; total_cont: number }[]
  /** 评分 */
  score: number
  type: SubjectType
  id: number
  /** 总集数 */
  eps: number
  volumes: 0
  /** 收藏数 */
  collection_total: number
  /** 排名 */
  rank: number
}
