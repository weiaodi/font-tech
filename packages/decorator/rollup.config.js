import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'dist/demo.transpiled.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
  },
  plugins: [nodeResolve(), commonjs()],
};
