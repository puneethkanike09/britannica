import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Add React plugin
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(), // Required for React/TSX support
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 1500, // Increased from 1000 to 1500
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion') || id.includes('react-hot-toast') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            if (id.includes('react-phone-number-input') || id.includes('libphonenumber-js')) {
              return 'form-vendor';
            }
            return 'vendor';
          }

          // Feature chunks
          if (id.includes('/pages/admin/') || id.includes('/services/admin/') || id.includes('/types/admin/')) {
            return 'admin';
          }
          if (id.includes('/pages/educator/') || id.includes('/services/educator/') || id.includes('/types/educator/')) {
            return 'educator';
          }
          if (id.includes('/components/') || id.includes('/utils/') || id.includes('/context/') || id.includes('/hooks/')) {
            return 'common';
          }
        }
      }
    }
  },
});