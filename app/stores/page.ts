import type { VNode } from 'vue'

type StringOrVNode = string | VNode | undefined

interface BannerMeta {
  bannerImage?: string
  postTitle?: StringOrVNode
  subtitle?: StringOrVNode
  postMeta?: StringOrVNode
}

interface PageMeta {
  banner?: BannerMeta
  description?: string
}

export const usePageStore = defineStore('page', {
  state: (): PageMeta => ({
    banner: undefined,
    description: undefined,
  }),

  actions: {
    setPageMeta(meta: PageMeta) {
      this.banner = meta.banner
      this.description = meta.description
    },

    resetPageMeta() {
      this.banner = undefined
      this.description = undefined
    },
  },
})
