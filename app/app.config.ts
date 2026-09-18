export default defineAppConfig({
  site: {
    name: '私の',
    author: 'mHaoza',
    description: '远离现实的藏身之处',
    /** 首页签名右侧的身份标签 */
    role: 'Full-Stack Developer',
    /** 首页问候语 */
    greeting: '你好，我是小浩砸。',
    /** 首页正文段落 */
    intro: ['无情追番人罢了。'],
  },
  /**
   * 社交链接：按需填写，留空则不会在页脚渲染对应图标
   * 例如 github / x / cv / email / rss
   */
  links: {
    github: 'https://github.com/mHaoza',
  } as Record<string, string | undefined>,
  ui: {
    pageColumns: {
      base: 'relative column-1 md:columns-2 lg:columns-2 gap-4 space-y-4',
    },
  },
})
