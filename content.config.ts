import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const articleSchema = z.object({
  title: z.string(),
  author: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  updated: z.string().optional(),
  tags: z.array(z.string()).default([]),
  category: z.string().optional(),

  image: z.string().optional(),
  recommend: z.number().optional(),
})

export default defineContentConfig({
  collections: {
    article: defineCollection({
      source: 'blog/**/*.md',
      type: 'page',
      schema: articleSchema,
    }),
  },
})
