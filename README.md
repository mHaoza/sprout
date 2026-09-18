# Sprout

属于我远离现实的藏身处

## Overview

- Markdown 内容驱动，基于 Nuxt Content 的集合化管理（`articles` / `stack` / `life` / `more`）
- 追番记录，数据来自 Bangumi API
- 响应式布局

## Stack

- Nuxt 4
- Vue 3
- TypeScript 5
- Tailwind CSS 4
- Nuxt Content 3
- Nuxt UI 4
- Pinia

## Development

### Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000/).

### Scripts

| Command          | Description    |
| ---------------- | -------------- |
| `pnpm dev`       | 启动开发服务器 |
| `pnpm build`     | 构建生产版本   |
| `pnpm start`     | 启动生产服务   |
| `pnpm lint`      | 代码检查       |
| `pnpm fmt`       | 代码格式化     |
| `pnpm sync-blog` | 同步文章内容   |

### Content

文章内容位于 `content/blog`，它是另一个仓库的克隆（已在 `.gitignore` 中忽略），通过 `pnpm sync-blog` 拉取。

该目录会被 `git reset --hard` 同步，**不要直接在其中新增或修改文件**，会被覆盖。

## License

MIT
