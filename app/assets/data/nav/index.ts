import { animeNavList } from './list/anime'
import { studyNavList } from './list/study'
import { toolNavList } from './list/tool'

export const navList = [...animeNavList, ...toolNavList, ...studyNavList]

export * from './types'
