import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Accept all network requests
    port: 5173, // Ensure the port matches Render's configuration
  },
  build: {
    outDir: 'dist', // Ensure the build output directory is correctly set
  },
}); 
