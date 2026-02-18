import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { readFileSync } from 'fs'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  base: '/standards/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    dirStyle: 'nested',
    includedRoutes(paths, routes) {
      const allRoutes = []

      function flattenRoutes(routeList, parentPath = '') {
        for (const route of routeList) {
          if (route.redirect) {
            continue
          }

          const fullPath = route.path.startsWith('/')
            ? route.path
            : parentPath
              ? `${parentPath}/${route.path}`.replace(/\/+/g, '/')
              : route.path

          if (fullPath && fullPath !== '' && !route.path.includes(':')) {
            allRoutes.push(fullPath)
          }

          if (route.children) {
            flattenRoutes(route.children, fullPath)
          }
        }
      }

      flattenRoutes(routes)

      // Add standards routes from built JSON
      try {
        const standardsIndexPath = resolve(__dirname, 'src/content/standards/index.json')
        const standardsData = JSON.parse(readFileSync(standardsIndexPath, 'utf-8'))

        for (const standard of standardsData) {
          const id = standard.id || standard.number
          if (id) {
            allRoutes.push(`/${id}`)
          }
        }
      } catch (err) {
        console.warn('Standards index not found, skipping standards routes')
      }

      return [...new Set(allRoutes)]
    },
    sitemap: {
      hostname: 'https://sipm.org/standards',
      lastmod: new Date().toISOString()
    },
    crittersOptions: {
      reduceInlineStyles: false
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', '@unhead/vue']
  }
})
