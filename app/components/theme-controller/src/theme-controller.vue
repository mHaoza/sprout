<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import Color from 'color'
import { Lunar } from 'lunar-typescript'
import { computed, onUnmounted, ref } from 'vue'
import { themeList } from './theme-list'

const panelVisible = ref(false)
const selectedTheme = useLocalStorage<string | null>('selectedTheme', null)

// 季节分组
const seasonGroups = computed(() => {
  const spring = themeList.slice(0, 6) // 立春到谷雨
  const summer = themeList.slice(6, 12) // 立夏到大暑
  const autumn = themeList.slice(12, 18) // 立秋到霜降
  const winter = themeList.slice(18, 24) // 立冬到大寒

  return [
    { name: '春', description: '万物复苏，生机盎然', themes: spring, color: '#7FB069' },
    { name: '夏', description: '热情奔放，绿意盎然', themes: summer, color: '#FF7043' },
    { name: '秋', description: '硕果累累，层林尽染', themes: autumn, color: '#F57C00' },
    { name: '冬', description: '银装素裹，宁静致远', themes: winter, color: '#607D8B' },
  ]
})

// 获取当前选中的主题数据
const selectedThemeData = computed(() => {
  if (selectedTheme.value) {
    return themeList.find(theme => theme.name === selectedTheme.value) || themeList[0]
  }

  // 如果没有手动选择，则根据当前日期自动匹配
  const d = Lunar.fromDate(new Date())
  const jieQi = d.getCurrentJieQi() ?? d.getPrevJieQi()
  return themeList.find(item => item.name === jieQi.getName()) || themeList[0]
})

// 面板动态样式计算 - 创建更淡雅的主题色彩
const panelDynamicStyles = computed(() => {
  const theme = selectedThemeData.value
  if (!theme)
    return {}

  const primaryColor = Color(theme.primaryColor)
  const accentColor = Color(theme.accentColor)
  const backgroundTone = Color(theme.backgroundTone)
  const highlightHue = Color(theme.highlightHue)

  return {
    '--panel-primary-color': theme.primaryColor,
    '--panel-accent-color': theme.accentColor,
    '--panel-background-tone': theme.backgroundTone,
    '--panel-text-shade': theme.textShade,
    '--panel-highlight-hue': theme.highlightHue,

    // 更淡雅的衍生颜色 (透明度处理)
    '--panel-primary-light': primaryColor.alpha(0.15).toString(),
    '--panel-primary-lighter': primaryColor.alpha(0.08).toString(),
    '--panel-accent-light': accentColor.alpha(0.2).toString(),
    '--panel-accent-lighter': accentColor.alpha(0.1).toString(),
    '--panel-background-soft': backgroundTone.alpha(0.6).toString(),
    '--panel-background-softer': backgroundTone.alpha(0.3).toString(),
    '--panel-highlight-soft': highlightHue.alpha(0.4).toString(),
    '--panel-highlight-softer': highlightHue.alpha(0.2).toString(),

    // 边框颜色
    '--panel-border-light': primaryColor.alpha(0.3).toString(),
    '--panel-border-lighter': primaryColor.alpha(0.15).toString(),
  }
})

// 获取主题的诗词
function getThemePoetry(themeName: string) {
  const poetryMap: Record<string, string> = {
    立春: '东风解冻，蛰虫始振，鱼陟负冰',
    雨水: '獭祭鱼，鸿雁来，草木萌动',
    惊蛰: '桃始华，仓庚鸣，鹰化为鸠',
    春分: '玄鸟至，雷乃发声，始电',
    清明: '桐始华，田鼠化为鴽，虹始见',
    谷雨: '萍始生，鸣鸠拂其羽，戴胜降于桑',
    立夏: '蝼蝈鸣，蚯蚓出，王瓜生',
    小满: '苦菜秀，靡草死，麦秋至',
    芒种: '螳螂生，鵙始鸣，反舌无声',
    夏至: '鹿角解，蜩始鸣，半夏生',
    小暑: '温风至，蟋蟀居宇，鹰始挚',
    大暑: '腐草为萤，土润溽暑，大雨时行',
    立秋: '凉风至，白露生，寒蝉鸣',
    处暑: '鹰乃祭鸟，天地始肃，禾乃登',
    白露: '鸿雁来，玄鸟归，群鸟养羞',
    秋分: '雷始收声，蛰虫坯户，水始涸',
    寒露: '鸿雁来宾，雀入大水为蛤，菊有黄华',
    霜降: '豺乃祭兽，草木黄落，蛰虫咸俯',
    立冬: '水始冰，地始冻，雉入大水为蜃',
    小雪: '虹藏不见，天气上升，闭塞成冬',
    大雪: '鹖鴠不鸣，虎始交，荔挺出',
    冬至: '蚯蚓结，麋角解，水泉动',
    小寒: '雁北乡，鹊始巢，雉始鸲',
    大寒: '鸡乳，征鸟厉疾，水泽腹坚',
  }
  return poetryMap[themeName] || ''
}

