// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    // Server-only variables
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    // Public variables
    public: {
      siteUrl:
        process.env.NODE_ENV === 'production'
          ? 'https://inteli-scrape.vercel.app'
          : 'http://localhost:3000',
      stripeSuccessUrl: process.env.STRIPE_SUCCESS_URL,
      stripeCancelUrl: process.env.STRIPE_CANCEL_URL,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY
    },
  },

  routeRules: {
    // Or just let the global middleware run for all routes
    // and protect conditionally from within the code
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    'shadcn-nuxt',
    '@nuxt/eslint',
  ],

  typescript: {
    tsConfig: {
      compilerOptions: {
        baseUrl: '.',
      },
    },
  },
  // "@nuxtjs/color-mode",
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },
  supabase: {
    redirect: false, // set to true if you want automatic route-based redirects
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
  colorMode: {
    classSuffix: '',
  },
})
