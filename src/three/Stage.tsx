import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import Rotatable from './Rotatable'

// 通用 3D 舞台：相机 + 灯光（含背光，营造透光感）+ 可拖拽旋转的模型
export default function Stage({ children }: { children: React.ReactNode }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'none' }}
    >
      <color attach="background" args={['#0a0a0c']} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 4, 5]} intensity={0.85} />
      <directionalLight position={[-4, -2, 2]} intensity={0.25} color="#bcd2ff" />
      {/* 背光：从模型后方打光，让浮雕/立体字边缘发光、像透着光 */}
      <pointLight position={[0, 0, -3]} intensity={4.5} color="#cfe0ff" distance={30} decay={1.4} />
      <Suspense fallback={null}>
        <Rotatable enableX>{children}</Rotatable>
      </Suspense>
    </Canvas>
  )
}
