// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  runtimeConfig: {
    // Server-only variables
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    // Public variables
    public: {
      // ...
    },
  },

  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },
});

