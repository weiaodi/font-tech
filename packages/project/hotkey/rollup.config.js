import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts', // 入口TS文件（根据你的实际入口调整）
  output: [
    {
      file: 'dist/index.js', // 打包后的CommonJS格式JS文件路径
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js', // 打包后的ES Module格式JS文件路径
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve(), // 解析第三方依赖
    commonjs(), // 处理CommonJS模块
    typescript(),
  ],
};
