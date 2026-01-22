<script setup lang="ts">
const route = useRoute()

const currentPage = computed(() => {
  const page = Number(route.query.page)
  return page > 0 ? page : 1
})

const currentPageSize = computed(() => {
  const pageSize = Number(route.query.pageSize)
  const limit = Number(route.query.limit)
  return pageSize > 0 ? pageSize : limit > 0 ? limit : 12
})

const category = computed(() => route.query.category as string | undefined)
const tag = computed(() => route.query.tag as string | undefined)

const { data: postsData } = await useAsyncData(
  `posts-${currentPage.value}-${category.value || 'all'}-${tag.value || 'all'}`,
  async () => {
    let query = queryCollection('articles').order('date', 'DESC')

    if (category.value) {
      query = query.where('category', '=', category.value)
    }

    let allPosts = await query.all()

    if (tag.value) {
      allPosts = allPosts.filter((post) => post.tags?.includes(tag.value!))
    }

    const total = allPosts.length

    const start = (currentPage.value - 1) * currentPageSize.value
    const end = start + currentPageSize.value
    const posts = allPosts.slice(start, end)

    return {
      posts,
      total,
    }
  },
  {
    watch: [category, tag, currentPage, currentPageSize],
  },
)

const totalCount = computed(() => postsData.value?.total || 0)
const posts = computed(() => postsData.value?.posts || [])

function getPostPath(post: any) {
  const fileName = post.path.split('/').pop()?.replace('.md', '')
  return `/post/${fileName}`
}

const router = useRouter()
function onPageChange(page: number) {
  router.push({
    query: {
      ...route.query,
      page: page.toString(),
    },
  })
}
</script>

<template>
  <div class="mx-auto min-h-[60vh] w-full max-w-4xl px-4 py-8">
    <UPageColumns>
      <UBlogPost
        v-for="post in posts"
        :key="post.path"
        :title="post.title"
        :description="post.description"
        :image="post.image"
        :date="post.date"
        :to="getPostPath(post)"
        :ui="{
          root: 'bg-bg-base border-2 hover:border-primary-500!',
          image: 'group-hover/blog-post:scale-100 ',
          title: 'group-hover/blog-post:text-primary-500',
          description: 'line-clamp-2',
        }"
      />
    </UPageColumns>
    <UEmpty
      v-if="!posts || posts.length === 0"
      variant="naked"
      title="暂无内容"
      description="以后会有的~"
    />
    <UPagination
      v-model:page="currentPage"
      :total="totalCount"
      :items-per-page="currentPageSize"
      show-edges
      :ui="{ root: 'mt-8', list: 'justify-center' }"
      @update:page="onPageChange"
    />
  </div>
</template>
