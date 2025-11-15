import { defineCollection, defineContentConfig } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    article: defineCollection({
      type: 'page',
      source: 'blog/article/*.md',
    }),
  },
})
