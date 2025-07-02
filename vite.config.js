import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['roughjs','classnames']

  },
  build: {
    commonjsOptions: {
      include: [/roughjs/, /node_modules/, /classnames/]
    }
  }
})
