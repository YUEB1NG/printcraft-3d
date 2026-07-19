import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js'
import { Mesh, BufferGeometry, type Object3D } from 'three'

// 把几何体 / 场景对象导出为二进制 STL 并触发下载
export function downloadSTL(object: BufferGeometry | Object3D, filename: string) {
  const target: Object3D = object instanceof BufferGeometry ? new Mesh(object) : object
  const exporter = new STLExporter()
  const result = exporter.parse(target as any, { binary: true })
  const blob = new Blob([result as unknown as BlobPart], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
