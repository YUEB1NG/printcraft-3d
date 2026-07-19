export interface ReliefField {
  // 原图像素 RGB（长度 = cols * rows * 3），用于「开灯」后显示彩色透光画
  color: Uint8ClampedArray
  cols: number
  rows: number
}

// 把照片缩采样成浮雕数据。
// - 保留原图 RGB（开灯后按 lithophane 方式映射成彩色透光画）
// - cropAspect：目标宽高比（宽/高）。传入则按该比例对原图做中心裁切，
//   让生成的浮雕正好贴合产品尺寸（浮光 = 10.8×14.4cm ≈ 3:4 竖版）
export function sampleImage(img: HTMLImageElement, cols = 160, cropAspect?: number): ReliefField {
  let sx = 0
  let sy = 0
  let sw = img.width
  let sh = img.height

  if (cropAspect) {
    const imgAspect = img.width / img.height
    if (imgAspect > cropAspect) {
      // 原图更宽 → 裁掉左右
      sw = Math.round(img.height * cropAspect)
      sx = Math.round((img.width - sw) / 2)
    } else {
      // 原图更高 → 裁掉上下
      sh = Math.round(img.width / cropAspect)
      sy = Math.round((img.height - sh) / 2)
    }
  }

  const aspect = sh / sw
  let rows = Math.round(cols * aspect)
  rows = Math.max(8, Math.min(240, rows))

  const c = document.createElement('canvas')
  c.width = cols
  c.height = rows
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows)
  const data = ctx.getImageData(0, 0, cols, rows).data

  const color = new Uint8ClampedArray(cols * rows * 3)
  for (let i = 0; i < cols * rows; i++) {
    color[i * 3] = data[i * 4]
    color[i * 3 + 1] = data[i * 4 + 1]
    color[i * 3 + 2] = data[i * 4 + 2]
  }
  return { color, cols, rows }
}

// 单像素亮度（0..1），用于顶点位移：越亮越凸起
export function luminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}
