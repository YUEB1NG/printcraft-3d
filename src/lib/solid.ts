import { BufferGeometry, Float32BufferAttribute } from 'three'
import { luminance, type ReliefField } from './relief'

interface SolidOpts {
  depth: number
  contrast: number
  base: number
  // 真实成品宽度（cm），高度按图像比例推导
  widthCm?: number
  // 场景宽度基准（用于把场景单位换算成 cm）
  sceneWidth?: number
}

// 把照片浮雕变成「可 3D 打印」的封闭实体：
// 前面 = 凹凸浮雕面，背面 = 平面，四周 = 侧壁，形成 watertight 网格。
// 尺寸按真实成品（默认 10.8cm 宽 → 高度按比例得到 14.4cm）。
export function buildLithophaneSolid(data: ReliefField, opts: SolidOpts): BufferGeometry {
  const { color, cols, rows } = data
  const { depth, contrast, base, widthCm = 10.8, sceneWidth = 3.4 } = opts
  const s = widthCm / sceneWidth
  const W = widthCm
  const H = widthCm * (rows / cols)
  const dz = depth * s
  const zb = base * s

  const pos: number[] = []
  const idx: number[] = []

  // 前浮雕面网格
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const k = j * cols + i
      const r = color[k * 3]
      const g = color[k * 3 + 1]
      const b = color[k * 3 + 2]
      const lum = Math.min(1, Math.max(0, luminance(r, g, b) * contrast))
      const x = (i / (cols - 1) - 0.5) * W
      const y = (0.5 - j / (rows - 1)) * H
      const z = zb + lum * dz
      pos.push(x, y, z)
    }
  }

  // 背面 4 角（z=0 平面）
  const cBL = cols * rows
  const cBR = cols * rows + 1
  const cTR = cols * rows + 2
  const cTL = cols * rows + 3
  pos.push(-W / 2, -H / 2, 0, W / 2, -H / 2, 0, W / 2, H / 2, 0, -W / 2, H / 2, 0)

  // 前表面（朝 +z）
  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const a = j * cols + i
      const b = j * cols + i + 1
      const c = (j + 1) * cols + i
      const d = (j + 1) * cols + i + 1
      idx.push(a, b, d, a, d, c)
    }
  }

  // 背面（朝 -z，反向缠绕）
  idx.push(cBL, cBR, cTR, cBL, cTR, cTL)

  // 侧壁：沿前表面周长一圈，连到 z=0 对应点
  const perim: number[] = []
  for (let i = 0; i < cols; i++) perim.push(i) // 上边 L→R
  for (let j = 1; j < rows; j++) perim.push(j * cols + (cols - 1)) // 右边 T→B
  for (let i = cols - 2; i >= 0; i--) perim.push((rows - 1) * cols + i) // 下边 R→L
  for (let j = rows - 2; j >= 1; j--) perim.push(j * cols) // 左边 B→T

  const backStart = cols * rows + 4
  for (const p of perim) {
    pos.push(pos[p * 3], pos[p * 3 + 1], 0)
  }
  for (let k = 0; k < perim.length; k++) {
    const f0 = perim[k]
    const f1 = perim[(k + 1) % perim.length]
    const b0 = backStart + k
    const b1 = backStart + ((k + 1) % perim.length)
    idx.push(f0, f1, b1, f0, b1, b0)
  }

  const geo = new BufferGeometry()
  geo.setAttribute('position', new Float32BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}
