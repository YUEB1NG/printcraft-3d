import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import Stage from '../three/Stage'
import DoubleTextMesh from '../three/DoubleTextMesh'
import StudioShell, { SectionTitle, Field, inputStyle, primaryBtn, ghostBtn, matChip, matChipActive } from './StudioShell'
import { springEnter } from '../lib/springs'

const PRESETS = [
  { key: 'glow', label: '透光树脂' },
  { key: 'matte', label: '哑光' },
  { key: 'metal', label: '金属' },
]

export default function TextStudio() {
  const [front, setFront] = useState('HELLO')
  const [back, setBack] = useState('WORLD')
  const [preset, setPreset] = useState('glow')
  const [lead, setLead] = useState({ name: '', contact: '', note: '' })
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [ready, setReady] = useState(false)
  const [params] = useSearchParams()

  useEffect(() => {
    const f = params.get('f'), b = params.get('b'), m = params.get('m')
    if (f) setFront(f)
    if (b) setBack(b)
    if (m && PRESETS.some((p) => p.key === m)) setPreset(m)
  }, [])

  // 只保留英文 / 数字 / 空格 / 连字符（字体仅含这些字形）
  const onlyEng = (s: string) => s.replace(/[^A-Za-z0-9 \-]/g, '')

  function copyLink() {
    const q = new URLSearchParams({ f: front, b: back, m: preset })
    const link = `${location.origin}${location.pathname}#/text?${q.toString()}`
    const clip = navigator.clipboard
    if (clip) {
      clip.writeText(link)
        .then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600) })
        .catch(() => {})
    } else {
      setCopied(true); setTimeout(() => setCopied(false), 1600)
    }
  }

  function submitLead(e: FormEvent) {
    e.preventDefault()
    if (!lead.contact.trim()) return
    const all = JSON.parse(localStorage.getItem('printcraft_leads') || '[]')
    all.push({ type: 'text', front, back, preset, ...lead, at: Date.now() })
    localStorage.setItem('printcraft_leads', JSON.stringify(all))
    setSent(true)
  }

  return (
    <StudioShell
      stage={
        <>
          <Stage><DoubleTextMesh front={front} back={back} preset={preset} onReady={() => setReady(true)} /></Stage>
          {!ready && <div className="stage-loading">模型加载中…</div>}
        </>
      }
      panel={
        <div>
          <SectionTitle>文字</SectionTitle>
          <Field label="正面（朝前）">
            <input style={inputStyle} value={front} maxLength={14}
              onChange={(e) => setFront(onlyEng(e.target.value.toUpperCase()))} placeholder="FRONT" />
          </Field>
          <Field label="背面（朝后）">
            <input style={inputStyle} value={back} maxLength={14}
              onChange={(e) => setBack(onlyEng(e.target.value.toUpperCase()))} placeholder="BACK" />
          </Field>

          <SectionTitle>材质</SectionTitle>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {PRESETS.map((p) => (
              <motion.button key={p.key} whileTap={{ scale: 0.95 }} transition={springEnter}
                onClick={() => setPreset(p.key)}
                style={{ ...matChip, ...(preset === p.key ? matChipActive : {}) }}>
                {p.label}
              </motion.button>
            ))}
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '22px 0' }} />
          <SectionTitle>留资 / 分享</SectionTitle>
          {sent ? (
            <div style={{ color: 'var(--accent)', fontSize: 14 }}>✓ 已收到，我们会尽快联系你</div>
          ) : (
            <form onSubmit={submitLead}>
              <Field label="称呼"><input style={inputStyle} value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="怎么称呼你" /></Field>
              <Field label="联系方式"><input required style={inputStyle} value={lead.contact} onChange={(e) => setLead({ ...lead, contact: e.target.value })} placeholder="微信 / 邮箱 / 手机" /></Field>
              <Field label="备注"><textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }} value={lead.note} onChange={(e) => setLead({ ...lead, note: e.target.value })} placeholder="想要的材质 / 尺寸 / 用途" /></Field>
              <motion.button type="submit" whileTap={{ scale: 0.97 }} transition={springEnter} style={primaryBtn}>提交需求</motion.button>
            </form>
          )}
          <motion.button whileTap={{ scale: 0.97 }} transition={springEnter} onClick={copyLink} style={{ ...ghostBtn, marginTop: 10 }}>
            {copied ? '✓ 已复制链接' : '复制分享链接'}
          </motion.button>
        </div>
      }
    />
  )
}
