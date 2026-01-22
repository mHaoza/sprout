import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      source: 'blog/articles/**/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        author: z.string().optional(),
        description: z.string().optional(),
        date: z.string().optional(),
        updated: z.string().optional(),
        tags: z.array(z.string()).default([]),
        category: z.string().optional(),

        image: z.string().optional(),
        recommend: z.number().optional(),
      }),
    }),
    links: defineCollection({
      source: 'blog/links/links.md',
      type: 'page',
      schema: z.object({
        links: z.array(
          z.object({
            name: z.string(),
            url: z.string().url(),
            description: z.string().optional(),
            avatar: z.string().optional(),
            email: z.string().email().optional(),
          }),
        ),
      }),
    }),
    projects: defineCollection({
      source: 'blog/projects/projects.md',
      type: 'page',
      schema: z.object({
        projects: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            repository: z.string().url(),
            homepage: z.string().url().optional(),
            tags: z.array(z.string()),
            language: z.string().optional(),
            color: z.string().optional(),
          }),
        ),
      }),
    }),
  },
})
