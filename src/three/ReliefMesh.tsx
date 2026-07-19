import { useMemo } from 'react'
import { PlaneGeometry, Color, BufferAttribute } from 'three'

interface Props {
  field: Float32Array
  cols: number
  rows: number
  depth: number
  contrast: number
  base: number
  glow: number
}

// 照片 → 3D 浮雕网格：在细分平面上按亮度做顶点位移，并用顶点色表现高低/发光。
export default function ReliefMesh({ field, cols, rows, depth, contrast, base, glow }: Props) {
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(4, 4 * (rows / cols), cols - 1, rows - 1)
    const pos = geo.attributes.position
    const colors: number[] = []
    const cLow = new Color('#16203c')
    const cHigh = new Color('#d6e6ff')
    const tmp = new Color()
    for (let i = 0; i < field.length; i++) {
      const v = Math.min(1, Math.max(0, field[i] * contrast))
      pos.setZ(i, base + v * depth)
      tmp.copy(cLow).lerp(cHigh, v)
      colors.push(tmp.r, tmp.g, tmp.b)
    }
    geo.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
    geo.computeVertexNormals()
    return geo
  }, [field, cols, rows, depth, contrast, base])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        vertexColors
        roughness={0.42}
        metalness={0.04}
        emissive="#3b5bff"
        emissiveIntensity={0.12 + glow * 0.33}
      />
    </mesh>
  )
}
