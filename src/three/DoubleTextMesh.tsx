import { useEffect } from 'react'
import { Text3D, Center, RoundedBox } from '@react-three/drei'
import { getPhysicalTexture } from '../lib/texture'

const FONT = '/fonts/helvetiker_bold.typeface.json'
// 字变制品长度约 15cm：以平面宽度 5.0 为基准推导（横版名牌）
const PLATE_W = 5.0
const PLATE_H = 2.3
const PLATE_D = 0.45
const FRONT_Z = PLATE_D / 2 + 0.05

// 白色材质预设（均统一为白，仅质感不同），并叠加实物质感纹理
function matProps(preset: string): Record<string, any> {
  const bump = getPhysicalTexture()
  const base = { bumpMap: bump, bumpScale: 0.004 }
  if (preset === 'matte') return { color: '#f1f0ec', roughness: 0.92, metalness: 0, ...base }
  if (preset === 'glow') return { color: '#eef2ff', roughness: 0.2, metalness: 0.02, emissive: '#cdd9ff', emissiveIntensity: 0.16, transparent: true, opacity: 0.92, ...base, bumpScale: 0.003 }
  // pearl 珠光：近白、带一点光泽
  return { color: '#fbfbfd', roughness: 0.34, metalness: 0.06, emissive: '#ffffff', emissiveIntensity: 0.05, ...base, bumpScale: 0.006 }
}

// 文字在底板基础上更亮一点，从板上「凸出来」
function textMatProps(preset: string): Record<string, any> {
  const bump = getPhysicalTexture()
  const base = { bumpMap: bump, bumpScale: 0.003 }
  if (preset === 'matte') return { color: '#faf9f6', roughness: 0.88, metalness: 0, ...base }
  if (preset === 'glow') return { color: '#f3f6ff', roughness: 0.2, metalness: 0.02, emissive: '#dbe4ff', emissiveIntensity: 0.28, transparent: true, opacity: 0.94, ...base }
  return { color: '#ffffff', roughness: 0.32, metalness: 0.06, emissive: '#ffffff', emissiveIntensity: 0.08, ...base }
}

// 双面立体字：一块板，正面一组字、背面一组反向字（绕 Y 转 180° 让背面可读）。
export default function DoubleTextMesh({ front, back, preset, onReady }: { front: string; back: string; preset: string; onReady?: () => void }) {
  const mat = matProps(preset) as any
  const textMat = textMatProps(preset) as any
  useEffect(() => { onReady?.() }, [])
  return (
    <group>
      <RoundedBox args={[PLATE_W, PLATE_H, PLATE_D]} radius={0.08} smoothness={4}>
        <meshStandardMaterial {...mat} />
      </RoundedBox>

      <Center position={[0, 0, FRONT_Z]}>
        <Text3D font={FONT} size={0.62} height={0.22} bevelEnabled bevelSize={0.015} bevelThickness={0.025} bevelSegments={3}>
          {front || ' '}
          <meshStandardMaterial {...textMat} />
        </Text3D>
      </Center>

      <Center position={[0, 0, -FRONT_Z]} rotation={[0, Math.PI, 0]}>
        <Text3D font={FONT} size={0.62} height={0.22} bevelEnabled bevelSize={0.015} bevelThickness={0.025} bevelSegments={3}>
          {back || ' '}
          <meshStandardMaterial {...textMat} />
        </Text3D>
      </Center>
    </group>
  )
}
