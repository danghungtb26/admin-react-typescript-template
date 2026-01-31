import path from 'path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const support_paths = [
  'components',
  'containers',
  'commons',
  'constants',
  'context',
  'decorators',
  'graphql',
  'hooks',
  'layouts',
  'locales',
  'models',
  'styles',
  'themes',
  'routers',
  'app',
  'lib',
  'contexts',
  'apis',
  'tests',
]

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      ...support_paths.reduce(
        (a, b) => ({
          ...a,
          [`@/${b}`]: path.resolve(__dirname, `./src/${b}`),
        }),
        {}
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/tests/',
        '**/*.stories.tsx',
        '**/*.config.*',
        '**/routeTree.gen.ts',
        '**/*.d.ts',
        'dist/',
      ],
      thresholds: {
        statements: 70,
        branches: 60,
        functions: 70,
        lines: 70,
      },
    },
  },
})
