// rollup.dev.config.js
import path from 'path';
import { fileURLToPath } from 'url';
import vue from 'rollup-plugin-vue';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

export default {
  input: 'dev/serve.ts',
  output: {
    file: 'dev/dist/serve.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('development'),
      },
    }),
    alias({
      entries: [
        { find: '@', replacement: path.resolve(projectRoot, 'src') }
      ],
    }),
    json(),
    vue({
      target: 'browser',
      preprocessStyles: false,
    }),
    postcss({
      extract: false,
      inject: true,
    }),
    esbuild({
      target: 'es2020',
      sourceMap: true,
    }),
    resolve({
      extensions: ['.js', '.ts', '.vue', '.css'],
      browser: true,
    }),
    commonjs(),
  ],
  external: [
    'auto-ros',
    'roslib',
  ],
};
