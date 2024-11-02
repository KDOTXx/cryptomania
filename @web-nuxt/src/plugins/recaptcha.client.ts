import { VueReCaptcha } from "vue-recaptcha-v3";

export default defineNuxtPlugin((nuxtApp) => {
  const config: any = useRuntimeConfig();

  const options = {
    siteKey: config.public.recaptcha.siteKey,
    loaderOptions: {
      autoHideBadge: true,
      useRecaptchaNet: true,
      renderParameters: {
        hl: "id",
      },
    },
  };

  nuxtApp.vueApp.use(VueReCaptcha, options);
});