init()

// 键盘事件处理
function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && panelVisible.value) {
    panelVisible.value = false
  }
}

// 监听键盘事件
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}

function init() {
  const selectedThemeItem = themeList.find(item => item.name === selectedTheme.value)
  if (selectedThemeItem) {
    setTheme(selectedThemeItem)
    return
  }

  const d = Lunar.fromDate(new Date())
  const jieQi = d.getCurrentJieQi() ?? d.getPrevJieQi()

  const theme = themeList.find(item => item.name === jieQi.getName())

  setTheme(theme || themeList[0]!)
}

function setTheme(theme: typeof themeList[number]) {
  // 设置主色调 - 用于强调元素、边框等
  document?.documentElement.style.setProperty('--theme-primary-color', theme.primaryColor)

  // 设置辅助色 - 用于装饰和次要元素
  document?.documentElement.style.setProperty('--theme-accent-color', theme.accentColor)

  // 设置背景色调 - 用于卡片、面板等背景
  document?.documentElement.style.setProperty('--theme-background-tone', Color(theme.backgroundTone).alpha(0.3).toString())

  // 设置文字阴影色 - 用于文字颜色
  document?.documentElement.style.setProperty('--theme-text-shade', theme.textShade)

  // 设置高亮色调 - 用于选中状态、悬停等
  document?.documentElement.style.setProperty('--theme-highlight-hue', theme.highlightHue)

  // 设置背景图片
  document?.documentElement.style.setProperty('--theme-bg-img', `url('${theme.poetryPicture}')`)
}

function selectTheme(theme: typeof themeList[number]) {
  if (selectedTheme.value === theme.name) {
    selectedTheme.value = null
    init()

    return
  }

  selectedTheme.value = theme.name
  setTheme(theme)
}

function resetToAutoTheme() {
  selectedTheme.value = null
  init()
}

