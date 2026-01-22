import { spawn } from 'node:child_process'
import fs from 'node:fs'

const REPO_URL = 'https://github.com/mHaoza/blog.git'
const CONTENT_PATH = './content/blog'

function runBashCommand(command: string) {
  return new Promise((resolve, reject) => {
    console.log(`Run bash command: ${command}`)
    const child = spawn(command, [], { shell: true })
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', (data) => process.stdout.write(data))
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', (data) => process.stderr.write(data))
    child.on('close', (code) => {
      if (code === 0) {
        resolve(void 0)
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })
  })
}

export async function syncBlogFromGit() {
  console.log('Syncing content files from git')
  if (fs.existsSync(CONTENT_PATH)) {
    await runBashCommand(`cd ${CONTENT_PATH} && git fetch --all && git reset --hard origin/main`)
  } else {
    await runBashCommand(`git clone --depth 1 --single-branch ${REPO_URL} ${CONTENT_PATH}`)
  }
}

syncBlogFromGit()
