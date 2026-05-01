<script setup lang="ts">
import { ref } from 'vue'
import CyberEarth from './_components/CyberEarth.vue'
import EarthBillboard from './_components/EarthBillboard.vue'
import { footprints, type Footprint } from './_data/footprints'

useHead({
  title: 'Footprints | 足迹',
})

const screenPositions = ref<Record<string, { x: number; y: number; visible: boolean }>>({})
const activeFootprint = ref<Footprint | null>(null)
const selectedRegion = ref<{ name: string; sub: string | null } | null>(null)

const onPointClick = (fp: Footprint) => {
  if (fp && fp.id === activeFootprint.value?.id) {
    activeFootprint.value = null
  } else {
    activeFootprint.value = fp
  }
}

const onPositionsUpdate = (pos: Record<string, { x: number; y: number; visible: boolean }>) => {
  screenPositions.value = pos
}

const onSelectCountry = (regionInfo: { name: string; sub: string | null } | null) => {
  selectedRegion.value = regionInfo
}
</script>

<template>
  <div
    class="relative flex h-screen w-full flex-col overflow-hidden bg-[#030816] font-sans text-white"
  >
    <!-- Title / Content Overlay -->
    <div
      class="pointer-events-none absolute top-28 left-8 z-40 max-w-sm space-y-6 pt-12 pl-4 select-none md:pl-16 lg:pl-24"
    >
      <h1
        class="animate-pulse bg-linear-to-r from-sky-400 via-rose-400 to-indigo-400 bg-clip-text text-6xl font-black tracking-tighter text-transparent drop-shadow-lg"
      >
        THE<br />WORLD<br />IS WIDE.
      </h1>
      <p
        class="rounded border-l-2 border-rose-500 bg-black/40 p-2 font-mono text-sm tracking-widest text-slate-400 uppercase backdrop-blur-sm"
      >
        [SYS] CONNECTION ESTABLISHED. <br />
        LOCATIONS LOGGED: {{ footprints.length }}
      </p>
      <ul
        class="custom-scrollbar pointer-events-auto h-auto max-h-[40vh] space-y-2 overflow-y-auto pr-4 font-mono text-sm text-slate-500"
      >
        <li
          v-for="fp in footprints"
          :key="fp.id"
          class="group flex cursor-pointer items-center justify-between rounded-md border border-transparent p-1.5 transition-colors hover:border-white/10 hover:bg-white/5"
          @click="onPointClick(fp)"
        >
          <span class="flex-1 truncate pr-2 transition-colors group-hover:text-sky-400">{{
            fp.title
          }}</span>
          <UIcon
            name="i-lucide-chevron-right"
            class="h-3 w-3 transform opacity-0 transition-all group-hover:translate-x-1 group-hover:text-sky-400 group-hover:opacity-100"
          />
        </li>
      </ul>
    </div>

    <!-- Engine Container -->
    <div class="relative h-full w-full flex-1 cursor-grab active:cursor-grabbing">
      <!-- Overlays corresponding to 3d data -->
      <transition name="billboard">
        <EarthBillboard
          v-if="activeFootprint"
          :key="activeFootprint.id"
          :footprint="activeFootprint"
          :position="screenPositions[activeFootprint.id] || { x: 0, y: 0, visible: false }"
          @close="activeFootprint = null"
        />
      </transition>

      <!-- Regional Display -->
      <transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div
          v-if="selectedRegion"
          class="pointer-events-none absolute right-8 bottom-8 z-40 flex flex-col items-end space-y-1 select-none"
        >
          <div class="font-mono text-sm tracking-[0.2em] text-rose-400 uppercase">
            Sector Selected
          </div>
          <div
            class="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] md:text-5xl"
          >
            {{ selectedRegion.name }}
          </div>
          <div
            v-if="selectedRegion.sub && selectedRegion.sub !== selectedRegion.name"
            class="text-xl font-bold tracking-wider text-slate-300"
          >
            {{ selectedRegion.sub }}
          </div>
        </div>
      </transition>

      <ClientOnly>
        <CyberEarth
          :footprints="footprints"
          :activeId="activeFootprint?.id"
          @update-positions="onPositionsUpdate"
          @click-point="onPointClick"
          @select-country="onSelectCountry"
          class="absolute inset-0"
        />

        <template #fallback>
          <div class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#030816]">
            <UIcon name="i-lucide-loader-2" class="h-12 w-12 animate-spin text-sky-500" />
            <p class="mt-4 animate-pulse font-mono text-sm tracking-widest text-sky-500/80">
              INITIALIZING GIS ENGINE...
            </p>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(14, 165, 233, 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(14, 165, 233, 0.5);
}
</style>
