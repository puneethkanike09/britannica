import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Add React plugin
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(), // Required for React/TSX support
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1000, // Keep your existing setting
  },
});