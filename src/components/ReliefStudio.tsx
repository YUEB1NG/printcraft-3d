import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ChangeEvent, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import Stage from '../three/Stage'
import ReliefMesh from '../three/ReliefMesh'
import StudioShell, { SectionTitle, Field, inputStyle, primaryBtn, ghostBtn } from './StudioShell'
import { ImageIcon, LightIcon } from './icons'
import Slider from '../ui/Slider'
import { sampleImage, type ReliefField } from '../lib/relief'
import { springEnter } from '../lib/springs'

// 浮光产品尺寸：10.8cm × 14.4cm ≈ 3:4 竖版
const CROP_ASPECT = 10.8 / 14.4

const overlayWrap: CSSProperties = {
  position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', padding: 20, pointerEvents: 'none',
}
const overlayBox: CSSProperties = {
  textAlign: 'center', padding: '28px 30px', borderRadius: 'var(--radius-m)',
  border: '1px solid var(--border)', background: 'var(--surface)', backdropFilter: 'blur(20px)',
  pointerEvents: 'auto', maxWidth: 320,
}
const uploadBtn: CSSProperties = {
  marginTop: 16, padding: '11px 22px', borderRadius: 999, border: 'none',
  background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#0a0a0c',
  fontWeight: 700, fontSize: 14,
}

export default function ReliefStudio() {
  const [relief, setRelief] = useState<ReliefField | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [p, setP] = useState({ depth: 0.45, contrast: 1.15, base: 0.04 })
  const [lit, setLit] = useState(false)
  const [light, setLight] = useState(1)
  const [lead, setLead] = useState({ name: '', contact: '', note: '' })
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const [params] = useSearchParams()

  // 从分享链接还原参数（含开灯状态）
  useEffect(() => {
    setP((prev) => ({
      ...prev,
      depth: params.get('d') ? +params.get('d')! : prev.depth,
      contrast: params.get('c') ? +params.get('c')! : prev.contrast,
    }))
    if (params.get('l') === '1') setLit(true)
  }, [])

  function onFile(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) { setError('请上传图片文件（JPG / PNG）'); return }
    setError(''); setBusy(true)
    const url = URL.createObjectURL(f)
    const img = new Image()
    img.onload = () => {
      try { setRelief(sampleImage(img, 168, CROP_ASPECT)) }
      catch { setError('图片解析失败，换一张试试') }
      finally { setBusy(false); URL.revokeObjectURL(url) }
    }
    img.onerror = () => { setError('图片加载失败'); setBusy(false) }
    img.src = url
  }

  function copyLink() {
    const q = new URLSearchParams({ d: String(p.depth), c: String(p.contrast), l: lit ? '1' : '0' })
    const link = `${location.origin}${location.pathname}#/?${q.toString()}`
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
    all.push({ type: 'fuguang', ...lead, params: p, lit, at: Date.now() })
    localStorage.setItem('printcraft_leads', JSON.stringify(all))
    setSent(true)
  }

  const stage = (
    <Stage
      backlight={lit ? light * 5 : 0}
      ambient={lit ? 1.0 : 0.5}
      keyLight={lit ? 0 : 0.9}
      hFactor={0.01}
      vFactor={0.01}
      vClamp={Math.PI / 2.4}
    >
      {relief ? (
        <ReliefMesh data={relief} depth={p.depth} contrast={p.contrast} base={p.base} lit={lit} />
      ) : null}
    </Stage>
  )

  return (
    <StudioShell
      showHint={!relief}
      stage={
        <>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          {stage}
          {!relief && (
            <div style={overlayWrap}>
              <div style={overlayBox}>
                <ImageIcon style={{ width: 34, height: 34, color: 'var(--accent)', margin: '0 auto 10px' }} />
                <div style={{ fontWeight: 600, marginBottom: 6 }}>上传一张照片开始</div>
                <div style={{ color: 'var(--text-dim)', fontSize: 13 }}>人像、风景、宠物都行 · 自动裁切为 10.8×14.4cm</div>
                <motion.button whileTap={{ scale: 0.96 }} transition={springEnter} onClick={() => fileRef.current?.click()} style={uploadBtn} disabled={busy}>
                  {busy ? '解析中…' : '选择照片'}
                </motion.button>
              </div>
            </div>
          )}

          {/* 舞台底部控制条：开灯按钮 + 尺寸标注 */}
          {relief && (
            <div className="stage-controls">
              <button
                className={`light-toggle ${lit ? 'on' : ''}`}
                onClick={() => setLit((v) => !v)}
              >
                <LightIcon style={{ width: 18, height: 18 }} />
                {lit ? '关灯' : '开灯'}
              </button>
              <span className="stage-size">浮光 · 10.8 × 14.4 cm</span>
            </div>
          )}
        </>
      }
      panel={
        <div>
          <SectionTitle>参数</SectionTitle>
          <Slider label="浮雕深度" min={0.1} max={1.1} value={p.depth} onChange={(v) => setP({ ...p, depth: v })} format={(v) => v.toFixed(2)} />
          <Slider label="对比度" min={0.5} max={2} value={p.contrast} onChange={(v) => setP({ ...p, contrast: v })} format={(v) => v.toFixed(2)} />
          {lit && (
            <Slider label="灯光强度" min={0.3} max={2} value={light} onChange={(v) => setLight(v)} format={(v) => v.toFixed(2)} />
          )}
          {error && <div style={{ color: '#ff9a9a', fontSize: 13, margin: '4px 0 12px' }}>{error}</div>}
          {relief && (
            <motion.button whileTap={{ scale: 0.96 }} transition={springEnter} onClick={() => fileRef.current?.click()} style={{ ...ghostBtn, marginBottom: 4 }} disabled={busy}>
              {busy ? '解析中…' : '更换照片'}
            </motion.button>
          )}
          <div style={{ color: 'var(--text-faint)', fontSize: 12, marginTop: 6, lineHeight: 1.5 }}>
            默认纯白浮雕，点「开灯」即可背光显示彩色透光画。
          </div>

          <div style={{ height: 1, background: 'var(--border)', margin: '22px 0' }} />
          <SectionTitle>留资 / 分享</SectionTitle>
          {sent ? (
            <div style={{ color: 'var(--accent)', fontSize: 14 }}>✓ 已收到，我们会尽快联系你</div>
          ) : (
            <form onSubmit={submitLead}>
              <Field label="称呼"><input style={inputStyle} value={lead.name} onChange={(e) => setLead({ ...lead, name: e.target.value })} placeholder="怎么称呼你" /></Field>
              <Field label="联系方式"><input required style={inputStyle} value={lead.contact} onChange={(e) => setLead({ ...lead, contact: e.target.value })} placeholder="微信 / 邮箱 / 手机" /></Field>
              <Field label="备注"><textarea style={{ ...inputStyle, minHeight: 64, resize: 'vertical' }} value={lead.note} onChange={(e) => setLead({ ...lead, note: e.target.value })} placeholder="想要的材质 / 用途" /></Field>
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
