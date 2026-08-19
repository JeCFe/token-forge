import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: [],
    },
  },
  test: {
    include: ['src/**/*.test.ts', 'examples/**/*.test.ts'],
    environment: 'node',
    coverage: {
      reporter: ['text', 'html'],
    },
  },
});
