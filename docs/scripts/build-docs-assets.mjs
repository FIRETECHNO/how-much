import { promises as fs } from 'fs'
import path from 'path'

const ROOT = path.resolve(process.cwd(), 'docs')
const PUBLIC_DIR = path.resolve(process.cwd(), 'public')

async function copyFile(src, dest) {
  await fs.mkdir(path.dirname(dest), { recursive: true })
  await fs.copyFile(src, dest)
}

async function main() {
  try {
    // Copy OpenAPI yaml from docs/openapi
    await copyFile(path.join(ROOT, 'openapi', 'openapi.yaml'), path.join(PUBLIC_DIR, 'docs', 'openapi.yaml'))
    // Copy docs index page from docs/pages
    await copyFile(path.join(ROOT, 'pages', 'index.html'), path.join(PUBLIC_DIR, 'docs', 'index.html'))
    // Copy ReDoc viewer page from docs/pages
    await copyFile(path.join(ROOT, 'pages', 'api-docs.html'), path.join(PUBLIC_DIR, 'api-docs.html'))
    console.log('Docs assets copied to public/')
  } catch (err) {
    console.error('Failed to copy docs assets:', err)
    process.exitCode = 1
  }
}

await main()
