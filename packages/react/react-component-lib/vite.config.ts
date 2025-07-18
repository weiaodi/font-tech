// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    // CSS Modules 配置
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      localsConvention: 'camelCaseOnly',
    },
    // Less 配置
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          '@primary-color': '#165DFF',
        },
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReactComponentLib',
      fileName: (format) => `index.${format}.js`, // 简化文件名格式
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        // 确保每个组件的 CSS 被正确提取
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    // 启用 CSS 代码分割（关键配置）
    cssCodeSplit: true,
  },
});
