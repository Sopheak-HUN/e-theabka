// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  telemetry: false,
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/fonts', 'nuxt-og-image'],
  // Link previews need absolute image URLs. Without a fixed address they use the domain the
  // page was requested on; set NUXT_SITE_URL at build time to pin one.
  // Every font the page and the share image (app/components/OgImage/Wedding.takumi.vue) use,
  // self-hosted from our own domain. Don't add a Google Fonts <link> as well: it blocks the
  // first paint and downloads every font a second time.
  fonts: {
    families: [
      { name: 'Moul', weights: [400], subsets: ['khmer', 'latin'], global: true },
      { name: 'Moulpali', weights: [400], subsets: ['khmer', 'latin'], global: true },
      { name: 'Noto Serif Khmer', weights: [400, 500, 600], subsets: ['khmer', 'latin'], global: true },
      { name: 'Cormorant Garamond', weights: [400, 500, 600], styles: ['normal', 'italic'], global: true },
      { name: 'Pinyon Script', weights: [400], global: true },
    ],
  },
  ogImage: {
    defaults: { width: 1200, height: 630 },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'km' },
      title: 'សិរីមង្គលអាពាហ៍ពិពាហ៍ · Wedding Invitation',
      meta: [
        { name: 'description', content: 'A Cambodian wedding invitation.' },
        { name: 'theme-color', content: '#E9DDC8' },
      ],
      link: [
        // Gold heart on the sage board (favicon.ico holds 16, 32 and 48 px)
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', href: '/favicon-32.png', sizes: '32x32' },
        { rel: 'icon', type: 'image/png', href: '/icon-192.png', sizes: '192x192' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
