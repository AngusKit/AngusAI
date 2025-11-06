import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';


export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['dev-host.xcan.cloud'],
    port: 80,
    strictPort: true,
    open: false,
    proxy: {
      '/ess/': {
        target: 'http://dev-apis.xcan.cloud',
        changeOrigin: true
      },
      '/storage/': {
        target: 'http://dev-files.xcan.cloud',
        changeOrigin: true
      }
    }
  },
});
