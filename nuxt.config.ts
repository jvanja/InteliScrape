// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  runtimeConfig: {
    // Server-only variables
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    // Public variables
    //  public: {
    //   supabaseUrl: process.env.SUPABASE_URL,
    //   supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    // }
  },

  routeRules: {
    // Or just let the global middleware run for all routes
    // and protect conditionally from within the code
  },

  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/supabase"],

  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },
  supabase: {
    redirect: false, // set to true if you want automatic route-based redirects
  },
});
