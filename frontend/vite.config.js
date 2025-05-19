import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    port: 6268, // Pick a port number until one works
    strictPort: true, // Fail if the port is in use instead of picking a new one
    host: '0.0.0.0' 
  }
})
