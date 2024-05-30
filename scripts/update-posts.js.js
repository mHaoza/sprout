// 使用 import 语法导入所需的模块
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import degit from 'degit'
import { SingleBar } from 'cli-progress'
import chalk from 'chalk'
import { getPostsData } from './get-posts-data.js'

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 定义克隆的仓库和目标路径
const repo = 'git@github.com:mHaoza/posts.git' // 替换为你要克隆的仓库地址
const targetPath = path.join(__dirname, '../public/posts')

// 创建进度条
const progressBar = new SingleBar({
  format: `克隆进度 |${chalk.cyan('{bar}')}| {percentage}% || {value}/{total} 文件`,
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true,
})

// 开始克隆
console.log(chalk.green('开始克隆posts仓库...'))

const emitter = degit(repo, {
  cache: false,
  force: true,
  verbose: true,
})

// 监听事件
emitter.on('info', (info) => {
  console.log(chalk.blue(info.message))
})

emitter.on('progress', (progress) => {
  if (progressBar.total === 100) {
    progressBar.update(progress.done)
  } else {
    progressBar.start(100, progress.done)
  }
})

emitter.clone(targetPath).then(() => {
  console.log(chalk.green('posts仓库克隆成功完成!'))
}).catch((err) => {
  console.error(chalk.red('posts仓库克隆过程中发生错误:', err))
}).finally(() => {
  progressBar.stop()
  getPostsData()
  process.exit()
})
