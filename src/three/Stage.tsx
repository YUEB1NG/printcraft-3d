import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Rotatable from './Rotatable'

interface StageProps {
  children: React.ReactNode
  // 背光强度（浮光开灯时拉高，制造透光发光感）
  backlight?: number
  // 环境光与正面主光强度
  ambient?: number
  keyLight?: number
  // 拖拽灵敏度（字变：左右高、上下低）
  hFactor?: number
  vFactor?: number
  vClamp?: number
  enableX?: boolean
}

// 通用 3D 舞台：相机 + 灯光 + 可拖拽旋转的模型。
// 灯光与拖拽手感由调用方按产品特性配置。
export default function Stage({
  children,
  backlight = 0,
  ambient = 0.45,
  keyLight = 0.85,
  hFactor = 0.01,
  vFactor = 0.01,
  vClamp = Math.PI / 2.4,
  enableX = true,
}: StageProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'none' }}
    >
      <color attach="background" args={['#0a0a0c']} />
      <ambientLight intensity={ambient} />
      <directionalLight position={[3, 4, 5]} intensity={keyLight} />
      <directionalLight position={[-4, -2, 2]} intensity={keyLight * 0.3} color="#bcd2ff" />
      {/* 背光：从模型后方打光，开灯时让浮雕像透着光 */}
      <pointLight position={[0, 0, -3]} intensity={backlight} color="#fff4e0" distance={30} decay={1.2} />
      <Suspense fallback={null}>
        <Rotatable enableX={enableX} hFactor={hFactor} vFactor={vFactor} vClamp={vClamp}>
          {children}
        </Rotatable>
      </Suspense>
    </Canvas>
  )
}
