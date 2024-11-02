<script setup>
import useMainStore from "@/stores/useMainStore";
import BannerModal from "@/components/Modals/BannerModal.vue";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import { fetchXsrfCookie } from "@/composables/useAxios";

useHead({
  htmlAttrs: {
    class: "theme--main",
  },
});

const route = useRoute();
const store = useMainStore();

const user = computed(() => store.user);
const isGuest = computed(() => store.isGuest);

onMounted(async () => {
  await fetchXsrfCookie();

  BannerModal.methods.open();
  store.switchTheme(store.theme);
  store.update();
  store.updateData();

  polyfillCountryFlagEmojis();
  addScrollToTopEvent();
});

onUpdated(() => {
  addScrollToTopEvent();
});

function addScrollToTopEvent() {
  document.querySelectorAll("a").forEach((link) => {
    link.removeEventListener("click", scrollToTop);
    link.addEventListener("click", scrollToTop);
  });
}

function scrollToTop(event) {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

watch(user, () => {
  if (!isGuest.value) {
    //
  }
});

watch(route, () => {
  addScrollToTopEvent();
});
</script>

<template>
  <router-view :key="$route.fullPath" v-if="$route.meta.hideLayout" />
  <div class="d-flex" v-else>
    <WebsiteNotifications />

    <div class="wrapper">
      <LayoutSidebar />

      <div class="pageWrapper">
        <LayoutHeader />

        <div
          class="pageContainer"
          style="
            scrollbar-color: #161b2c #0000;
            height: calc(100vh - 110px);
            overflow: auto;
          "
        >
          <!-- <GlobalNotifications /> -->

          <div class="pageContent">
            <slot />
          </div>

          <!-- <LayoutLiveFeed /> -->
          <LayoutFooter />
        </div>
      </div>
    </div>

    <!-- <LayoutChat /> -->
    <!-- <LayoutFloatingButtons /> -->
    <!-- <BetSlip /> -->
    <!-- <mobile-menu /> -->
    <!-- <profit-monitoring /> -->
    <!-- <support-chat /> -->
    <!-- <phoenix-gambling-manager-view
      v-if="!isGuest && user && user.isPhoenixGamblingManager"
    /> -->
    <!-- <search /> -->
  </div>
</template>

<style scoped>
.d-flex {
  display: flex;
}
</style>
