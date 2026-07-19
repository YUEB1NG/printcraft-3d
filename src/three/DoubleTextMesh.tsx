import { useEffect } from 'react'
import { Text3D, Center, RoundedBox } from '@react-three/drei'

const FONT = '/fonts/helvetiker_bold.typeface.json'
const PLATE_W = 4.4
const PLATE_H = 2.6
const PLATE_D = 0.5
const FRONT_Z = PLATE_D / 2 + 0.06

// 材质预设：透光树脂感（默认）/ 哑光 / 金属感
function matProps(preset: string): Record<string, any> {
  if (preset === 'matte') return { color: '#e9e4d8', roughness: 0.92, metalness: 0 }
  if (preset === 'metal') return { color: '#d9d9e0', roughness: 0.24, metalness: 0.95 }
  return {
    color: '#dce5ff',
    roughness: 0.22,
    metalness: 0.04,
    emissive: '#4a6cff',
    emissiveIntensity: 0.24,
    transparent: true,
    opacity: 0.92,
  }
}

// 文字在底板基础上更亮/更发光，让字从板上「凸出来」
function textMatProps(preset: string): Record<string, any> {
  if (preset === 'matte') return { color: '#f3efe8', roughness: 0.88, metalness: 0 }
  if (preset === 'metal') return { color: '#ececf1', roughness: 0.22, metalness: 0.95, emissive: '#ffffff', emissiveIntensity: 0.1 }
  return {
    color: '#eef2ff',
    roughness: 0.22,
    metalness: 0.04,
    emissive: '#5b7bff',
    emissiveIntensity: 0.48,
    transparent: true,
    opacity: 0.94,
  }
}

// 双面立体字：一块板，正面一组字、背面一组反向字（绕 Y 转 180° 让背面可读）。
export default function DoubleTextMesh({ front, back, preset, onReady }: { front: string; back: string; preset: string; onReady?: () => void }) {
  const mat = matProps(preset)
  const textMat = textMatProps(preset)
  useEffect(() => { onReady?.() }, [])
  return (
    <group>
      <RoundedBox args={[PLATE_W, PLATE_H, PLATE_D]} radius={0.09} smoothness={4}>
        <meshStandardMaterial {...mat} />
      </RoundedBox>

      <Center position={[0, 0, FRONT_Z]}>
        <Text3D font={FONT} size={0.6} height={0.2} bevelEnabled bevelSize={0.015} bevelThickness={0.025} bevelSegments={3}>
          {front || ' '}
          <meshStandardMaterial {...textMat} />
        </Text3D>
      </Center>

      <Center position={[0, 0, -FRONT_Z]} rotation={[0, Math.PI, 0]}>
        <Text3D font={FONT} size={0.6} height={0.2} bevelEnabled bevelSize={0.015} bevelThickness={0.025} bevelSegments={3}>
          {back || ' '}
          <meshStandardMaterial {...textMat} />
        </Text3D>
      </Center>
    </group>
  )
}
