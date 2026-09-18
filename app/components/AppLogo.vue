<script setup lang="ts">
/**
 * 头像 Logo
 *
 * 圆形头像外套一圈渐变描边，颜色取自实时换肤的强调色（`--ui-primary`），
 * 会随「二十四节气」主题自动染色。
 * 悬停时只在 `overflow-hidden` 容器内放大图片，不改变外部布局几何。
 */
const AVATAR_URL =
  'https://weavatar.com/avatar/a88c31ffef806df6c179e89f75939189c174f120ee9fd6f13fb9a6492d9d139d?sha256=1&d=mp&s=240'
</script>

<template>
  <div class="group relative size-26 shrink-0 select-none max-md:size-20">
    <!-- 渐变描边：随二十四节气换肤自动染色 -->
    <span
      aria-hidden="true"
      class="from-love via-love/45 to-love/5 absolute inset-0 rounded-full bg-linear-to-br"
    />

    <!-- 头像本体 -->
    <span class="bg-base absolute inset-0.75 block overflow-hidden rounded-full">
      <img
        :src="AVATAR_URL"
        alt="mHaoza 的头像"
        width="240"
        height="240"
        loading="eager"
        decoding="async"
        class="m-0! size-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 motion-reduce:transition-none"
      />
    </span>
  </div>
</template>
