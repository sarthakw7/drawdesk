import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)))
const rendererUrl = 'http://127.0.0.1:5173'
const binExt = process.platform === 'win32' ? '.cmd' : ''

const vite = spawn(join(rootDir, 'node_modules', '.bin', `vite${binExt}`), [
  '--host',
  '127.0.0.1',
  '--strictPort'
], {
  cwd: rootDir,
  stdio: 'inherit'
})

let electron

const stop = () => {
  electron?.kill()
  vite.kill()
}

process.on('SIGINT', stop)
process.on('SIGTERM', stop)

vite.on('exit', (code) => {
  if (!electron) {
    process.exit(code ?? 1)
  }
})

const waitForRenderer = async () => {
  const startedAt = Date.now()

  while (Date.now() - startedAt < 15000) {
    try {
      const response = await fetch(rendererUrl)

      if (response.ok) {
        return
      }
    } catch {
      // Vite is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error(`Timed out waiting for ${rendererUrl}`)
}

try {
  await waitForRenderer()

  electron = spawn(join(rootDir, 'node_modules', '.bin', `electron${binExt}`), ['.'], {
    cwd: rootDir,
    env: {
      ...process.env,
      ELECTRON_RENDERER_URL: rendererUrl
    },
    stdio: 'inherit'
  })

  electron.on('exit', (code) => {
    vite.kill()
    process.exit(code ?? 0)
  })
} catch (error) {
  console.error(error)
  stop()
  process.exit(1)
}
