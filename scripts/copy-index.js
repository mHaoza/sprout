/** 复制打包后的dist目录下的index.html到dist目录， 重命名为404.html */
/** 解决github page 单页面应用刷新会定向到404的问题 */

import { promises as fs } from 'node:fs'
import { join } from 'node:path'
import chalk from 'chalk'

async function copyFile() {
  const sourcePath = join('dist', 'index.html')
  const destinationPath = join('dist', '404.html')

  try {
    // 检查源文件是否存在
    await fs.access(sourcePath)
  } catch {
    console.log(chalk.red('Error: Source file "index.html" does not exist.'))
    return
  }

  try {
    // 检查目标目录是否存在
    await fs.access(join('dist'))
  } catch {
    console.log(chalk.red('Error: Target directory "dist" does not exist.'))
    return
  }

  try {
    // 复制文件
    await fs.copyFile(sourcePath, destinationPath)
    console.log(console.log('index.html has been copied to 404.html successfully.'))
  } catch (err) {
    chalk.red('Error:', err)
  }
}

copyFile()
