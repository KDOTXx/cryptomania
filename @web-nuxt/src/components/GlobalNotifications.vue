<script setup>
import Bus from "@/composables/useBus";
import useMainStore from "@/stores/useMainStore";

const store = useMainStore();

const notificationsC = computed(() => store.notifications);

const ws = ref(false);
const redis = ref(true);
const pageIsLoaded = ref(false);

const signalIconAnim = ref(0);

onMounted(() => {
  Bus.$on("ws:pingStatus", (status) => (redis.value = status));

  Bus.$on("ws:connect", () => (ws.value = true));
  Bus.$on("ws:disconnect", () => (ws.value = false));

  if (window.Echo.connector.socket.connected) ws.value = true;

  setTimeout(() => (pageIsLoaded.value = true), 3000);

  setInterval(() => {
    signalIconAnim.value++;
    if (signalIconAnim.value >= 5) signalIconAnim.value = 0;
  }, 500);
});
</script>

<template>
  <transition-group name="fade" mode="out-in">
    <div
      class="notificationSpace"
      v-if="(!ws || !redis) && pageIsLoaded"
      :key="0"
    ></div>
    <div
      class="globalNotification connectionLostContainer"
      :key="1"
      v-if="(!ws || !redis) && pageIsLoaded"
    >
      <div class="icon">
        <i
          :class="`fal fa-signal${
            signalIconAnim === 0 ? '' : '-' + signalIconAnim
          }`"
        ></i>
      </div>
      <div class="text">
        <span>{{ $t("general.error.connection_lost") }}</span>
      </div>
    </div>
    <div
      class="globalNotification"
      v-for="notification in notificationsC"
      :key="notification._id"
    >
      <div class="icon">
        <WebIcon :icon="notification.icon" />
      </div>
      <div class="text" v-html="notification.text"></div>
    </div>
  </transition-group>
</template>

<style scoped lang="scss">
.notificationSpace {
  height: 53px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
  opacity: 1;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
