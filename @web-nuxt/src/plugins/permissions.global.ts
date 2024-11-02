import { usePermissions } from "@/composables/usePermissions";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      permission: usePermissions(),
    },
  };
});
