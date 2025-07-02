import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        'react-icons/lu',
        'react-icons/fa',
        'roughjs',
        'classnames',
        'perfect-freehand'
      ],
      output: {
        globals: {
          'react-icons/lu': 'ReactIconsLu',
          'react-icons/fa': 'ReactIconsFa',
          'roughjs': 'rough',
          'classnames': 'classNames',
          'perfect-freehand': 'perfectFreehand'
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 4173
  }
})