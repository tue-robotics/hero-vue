// @ts-check

import eslint from '@eslint/js';
import { defineConfig } from "eslint/config"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import globals from "globals";


export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  skipFormatting,
  pluginVue.configs['flat/strongly-recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    }
  },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
        parser: vueParser,
        parserOptions: {
          parser: tsParser,
          ecmaVersion: 2020,
          sourceType: 'module'
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ["**/__tests__/*.{j,t}s?(x)", "**/tests/unit/**/*.spec.{j,t}s?(x)"],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    }
  }
)
