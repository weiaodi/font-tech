import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
      modules: {
        localsConvention: 'camelCase', // 可选配置
      },
    },
  },
  server: {
    port: 8848,
    open: true,
  },
  build: {
    // 1. 指定打包输出目录（默认是 dist）
    outDir: 'build', // 例如：将打包结果输出到项目根目录的 build 文件夹

    // 2. 指定静态资源输出目录（相对于 outDir）
    assetsDir: 'static', // 所有静态资源（js、css、img 等）放在 build/static 下

    // 3. 配置输出文件名（哈希值用于缓存控制）
    rollupOptions: {
      output: {
        // js 文件输出到 static/js 下，文件名格式：[name]-[hash].js
        entryFileNames: 'static/js/[name]-[hash].js',
        // 非入口 js 文件（如异步chunk）输出格式
        chunkFileNames: 'static/js/[name]-[hash].chunk.js',
        // css 文件输出到 static/css 下
        assetFileNames: (assetInfo) => {
          // assetInfo 包含文件的信息（如 name、source 等）
          if (assetInfo.name?.endsWith('.css')) {
            // CSS 文件：输出到 static/css 目录
            return 'static/css/[name]-[hash].[ext]';
          }
          if (assetInfo.name?.match(/\.(png|jpe?g|gif|svg)$/)) {
            // 图片文件：输出到 static/img 目录
            return 'static/img/[name]-[hash].[ext]';
          }
          if (assetInfo.name?.match(/\.(woff|woff2|eot|ttf|otf)$/)) {
            // 字体文件：输出到 static/fonts 目录
            return 'static/fonts/[name]-[hash].[ext]';
          }
          // 其他资产（如 json、txt 等）：默认路径
          return 'static/[name]-[hash].[ext]';
        },
      },
    },
    // 4. 压缩配置
    minify: 'terser', // 使用 terser 压缩（默认，生产环境生效）
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境移除 console
        drop_debugger: true, // 移除 debugger
      },
    },

    // 5. 生成 sourcemap（生产环境建议关闭，减小体积）
    sourcemap: process.env.NODE_ENV === 'development', // 开发环境生成，生产环境不生成
  },
});
