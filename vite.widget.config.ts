import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  publicDir: false,
  build: {
    emptyOutDir: true,
    outDir: resolve('dist/embed'),
    lib: {
      entry: resolve('src/widget/embed.ts'),
      name: 'XingyuConsultantPopup',
      formats: ['iife'],
      fileName: () => 'xingyu-popup.js',
    },
    rollupOptions: {
      output: {
        exports: 'default',
        assetFileNames: 'xingyu-popup.[ext]',
      },
    },
    cssCodeSplit: false,
  },
});
