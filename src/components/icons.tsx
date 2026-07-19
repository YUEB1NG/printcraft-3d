import type { CSSProperties } from 'react'

export function ImageIcon({ style }: { style?: CSSProperties }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
}

export function TypeIcon({ style }: { style?: CSSProperties }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <polyline points="4 20 4 4 20 4" />
      <path d="M7 14h.01M12 14h.01M17 14h.01M7 9h.01M12 9h.01M17 9h.01" />
      <path d="M4 16h16" opacity="0.4" />
    </svg>
  )
}
