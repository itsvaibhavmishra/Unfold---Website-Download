import { watch } from 'node:fs'
import { copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import * as esbuild from 'esbuild'

const root = fileURLToPath(new URL('..', import.meta.url))
const watching = process.argv.includes('--watch')

const common = {
  absWorkingDir: root,
  bundle: true,
  outdir: 'dist',
  target: 'chrome120',
  sourcemap: watching ? 'inline' : false,
  logLevel: 'info',
}

const bundles = [
  { ...common, format: 'esm', entryPoints: { background: 'src/background/index.ts', popup: 'src/popup/index.ts' } },
  // Chrome loads content scripts as classic scripts, so this one cannot be a module.
  { ...common, format: 'iife', entryPoints: { content: 'src/content/index.ts' } },
]

const staticSources = ['package.json', 'src/manifest.json', 'src/popup/index.html', 'src/popup/popup.css']

const writeStatic = async () => {
  const { version } = JSON.parse(await readFile(`${root}package.json`, 'utf8'))
  const manifest = JSON.parse(await readFile(`${root}src/manifest.json`, 'utf8'))
  await writeFile(`${root}dist/manifest.json`, `${JSON.stringify({ ...manifest, version }, null, 2)}\n`)
  await copyFile(`${root}src/popup/index.html`, `${root}dist/popup.html`)
  await copyFile(`${root}src/popup/popup.css`, `${root}dist/popup.css`)
}

await rm(`${root}dist`, { recursive: true, force: true })
await mkdir(`${root}dist`, { recursive: true })

if (watching) {
  const contexts = await Promise.all(bundles.map(options => esbuild.context(options)))
  await Promise.all(contexts.map(context => context.watch()))
  await writeStatic()
  for (const source of staticSources) {
    watch(`${root}${source}`, () => writeStatic().catch(console.error))
  }
} else {
  await Promise.all(bundles.map(options => esbuild.build(options)))
  await writeStatic()
}
