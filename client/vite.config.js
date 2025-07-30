import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
	  server: {
    allowedHosts: ['intellivibe.redirectme.net'],
    // If you are running the dev server on your GCP instance,
    // you might also need to make it listen on all network interfaces.
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      },
      '/socket.io': {
        target: 'http://localhost:5001',
        
      },
    }
  }
})
