export interface ReliefField {
  field: Float32Array
  cols: number
  rows: number
}

// 把照片缩采样成亮度场：亮的地方=高（凸起），暗的地方=低（凹陷）。
// 采样到 cols×rows 的网格，正好对应后面网格的顶点数。
export function sampleImage(img: HTMLImageElement, cols = 160): ReliefField {
  const aspect = img.height / img.width
  let rows = Math.round(cols * aspect)
  rows = Math.max(8, Math.min(240, rows))

  const c = document.createElement('canvas')
  c.width = cols
  c.height = rows
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, cols, rows)
  const data = ctx.getImageData(0, 0, cols, rows).data

  const field = new Float32Array(cols * rows)
  for (let i = 0; i < cols * rows; i++) {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    field[i] = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  }
  return { field, cols, rows }
}
