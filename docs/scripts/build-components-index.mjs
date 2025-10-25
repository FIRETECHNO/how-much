import { promises as fs } from 'fs'
import path from 'path'

const ROOT = path.resolve(process.cwd(), 'public', 'docs', 'components')

async function collectMarkdown(dir, base = '') {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const items = []
  for (const e of entries) {
    if (e.name.startsWith('.')) continue
    const full = path.join(dir, e.name)
    const rel = path.posix.join(base.replaceAll('\\', '/'), e.name)
    if (e.isDirectory()) {
      const sub = await collectMarkdown(full, rel)
      items.push(...sub)
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) {
      items.push(rel)
    }
  }
  return items
}

function htmlPage(list) {
  const links = list
    .sort((a,b) => a.localeCompare(b))
    .map(f => `<li><a href="./${f}">${f}</a></li>`) 
    .join('\n')
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Vue Components Docs</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body{font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial; line-height:1.5; padding:24px;}
    a{color:#2563eb; text-decoration:none}
    a:hover{text-decoration:underline}
    ul{padding-left:20px}
  </style>
</head>
<body>
  <h1>Документация компонентов</h1>
  <p>Markdown-файлы, сгенерированные vue-docgen-cli.</p>
  <ul>
    ${links}
  </ul>
  <p><a href="/docs/">← Назад к общей документации</a></p>
</body>
</html>`
}

async function main() {
  try {
    await fs.mkdir(ROOT, { recursive: true })
    const files = await collectMarkdown(ROOT)
    const indexHtml = htmlPage(files)
    await fs.writeFile(path.join(ROOT, 'index.html'), indexHtml, 'utf8')
    console.log(`Generated components index with ${files.length} entries`)
  } catch (err) {
    console.error('Failed to build components index:', err)
    process.exitCode = 1
  }
}

await main()
