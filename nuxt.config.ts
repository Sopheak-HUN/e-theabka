// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,
  telemetry: false,
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/fonts', 'nuxt-og-image'],
  // Link previews need absolute image URLs: set NUXT_SITE_URL to the live address when deploying
  site: { url: process.env.NUXT_SITE_URL || 'http://localhost:3000' },
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
