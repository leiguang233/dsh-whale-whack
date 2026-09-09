/** 鲸鱼娘打地鼠 —— Host 端（常驻 bundle 版）。行为在 Client；这里只挂视频素材的静态服务。 */
import { readFile } from 'node:fs/promises'
import { dirname, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'dsh-whale-whack'
export const ASSET_PREFIX = '/plugins/dsh-whale-whack/assets'
const assetRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'assets')

const ASSET_MIME = Object.freeze({
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.mp3': 'audio/mpeg',
})

function createAssetHandler() {
  return async (req, res) => {
    const pathname = new URL(req.url ?? '/', 'http://x').pathname
    if (!pathname.startsWith(`${ASSET_PREFIX}/`)) {
      res.writeHead(404)
      res.end()
      return
    }
    let relative
    try {
      relative = decodeURIComponent(pathname.slice(ASSET_PREFIX.length + 1))
    } catch {
      res.writeHead(400)
      res.end()
      return
    }
    const target = resolve(assetRoot, normalize(relative))
    if (target !== assetRoot && !target.startsWith(`${assetRoot}${sep}`)) {
      res.writeHead(403)
      res.end()
      return
    }
    try {
      const data = await readFile(target)
      const extension = target.slice(target.lastIndexOf('.')).toLowerCase()
      res.writeHead(200, {
        'content-type': ASSET_MIME[extension] ?? 'application/octet-stream',
        'cache-control': 'no-store',
      })
      res.end(data)
    } catch {
      res.writeHead(404)
      res.end()
    }
  }
}

export function apply(ctx) {
  if (typeof ctx.inject !== 'function') return
  ctx.inject(['webServer'], (httpCtx) => {
    httpCtx.effect(
      () => httpCtx.webServer.register({ kind: 'prefix', path: ASSET_PREFIX, handler: createAssetHandler() }),
      'dsh-whale-whack: static assets',
    )
  })
}
