// vite.config.ts
import { defineConfig } from 'vite';
import { generateTsMap } from './vite-plugin-generate-ts-map';

export default defineConfig({
  plugins: [
    generateTsMap({
      targetDir: 'src/modules', // 你要遍历的文件夹
      outputFile: 'src/generated/files-map.ts', // 生成的TS对象文件
    }),
  ],
  build: {
    // 关键：启用库模式，指定TS入口，完全不依赖index.html
    lib: {
      entry: 'src/index.ts', // 你的核心TS入口（必须存在，哪怕是空的中转文件）
      formats: ['es', 'cjs'], // 输出格式（按需选择：ES模块/CommonJS）
      fileName: (format) => `your-output-name.${format}.js`, // 输出文件名
    },
    // 可选：关闭不必要的Web相关优化（减少打包冗余）
    rollupOptions: {
      // 若你的代码不依赖浏览器API，可标记为Node环境
      external: [], // 若依赖外部包（如lodash），需在这里声明，避免被打包进来
    },
  },
  // 可选：关闭开发服务器相关配置（因为你只需要打包）
  server: {
    open: false,
  },
});
