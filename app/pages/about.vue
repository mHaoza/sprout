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
        }}」，一个用来记录技术、生活与所思所想的地方。站点使用 Nuxt 与 Nuxt Content
        构建，采用静态生成，主题配色随二十四节气流转。
      </p>

      <h4>关于我</h4>
      <p>无情追番人，偶尔胡乱折腾。</p>
    </div>
  </AppPage>
</template>

<style scoped></style>
