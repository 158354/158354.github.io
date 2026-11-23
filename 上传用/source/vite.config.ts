import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 使用相对路径 base：本地双击 index.html（file://）与 GitHub Pages 子目录
// （https://158354.github.io/Assignment2/）都能正确加载资源，无需区分环境。
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
  },
})
