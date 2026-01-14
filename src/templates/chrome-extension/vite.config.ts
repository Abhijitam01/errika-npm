import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';

// Plugin to copy manifest and other public files
function copyPublicFiles() {
  return {
    name: 'copy-public-files',
    closeBundle() {
      const publicDir = resolve(__dirname, 'public');
      const distDir = resolve(__dirname, 'dist');

      // Ensure dist directory exists
      if (!existsSync(distDir)) {
        mkdirSync(distDir, { recursive: true });
      }

      // Copy manifest.json
      const manifestSrc = resolve(publicDir, 'manifest.json');
      const manifestDest = resolve(distDir, 'manifest.json');
      if (existsSync(manifestSrc)) {
        copyFileSync(manifestSrc, manifestDest);
        console.log('✓ Copied manifest.json');
      }

      // Copy icons directory
      const iconsSrc = resolve(publicDir, 'icons');
      const iconsDest = resolve(distDir, 'icons');
      if (existsSync(iconsSrc)) {
        if (!existsSync(iconsDest)) {
          mkdirSync(iconsDest, { recursive: true });
        }
        const fs = require('fs');
        fs.readdirSync(iconsSrc).forEach((file: string) => {
          copyFileSync(
            resolve(iconsSrc, file),
            resolve(iconsDest, file)
          );
        });
        console.log('✓ Copied icons');
      }
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    copyPublicFiles()
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep proper naming for entry files
          if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
            return '[name].js';
          }
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          
          // Keep HTML files at root
          if (name.endsWith('.html')) {
            return '[name].[ext]';
          }
          
          // Keep CSS files with proper naming
          if (name.endsWith('.css')) {
            if (name.includes('popup') || name.includes('options') || name.includes('content')) {
              return '[name].[ext]';
            }
            return 'assets/[name]-[hash].[ext]';
          }
          
          // Other assets go to assets folder
          return 'assets/[name]-[hash].[ext]';
        }
      }
    },
    // Improve build output
    sourcemap: process.env.NODE_ENV === 'development',
    minify: process.env.NODE_ENV === 'production',
    target: 'es2020',
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
    }
  },
  // Define global constants
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
