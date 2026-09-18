<script setup lang="ts">
const appConfig = useAppConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-auto mb-6 flex items-center justify-between gap-1 text-sm">
    <div class="flex items-center gap-1">
      <img src="/icon.svg" alt="" width="14" height="14" />
      <p>
        {{ appConfig.site.author }}
        <span class="ml-1 inline-block translate-y-0.5">&copy;</span>
        2023-{{ year }}
      </p>
    </div>

    <AppFooterNav />
  </footer>
</template>
