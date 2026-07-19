import type { CSSProperties, ReactNode } from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { springEnter } from '../lib/springs'

export default function StudioShell({ stage, panel }: { stage: ReactNode; panel: ReactNode }) {
  const [hinted, setHinted] = useState(false)
  return (
    <div className="studio">
      <div className="studio-stage" onPointerDown={() => setHinted(true)}>
        {stage}
        <AnimatePresence>
          {!hinted && (
            <motion.div
              key="hint"
              className="drag-hint"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={springEnter}
            >
              ✥ 拖拽旋转 · 松手带惯性
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.aside
        className="studio-panel"
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={springEnter}
      >
        {panel}
      </motion.aside>
    </div>
  )
}

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '11px 13px',
  borderRadius: 'var(--radius-s)',
  border: '1px solid var(--border)',
  background: 'rgba(255,255,255,0.04)',
  color: 'var(--text)',
  fontSize: 14,
  outline: 'none',
}

export const primaryBtn: CSSProperties = {
  width: '100%',
  padding: '13px',
  borderRadius: 'var(--radius-s)',
  border: 'none',
  background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
  color: '#0a0a0c',
  fontWeight: 700,
  fontSize: 15,
  marginTop: 4,
}

export const ghostBtn: CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 'var(--radius-s)',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text)',
  fontSize: 14,
}

export const matChip: CSSProperties = {
  flex: 1,
  padding: '10px 0',
  borderRadius: 'var(--radius-s)',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--text-dim)',
  fontSize: 13,
}

export const matChipActive: CSSProperties = {
  borderColor: 'var(--border-bright)',
  color: 'var(--text)',
  background: 'var(--surface-strong)',
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 12,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-faint)',
        fontWeight: 600,
        marginBottom: 14,
      }}
    >
      {children}
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      <span style={{ display: 'block', fontSize: 13, color: 'var(--text-dim)', marginBottom: 7 }}>{label}</span>
      {children}
    </label>
  )
}
