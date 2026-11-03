import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Konfigurasi Vite: plugin React untuk JSX + port dev server 5173
// (port ini harus sama dengan CORS_ORIGIN di .env backend)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});

