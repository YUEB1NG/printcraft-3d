import { useEffect, useMemo } from 'react'
import { PlaneGeometry, Color, BufferAttribute } from 'three'
import { luminance, type ReliefField } from '../lib/relief'

interface Props {
  data: ReliefField
  depth: number
  contrast: number
  base: number
  // 开灯：true = 彩色透光模式；false = 纯白浮雕
  lit: boolean
}

// 照片 → 3D 浮雕网格
// - 顶点位移：越亮越凸起（凹凸立体）
// - 默认纯白：顶点色为白→近白的细微梯度，正面打光，像一尊白色雕塑
// - 开灯(lit)：切换为 meshBasicMaterial，顶点色为照片原色（linear），显示彩色透光画
export default function ReliefMesh({ data, depth, contrast, base, lit }: Props) {
  const { color, cols, rows } = data

  // 产品比例 10.8×14.4cm ≈ 3:4 竖版；以平面宽度 3.4 为基准推导高度
  const W = 3.4
  const H = W * (rows / cols)

  const { geometry, whiteBuf, colorBuf } = useMemo(() => {
    const geo = new PlaneGeometry(W, H, cols - 1, rows - 1)
    const pos = geo.attributes.position
    const white: number[] = []
    const col: number[] = []
    const cLow = new Color('#e9e9ef')
    const cHigh = new Color('#ffffff')
    const tmp = new Color()
    for (let i = 0; i < cols * rows; i++) {
      const r = color[i * 3]
      const g = color[i * 3 + 1]
      const b = color[i * 3 + 2]
      const lum = Math.min(1, Math.max(0, luminance(r, g, b) * contrast))
      pos.setZ(i, base + lum * depth)
      // 白模：由低到高做极轻微的亮度梯度，保留形体感
      tmp.copy(cLow).lerp(cHigh, lum)
      white.push(tmp.r, tmp.g, tmp.b)
      // 彩色：原图 RGB，转换为 linear 供 Three.js 正确显示
      tmp.setRGB(r / 255, g / 255, b / 255).convertSRGBToLinear()
      col.push(tmp.r, tmp.g, tmp.b)
    }
    geo.setAttribute('color', new BufferAttribute(new Float32Array(white), 3))
    geo.computeVertexNormals()
    return { geometry: geo, whiteBuf: new Float32Array(white), colorBuf: new Float32Array(col) }
  }, [color, cols, rows, depth, contrast, base, W, H])

  // 开灯切换顶点色
  useEffect(() => {
    const attr = geometry.getAttribute('color') as BufferAttribute
    attr.set(lit ? colorBuf : whiteBuf)
    attr.needsUpdate = true
  }, [lit, geometry, whiteBuf, colorBuf])

  return (
    <mesh geometry={geometry}>
      {lit ? (
        <meshBasicMaterial vertexColors toneMapped={false} />
      ) : (
        <meshStandardMaterial
          vertexColors
          color="#ffffff"
          roughness={0.5}
          metalness={0.02}
          emissive="#ffffff"
          emissiveIntensity={0.05}
        />
      )}
    </mesh>
  )
}
