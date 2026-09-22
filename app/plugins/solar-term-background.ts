/**
 * 节气背景插画
 *
 * 把当前生效的节气插画写到 <html> 的 `--bg-img` 上
 * （`main.css` 里的 `html::before` 消费它，交叉淡化也在那边）。
 *
 * 手选节气只存在 localStorage 里，服务端给不出，所以 SSR 先留白；
 * 客户端插件一跑起来立刻写值，让浏览器尽早开始下载，不等图片下完。
 * 换节气时才先备好新图再写：两张图都在缓存里，过渡才能干净地淡出旧图、淡入新图，
 * 否则中间会空一拍。
 *
 * `style` 必须是 computed：unhead 每次 patch 都会重写整个 style 属性，
 * 若把它写死成当令节气，用户手选的那张下一轮就会被抹回默认。
 */
export default defineNuxtPlugin(() => {
  const solarTerm = useSolarTermStore()

  /** 挂在 `<html>` 上的图片，`null` 表示还处在首屏留白阶段 */
  const applied = ref<string | null>(import.meta.client ? solarTerm.activeTerm.image : null)

  useHead({
    htmlAttrs: {
      style: computed(() => (applied.value ? `--bg-img: url('${applied.value}')` : '')),
    },
  })

  if (import.meta.client) {
    /** 等图片进缓存；失败也放行，不能让背景卡在旧图上 */
    function preload(url: string) {
      return new Promise<void>((resolve) => {
        const image = new Image()

        image.addEventListener('load', () => resolve(), { once: true })
        image.addEventListener('error', () => resolve(), { once: true })
        image.src = url
      })
    }

    /** 连点翻页时只认最后一次，免得先发的慢请求盖住后发的那张 */
    let seq = 0
    watch(
      () => solarTerm.activeTerm.image,
      async (url) => {
        const token = ++seq

        await preload(url)

        if (token === seq) {
          applied.value = url
        }
      },
    )
  }
})
