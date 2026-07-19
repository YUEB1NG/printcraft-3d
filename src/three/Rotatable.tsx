import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import { useReducedMotion } from 'framer-motion'

// 流体旋转：拖拽跟手（1:1），松手继承速度带惯性衰减。
// 对应 Apple《Designing Fluid Interfaces》——从当前值出发、携带速度、可随时被打断。
export default function Rotatable({ children, enableX = true }: { children: React.ReactNode; enableX?: boolean }) {
  const ref = useRef<Group>(null)
  const { gl } = useThree()
  const reduced = useReducedMotion()
  const s = useRef({ dragging: false, lastX: 0, lastY: 0, lastT: 0, velX: 0, velY: 0, rotX: -0.15, rotY: -0.35 })

  useEffect(() => {
    const el = gl.domElement
    const onDown = (e: PointerEvent) => {
      el.setPointerCapture?.(e.pointerId)
      const st = s.current
      st.dragging = true
      st.lastX = e.clientX
      st.lastY = e.clientY
      st.lastT = performance.now()
      st.velX = 0
      st.velY = 0
    }
    const onMove = (e: PointerEvent) => {
      const st = s.current
      if (!st.dragging) return
      const now = performance.now()
      const dt = Math.max(1, now - st.lastT) / 1000
      const dx = e.clientX - st.lastX
      const dy = e.clientY - st.lastY
      st.rotY += dx * 0.01
      if (enableX) st.rotX += dy * 0.01
      // 记录释放速度（px/s → rad/s）
      st.velY = (dx / dt) * 0.01
      if (enableX) st.velX = (dy / dt) * 0.01
      st.lastX = e.clientX
      st.lastY = e.clientY
      st.lastT = now
    }
    const onUp = (e: PointerEvent) => {
      s.current.dragging = false
      el.releasePointerCapture?.(e.pointerId)
    }
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [gl, enableX])

  useFrame((_, delta) => {
    const st = s.current
    const g = ref.current
    if (!g) return
    if (!st.dragging && !reduced) {
      st.rotY += st.velY * delta
      if (enableX) st.rotX += st.velX * delta
      const decay = Math.pow(0.94, delta * 60) // 帧率无关的惯性衰减
      st.velY *= decay
      if (enableX) st.velX *= decay
    }
    const clampX = Math.max(-Math.PI / 2.4, Math.min(Math.PI / 2.4, st.rotX))
    g.rotation.set(clampX, st.rotY, 0)
  })

  return <group ref={ref}>{children}</group>
}
