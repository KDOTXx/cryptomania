import VueContentPlaceholders from "@fred78290/vue3-content-placeholders";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueContentPlaceholders);
});
