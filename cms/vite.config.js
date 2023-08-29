import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import nodePolyfills from 'vite-plugin-node-stdlib-browser'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  plugins: [nodePolyfills()]

});