<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
  title: '关于',
  description: appConfig.site.description,
})
</script>

<template>
  <AppPage>
    <HomeAbout />

    <div data-slide-auto class="prose prose-rosepine w-full max-w-none space-y-6">
      <hr class="mt-0 mb-0" />

      <h4>关于本站</h4>
      <p>
        这里是 {{ appConfig.site.author }} 的「{{
          appConfig.site.name
        }}」，一块用来堆放技术笔记、生活碎片与胡思乱想的地方。
      </p>
      <p>站点使用 Nuxt 4 与 Nuxt Content 构建。</p>
      <p>
        主题样式参考了shiyu 开源的博客主题
        <a
          href="https://github.com/chanshiyucx/zero"
          target="_blank"
          rel="noopener noreferrer"
          class="link"
        >
          zero
        </a>
        ，在此致谢。
      </p>

      <h4>关于我</h4>
      <p>无情追番人，偶尔胡乱折腾。</p>
    </div>
  </AppPage>
</template>

<style scoped></style>
