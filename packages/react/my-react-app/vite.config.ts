import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    // 1. 修复：CSS Modules 配置移到与 preprocessorOptions 平级
    modules: {
      localsConvention: 'camelCase', // 正确位置：用于配置 CSS Modules
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true, // 仅用于 less 预处理器的配置
      },
      // 移除这里的 modules 配置
    },
  },
  server: {
    port: 8848,
    open: true,
  },
  build: {
    outDir: 'build',
    assetsDir: 'static', // 静态资源根目录：build/static/

    // 2. 修复：移除路径中的 static/ 前缀，避免重复嵌套
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name]-[hash].js', // 最终路径：build/static/js/...
        chunkFileNames: 'js/[name]-[hash].chunk.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name]-[hash].[ext]'; // build/static/css/...
          }
          if (assetInfo.name?.match(/\.(png|jpe?g|gif|svg)$/)) {
            return 'img/[name]-[hash].[ext]'; // build/static/img/...
          }
          if (assetInfo.name?.match(/\.(woff|woff2|eot|ttf|otf)$/)) {
            return 'fonts/[name]-[hash].[ext]'; // build/static/fonts/...
          }
          return '[name]-[hash].[ext]'; // 其他资源：build/static/...
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    sourcemap: process.env.NODE_ENV === 'development',
  },
});
