import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // On change '/JourFleuri/' par '/' car tu as un domaine personnalisé
  base: '/', 
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
