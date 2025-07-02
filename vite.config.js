import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'roughjs',
      'classnames', 
      'perfect-freehand',
      'react-icons'
    ]
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/]
    },
    rollupOptions: {
      external: ['roughjs', 'classnames', 'perfect-freehand'],
      output: {
        globals: {
          'roughjs': 'rough',
          'classnames': 'classNames',
          'perfect-freehand': 'perfectFreehand'
        }
      }
    }
  },
  resolve: {
    alias: {
      // Add any path aliases if needed
    }
  }
})