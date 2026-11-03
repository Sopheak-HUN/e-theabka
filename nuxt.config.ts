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
  // The share image (app/components/OgImage/Wedding.takumi.vue) only sees fonts loaded here
  fonts: {
    families: [
      { name: 'Moul', weights: [400], subsets: ['khmer', 'latin'], global: true },
      { name: 'Noto Serif Khmer', weights: [400, 500], subsets: ['khmer', 'latin'], global: true },
      { name: 'Cormorant Garamond', weights: [400, 500], global: true },
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
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Moul&family=Moulpali&family=Noto+Serif+Khmer:wght@400;500;600&family=Pinyon+Script&display=swap',
        },
      ],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
