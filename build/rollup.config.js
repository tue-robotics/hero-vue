// rollup.config.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vue from 'rollup-plugin-vue';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild';
import postcss from 'rollup-plugin-postcss';
import terser from '@rollup/plugin-terser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get browserslist config and remove ie from es build targets
const esbrowserslist = fs.readFileSync('./.browserslistrc')
  .toString()
  .split('\n')
  .filter((entry) => entry && entry.substring(0, 2) !== 'ie');

const projectRoot = path.resolve(__dirname, '..');

const baseConfig = {
  input: 'src/entry.ts',
  plugins: {
    preVue: [
      alias({
        entries: [
          { find: '@', replacement: path.resolve(projectRoot, 'src') }
        ],
      }),
    ],
    replace: {
      preventAssignment: true,
      values: {
        'process.env.NODE_ENV': JSON.stringify('production'),
      },
    },
    vue: {
      target: 'browser',
      css: 'dist/hero-vue.css',
    },
    esbuild: {
      include: /\.[jt]s$/,
      exclude: /node_modules/,
      sourceMap: true,
      target: 'es2020',
      loaders: {
        '.ts': 'ts',
        '.vue': 'ts',
      },
    },
  },
};

// ESM/UMD/IIFE shared settings: externals
const external = [
  '@fortawesome/fontawesome-svg-core',
  '@fortawesome/free-solid-svg-icons',
  '@fortawesome/vue-fontawesome',
  'bootstrap/dist/css/bootstrap.css',
  'roslib',
  'vue',
];

// UMD/IIFE shared settings: output.globals
const globals = {
  '@fortawesome/fontawesome-svg-core': 'fontawesomeSvgCore',
  '@fortawesome/free-solid-svg-icons': 'freeSolidSvgIcons',
  '@fortawesome/vue-fontawesome': 'vueFontawesome',
  'roslib': 'ROSLIB',
  'vue': 'Vue',
};

// Customize configs for individual targets
const buildFormats = [];

// ES Module build
const esConfig = {
  ...baseConfig,
  external,
  output: {
    file: 'dist/hero-vue.esm.js',
    format: 'esm',
    exports: 'named',
    sourcemap: true,
  },
  plugins: [
    replace(baseConfig.plugins.replace),
    ...baseConfig.plugins.preVue,
    postcss(),
    vue(baseConfig.plugins.vue),
    esbuild(baseConfig.plugins.esbuild),
    resolve({
      extensions: ['.js', '.ts', '.vue']
    }),
    commonjs(),
  ],
};
buildFormats.push(esConfig);

// SSR/CommonJS build
const cjsConfig = {
  ...baseConfig,
  external,
  output: {
    compact: true,
    file: 'dist/hero-vue.ssr.js',
    format: 'cjs',
    name: 'HeroVue',
    exports: 'named',
    globals,
    sourcemap: true,
  },
  plugins: [
    replace(baseConfig.plugins.replace),
    ...baseConfig.plugins.preVue,
    postcss(),
    vue(baseConfig.plugins.vue),
    esbuild(baseConfig.plugins.esbuild),
    resolve({
      extensions: ['.js', '.ts', '.vue']
    }),
    commonjs(),
  ],
};
buildFormats.push(cjsConfig);

// Browser/IIFE build
const iifeConfig = {
  ...baseConfig,
  external,
  output: {
    compact: true,
    file: 'dist/hero-vue.min.js',
    format: 'iife',
    name: 'HeroVue',
    exports: 'named',
    globals,
    sourcemap: true,
  },
  plugins: [
    replace(baseConfig.plugins.replace),
    ...baseConfig.plugins.preVue,
    postcss(),
    vue(baseConfig.plugins.vue),
    esbuild(baseConfig.plugins.esbuild),
    resolve({
      extensions: ['.js', '.ts', '.vue']
    }),
    commonjs(),
    terser({
      output: {
        ecma: 2015,
      },
    }),
  ],
};
buildFormats.push(iifeConfig);

// Export config
export default buildFormats;
