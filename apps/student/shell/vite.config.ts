/// <reference types='vitest' />
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
// eslint-disable-next-line import/no-extraneous-dependencies
import federation from '@originjs/vite-plugin-federation'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/apps/student/shell',

  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4200,
    host: 'localhost',
  },

  plugins: [
    react(),
    federation({
      name: 'remote-app',
      filename: 'remoteEntry.js',
      remotes: {
        'student-dashboard': 'http://localhost:4201/assets/remoteEntry.js',
      },
    }),
    // eslint-disable-next-line new-cap
    TanStackRouterVite({
      routesDirectory: './src/routes',
      generatedRouteTree: './src/routeTree.gen.ts',
      quoteStyle: 'single',
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
    outDir: '../../../dist/apps/student',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },

  test: {
    globals: true,
    cache: {
      dir: '../../../node_modules/.vitest/apps/student/shell',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../../coverage/apps/student/shell',
      provider: 'v8',
    },
  },
})
