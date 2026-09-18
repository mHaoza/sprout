<script setup lang="ts">
const appConfig = useAppConfig()
</script>

<template>
  <div data-slide-auto class="prose prose-rosepine w-full max-w-none">
    <div class="flex flex-row items-end gap-6 max-md:flex-col max-md:items-start max-md:gap-0">
      <div class="max-md:self-center">
        <AppLogo />
      </div>

      <div>
        <h2 class="text-subtle text-xs">{{ appConfig.site.role }}</h2>

        <p class="mb-0">
          <UIcon name="i-lucide-hand" class="mr-1 inline size-4.5" />
          <span>{{ appConfig.site.greeting }}</span>
        </p>
      </div>
    </div>

    <p v-for="(paragraph, index) in appConfig.site.intro" :key="index">
      {{ paragraph }}
    </p>
  </div>
</template>
