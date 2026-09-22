<script setup lang="ts">
/**
 * 节气插画
 *
 * 触发器只放一个图标：页脚是一排等距的图标项（对齐靠 `icon-link`，见 main.css），
 * 挤进文字会打乱这一排的节奏。节气名称、交节时刻、24 个节气与翻页按钮
 * 都收在点开后的面板里。
 */
const solarTerm = useSolarTermStore()

/** 面板底部的翻页 / 交还按钮 */
const actionClass =
  'border-overlay text-subtle hover:border-muted hover:text-text flex cursor-pointer items-center justify-center rounded-md border text-sm transition-colors duration-300 disabled:opacity-60'

/** 二十四节气里的一个格子 */
function chipClass(active: boolean) {
  return [
    'cursor-pointer rounded-md px-1.5 py-1 text-xs transition-colors duration-200',
    active ? 'bg-overlay text-text font-medium' : 'text-subtle hover:bg-overlay hover:text-text',
  ]
}
</script>

<template>
  <UPopover :content="{ side: 'top', sideOffset: 8, collisionPadding: 8 }">
    <button type="button" class="icon-link" :aria-label="`节气插画：${solarTerm.activeTerm.name}`">
      <UIcon name="i-lucide-sprout" class="size-4.5" />
    </button>

    <template #content>
      <div class="w-64 p-3">
        <!-- 当前生效的节气 -->
        <div class="flex gap-3">
          <img
            :src="solarTerm.activeTerm.image"
            alt=""
            draggable="false"
            class="border-overlay h-16 w-9 shrink-0 rounded-sm border object-cover"
          />

          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5">
              <h3 class="text-text font-bold">{{ solarTerm.activeTerm.name }}</h3>
              <span class="border-overlay text-muted rounded-full border px-1.5 text-[10px]">
                {{ solarTerm.isAuto ? '当令' : '已固定' }}
              </span>
            </div>

            <template v-if="solarTerm.isAuto">
              <p class="text-subtle mt-1.5 text-xs">交节 {{ solarTerm.auto.since }}</p>
              <p class="text-subtle mt-0.5 text-xs">
                下个 {{ solarTerm.auto.next.name }} · {{ solarTerm.auto.next.at }}
              </p>
            </template>
            <p v-else class="text-subtle mt-1.5 text-xs">下次交节 {{ solarTerm.activeMoment }}</p>
          </div>
        </div>

        <hr class="border-overlay my-3" />

        <!-- 二十四节气 -->
        <div class="grid grid-cols-4 gap-0.5">
          <button
            v-for="(term, index) in solarTerms"
            :key="term.name"
            type="button"
            :title="solarTerm.moments[index] ? `${solarTerm.moments[index]} 交节` : undefined"
            :aria-pressed="term.name === solarTerm.activeTerm.name"
            :class="chipClass(term.name === solarTerm.activeTerm.name)"
            @click="solarTerm.select(term.name)"
          >
            {{ term.name }}
          </button>
        </div>

        <hr class="border-overlay my-3" />

        <div class="flex items-center gap-1">
          <button
            type="button"
            :class="[actionClass, 'px-2 py-1.5']"
            aria-label="上一个节气"
            @click="solarTerm.shift(-1)"
          >
            <UIcon name="i-lucide-chevron-left" class="size-4" />
          </button>

          <button
            type="button"
            :class="[actionClass, 'flex-1 py-1.5 text-xs']"
            :disabled="solarTerm.isAuto"
            @click="solarTerm.followAuto()"
          >
            跟随当令
          </button>

          <button
            type="button"
            :class="[actionClass, 'px-2 py-1.5']"
            aria-label="下一个节气"
            @click="solarTerm.shift(1)"
          >
            <UIcon name="i-lucide-chevron-right" class="size-4" />
          </button>
        </div>
      </div>
    </template>
  </UPopover>
</template>