// 组件卸载时清理事件监听器
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <!-- 主题控制器触发按钮 -->
  <div
    class="fixed bottom-[10vw] right-[3vw] h-16 w-16 cursor-pointer overflow-hidden border-2 border-[var(--theme-primary-color)] rounded-full opacity-0 transition-all duration-300 ease-in-out hover:scale-110 hover:opacity-100 hover:shadow-[var(--theme-primary-color)]/50 hover:shadow-lg"
    @click="panelVisible = !panelVisible"
  >
    <img src="/imgs/比丢00.webp" class="h-full w-full object-cover transition-transform duration-300 hover:scale-105">
  </div>

  <!-- 主题选择看板 -->
  <Teleport to="body">
    <Transition name="backdrop-fade">
      <div
        v-if="panelVisible"
        class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        @click="panelVisible = false"
      />
    </Transition>

    <Transition name="kanban-drop">
      <div
        v-if="panelVisible"
        class="fixed left-1/2 top-0 z-50 transform -translate-x-1/2"
        @click.stop
      >
        <!-- 绳子效果 -->
        <div class="kanban-ropes">
          <div class="rope rope-left" />
          <div class="rope rope-right" />
        </div>

        <!-- 看板主体 -->
        <div
          :class="[
            'kanban-board',
            'relative mx-4 mt-8 sm:mx-4 sm:mt-8',
            'max-h-[85vh] max-w-5xl w-[95vw] sm:max-h-[85vh] sm:w-[95vw]',
            'overflow-hidden border-2 rounded-xl backdrop-blur-lg',
            'shadow-[0_20px_40px_rgba(0,0,0,0.15)] origin-top',
          ].join(' ')"
          :style="panelDynamicStyles"
        >
          <!-- 看板标题区域 -->
          <div
            :class="[
              'kanban-header',
              'relative overflow-hidden border-b-2 rounded-t-xl',
              'px-6 py-4 sm:px-6 sm:py-4',
              'shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_1px_3px_rgba(255,255,255,0.3)]',
            ].join(' ')"
          >
            <div class="relative flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  :class="[
                    'h-10 w-10 flex items-center justify-center rounded-full',
                    'bg-[var(--panel-accent-light)] shadow-inner',
                  ].join(' ')"
                >
                  <div
                    :class="[
                      'title-icon i-heroicons-star-solid h-5 w-5',
                      'text-[var(--panel-text-shade)]',
                      'transition-transform duration-500 ease-in-out',
                      'hover:rotate-[360deg] hover:scale-120',
                    ].join(' ')"
                  />
                </div>
                <div>
                  <h2 class="flex items-center gap-3 text-xl text-[var(--panel-text-shade)] font-bold sm:text-2xl">
                    二十四节气主题选择
                    <span class="rounded-full bg-[var(--panel-background-soft)] px-3 py-1 text-sm text-[var(--panel-text-shade)] font-normal shadow-sm">
                      {{ themeList.length }} 节气
                    </span>
                  </h2>
                  <p class="mt-1 text-sm text-[var(--panel-text-shade)] opacity-80">
                    🍃 依据传统节气，营造诗意氛围，感受四季变迁之美
                  </p>
                </div>
              </div>
              <button
                :class="[
                  'group h-8 w-8 flex items-center justify-center rounded-full',
                  'bg-[var(--panel-accent-light)] text-[var(--panel-text-shade)]',
                  'transition-all duration-300 hover:rotate-90 hover:scale-110',
                  'shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)]',
                ].join(' ')"
                @click="panelVisible = false"
              >
                <div class="i-heroicons-x-mark h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          </div>

          <!-- 主题内容区域 -->
          <div
            :class="[
              'kanban-content',
              'max-h-[calc(85vh-200px)] sm:max-h-[calc(85vh-180px)]',
              'overflow-y-auto p-6 sm:p-4',
            ].join(' ')"
          >
            <!-- 季节分组显示 -->
            <div class="space-y-6">
              <div v-for="season in seasonGroups" :key="season.name" class="space-y-3">
                <div
                  :class="[
                    'flex items-center gap-3 rounded-lg px-4 py-3',
                    'border border-[var(--panel-border-lighter)]',
                    'bg-[var(--panel-background-softer)] shadow-sm',
                  ].join(' ')"
                >
                  <div
                    :class="[
                      'season-indicator h-4 w-4 rounded-full shadow-md',
                      'border-2 border-[var(--panel-highlight-soft)]',
                      'relative animate-pulse',
                    ].join(' ')"
                    :style="{ backgroundColor: season.color }"
                  />
                  <h4
                    :class="[
                      'season-title text-base font-bold tracking-wide',
                      'text-[var(--panel-text-shade)]',
                      'relative',
                    ].join(' ')"
                  >
                    {{ season.name }}季
                  </h4>
                  <span class="text-sm text-[var(--panel-text-shade)] font-medium opacity-80">{{ season.description }}</span>
                  <div class="season-divider h-px flex-1" />
                </div>
                <div class="grid grid-cols-2 gap-3 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 sm:gap-4">
                  <div
                    v-for="theme in season.themes"
                    :key="theme.name"
                    :class="[
                      'group relative cursor-pointer overflow-hidden rounded-xl',
                      'shadow-lg transition-all duration-300',
                      'active:scale-95 hover:scale-105 focus:outline-none',
                      'focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-primary-color)]',
                      'border-2 hover:border-[var(--panel-border-light)]',
                      'hover:shadow-[0_12px_24px_var(--panel-primary-lighter),0_6px_12px_rgba(0,0,0,0.1)]',
                      'hover:-translate-y-1 hover:scale-102',
                      theme.name === selectedTheme
                        ? 'ring-2 ring-[var(--theme-primary-color)] shadow-[var(--theme-primary-color)]/30'
                        : 'ring-2 ring-transparent shadow-gray-200/50 hover:shadow-gray-300/60',
                    ].join(' ')"
                    :tabindex="0"
                    @click="selectTheme(theme)"
                    @keydown.enter="selectTheme(theme)"
                    @keydown.space.prevent="selectTheme(theme)"
                  >
                    <!-- 主题图片 -->
                    <div class="theme-card-border relative aspect-[3/4] overflow-hidden">
                      <img
                        :src="theme.picture"
                        :alt="theme.name"
                        draggable="false"
                        class="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                      >
                      <!-- 色彩条 -->
                      <div class="absolute bottom-0 left-0 right-0 h-1 flex">
                        <div class="flex-1 transition-all duration-300" :style="{ backgroundColor: theme.primaryColor }" />
                        <div class="flex-1 transition-all duration-300" :style="{ backgroundColor: theme.accentColor }" />
                        <div class="flex-1 transition-all duration-300" :style="{ backgroundColor: theme.backgroundTone }" />
                      </div>
                    </div>

                    <!-- 主题信息覆盖层 -->
                    <div class="absolute inset-0 from-black/90 via-black/30 to-transparent bg-gradient-to-t opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div class="absolute bottom-0 left-0 right-0 p-2 text-white sm:p-3">
                        <h3 class="mb-1 text-sm font-bold sm:text-base">
                          {{ theme.name }}
                        </h3>
                        <p class="mb-2 text-xs opacity-90">
                          {{ theme.description }}
                        </p>
                        <p class="poetry-text hidden text-xs leading-relaxed opacity-75 sm:block">
                          {{ getThemePoetry(theme.name) }}
                        </p>
                      </div>
                    </div>

                    <!-- 选中状态指示器 -->
                    <div
                      v-if="theme.name === selectedTheme"
                      class="absolute right-2 top-2 h-6 w-6 flex animate-pulse items-center justify-center rounded-full bg-[var(--theme-primary-color)] text-white shadow-lg"
                    >
                      <div class="i-heroicons-check h-3 w-3" />
                    </div>

                    <!-- 节气标识 -->
                    <div class="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
                      {{ theme.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 看板底部 -->
          <div
            :class="[
              'kanban-footer',
              'border-t-2 rounded-b-xl',
              'px-6 py-4 sm:px-4 sm:py-3',
              'shadow-[0_-2px_4px_rgba(0,0,0,0.05)]',
            ].join(' ')"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-4 text-sm">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'status-indicator h-3 w-3 rounded-full shadow-sm',
                      'bg-[var(--panel-primary-color)]',
                      'animate-pulse',
                    ].join(' ')"
                  />
                  <span class="text-[var(--panel-text-shade)]">当前主题: <strong>{{ selectedTheme || '自动匹配节气' }}</strong></span>
                </div>
                <div class="hidden items-center gap-2 text-xs sm:flex">
                  <div class="i-heroicons-information-circle h-4 w-4 text-[var(--panel-primary-color)]" />
                  <span class="text-[var(--panel-text-shade)] opacity-80">点击卡片切换主题，悬停查看详情</span>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button
                  v-if="selectedTheme"
                  :class="[
                    'flex items-center gap-2 rounded-lg px-4 py-2',
                    'text-sm font-medium text-[var(--panel-text-shade)]',
                    'bg-[var(--panel-accent-light)] shadow-sm',
                    'transition-all hover:scale-105 hover:shadow-md',
                    'shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.3)]',
                    'border border-[var(--panel-border-light)]',
                  ].join(' ')"
                  @click="resetToAutoTheme"
                >
                  <div class="i-heroicons-arrow-path h-4 w-4" />
                  <span>恢复自动</span>
                </button>
                <div class="text-xs text-[var(--panel-text-shade)] font-medium opacity-70">
                  {{ selectedTheme ? '🎨 手动选择' : '🤖 自动模式' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="postcss" scoped>
/* 背景淡入淡出动画 */
.backdrop-fade-enter-active,
.backdrop-fade-leave-active {
  transition: all 0.3s ease-out;
}

.backdrop-fade-enter-from,
.backdrop-fade-leave-to {
  opacity: 0;
}

/* 看板下坠反弹动画 */
.kanban-drop-enter-active {
  animation: bounceInDown 0.6s ease-out;
}

.kanban-drop-leave-active {
  animation: bounceOutUp 0.4s ease-in;
}

@keyframes bounceInDown {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-100%);
  }
  70% {
    opacity: 1;
    transform: translateX(-50%) translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes bounceOutUp {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateX(-50%) translateY(10px);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-100%);
  }
}

