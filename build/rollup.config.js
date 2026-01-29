// rollup.config.js
import path from "path";
import { fileURLToPath } from "url";
import vue from "rollup-plugin-vue";
import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import esbuild from "rollup-plugin-esbuild";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import terser from "@rollup/plugin-terser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "..");

const baseConfig = {
  input: "src/entry.ts",
  plugins: {
    preVue: [
      alias({
        entries: [{ find: "@", replacement: path.resolve(projectRoot, "src") }],
      }),
    ],
    replace: {
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
    },
    postcss: {
      extract: true,
      minimize: true,
    },
    vue: {
      target: "browser",
      preprocessStyles: false,
    },
    esbuild: {
      target: "es2020",
      sourceMap: true,
    },
  },
};

// ESM/UMD/IIFE shared settings: externals
const external = [
  "@fortawesome/fontawesome-svg-core",
  "@fortawesome/free-solid-svg-icons",
  "@fortawesome/vue-fontawesome",
  "bootstrap/dist/css/bootstrap.css",
  "roslib",
  "vue",
];

// UMD/IIFE shared settings: output.globals
const globals = {
  "@fortawesome/fontawesome-svg-core": "fontawesomeSvgCore",
  "@fortawesome/free-solid-svg-icons": "freeSolidSvgIcons",
  "@fortawesome/vue-fontawesome": "vueFontawesome",
  roslib: "roslib",
  vue: "vue",
};

// Customize configs for individual targets
const buildFormats = [];

// ES Module build
const esConfig = {
  ...baseConfig,
  external,
  output: {
    file: "dist/hero-vue.esm.js",
    format: "esm",
    exports: "named",
    globals,
    sourcemap: true,
  },
  plugins: [
    replace(baseConfig.plugins.replace),
    ...baseConfig.plugins.preVue,
    vue(baseConfig.plugins.vue),
    postcss({ ...baseConfig.plugins.postcss, extract: false, inject: true }),
    typescript({
      tsconfig: "./tsconfig.json",
      declarationDir: "dist",
      rootDir: "src",
      exclude: ["node_modules", "dist", "build", "dev", "tests", "**/*.vue"],
      compilerOptions: {
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
      },
    }),
    esbuild(baseConfig.plugins.esbuild),
    resolve({
      extensions: [".js", ".ts", ".vue", ".css"],
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
    file: "dist/hero-vue.ssr.js",
    format: "cjs",
    name: "HeroVue",
    exports: "named",
    globals,
    sourcemap: true,
  },
  plugins: [
    replace(baseConfig.plugins.replace),
    ...baseConfig.plugins.preVue,
    vue(baseConfig.plugins.vue),
    postcss({ ...baseConfig.plugins.postcss, extract: false, inject: false }),
    esbuild(baseConfig.plugins.esbuild),
    resolve({
      extensions: [".js", ".ts", ".vue", ".css"],
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
    file: "dist/hero-vue.min.js",
    format: "iife",
    name: "HeroVue",
    exports: "named",
    globals,
    sourcemap: true,
  },
  plugins: [
    replace(baseConfig.plugins.replace),
    ...baseConfig.plugins.preVue,
    vue(baseConfig.plugins.vue),
    postcss({ ...baseConfig.plugins.postcss, extract: false, inject: true }),
    esbuild(baseConfig.plugins.esbuild),
    resolve({
      extensions: [".js", ".ts", ".vue", ".css"],
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
