// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig(<any>{
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  srcDir: "src/",
  site: {
    description: "CryptoMania.gg",
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.PUBLIC_API_URL,
      recaptcha: {
        siteKey: process.env.PUBLIC_RECAPTCHA_SITE_KEY,
      },
    },
  },
  i18n: {
    lazy: true,
    langDir: "lang",
    defaultLocale: "en",
    legacy: true,
    allowComposition: true,
    compilation: {
      strictMessage: false,
      escapeHtml: false,
    },
    locales: [
      {
        code: "ar",
        file: "ar.json",
      },
      {
        code: "en",
        file: "en.json",
      },
      {
        code: "es",
        file: "es.json",
      },
      {
        code: "fr",
        file: "fr.json",
      },
      {
        code: "zh",
        file: "zh.json",
      },
    ],
  },
  css: ["@/assets/sass/main.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "~/assets/sass/bootstrap.scss";`,
        },
      },
    },
  },
  modules: ["@pinia/nuxt", "@nuxtjs/i18n"],
});
