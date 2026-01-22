<script setup lang="ts">
interface Props {
  code?: string
  language?: string
  lang?: string
  filename?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  language: '',
  lang: '',
  filename: '',
})

const attrs = useAttrs()

const codeRef = ref<HTMLElement | null>(null)
const copied = ref(false)

function extractLanguage(): string {
  const lang =
    props.language || props.lang || (attrs.language as string) || (attrs.lang as string) || ''

  if (!lang && import.meta.client && codeRef.value) {
    const codeElement = codeRef.value.querySelector('code')
    if (codeElement) {
      const classList = Array.from(codeElement.classList)
      const langClass = classList.find((cls) => cls.startsWith('language-'))
      if (langClass) {
        return langClass.replace('language-', '')
      }
    }
  }

  return lang
}

const languageName = computed(() => extractLanguage())

const languageDisplayName: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  vue: 'Vue',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sass: 'Sass',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  md: 'Markdown',
  markdown: 'Markdown',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  python: 'Python',
  py: 'Python',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
  ruby: 'Ruby',
  sql: 'SQL',
  xml: 'XML',
  dockerfile: 'Dockerfile',
  diff: 'Diff',
}

const displayLanguage = computed(() => {
  if (!languageName.value) return ''
  const lang = languageName.value.toLowerCase()
  return languageDisplayName[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
})

async function getCodeText(): Promise<string> {
  if (props.code) return props.code

  await nextTick()
  if (import.meta.client && codeRef.value) {
    const codeElement = codeRef.value.querySelector('code')
    if (codeElement) {
      return codeElement.textContent || ''
    }
  }
  return ''
}

async function copyCode() {
  const codeText = await getCodeText()
  if (!codeText) return

  try {
    await navigator.clipboard.writeText(codeText)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code:', err)
  }
}
</script>

<template>
  <div ref="codeRef" class="group border-primary my-6 overflow-hidden rounded-lg border text-sm">
    <div class="border-muted flex items-center justify-between border-b px-3 py-2 text-xs">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-terminal" class="h-4 w-4" />
        <span class="font-medium">{{ filename || displayLanguage || 'Code' }}</span>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="ghost"
          size="xs"
          :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
          class="text-muted hover:bg-muted/50"
          @click="copyCode"
        />
      </div>
    </div>
    <pre
      :class="[
        'shiki',
        'has-line-numbers overflow-x-auto bg-transparent py-4 pr-4 pl-10 text-sm',
        '[&_code]:[counter-reset:line] [&_code_.line]:relative [&_code_.line]:[counter-increment:line]',
        '[&_code_.line]:before:absolute [&_code_.line]:before:top-0 [&_code_.line]:before:-left-10 [&_code_.line]:before:w-8',
        '[&_code_.line]:before:text-right [&_code_.line]:before:opacity-50 [&_code_.line]:before:content-[counter(line)] [&_code_.line]:before:select-none',
      ]"
    ><slot /></pre>
  </div>
</template>
