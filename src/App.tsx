import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { springEnter } from './lib/springs'
import Home from './components/Home'
import ReliefStudio from './components/ReliefStudio'
import TextStudio from './components/TextStudio'

function BackBar({ title }: { title: string }) {
  const nav = useNavigate()
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
      <motion.button
        onClick={() => nav('/')}
        whileTap={{ scale: 0.92 }}
        transition={springEnter}
        style={backBtn}
        aria-label="返回主页"
      >
        ‹
      </motion.button>
      <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>{title}</span>
    </div>
  )
}

const backBtn: React.CSSProperties = {
  width: 38, height: 38, borderRadius: 19, border: '1px solid var(--border)',
  background: 'var(--surface)', backdropFilter: 'blur(20px)', color: 'var(--text)',
  fontSize: 24, lineHeight: 1, display: 'grid', placeItems: 'center', paddingBottom: 3,
}

export default function App() {
  const loc = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={loc} key={loc.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/relief" element={<><BackBar title="透光浮雕" /><ReliefStudio /></>} />
        <Route path="/text" element={<><BackBar title="双面立体字" /><TextStudio /></>} />
      </Routes>
    </AnimatePresence>
  )
}
