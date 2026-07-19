# PrintCraft · 3D 打印定制（v1 体验原型）

把照片/文字变成可旋转的 3D 模型，实时预览。v1 用于**验证需求**，不接支付、不接真实打印。

## 跑起来（本地）

```bash
npm install
npm run dev      # 打开终端里的 http://localhost:5173
```

构建生产版本：`npm run build`（产物在 `dist/`）。

## 页面

| 路由 | 内容 |
|---|---|
| `/` | 主页：透光浮雕 / 双面立体字 两个入口 |
| `/relief` | 上传照片 → 实时 3D 浮雕 → 调参（深度/对比度/底光）→ 留资/分享 |
| `/text` | 输入正反面文字 → 实时双面 3D 字 → 选材质 → 留资/分享 |

交互遵循 Apple《Designing Fluid Interfaces》：拖拽 1:1 跟手、松手带惯性、按压即时回弹，并尊重 `prefers-reduced-motion`。

## 部署到 Vercel（给朋友发链接）

1. 把本目录推到 GitHub。
2. 在 [vercel.com](https://vercel.com) 用 GitHub 导入仓库，框架选 **Vite**，其余默认。
3. 部署完得到一个链接，直接发朋友。

> 用的是 HashRouter（`#/relief` 这种地址），纯静态托管即可，无需服务端路由配置。

## 数据说明（v1 留资）

「提交需求」目前写入浏览器 `localStorage`（key：`printcraft_leads`），仅作原型演示。
v2 接后端 + 微信支付后，改为提交到真实接口。

## 技术栈

Vite · React · TypeScript · Three.js（`@react-three/fiber` / `drei`）· Framer Motion

## 已知边界 / v2 待办

- 仅支持英文 + 数字（字体限制）；中文需 v1.5 子集化字体。
- 「透光」为渲染近似（背光发光），真实 lithophane 透光效果在 v3 服务端生成 STL 时处理。
- 留资未接后端；小程序、支付、真实打印履约均属 v2/v3。
