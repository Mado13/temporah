import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'node:path'
import AutoImport from 'unplugin-auto-import/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import svelteConfig from './svelte.config.js'

export default defineConfig(({ command }) => {
  const isDev = command !== 'build'

  return {
    server: { cors: true },
    base: '/',
    publicDir: 'static',
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use '@/styles/variables.scss' as *;\n`,
        },
      },
    },

    plugins: [
      Icons({ compiler: 'svelte' }),
      AutoImport({
        resolvers: [
          IconsResolver({
            prefix: 'Icon',
            extension: 'svelte',
          }),
        ],
        dts: './app/auto-imports.d.ts',
      }),

      paraglideVitePlugin({
        project: './i18n/project.inlang/',
        outdir: './i18n/paraglide/',
      }),

      svelte({
        ...svelteConfig,
        compilerOptions: {
          ...svelteConfig.compilerOptions,
          hmr: true,
          dev: isDev,
        },
        onwarn: (warning, handler) => {
          if (warning.code === 'css-unused-selector' && warning.message.includes('[data-melt-')) {
            return
          }
          handler(warning)
        },
      }),

      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'inline',
        includeAssets: ['**/*'],
        outDir: '../priv/static',
        srcDir: 'app',
        filename: 'sw.js',
        strategies: 'generateSW',
        manifest: {
          name: 'Tempi',
          short_name: 'Tempi',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          background_color: '#f5f7fa',
          theme_color: '#6c5ce7',
          icons: [
            {
              src: '/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/icon-192-maskable.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/icon-512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          navigateFallback: '/',
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff2)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'assets-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: isDev,
          type: 'module',
        },
      }),
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './app'),
        $components: path.resolve(__dirname, './app/components/'),
        $actions: path.resolve(__dirname, './app/actions/'),
        $i18n: path.resolve(__dirname, './i18n/'),
      },
    },

    build: {
      target: 'es2022',
      emptyOutDir: true,
      outDir: '../priv/static',
      sourcemap: isDev,
      manifest: true,
      cssMinify: true,
      minify: isDev ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: !isDev,
          drop_debugger: !isDev,
          passes: 3,
          pure_funcs: ['console.info', 'console.debug', 'console.log'],
        },
        mangle: {
          toplevel: true,
          properties: {
            regex: /^_/,
          },
        },
      },

      rollupOptions: {
        input: { app: './app/app.js' },
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/chunks/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
          manualChunks(id) {
            if (!id.includes('node_modules')) return

            if (id.includes('@inertiajs')) return 'vendor-inertia'
            if (id.includes('svelte')) return 'vendor-svelte'
            if (id.includes('@melt-ui')) return 'vendor-melt'
            if (id.includes('runed')) return 'vendor-runed'
            if (id.includes('@inlang')) return 'vendor-i18n'

            return 'vendor-common'
          },
        },
        external: ['/fonts/*', '/images/*'],
      },
    },
  }
})
