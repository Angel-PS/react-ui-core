/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyFileSync } from 'node:fs';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = path.dirname(fileURLToPath(import.meta.url));

// Ship the RAW theme partial (src/styles/theme.css) to dist/theme.css so Tailwind
// consumers can `@import "@angelps/react-ui-core/css"` into their OWN build (a
// single Tailwind pass: one Preflight, one correctly-ordered @layer utilities).
// Vite lib mode inlines theme.css into dist/style.css and never emits it stand-
// alone, and it must stay UNCOMPILED (the consumer's Tailwind resolves its
// @theme/@apply/@custom-variant). closeBundle runs after Vite writes dist (past
// emptyOutDir) and re-runs under `vite build --watch`, so the copy always exists.
const copyThemeCss = {
  name: 'copy-theme-css',
  closeBundle() {
    copyFileSync(
      resolve(dirname, 'src/styles/theme.css'),
      resolve(dirname, 'dist/theme.css'),
    );
  },
};

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [tailwindcss(), react(), dts({
    include: ['src'],
    exclude: ['src/**/*.stories.tsx', 'src/**/*.test.{ts,tsx}', 'src/test/**'],
    insertTypesEntry: true
  }), copyThemeCss],
  resolve: {
    alias: {
      '@': resolve(dirname, 'src'),
    },
  },
  build: {
    lib: {
      entry: resolve(dirname, 'src/index.ts'),
      name: 'UiCore',
      formats: ['es', 'cjs'],
      fileName: format => `ui-core.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./src/test/setup.ts'],
          include: ['src/**/*.test.{ts,tsx}'],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{
              browser: 'chromium'
            }]
          }
        }
      }
    ]
  }
});
