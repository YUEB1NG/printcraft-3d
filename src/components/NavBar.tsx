import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { springEnter } from '../lib/springs'

const TABS = [
  { to: '/', key: 'fuguang', label: '浮光' },
  { to: '/zibian', key: 'zibian', label: '字变' },
]

export default function NavBar() {
  const nav = useNavigate()
  const loc = useLocation()
  const active = loc.pathname.startsWith('/zibian') ? '/zibian' : '/'
  return (
    <div className="nav">
      <div className="nav-brand" onClick={() => nav('/')}>
        <span className="nav-logo">悦</span>
        <span className="nav-name">悦饼</span>
        <span className="nav-tag">3D 打印定制</span>
      </div>
      <div className="nav-tabs">
        {TABS.map((t) => {
          const on = active === t.to
          return (
            <button
              key={t.key}
              onClick={() => nav(t.to)}
              className="nav-tab"
              style={{ color: on ? 'var(--text)' : 'var(--text-dim)' }}
            >
              {on && (
                <motion.span layoutId="nav-pill" className="nav-pill" transition={springEnter} />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{t.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
