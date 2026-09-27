import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import boundaries from 'eslint-plugin-boundaries'
import storybook from 'eslint-plugin-storybook'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'storybook-static']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // FSD: layer boundaries + public API enforcement
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/main.tsx'],
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
      },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app' }, // app e sliceless: a camada inteira e um elemento
        { type: 'pages', pattern: 'src/pages/*' },
        { type: 'widgets', pattern: 'src/widgets/*' },
        { type: 'features', pattern: 'src/features/*' },
        { type: 'entities', pattern: 'src/entities/*' },
        { type: 'shared', pattern: 'src/shared/*' },
      ],
    },
    rules: {
      // 1. Hierarquia de camadas: cada uma so importa das de baixo
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            { from: [{ element: { type: 'app' } }], allow: [{ to: { element: { type: ['pages', 'widgets', 'features', 'entities', 'shared'], fileInternalPath: ['index.ts', 'index.tsx'] } } }] },
            { from: [{ element: { type: 'pages' } }], allow: [{ to: { element: { type: ['widgets', 'features', 'entities', 'shared'], fileInternalPath: ['index.ts', 'index.tsx'] } } }] },
            { from: [{ element: { type: 'widgets' } }], allow: [{ to: { element: { type: ['features', 'entities', 'shared'], fileInternalPath: ['index.ts', 'index.tsx'] } } }] },
            { from: [{ element: { type: 'features' } }], allow: [{ to: { element: { type: ['entities', 'shared'], fileInternalPath: ['index.ts', 'index.tsx'] } } }] },
            { from: [{ element: { type: 'entities' } }], allow: [{ to: { element: { type: ['shared'], fileInternalPath: ['index.ts', 'index.tsx'] } } }] },
            { from: [{ element: { type: 'shared' } }], allow: [{ to: { element: { type: ['shared'], fileInternalPath: ['index.ts', 'index.tsx'] } } }] },
          ],
        },
      ],
    },
  },
  // Storybook: regras do plugin + stories exportam objetos (nao componentes), entao o react-refresh nao se aplica
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.stories.{ts,tsx}'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
