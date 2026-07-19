import { motion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { springUI } from '../lib/springs'

// Apple 风格按压卡片：按下即时回弹，hover 轻微上浮。
export default function SpringCard({ onClick, children, style }: {
  onClick: () => void
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -5, scale: 1.015 }}
      whileTap={{ scale: 0.975 }}
      transition={springUI}
      className="glass"
      style={{ ...cardBase, ...style }}
    >
      {children}
    </motion.button>
  )
}

const cardBase: CSSProperties = {
  textAlign: 'left',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-l)',
  padding: '28px 26px',
  background: 'var(--surface)',
  color: 'var(--text)',
  display: 'block',
  width: '100%',
}
