import { CanvasTexture, RepeatWrapping } from 'three'

// 程序化生成「实物质感」纹理：极细的层纹 + 轻微噪点，
// 让白色树脂/哑光件看起来像真的 3D 打印实物，而不是塑料感平面。
let cached: CanvasTexture | null = null

export function getPhysicalTexture(): CanvasTexture {
  if (cached) return cached
  const size = 512
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')!
  // 中灰底（bump 中性值）
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, size, size)

  // 横向层纹（每条打印层一道极淡的明暗交界）
  const lines = 64
  for (let i = 0; i < lines; i++) {
    const y = Math.floor((i / lines) * size)
    const shade = 128 + (Math.random() * 10 - 5)
    ctx.fillStyle = `rgb(${shade | 0},${shade | 0},${shade | 0})`
    ctx.fillRect(0, y, size, Math.max(1, Math.floor(size / lines)))
  }

  // 细微噪点，打破规整感
  const img = ctx.getImageData(0, 0, size, size)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() * 8 - 4) | 0
    img.data[i] = clamp8(img.data[i] + n)
    img.data[i + 1] = clamp8(img.data[i + 1] + n)
    img.data[i + 2] = clamp8(img.data[i + 2] + n)
  }
  ctx.putImageData(img, 0, 0)

  const tex = new CanvasTexture(c)
  tex.wrapS = RepeatWrapping
  tex.wrapT = RepeatWrapping
  tex.repeat.set(1, 6)
  cached = tex
  return tex
}

function clamp8(v: number) {
  return v < 0 ? 0 : v > 255 ? 255 : v
}
