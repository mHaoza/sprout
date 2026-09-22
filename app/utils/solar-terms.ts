import { Lunar, type Solar } from 'lunar-typescript'

/**
 * 二十四节气
 *
 * 节气只负责「背景插画」这一件事：默认按当前时刻自动换图，
 * 也可以在页脚的节气面板里手选一张固定下来（见 `useSolarTermStore`）。
 * 文字与背景的颜色已经交给黑白模式（`useColorModeStore`），
 * 因此这里不再保留任何配色数据。
 */
export const solarTerms = [
  { name: '立春', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202401.png' },
  { name: '雨水', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202402.png' },
  { name: '惊蛰', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202403.png' },
  { name: '春分', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202404.png' },
  { name: '清明', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202405.png' },
  { name: '谷雨', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202406.png' },
  { name: '立夏', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202407.png' },
  { name: '小满', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202408.png' },
  { name: '芒种', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202409.png' },
  { name: '夏至', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202410.png' },
  { name: '小暑', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202411.png' },
  { name: '大暑', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202412.png' },
  { name: '立秋', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202413.png' },
  { name: '处暑', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202414.png' },
  { name: '白露', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202415.png' },
  { name: '秋分', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202416.png' },
  { name: '寒露', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202417.png' },
  { name: '霜降', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202418.png' },
  { name: '立冬', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202419.png' },
  { name: '小雪', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202420.png' },
  { name: '大雪', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202421.png' },
  { name: '冬至', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202422.png' },
  { name: '小寒', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202423.png' },
  { name: '大寒', image: 'https://img.iice.fun/hei/HeiSolarTermsTransparent/202424.png' },
]

export type SolarTerm = (typeof solarTerms)[number]

/** 节气在 `solarTerms` 里的下标；认不出的名字兜底为首个节气 */
export function solarTermIndex(name: string): number {
  const index = solarTerms.findIndex((term) => term.name === name)

  return index < 0 ? 0 : index
}

/** 把 Solar 压成 'YYYY-MM-DD HH:mm'（秒对节气没有意义） */
function toMinute(solar: Solar): string {
  return solar.toYmdHms().slice(0, 16)
}

/** 当令节气及其前后信息 */
export interface SolarTermInfo {
  /** 当令节气 */
  term: SolarTerm
  /** `term` 在 `solarTerms` 里的下标 */
  index: number
  /** 本节气的交节时刻 */
  since: string
  /** 下一个节气及其交节时刻 */
  next: { name: string; at: string }
}

/**
 * 当前时刻所在的节气
 *
 * 用 `getPrevJieQi` 而不是 `getCurrentJieQi`：后者按「整个自然日」匹配，
 * 交节当天的凌晨还没到交节时刻就会被算成本节气（实测 09-23 08:05 交秋分，
 * 当天 00:10 就已返回秋分）。`getPrevJieQi` 认的是「最近一次已发生的交节」，
 * 扫过全年 25 次交节，顺序与时刻都正确，也不会和 `getNextJieQi` 撞名。
 */
export function resolveSolarTermInfo(date: Date = new Date()): SolarTermInfo {
  const lunar = Lunar.fromDate(date)
  const current = lunar.getPrevJieQi()
  const next = lunar.getNextJieQi()
  const index = solarTermIndex(current.getName())

  return {
    term: solarTerms[index]!,
    index,
    since: toMinute(current.getSolar()),
    next: { name: next.getName(), at: toMinute(next.getSolar()) },
  }
}

/** 当前时刻所处的节气，兜底为首个节气 */
export function resolveSolarTerm(date: Date = new Date()): SolarTerm {
  return resolveSolarTermInfo(date).term
}

/**
 * 24 个节气各自「下一次交节」的时刻，顺序与 `solarTerms` 一致
 *
 * `getJieQiTable()` 一轮只覆盖一个節氣年（上个冬至 → 本个大雪），所以冬至、小寒、
 * 大寒在本轮里落在开头，也就是大半年前。这里同时查现在与半年后两张表，
 * 取第一个还没过去的时刻，面板上每个节气报的就都是「下一次交节」，
 * 不会出现日期往回跳的怪现象。
 *
 * 比较用的是 `toYmdHms()` 字符串：'YYYY-MM-DD HH:mm:ss' 定长有序，
 * 字典序恰好等于时间序，比引一个时间戳 API 省事。
 */
export function nextSolarTermMoments(date: Date = new Date()): string[] {
  const now = Lunar.fromDate(date).getSolar().toYmdHms()
  const later = new Date(date.getTime() + 183 * 24 * 60 * 60 * 1000)
  const tables = [Lunar.fromDate(date).getJieQiTable(), Lunar.fromDate(later).getJieQiTable()]

  return solarTerms.map((term) => {
    const solar = tables
      .map((table) => table[term.name])
      .find((candidate) => candidate && candidate.toYmdHms() >= now)

    return solar ? toMinute(solar) : ''
  })
}

/** 用户在节气面板里手选的节气 */
export interface SolarTermOverride {
  name: string
  image: string
}

/** 手选节气的持久化键 */
export const SOLAR_TERM_STORAGE_KEY = 'solar-term'
