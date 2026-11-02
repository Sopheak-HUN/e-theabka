// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['nuxt-og-image'],
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
