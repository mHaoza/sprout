<script setup lang="ts">
import { Check, Copy } from 'lucide-vue-next'
import { computed, nextTick, ref, useAttrs } from 'vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

const languageName = computed(() => {
  return (
    props.language
    || props.lang
    || (attrs.language as string)
    || (attrs.lang as string)
    || ''
  )
})

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
  if (!languageName.value)
    return ''
  const lang = languageName.value.toLowerCase()
  return languageDisplayName[lang] || lang.charAt(0).toUpperCase() + lang.slice(1)
})

async function getCodeText(): Promise<string> {
  if (props.code)
    return props.code

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
  if (!codeText)
    return

  try {
    await navigator.clipboard.writeText(codeText)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch (err) {
    console.error('Failed to copy code:', err)
  }
}
</script>

<template>
  <div ref="codeRef" :class="cn('relative group my-6', props.class)">
    <pre
      :class="cn(
        'overflow-x-auto rounded-lg border bg-muted text-sm',
        'has-line-numbers',
        props.class,
      )"
    ><code :class="languageName ? `language-${languageName}` : ''"><slot /></code></pre>
    <div
      v-if="displayLanguage || filename"
      class="absolute right-0 top-0 z-10 flex items-center gap-2 rounded-bl-md"
    >
      <span
        v-if="displayLanguage"
        class="rounded-tl-md rounded-br-md bg-background/80 px-2 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
      >
        {{ displayLanguage }}
      </span>
      <span
        v-if="filename"
        class="rounded-tl-md rounded-br-md bg-background/80 px-2 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
      >
        {{ filename }}
      </span>
      <Button
        variant="ghost"
        size="sm"
        class="h-7 w-7 rounded-tl-none rounded-br-none p-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        @click="copyCode"
      >
        <Check v-if="copied" class="h-4 w-4" />
        <Copy v-else class="h-4 w-4" />
      </Button>
    </div>
    <div
      v-else
      class="absolute right-0 top-0 z-10 rounded-bl-md"
    >
      <Button
        variant="ghost"
        size="sm"
        class="h-7 w-7 rounded-tl-none rounded-br-md p-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        @click="copyCode"
      >
        <Check v-if="copied" class="h-4 w-4" />
        <Copy v-else class="h-4 w-4" />
      </Button>
    </div>
  </div>
</template>
