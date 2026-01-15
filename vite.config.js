import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import tailwind from '@tailwindcss/postcss'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tailwind(),
  ],
  base: '/Habitify/',
  resolve: {
    alias : {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
