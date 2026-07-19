import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import SpringCard from './SpringCard'
import { ImageIcon, TypeIcon } from './icons'
import { springEnter } from '../lib/springs'

export default function Home() {
  const nav = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springEnter}
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        gap: 28,
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 640 }}>
        <div className="eyebrow">PrintCraft · 3D 打印定制</div>
        <h1 className="display" style={{ margin: '12px 0 14px' }}>
          把照片和文字，变成能拿在手里的 3D 实物
        </h1>
        <p className="subtitle">选一种定制，实时预览你的 3D 模型。拖一拖，转着看看。</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 320px))',
          gap: 18,
          width: '100%',
          maxWidth: 720,
        }}
      >
        <SpringCard onClick={() => nav('/relief')}>
          <ImageIcon style={{ color: 'var(--accent)', marginBottom: 12 }} />
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>透光浮雕</div>
          <div style={{ color: 'var(--text-dim)', marginTop: 6, fontSize: 14, lineHeight: 1.5 }}>
            上传一张照片，实时生成可 3D 打印的透光浮雕，背光下发光。
          </div>
        </SpringCard>

        <SpringCard onClick={() => nav('/text')}>
          <TypeIcon style={{ color: 'var(--accent-2)', marginBottom: 12 }} />
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>双面立体字</div>
          <div style={{ color: 'var(--text-dim)', marginTop: 6, fontSize: 14, lineHeight: 1.5 }}>
            正反两面各刻一组字，像名片座一样，摆桌上很有质感。
          </div>
        </SpringCard>
      </div>

      <div style={{ color: 'var(--text-faint)', fontSize: 13, marginTop: 4 }}>
        v1 · 体验原型（暂不接单，先看看喜不喜欢）
      </div>
    </motion.div>
  )
}
