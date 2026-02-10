
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // For Vercel, the base should be '/'
  base: '/',
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
