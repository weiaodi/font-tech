import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// 修改导入语句

export default {
  input: 'src/index.js',
  treeshake: false, // 禁用默认的 tree-shaking
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      inlineDynamicImports: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      inlineDynamicImports: true,
    },
  ],
  plugins: [nodeResolve(), commonjs()],
};
