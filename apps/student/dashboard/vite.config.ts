/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
// eslint-disable-next-line import/no-extraneous-dependencies
import federation from '@originjs/vite-plugin-federation'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/apps/student/dashboard',

  server: {
    port: 4201,
    host: 'localhost',
  },

  preview: {
    port: 4201,
    host: 'localhost',
  },

  plugins: [
    react(),
    federation({
      name: 'student-dashboard',
      filename: 'remoteEntry.js',
      // Modules to expose
      exposes: {
        './Dashboard': './src/app/app.tsx',
      },
    }),
    svgr({
      include: /(?<=\/(global|custom|altbox)\/.+)\.svg/,
      svgrOptions: {
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
        exportType: 'named',
        ref: true,
        titleProp: true,
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'convertColors',
              params: {
                currentColor: true,
              },
            },
          ],
        },
      },
    }),
    svgr({
      include: /(?<=\/(colourful|flags)\/.+)\.svg/,
      svgrOptions: {
        exportType: 'named',
        ref: true,
        titleProp: true,
        svgo: true,
      },
    }),
    nxViteTsPaths(),
  ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  build: {
    outDir: '../../../dist/apps/student/projects/dashboard',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },

  test: {
    globals: true,
    cache: {
      dir: '../../../node_modules/.vitest/apps/student/dashboard',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/apps/student/dashboard',
      provider: 'v8',
    },
  },
})
