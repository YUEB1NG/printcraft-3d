import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Group } from 'three'
import { useReducedMotion } from 'framer-motion'

// 流体旋转：拖拽跟手（1:1），松手继承速度带惯性衰减。
// 对应 Apple《Designing Fluid Interfaces》——从当前值出发、携带速度、可随时被打断。
//
// hFactor：水平拖拽 → 绕 Y 轴（左右转）的灵敏度
// vFactor：垂直拖拽 → 绕 X 轴（上下转）的灵敏度
// vClamp ：上下转动的最大角度（字变要求「左右灵敏、上下轻微」）
export default function Rotatable({
  children,
  enableX = true,
  hFactor = 0.01,
  vFactor = 0.01,
  vClamp = Math.PI / 2.4,
}: {
  children: React.ReactNode
  enableX?: boolean
  hFactor?: number
  vFactor?: number
  vClamp?: number
}) {
  const ref = useRef<Group>(null)
  const { gl } = useThree()
  const reduced = useReducedMotion()
  const s = useRef({ dragging: false, lastX: 0, lastY: 0, lastT: 0, velX: 0, velY: 0, rotX: -0.12, rotY: -0.3 })

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
      st.rotY += dx * hFactor
      if (enableX) st.rotX += dy * vFactor
      // 记录释放速度（px/s → rad/s）
      st.velY = (dx / dt) * hFactor
      if (enableX) st.velX = (dy / dt) * vFactor
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
  }, [gl, enableX, hFactor, vFactor])

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
    const clampX = Math.max(-vClamp, Math.min(vClamp, st.rotX))
    g.rotation.set(clampX, st.rotY, 0)
  })

  return <group ref={ref}>{children}</group>
}
