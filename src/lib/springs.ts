import type { Transition } from 'framer-motion'

// 对应 Apple 的 damping / response 弹簧参数（damping 1.0 = 临界阻尼，无回弹）
// 默认 UI：临界阻尼，优雅不晃
export const springUI: Transition = { type: 'spring', bounce: 0, duration: 0.32 }

// 带动量的物理交互（甩动/拖拽释放）：轻微回弹
export const springMomentum: Transition = { type: 'spring', bounce: 0.18, duration: 0.42 }

// 进出场：临界阻尼，干净
export const springEnter: Transition = { type: 'spring', bounce: 0, duration: 0.5 }