/* 绳子样式 */
.kanban-ropes {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 60px;
  pointer-events: none;
  z-index: 1;
}

.rope {
  position: absolute;
  width: 8px;
  height: 60px;
  background: linear-gradient(to bottom, #8b4513 0%, #a0522d 20%, #cd853f 40%, #deb887 60%, #f5deb3 80%, #8b4513 100%);
  border-radius: 4px;
  box-shadow:
    inset -2px 0 2px rgba(0, 0, 0, 0.3),
    inset 2px 0 2px rgba(255, 255, 255, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.2);
}

.rope::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, #654321 0%, #8b4513 50%, #a0522d 100%);
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.rope::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 4px;
  background: #8b4513;
  border-radius: 0 0 50% 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.rope-left {
  left: calc(20% + 16px);
}

.rope-right {
  right: calc(20% + 16px);
}

/* 动态背景样式 */
.kanban-board {
  border-color: var(--panel-border-light);
  background: linear-gradient(135deg, var(--panel-background-softer), var(--panel-highlight-softer));
}

.kanban-header {
  border-color: var(--panel-border-lighter);
  background: linear-gradient(135deg, var(--panel-background-soft), var(--panel-highlight-soft));
}

.kanban-content {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.4) 0%,
    var(--panel-background-softer) 50%,
    var(--panel-highlight-softer) 100%
  );
}

.kanban-footer {
  border-color: var(--panel-border-lighter);
  background: linear-gradient(135deg, var(--panel-background-soft), var(--panel-highlight-soft));
}

/* 季节标题文字阴影 */
.season-title {
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
}
/* 诗词文字渐变效果 */
.poetry-text {
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.95), rgba(254, 243, 199, 0.9), rgba(255, 255, 255, 0.95));
  background-size: 200% 200%;
  animation: poetryShimmer 4s ease-in-out infinite;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
}
</style>
