import path from 'path'

import tailwindcss from '@tailwindcss/vite'
import tanstackRouter from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { i18nAlly } from 'vite-plugin-i18n-ally'

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
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
    i18nAlly({
      localesPaths: ['./src/locales/messages'],
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          const pathSource = id.replace(__dirname, '')
          // creating a chunk to react routes deps. Reducing the vendor chunk size
          if (pathSource.includes('react') || pathSource.includes('@tanstack/react-router')) {
            return '@tanstack-router'
          }
          if (pathSource.includes('react')) {
            return 'react'
          }
          if (pathSource.includes('antd')) {
            return 'antd'
          }
          if (pathSource.includes('echarts')) {
            return 'echarts'
          }
          if (id.includes('lodash')) {
            return 'lodash'
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      ...support_paths.reduce((a, b) => {
        return {
          ...a,
          [`@/${b}`]: path.resolve(__dirname, `./src/${b}`),
        }
      }, {}),
    },
  },
})
