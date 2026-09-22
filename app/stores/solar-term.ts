import { defineStore, skipHydrate } from 'pinia'
import type { SolarTerm, SolarTermInfo, SolarTermOverride } from '~/utils/solar-terms'

/**
 * 节气插画
 *
 * 默认跟随当令节气自动换图；用户在页脚面板里手选之后固定成那一张，
 * 直到点「跟随当令」交还。与黑白模式同源：手选偏好是本机状态，
 * 服务端一无所知，所以必须 skipHydrate，否则会被 payload 里的 null 覆盖掉。
 */
export const useSolarTermStore = defineStore('solar-term', () => {
  /**
   * 当令节气及其前后信息
   *
   * 用 useState 而不是在客户端就地 new Date()：服务端算一次并序列化进 payload，
   * 客户端直接复用，免得两端各自取时刻而正好跨过交节瞬间、报 hydration 不一致。
   */
  const auto = useState<SolarTermInfo>('solar-term-auto', () => resolveSolarTermInfo())

  /** 24 个节气各自下一次交节的时刻，供面板显示与提示 */
  const moments = useState<string[]>('solar-term-moments', () => nextSolarTermMoments())

  /**
   * 手选的节气，`null` 表示跟随当令
   *
   * 必须显式指定 serializer：默认值是 `null`，VueUse 猜不出该用哪种序列化，
   * 会退化成 `String(value)`，存进去就成了 "[object Object]" ——
   * 当次点击看着正常，一刷新偏好就没了。
   */
  const override = skipHydrate(
    useLocalStorage<SolarTermOverride | null>(SOLAR_TERM_STORAGE_KEY, null, {
      serializer: {
        read: (raw) => {
          try {
            return JSON.parse(raw) as SolarTermOverride
          } catch {
            return null
          }
        },
        write: (value) => JSON.stringify(value),
      },
    }),
  )

  /**
   * 手选节气的下标
   *
   * 名字认不出来时（存储被改坏、或日后节气表调整过）一律当没选，
   * 直接回落到当令节气，不让一个坏值把背景图卡死。
   */
  const pinnedIndex = computed(() => {
    const name = override.value?.name

    return name ? solarTerms.findIndex((term) => term.name === name) : -1
  })

  /** 是否处于跟随当令的状态 */
  const isAuto = computed(() => pinnedIndex.value < 0)

  /** 实际生效的节气下标 */
  const activeIndex = computed(() => (isAuto.value ? auto.value.index : pinnedIndex.value))

  const activeTerm = computed<SolarTerm>(() => solarTerms[activeIndex.value]!)

  /** 生效节气下一次交节的时刻 */
  const activeMoment = computed(() => moments.value[activeIndex.value] ?? '')

  /** 固定成某个节气 */
  function select(name: string) {
    const index = solarTerms.findIndex((term) => term.name === name)

    if (index >= 0) {
      override.value = { ...solarTerms[index]! }
    }
  }

  /** 以当前生效的节气为基准前后挪，用来快速翻看相邻的几张 */
  function shift(step: number) {
    const index = (activeIndex.value + step + solarTerms.length) % solarTerms.length

    override.value = { ...solarTerms[index]! }
  }

  /** 交还给当令节气 */
  function followAuto() {
    override.value = null
  }

  return {
    auto,
    moments,
    override,
    isAuto,
    activeIndex,
    activeTerm,
    activeMoment,
    select,
    shift,
    followAuto,
  }
})
