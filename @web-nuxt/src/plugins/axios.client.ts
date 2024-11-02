export default function ({ $axios }: any) {
  $axios.onRequest(async (config: any) => {
    if (!document.cookie.includes("XSRF-TOKEN")) {
      await $axios.get("/sanctum/csrf-cookie");
    }
    return config;
  });
}
