import { defineConfig } from 'vite';
export default defineConfig({ root: 'src/demo', publicDir: '../../public', build: { outDir: '../../dist', emptyOutDir: true }, server: { proxy: { '/api': 'http://localhost:5178' } } });
