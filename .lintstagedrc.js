import { ESLint } from 'eslint'

async function removeIgnoredFiles(files) {
  const eslint = new ESLint()
  const ignoredFiles = await Promise.all(files.map(file => eslint.isPathIgnored(file)))
  const filteredFiles = files.filter((_, i) => !ignoredFiles[i])
  return filteredFiles.join(' ')
}

export default {
  '*.{js,ts,json}': async (files) => {
    const filesToLint = await removeIgnoredFiles(files)
    return [`eslint ${filesToLint} --fix`]
  },
}
